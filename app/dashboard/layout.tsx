"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ChatWindow } from "@/components/chat/chat-window"
import { AccessControl } from "@/components/layout/access-control"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [chatOpen, setChatOpen] = useState(false)

  const handleChatToggle = () => {
    setChatOpen(!chatOpen)
  }

  return (
    <AccessControl requireAuth={true}>
      <div className="h-screen flex bg-gray-900">
        <Sidebar />
        <div className="flex-1 pl-16 lg:pl-80">
          <Header onChatToggle={handleChatToggle} chatOpen={chatOpen} />
          <main className="pt-24 pb-6 px-4 sm:px-6 lg:px-8 min-h-full bg-gray-900">{children}</main>
        </div>
        <ChatWindow isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </AccessControl>
  )
}

