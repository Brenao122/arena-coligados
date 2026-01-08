"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AutomacaoNextfitPage() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Automação Nextfit + WhatsApp</h1>
        <p className="text-muted-foreground">
          Guia completo para configurar envio automático de confirmação via WhatsApp após cadastro no Nextfit
        </p>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <strong>Objetivo:</strong> Quando um lead faz cadastro pelo link do Nextfit, enviar automaticamente uma
          mensagem no WhatsApp confirmando a presença na aula experimental.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="fluxo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fluxo">Fluxo</TabsTrigger>
          <TabsTrigger value="n8n">Workflow N8N</TabsTrigger>
          <TabsTrigger value="codigo">Código</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="fluxo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fluxo Completo</CardTitle>
              <CardDescription>Como funciona do início ao fim</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">1</Badge>
                  <div>
                    <h3 className="font-semibold">Lead entra em contato</h3>
                    <p className="text-sm text-muted-foreground">WhatsApp, Instagram, telefone, etc.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">2</Badge>
                  <div>
                    <h3 className="font-semibold">Você descobre as necessidades</h3>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      <li>Esporte: Vôlei, Futebol, etc.</li>
                      <li>Nível: Iniciante, Intermediário, Avançado</li>
                      <li>Idade: Adulto ou Kids</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">3</Badge>
                  <div>
                    <h3 className="font-semibold">Você envia link específico</h3>
                    <p className="text-sm text-muted-foreground">Cada combinação tem link/funil próprio no Nextfit</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1">4</Badge>
                  <div>
                    <h3 className="font-semibold">Lead faz cadastro no Nextfit</h3>
                    <p className="text-sm text-muted-foreground">
                      Sistema cria automaticamente: Cliente → Venda → Oportunidade
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 bg-green-600">5</Badge>
                  <div>
                    <h3 className="font-semibold text-green-600">N8N detecta novo cadastro</h3>
                    <p className="text-sm text-muted-foreground">Polling a cada 2-5 minutos na API do Nextfit</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 bg-green-600">6</Badge>
                  <div>
                    <h3 className="font-semibold text-green-600">Envia confirmação no WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">
                      Mensagem personalizada com nome, esporte e professor
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="n8n" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estrutura do Workflow N8N</CardTitle>
              <CardDescription>Nodes necessários e configuração</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold mb-2">1. Schedule Trigger (Cron)</h3>
                  <p className="text-sm text-muted-foreground mb-2">Executa a cada 2-5 minutos</p>
                  <div className="bg-muted p-3 rounded text-sm font-mono">*/2 * * * * (a cada 2 minutos)</div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold mb-2">2. HTTP Request - Buscar Oportunidades</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-muted p-3 rounded">
                      <div className="font-mono">
                        <div>
                          <strong>Method:</strong> GET
                        </div>
                        <div>
                          <strong>URL:</strong> https://integracao.nextfit.com.br/api/v1/Oportunidade
                        </div>
                        <div>
                          <strong>Headers:</strong>
                        </div>
                        <div className="ml-4">Authorization: Bearer {"<SUA_CHAVE_API>"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold mb-2">3. Filter - Apenas Novas Oportunidades</h3>
                  <p className="text-sm text-muted-foreground mb-2">Filtrar por data de criação (últimos 5 minutos)</p>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    {"{{ $now.minus({ minutes: 5 }).toISO() < $json.dataCriacao }}"}
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold mb-2">4. HTTP Request - Buscar Venda</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-muted p-3 rounded">
                      <div className="font-mono">
                        <div>
                          <strong>Method:</strong> GET
                        </div>
                        <div>
                          <strong>URL:</strong> https://integracao.nextfit.com.br/api/v1/Venda
                        </div>
                        <div className="text-muted-foreground mt-2">Filtrar pelo ID: {"{{ $json.codigoPessoa }}"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-pink-500 pl-4">
                  <h3 className="font-semibold mb-2">5. Function - Processar Dados</h3>
                  <p className="text-sm text-muted-foreground mb-2">Extrair e formatar informações</p>
                  <div className="bg-muted p-3 rounded text-sm font-mono">
                    <pre>{`// Extrair dados da venda
const venda = items[0].json;
const nome = venda.nome;
const telefone = \`55\${venda.dddFone}\${venda.fone}\`;
const descricao = $('HTTP Request').item.json.descricao;

return [{
  json: { nome, telefone, descricao }
}];`}</pre>
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold mb-2">6. WhatsApp - Enviar Mensagem</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Usar Evolution API, Baileys ou WhatsApp Business API
                  </p>
                  <div className="bg-muted p-3 rounded text-sm">
                    <div className="font-semibold mb-2">Opções de integração:</div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        <strong>Evolution API</strong> - Recomendado (gratuito, fácil)
                      </li>
                      <li>
                        <strong>Baileys</strong> - Open source
                      </li>
                      <li>
                        <strong>WhatsApp Business API</strong> - Oficial (pago)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="codigo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exemplos de Código</CardTitle>
              <CardDescription>Snippets para usar no N8N</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Filtrar Oportunidades Recentes (Function Node)</h3>
                <div className="bg-muted p-4 rounded">
                  <pre className="text-sm font-mono overflow-x-auto">{`// Pegar apenas oportunidades dos últimos 5 minutos
const cincoMinutosAtras = new Date();
cincoMinutosAtras.setMinutes(cincoMinutosAtras.getMinutes() - 5);

const oportunidadesRecentes = items.filter(item => {
  const dataCriacao = new Date(item.json.dataCriacao);
  return dataCriacao > cincoMinutosAtras;
});

return oportunidadesRecentes;`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Buscar Venda por ID (HTTP Request)</h3>
                <div className="bg-muted p-4 rounded">
                  <pre className="text-sm font-mono overflow-x-auto">{`// No HTTP Request Node
URL: https://integracao.nextfit.com.br/api/v1/Venda

Headers:
{
  "Authorization": "Bearer SUA_CHAVE_API"
}

// Depois, filtrar no Function Node:
const vendaId = $('Buscar Oportunidades').item.json.codigoPessoa;
const venda = items.find(item => item.json.id === vendaId);

return [{ json: venda.json }];`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Formatar Dados para WhatsApp (Function Node)</h3>
                <div className="bg-muted p-4 rounded">
                  <pre className="text-sm font-mono overflow-x-auto">{`// Extrair dados da venda
const venda = items[0].json;
const oportunidade = $('Buscar Oportunidades').item.json;

// Formatar telefone (adicionar código do país)
const telefone = \`55\${venda.dddFone}\${venda.fone}\`;

// Extrair informações da descrição
const descricao = oportunidade.descricao;
// Ex: "Volei Aprendiz/Iniciante - Prof. Eduardo."

// Separar esporte e professor
const [esporteNivel, professor] = descricao.split(' - ');

// Montar mensagem
const mensagem = \`Olá \${venda.nome}! 👋

Confirmamos sua presença na aula experimental de *\${esporteNivel}* com o \${professor}

Estamos te esperando! 🏐

Qualquer dúvida, estamos à disposição.\`;

return [{
  json: {
    telefone: telefone,
    mensagem: mensagem,
    nome: venda.nome
  }
}];`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Evitar Mensagens Duplicadas (Redis/Upstash)</h3>
                <div className="bg-muted p-4 rounded">
                  <pre className="text-sm font-mono overflow-x-auto">{`// Usar Redis para armazenar IDs já processados
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

const oportunidadeId = items[0].json.id;

// Verificar se já foi processado
const jaProcessado = await redis.get(\`oportunidade:\${oportunidadeId}\`);

if (jaProcessado) {
  return []; // Não processar novamente
}

// Marcar como processado (expira em 7 dias)
await redis.setex(\`oportunidade:\${oportunidadeId}\`, 604800, 'true');

return items; // Continuar processamento`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mensagens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Mensagens</CardTitle>
              <CardDescription>Exemplos personalizados por tipo de aula</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Mensagem Padrão</h3>
                <div className="bg-muted p-4 rounded">
                  <pre className="text-sm whitespace-pre-wrap">{`Olá {{nome}}! 👋

Confirmamos sua presença na aula experimental de *{{esporte}} {{nivel}}* com o {{professor}}

Estamos te esperando! {{emoji_esporte}}

Qualquer dúvida, estamos à disposição.

Arena Coligados`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Mensagem para Kids</h3>
                <div className="bg-muted p-4 rounded">
                  <pre className="text-sm whitespace-pre-wrap">{`Olá! 👋

Confirmamos a presença de {{nome}} na aula experimental de *{{esporte}} Kids* com o {{professor}}

Estamos ansiosos para receber seu filho(a)! {{emoji_esporte}}

📍 Local: Arena Coligados
⏰ Horário: [HORÁRIO DA AULA]

Qualquer dúvida, estamos à disposição.`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Código para Personalizar Emoji</h3>
                <div className="bg-muted p-4 rounded">
                  <pre className="text-sm font-mono overflow-x-auto">{`// Function para adicionar emoji baseado no esporte
function getEmojiEsporte(descricao) {
  const desc = descricao.toLowerCase();
  
  if (desc.includes('volei') || desc.includes('vôlei')) return '🏐';
  if (desc.includes('futebol')) return '⚽';
  if (desc.includes('basquete')) return '🏀';
  if (desc.includes('tenis') || desc.includes('tênis')) return '🎾';
  if (desc.includes('natacao') || desc.includes('natação')) return '🏊';
  
  return '💪'; // Emoji padrão
}

const emoji = getEmojiEsporte(oportunidade.descricao);`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Variáveis Disponíveis</h3>
                <div className="bg-muted p-4 rounded">
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Da Venda:</strong>
                    </div>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>
                        <code>nome</code> - Nome completo do cliente
                      </li>
                      <li>
                        <code>dddFone</code> + <code>fone</code> - Telefone
                      </li>
                      <li>
                        <code>email</code> - Email do cliente
                      </li>
                    </ul>
                    <div className="mt-3">
                      <strong>Da Oportunidade:</strong>
                    </div>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>
                        <code>descricao</code> - Ex: "Volei Aprendiz/Iniciante - Prof. Eduardo."
                      </li>
                      <li>
                        <code>dataCriacao</code> - Data/hora do cadastro
                      </li>
                      <li>
                        <code>status</code> - Status da oportunidade
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Configurar Evolution API ou outra solução de WhatsApp</li>
            <li>Criar workflow no N8N seguindo a estrutura acima</li>
            <li>Configurar Redis/Upstash para evitar mensagens duplicadas</li>
            <li>Testar com um cadastro real no Nextfit</li>
            <li>Ajustar timing do polling (2-5 minutos)</li>
            <li>Monitorar logs e ajustar mensagens conforme necessário</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
