"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("search-firm")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, userType }),
    })

    const data = await response.json()

    if (response.ok) {
      toast({
        title: "Signup Successful",
        description: "Welcome to Executive Search Platform!",
      })
      router.push("/onboarding")
    } else {
      toast({
        title: "Error",
        description: data.message || "An error occurred during signup.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>User Type</Label>
          <RadioGroup value={userType} onValueChange={setUserType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="search-firm" id="search-firm" />
              <Label htmlFor="search-firm">Search Firm</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="client-company" id="client-company" />
              <Label htmlFor="client-company">Client Company</Label>
            </div>
          </RadioGroup>
        </div>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </div>
  )
}

