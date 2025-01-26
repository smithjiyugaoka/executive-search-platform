"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { StarRating } from "./StarRating"

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, {
    message: "Comment must be at least 10 characters.",
  }),
})

interface ReviewFormProps {
  revieweeId: string
  jobId?: string
  onReviewSubmitted: () => void
}

export function ReviewForm({ revieweeId, jobId, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  })

  async function onSubmit(values: z.infer<typeof reviewSchema>) {
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a review.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          revieweeId,
          jobId,
        }),
      })

      if (response.ok) {
        toast({
          title: "Review Submitted",
          description: "Your review has been successfully submitted.",
        })
        form.reset()
        onReviewSubmitted()
      } else {
        throw new Error("Failed to submit review")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <StarRating value={field.value} onChange={(value) => field.onChange(value)} />
              </FormControl>
              <FormDescription>Rate your experience from 1 to 5 stars</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Share your experience..." className="resize-none" {...field} />
              </FormControl>
              <FormDescription>Provide details about your experience</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  )
}

