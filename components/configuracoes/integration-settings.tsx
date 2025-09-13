"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquare, Instagram, CreditCard, Zap, CheckCircle, XCircle } from "lucide-react"

export function IntegrationSettings() {
  const [settings, setSettings] = useState({
    whatsapp: {
      enabled: false,
      phone: "",
      apiKey: "",
      webhookUrl: "",
    },
    instagram: {
      enabled: false,
      accessToken: "",
      businessId: "",
    },
    mercadoPago: {
      enabled: false,
      publicKey: "",
      accessToken: "",
    },
    n8n: {
      enabled: false,
      webhookUrl: "",
      apiKey: "",
    },
  })

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
  }

  const integrations = [
    {
      id: "whatsapp",
      name: "WhatsApp Business API",
      description: "AutomaÃ§Ã£o de mensagens e chatbot",
      icon: MessageSquare,
      status: settings.whatsapp.enabled,
      fields: [
        { key: "phone", label: "NÃºmero do WhatsApp", placeholder: "+5511999999999" },
        { key: "apiKey", label: "API Key", placeholder: "Sua chave da API" },
        { key: "webhookUrl", label: "Webhook URL", placeholder: "https://sua-api.com/webhook" },
      ],
    },
    {
      id: "instagram",
      name: "Instagram Business",
      description: "Captura de leads do Instagram",
      icon: Instagram,
      status: settings.instagram.enabled,
      fields: [
        { key: "accessToken", label: "Access Token", placeholder: "Token de acesso do Instagram" },
        { key: "businessId", label: "Business ID", placeholder: "ID da conta business" },
      ],
    },
    {
      id: "mercadoPago",
      name: "Mercado Pago",
      description: "Processamento de pagamentos",
      icon: CreditCard,
      status: settings.mercadoPago.enabled,
      fields: [
        { key: "publicKey", label: "Public Key", placeholder: "Chave pÃºblica" },
        { key: "accessToken", label: "Access Token", placeholder: "Token de acesso" },
      ],
    },
    {
      id: "n8n",
      name: "n8n Workflows",
      description: "AutomaÃ§Ã£o de processos",
      icon: Zap,
      status: settings.n8n.enabled,
      fields: [
        { key: "webhookUrl", label: "Webhook URL", placeholder: "https://n8n.exemplo.com/webhook" },
        { key: "apiKey", label: "API Key", placeholder: "Chave da API do n8n" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          Configure as integraÃ§Ãµes abaixo para ativar funcionalidades avanÃ§adas como automaÃ§Ã£o de WhatsApp, captura de
          leads do Instagram e processamento de pagamentos.
        </AlertDescription>
      </Alert>

      {integrations.map((integration) => (
        <Card key={integration.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <integration.icon className="h-6 w-6 text-brand-primary" />
                <div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={integration.status ? "default" : "secondary"}>
                  {integration.status ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Inativo
                    </>
                  )}
                </Badge>
                <Switch
                  checked={settings[integration.id as keyof typeof settings].enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      [integration.id]: {
                        ...settings[integration.id as keyof typeof settings],
                        enabled: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          </CardHeader>
          {settings[integration.id as keyof typeof settings].enabled && (
            <CardContent className="space-y-4">
              {integration.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={`${integration.id}-${field.key}`}>{field.label}</Label>
                  <Input
                    id={`${integration.id}-${field.key}`}
                    placeholder={field.placeholder}
                    value={String(settings[integration.id as keyof typeof settings][field.key as keyof (typeof settings)[keyof typeof settings]] || "")}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        [integration.id]: {
                          ...settings[integration.id as keyof typeof settings],
                          [field.key]: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-brand-primary hover:bg-orange-600">
          {saving ? "Salvando..." : "Salvar ConfiguraÃ§Ãµes"}
        </Button>
      </div>
    </div>
  )
}

