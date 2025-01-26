"use client"

import { useState } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface PaymentFormProps {
  amount: number
  jobId: string
  onPaymentSuccess: () => void
}

export function PaymentForm({ amount, jobId, onPaymentSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, jobId }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment intent")
      }

      const { clientSecret } = await response.json()

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      })
      onPaymentSuccess()
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "An error occurred while processing your payment.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement />
      <Button type="submit" disabled={isProcessing}>
        {isProcessing ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </Button>
    </form>
  )
}

