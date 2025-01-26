"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface Job {
  id: string
  title: string
  company: string
  location: string
  jobType: string
  salary: string
  status: string
  createdAt: string
}

export default function Jobs() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const { toast } = useToast()

  useEffect(() => {
    async function fetchJobs() {
      const response = await fetch("/api/jobs")
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    }
    fetchJobs()
  }, [])

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)))
        toast({
          title: "Job Updated",
          description: `Job status changed to ${newStatus}`,
        })
      } else {
        throw new Error("Failed to update job status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Listings</h1>
        {session?.user?.userType === "client-company" && (
          <Button asChild>
            <Link href="/dashboard/post-job">Post a New Job</Link>
          </Button>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.company}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">{job.location}</p>
              <Badge>{job.jobType}</Badge>
              <p className="mt-2">{job.salary}</p>
              <Badge variant={job.status === "active" ? "default" : "secondary"} className="mt-2">
                {job.status}
              </Badge>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild variant="outline">
                <Link href={`/dashboard/jobs/${job.id}`}>View Details</Link>
              </Button>
              {session?.user?.userType === "client-company" && (
                <Button variant="outline" onClick={() => toggleJobStatus(job.id, job.status)}>
                  {job.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

