"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageThread } from "@/components/messaging/MessageThread"

interface Contact {
  id: string
  name: string
  image: string
  lastMessage: string
  lastMessageTime: string
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  useEffect(() => {
    async function fetchContacts() {
      const response = await fetch("/api/contacts")
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    }
    fetchContacts()
  }, [])

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Card className="w-1/3 overflow-auto">
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.map((contact) => (
            <Button
              key={contact.id}
              variant="ghost"
              className="w-full justify-start mb-2"
              onClick={() => setSelectedContact(contact)}
            >
              <Avatar className="mr-2">
                <AvatarImage src={contact.image} alt={contact.name} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.lastMessage}</p>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
      <div className="flex-1 p-4">
        {selectedContact ? (
          <MessageThread receiverId={selectedContact.id} />
        ) : (
          <p className="text-center text-muted-foreground">Select a contact to start messaging</p>
        )}
      </div>
    </div>
  )
}

