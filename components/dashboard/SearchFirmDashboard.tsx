"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Proposal {
  id: string
  job: {
    title: string
    company: string
  }
  status: string
  createdAt: string
}

export default function SearchFirmDashboard() {
  const [recentProposals, setRecentProposals] = useState<Proposal[]>([])

  useEffect(() => {
    async function fetchRecentProposals() {
      const response = await fetch("/api/proposals")
      if (response.ok) {
        const data = await response.json()
        setRecentProposals(data.slice(0, 5)) // Get the 5 most recent proposals
      }
    }
    fetchRecentProposals()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Explore new job opportunities</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/jobs">
              View Jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>My Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentProposals.map((proposal) => (
              <li key={proposal.id} className="text-sm">
                <span className="font-medium">{proposal.job.title}</span> - {proposal.job.company}
                <br />
                <span className="text-muted-foreground">Status: {proposal.status}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/dashboard/proposals">
              View All Proposals <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Candidate Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">10 candidates in various stages</p>
          <Button variant="outline" size="sm">
            Manage Pipeline <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Placements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">3 successful placements this month</p>
          <Button variant="outline" size="sm">
            View Placements <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Performance metrics and insights</p>
          <Button variant="outline" size="sm">
            View Analytics <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">3 unread messages</p>
          <Button variant="outline" size="sm">
            Open Inbox <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

