"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  MessageSquare,
  BarChart,
  Settings,
  CreditCard,
} from "lucide-react"

const commonRoutes = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Messages", path: "/dashboard/messages", icon: MessageSquare },
  { name: "Payments", path: "/dashboard/payments", icon: CreditCard },
  { name: "Analytics", path: "/dashboard/analytics", icon: BarChart },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
]

const searchFirmRoutes = [
  { name: "Jobs", path: "/dashboard/jobs", icon: Briefcase },
  { name: "My Proposals", path: "/dashboard/proposals", icon: FileText },
  { name: "Candidates", path: "/dashboard/candidates", icon: Users },
]

const clientCompanyRoutes = [
  { name: "Post Job", path: "/dashboard/post-job", icon: Briefcase },
  { name: "Active Searches", path: "/dashboard/jobs", icon: Briefcase },
  { name: "Received Proposals", path: "/dashboard/proposals", icon: FileText },
  { name: "Candidates", path: "/dashboard/candidates", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userType = session?.user?.userType as "search-firm" | "client-company"

  const routes = [...commonRoutes, ...(userType === "search-firm" ? searchFirmRoutes : clientCompanyRoutes)]

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <nav className="space-y-2">
        {routes.map((route) => (
          <Button
            key={route.path}
            asChild
            variant="ghost"
            className={cn("w-full justify-start", pathname === route.path && "bg-gray-700")}
          >
            <Link href={route.path}>
              <route.icon className="mr-2 h-4 w-4" />
              {route.name}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  )
}

