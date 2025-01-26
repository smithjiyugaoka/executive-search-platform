import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.userType !== "client-company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { amount, jobId } = await req.json()

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { postedBy: true },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    let customer
    if (!job.postedBy.stripeCustomerId) {
      customer = await stripe.customers.create({
        email: job.postedBy.email!,
        name: job.postedBy.name!,
      })
      await prisma.user.update({
        where: { id: job.postedBy.id },
        data: { stripeCustomerId: customer.id },
      })
    } else {
      customer = await stripe.customers.retrieve(job.postedBy.stripeCustomerId)
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customer.id,
      metadata: { jobId },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  try {
    const payments = await prisma.payment.findMany({
      where: {
        OR: [{ payerId: userId || session.user.id }, { recipientId: userId || session.user.id }],
      },
      include: {
        job: {
          select: { id: true, title: true },
        },
        payer: {
          select: { id: true, name: true },
        },
        recipient: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(payments)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

