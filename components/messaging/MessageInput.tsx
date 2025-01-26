import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface MessageInputProps {
  jobId?: string
  receiverId: string
  onMessageSent: () => void
}

export function MessageInput({ jobId, receiverId, onMessageSent }: MessageInputProps) {
  const [content, setContent] = useState("")
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          receiverId,
          jobId,
        }),
      })

      if (response.ok) {
        setContent("")
        onMessageSent()
        toast({
          title: "Message Sent",
          description: "Your message has been sent successfully.",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message here..."
        className="mb-2"
      />
      <Button type="submit">Send Message</Button>
    </form>
  )
}

