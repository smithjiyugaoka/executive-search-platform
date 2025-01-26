"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-primary text-primary-foreground">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold">
          Executive Search Platform
        </Link>
        <div className="space-x-4">
          {session ? (
            <>
              <Button variant="secondary" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="secondary" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

