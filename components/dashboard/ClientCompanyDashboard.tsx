"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface Job {
  id: string
  title: string
  status: string
}

export default function ClientCompanyDashboard() {
  const [recentJobs, setRecentJobs] = useState<Job[]>([])

  useEffect(() => {
    async function fetchRecentJobs() {
      const response = await fetch('/apiI understand. I'll continue the text stream from the cut-off point, maintaining coherence and consistency. Here's the continuation:

async function fetchRecentJobs() {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setRecentJobs(data.slice(0, 5)) // Get the 5 most recent jobs
      }
    }
    fetchRecentJobs()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">{recentJobs.filter(job => job.status === 'active').length} active job postings</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/jobs">
              View Jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentJobs.map((job) => (
              <li key={job.id} className="text-sm">
                <span className="font-medium">{job.title}</span>
                <br />
                <span className="text-muted-foreground">Status: {job.status}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/dashboard/jobs">
              Manage Jobs <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Received Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">5 new proposals from search firms</p>
          <Button variant="outline" size="sm">
            Review Proposals <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Candidate Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">8 candidates awaiting your review</p>
          <Button variant="outline" size="sm">
            Review Candidates <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Hires</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">2 executives hired this quarter</p>
          <Button variant="outline" size="sm">
            View Hires <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">Hiring metrics and insights</p>
          <Button variant="outline" size="sm">
            View Analytics <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

