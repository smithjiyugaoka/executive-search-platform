"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Proposal {
  id: string
  job: {
    id: string
    title: string
    company: string
  }
  status: string
  createdAt: string
}

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([])

  useEffect(() => {
    async function fetchProposals() {
      const response = await fetch("/api/proposals")
      if (response.ok) {
        const data = await response.json()
        setProposals(data)
      }
    }
    fetchProposals()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Proposals</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {proposals.map((proposal) => (
          <Card key={proposal.id}>
            <CardHeader>
              <CardTitle>{proposal.job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">{proposal.job.company}</p>
              <Badge className="mb-2">{proposal.status}</Badge>
              <p className="text-sm mb-4">Submitted on: {new Date(proposal.createdAt).toLocaleDateString()}</p>
              <Button asChild>
                <Link href={`/dashboard/proposals/${proposal.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

