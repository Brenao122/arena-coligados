"use client"

import { useState, useEffect } from "react"
import { X, Send, Minimize2, Users, Phone, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [message, setMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeChat, setActiveChat] = useState("professor")

  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    // TODO: Buscar conversas reais do banco de dados
    // fetchConversations()
  }, [])

  const handleSendMessage = () => {
    if (message.trim()) {
      // Aqui implementaria o envio real da mensagem
      setMessage("")
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl transition-all duration-300 ${
        isMinimized ? "h-14 w-80" : "h-96 w-80"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-medium text-white">Chat</span>
          <Badge className="bg-green-500/20 text-green-400 text-xs">2 online</Badge>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 text-gray-400 hover:text-white">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex h-80">
          {/* Conversations List */}
          <div className="w-24 border-r border-gray-700 bg-gray-800/50">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveChat(conv.id)}
                    className={`w-full p-2 rounded-lg transition-colors relative ${
                      activeChat === conv.id ? "bg-orange-500/20" : "hover:bg-gray-700"
                    }`}
                  >
                    <Avatar className="h-8 w-8 mx-auto">
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-green-500 text-white text-xs">
                        {conv.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && <div className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full"></div>}
                    {conv.unread > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-orange-500 text-xs">
                        {conv.unread}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-3 border-b border-gray-700 bg-gray-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-gradient-to-r from-orange-500 to-green-500 text-white text-xs">
                      CS
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">Carlos Santos</p>
                    <p className="text-xs text-green-400">Online</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400">
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400">
                    <Video className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        msg.isMe ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-3 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

