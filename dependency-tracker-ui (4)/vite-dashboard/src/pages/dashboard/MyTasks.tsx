'use client';

import { useState } from "react"
import { Header } from "@/components/dashboard/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckSquare, FolderKanban, Calendar, Play, Pause, CheckCircle2 } from "lucide-react"

// Mock data for developer tasks
const mockMyTasks = [
  { taskID: 1, taskName: "Implement Login API", project: "Dependency Tracker", module: "Authentication", priority: "High", status: "In Progress", dueDate: "2026-02-15", progress: 60 },
  { taskID: 2, taskName: "Add JWT Token Refresh", project: "Auth Service", module: "Security", priority: "High", status: "Pending", dueDate: "2026-02-18", progress: 0 },
  { taskID: 3, taskName: "Write Unit Tests", project: "Dependency Tracker", module: "Testing", priority: "Medium", status: "In Progress", dueDate: "2026-02-20", progress: 40 },
  { taskID: 4, taskName: "Setup Database Migrations", project: "API Gateway", module: "Database", priority: "Low", status: "Completed", dueDate: "2026-02-10", progress: 100 },
  { taskID: 5, taskName: "Implement Logging Service", project: "Dependency Tracker", module: "Infrastructure", priority: "Medium", status: "Pending", dueDate: "2026-02-25", progress: 0 },
]

export default function MyTasksPage() {
  const [tasks, setTasks] = useState(mockMyTasks)
  const [activeTab, setActiveTab] = useState("all")

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "all") return true
    return t.status.toLowerCase().replace(" ", "-") === activeTab
  })

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

  const handleStartTask = (id: number) => {
    setTasks(tasks.map((t) => (t.taskID === id ? { ...t, status: "In Progress", progress: 10 } : t)))
  }

  const handleCompleteTask = (id: number) => {
    setTasks(tasks.map((t) => (t.taskID === id ? { ...t, status: "Completed", progress: 100 } : t)))
  }

  return (
    <div className="flex flex-col">
      <Header title="My Tasks" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold text-card-foreground">{tasks.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-info">{tasks.filter((t) => t.status === "In Progress").length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">{tasks.filter((t) => t.status === "Pending").length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-primary">{tasks.filter((t) => t.status === "Completed").length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card key={task.taskID} className="border-border bg-card">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                        <CheckSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-card-foreground">{task.taskName}</CardTitle>
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
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-border">
                          {task.module}
                        </Badge>
                      </div>

                      {task.status === "In Progress" && (
                        <div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="mt-1 h-2" />
                        </div>
                      )}

                      <div className="flex gap-2">
                        {task.status === "Pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartTask(task.taskID)}
                            className="border-border bg-transparent"
                          >
                            <Play className="mr-1 h-3 w-3" />
                            Start Task
                          </Button>
                        )}
                        {task.status === "In Progress" && (
                          <>
                            <Button size="sm" variant="outline" className="border-border bg-transparent">
                              <Pause className="mr-1 h-3 w-3" />
                              Pause
                            </Button>
                            <Button size="sm" onClick={() => handleCompleteTask(task.taskID)}>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Mark Complete
                            </Button>
                          </>
                        )}
                        {task.status === "Completed" && (
                          <span className="flex items-center gap-1 text-sm text-primary">
                            <CheckCircle2 className="h-4 w-4" />
                            Task completed
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
