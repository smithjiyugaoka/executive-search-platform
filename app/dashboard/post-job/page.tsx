"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { PaymentForm } from "@/components/payments/PaymentForm"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const jobFormSchema = z.object({
  title: z.string().min(5, {
    message: "Job title must be at least 5 characters.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  jobType: z.enum(["full-time", "part-time", "contract", "temporary"]),
  salary: z.string().min(1, {
    message: "Salary is required.",
  }),
  description: z.string().min(50, {
    message: "Job description must be at least 50 characters.",
  }),
  requirements: z.string().min(50, {
    message: "Job requirements must be at least 50 characters.",
  }),
})

const JOB_POSTING_FEE = 9900 // $99.00 in cents

export default function PostJob() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [jobId, setJobId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof jobFormSchema>>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      jobType: "full-time",
      salary: "",
      description: "",
      requirements: "",
    },
  })

  async function onSubmit(values: z.infer<typeof jobFormSchema>) {
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        const job = await response.json()
        setJobId(job.id)
        toast({
          title: "Job Created",
          description: "Your job has been created. Please complete the payment to post it.",
        })
      } else {
        throw new Error("Failed to create job")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your job. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePaymentSuccess = () => {
    router.push("/dashboard/jobs")
  }

  if (session?.user?.userType !== "client-company") {
    return <div>Access Denied. Only client companies can post jobs.</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
      {!jobId ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormDescription>The title of the job position you're hiring for.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. New York, NY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Range</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. $100,000 - $150,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the job role, responsibilities, and any other relevant information."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the required skills, experience, and qualifications for this position."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create Job</Button>
          </form>
        </Form>
      ) : (
        <Elements stripe={stripePromise}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Complete Payment</h2>
            <p>To post your job, please complete the payment of ${(JOB_POSTING_FEE / 100).toFixed(2)}.</p>
            <PaymentForm amount={JOB_POSTING_FEE} jobId={jobId} onPaymentSuccess={handlePaymentSuccess} />
          </div>
        </Elements>
      )}
    </div>
  )
}

