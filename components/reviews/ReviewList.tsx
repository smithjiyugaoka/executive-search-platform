import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "./StarRating"

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  reviewer: {
    id: string
    name: string
    image: string
  }
  job?: {
    id: string
    title: string
  }
}

interface ReviewListProps {
  userId?: string
  jobId?: string
}

export function ReviewList({ userId, jobId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    async function fetchReviews() {
      const queryParams = new URLSearchParams()
      if (userId) queryParams.append("userId", userId)
      if (jobId) queryParams.append("jobId", jobId)

      const response = await fetch(`/api/reviews?${queryParams.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    }
    fetchReviews()
  }, [userId, jobId])

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={review.reviewer.image} alt={review.reviewer.name} />
                <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{review.reviewer.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <StarRating value={review.rating} onChange={() => {}} />
            <p className="mt-2">{review.comment}</p>
            {review.job && <p className="mt-2 text-sm text-muted-foreground">Job: {review.job.title}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

