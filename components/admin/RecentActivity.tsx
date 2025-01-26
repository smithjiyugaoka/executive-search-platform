import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentActivities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      email: "john@example.com",
      image: "/placeholder-user.jpg",
    },
    action: "posted a new job",
    target: "Senior Software Engineer",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
      image: "/placeholder-user.jpg",
    },
    action: "submitted a proposal",
    target: "Marketing Manager position",
    time: "4 hours ago",
  },
  {
    id: 3,
    user: {
      name: "Bob Johnson",
      email: "bob@example.com",
      image: "/placeholder-user.jpg",
    },
    action: "left a review",
    target: "for XYZ Company",
    time: "1 day ago",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {recentActivities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.image} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {activity.action} {activity.target}
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

