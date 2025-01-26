"use client"

import { useSession } from "next-auth/react"
import SearchFirmDashboard from "@/components/dashboard/SearchFirmDashboard"
import ClientCompanyDashboard from "@/components/dashboard/ClientCompanyDashboard"

export default function Dashboard() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Access Denied</div>
  }

  const userType = session.user?.userType as "search-firm" | "client-company"

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {session.user?.name || session.user?.email}</h1>
      {userType === "search-firm" ? <SearchFirmDashboard /> : <ClientCompanyDashboard />}
    </div>
  )
}

