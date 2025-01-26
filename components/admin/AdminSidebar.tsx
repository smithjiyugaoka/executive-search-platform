"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Briefcase, FileText, MessageSquare, BarChart, Settings } from "lucide-react"

const adminRoutes = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Jobs", path: "/admin/jobs", icon: Briefcase },
  { name: "Proposals", path: "/admin/proposals", icon: FileText },
  { name: "Messages", path: "/admin/messages", icon: MessageSquare },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart },
  { name: "Settings", path: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <div className="text-2xl font-bold mb-6">Admin Panel</div>
      <nav className="space-y-2">
        {adminRoutes.map((route) => (
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

