"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReviewForm } from "@/components/reviews/ReviewForm"
import { ReviewList } from "@/components/reviews/ReviewList"

interface UserProfile {
  id: string
  name: string
  email: string
  image: string
  userType: string
}

export default function UserProfile() {
  const { id } = useParams()
  const { data: session } = useSession()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    async function fetchUserProfile() {
      const response = await fetch(`/api/users/${id}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    }
    if (id) {
      fetchUserProfile()
    }
  }, [id])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-muted-foreground">{user.userType}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>Email: {user.email}</p>
        </CardContent>
      </Card>

      {session?.user?.id !== user.id && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
          </CardHeader>
          <CardContent>
            {showReviewForm ? (
              <ReviewForm revieweeId={user.id} onReviewSubmitted={() => setShowReviewForm(false)} />
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
          <ReviewList userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}

