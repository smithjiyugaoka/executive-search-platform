"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ReviewForm } from "@/components/reviews/ReviewForm"
import { ReviewList } from "@/components/reviews/ReviewList"

interface Job {
  id: string
  title: string
  company: string
  location: string
  jobType: string
  salary: string
  description: string
  requirements: string
  createdAt: string
  postedBy: {
    id: string
    name: string
  }
}

export default function JobDetails() {
  const { id } = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [resume, setResume] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    async function fetchJob() {
      const response = await fetch(`/api/jobs/${id}`)
      if (response.ok) {
        const data = await response.json()
        setJob(data)
      }
    }
    if (id) {
      fetchJob()
    }
  }, [id])

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: id,
          coverLetter,
          resume,
        }),
      })

      if (response.ok) {
        toast({
          title: "Proposal Submitted",
          description: "Your proposal has been successfully submitted.",
        })
        router.push("/dashboard")
      } else {
        throw new Error("Failed to submit proposal")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your proposal. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!job) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <CardDescription>{job.company}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-2">{job.location}</p>
          <Badge className="mb-2">{job.jobType}</Badge>
          <p className="mb-4">{job.salary}</p>
          <h3 className="font-semibold mb-2">Job Description</h3>
          <p className="mb-4">{job.description}</p>
          <h3 className="font-semibold mb-2">Requirements</h3>
          <p>{job.requirements}</p>
        </CardContent>
      </Card>

      {session?.user?.userType === "search-firm" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Submit Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  className="min-h-[200px]"
                />
              </div>
              <div>
                <Label htmlFor="resume">Resume</Label>
                <Input id="resume" type="file" onChange={(e) => setResume(e.target.files?.[0]?.name || "")} required />
              </div>
              <Button type="submit">Submit Proposal</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {session?.user?.id !== job.postedBy.id && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
          </CardHeader>
          <CardContent>
            {showReviewForm ? (
              <ReviewForm
                revieweeId={job.postedBy.id}
                jobId={job.id}
                onReviewSubmitted={() => setShowReviewForm(false)}
              />
            ) : (
              <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewList jobId={job.id} />
        </CardContent>
      </Card>
    </div>
  )
}

