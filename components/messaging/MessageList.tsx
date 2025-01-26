import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  createdAt: string
  sender: {
    id: string
    name: string
    image: string
  }
  receiver: {
    id: string
    name: string
    image: string
  }
}

export function MessageList({ jobId }: { jobId?: string }) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    async function fetchMessages() {
      const response = await fetch(`/api/messages${jobId ? `?jobId=${jobId}` : ""}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    }
    fetchMessages()
    // Set up a polling mechanism to fetch new messages every 5 seconds
    const intervalId = setInterval(fetchMessages, 5000)
    return () => clearInterval(intervalId)
  }, [jobId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 mb-4 ${
                message.sender.id === session?.user?.id ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender.id !== session?.user?.id && (
                <Avatar>
                  <AvatarImage src={message.sender.image} alt={message.sender.name} />
                  <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`p-2 rounded-lg ${
                  message.sender.id === session?.user?.id ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(message.createdAt).toLocaleString()}</p>
              </div>
              {message.sender.id === session?.user?.id && (
                <Avatar>
                  <AvatarImage src={message.sender.image} alt={message.sender.name} />
                  <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

