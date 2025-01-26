"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  createdAt: string
  job: {
    id: string
    title: string
  }
  payer: {
    id: string
    name: string
  }
  recipient: {
    id: string
    name: string
  }
}

export default function PaymentsPage() {
  const { data: session } = useSession()
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    async function fetchPayments() {
      const response = await fetch("/api/payments")
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    }
    fetchPayments()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      <div className="grid gap-6">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <CardTitle>{payment.job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                ${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
              </p>
              <p className="text-sm text-muted-foreground">
                {payment.payer.id === session?.user?.id ? "Paid to" : "Received from"}:{" "}
                {payment.payer.id === session?.user?.id ? payment.recipient.name : payment.payer.name}
              </p>
              <p className="text-sm text-muted-foreground">Date: {new Date(payment.createdAt).toLocaleDateString()}</p>
              <Badge className="mt-2" variant={payment.status === "succeeded" ? "default" : "secondary"}>
                {payment.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

