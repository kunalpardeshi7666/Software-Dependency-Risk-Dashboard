'use client';

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Header } from "@/components/dashboard/Header"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  Calendar,
  ArrowRight,
  Play,
  Pause,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data for developer tasks
const myTasks = [
  {
    id: 1,
    name: "Implement Login API",
    project: "Dependency Tracker",
    module: "Authentication",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-02-15",
    progress: 60,
  },
  {
    id: 2,
    name: "Add JWT Token Refresh",
    project: "Auth Service",
    module: "Security",
    priority: "High",
    status: "Pending",
    dueDate: "2026-02-18",
    progress: 0,
  },
  {
    id: 3,
    name: "Write Unit Tests",
    project: "Dependency Tracker",
    module: "Testing",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-02-20",
    progress: 40,
  },
  {
    id: 4,
    name: "Setup Database Migrations",
    project: "API Gateway",
    module: "Database",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-02-10",
    progress: 100,
  },
  {
    id: 5,
    name: "Implement Logging Service",
    project: "Dependency Tracker",
    module: "Infrastructure",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-02-25",
    progress: 0,
  },
]

const weeklyProgress = [
  { day: "Mon", tasks: 3 },
  { day: "Tue", tasks: 5 },
  { day: "Wed", tasks: 2 },
  { day: "Thu", tasks: 7 },
  { day: "Fri", tasks: 4 },
  { day: "Sat", tasks: 1 },
  { day: "Sun", tasks: 0 },
]

const assignedProjects = [
  { id: 1, name: "Dependency Tracker", tasks: 8, completed: 5 },
  { id: 2, name: "Auth Service", tasks: 4, completed: 1 },
  { id: 3, name: "API Gateway", tasks: 3, completed: 3 },
]

export function DeveloperDashboard() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-primary/20 text-primary"
      case "In Progress":
        return "bg-info/20 text-info"
      case "Pending":
        return "bg-warning/20 text-warning"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive/20 text-destructive"
      case "Medium":
        return "bg-warning/20 text-warning"
      case "Low":
        return "bg-primary/20 text-primary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const completedTasks = myTasks.filter((t) => t.status === "Completed").length
  const inProgressTasks = myTasks.filter((t) => t.status === "In Progress").length
  const highPriorityTasks = myTasks.filter((t) => t.priority === "High" && t.status !== "Completed").length

  return (
    <div className="flex flex-col">
      <Header title={`Welcome back, ${user?.name?.split(" ")[0] || "Developer"}`} />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="My Tasks" value={myTasks.length} description="Total assigned" icon={CheckSquare} />
          <StatsCard
            title="In Progress"
            value={inProgressTasks}
            description="Currently working on"
            icon={Play}
            trend={{ value: 25, isPositive: true }}
          />
          <StatsCard title="Completed" value={completedTasks} description="This month" icon={CheckCircle2} />
          <StatsCard
            title="High Priority"
            value={highPriorityTasks}
            description="Needs attention"
            icon={AlertTriangle}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Task List */}
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  My Tasks
                </CardTitle>
                <CardDescription>Tasks assigned to you</CardDescription>
              </div>
              <Link to="/dashboard/my-tasks">
                <Button variant="outline" size="sm" className="border-border bg-transparent">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-card-foreground">{task.name}</h4>
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FolderKanban className="h-3 w-3" />
                            {task.project}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                    {task.status === "In Progress" && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="mt-1 h-2" />
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      {task.status === "Pending" && (
                        <Button size="sm" variant="outline" className="h-7 border-border bg-transparent">
                          <Play className="mr-1 h-3 w-3" />
                          Start
                        </Button>
                      )}
                      {task.status === "In Progress" && (
                        <>
                          <Button size="sm" variant="outline" className="h-7 border-border bg-transparent">
                            <Pause className="mr-1 h-3 w-3" />
                            Pause
                          </Button>
                          <Button size="sm" className="h-7">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Complete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Weekly Progress Chart */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>Tasks completed this week</CardDescription>
              </CardHeader>
              <CardContent>
                {mounted && (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 15%)" />
                      <XAxis dataKey="day" stroke="hsl(0, 0%, 55%)" fontSize={12} />
                      <YAxis stroke="hsl(0, 0%, 55%)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220, 15%, 8%)",
                          border: "1px solid hsl(220, 15%, 15%)",
                          borderRadius: "8px",
                          color: "hsl(0, 0%, 95%)",
                        }}
                      />
                      <Bar dataKey="tasks" fill="hsl(155, 70%, 45%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Assigned Projects */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <FolderKanban className="h-5 w-5 text-primary" />
                  My Projects
                </CardTitle>
                <CardDescription>Projects you are working on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignedProjects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-card-foreground">{project.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {project.completed}/{project.tasks}
                        </span>
                      </div>
                      <Progress value={(project.completed / project.tasks) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myTasks
                    .filter((t) => t.status !== "Completed")
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 3)
                    .map((task) => (
                      <div key={task.id} className="flex items-center justify-between rounded-lg bg-secondary/30 p-2">
                        <span className="text-sm text-card-foreground">{task.name}</span>
                        <Badge variant="outline" className="border-border text-xs">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
