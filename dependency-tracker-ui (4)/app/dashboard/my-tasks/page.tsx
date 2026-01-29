"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckSquare,
  FolderKanban,
  Calendar,
  Search,
  Filter,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  MoreVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for developer tasks
const allTasks = [
  {
    id: 1,
    name: "Implement Login API",
    description: "Create JWT-based authentication endpoint",
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
    description: "Implement token refresh mechanism",
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
    description: "Create comprehensive unit tests for auth module",
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
    description: "Configure EF Core migrations",
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
    description: "Add structured logging with Serilog",
    project: "Dependency Tracker",
    module: "Infrastructure",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-02-25",
    progress: 0,
  },
  {
    id: 6,
    name: "Create API Documentation",
    description: "Generate Swagger/OpenAPI docs",
    project: "Auth Service",
    module: "Documentation",
    priority: "Low",
    status: "Pending",
    dueDate: "2026-02-28",
    progress: 0,
  },
  {
    id: 7,
    name: "Optimize Database Queries",
    description: "Review and optimize slow queries",
    project: "Dependency Tracker",
    module: "Database",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-02-17",
    progress: 30,
  },
  {
    id: 8,
    name: "Implement Caching Layer",
    description: "Add Redis caching for frequently accessed data",
    project: "API Gateway",
    module: "Infrastructure",
    priority: "Medium",
    status: "Completed",
    dueDate: "2026-02-05",
    progress: 100,
  },
]

export default function MyTasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [tasks, setTasks] = useState(allTasks)

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
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

  const updateTaskStatus = (taskId: number, newStatus: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              progress: newStatus === "Completed" ? 100 : newStatus === "Pending" ? 0 : task.progress,
            }
          : task
      )
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="My Tasks" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Filters */}
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-secondary border-border pl-10 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 bg-secondary border-border text-foreground">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-36 bg-secondary border-border text-foreground">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <CheckSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{tasks.length}</p>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/20">
              <Play className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {tasks.filter((t) => t.status === "In Progress").length}
              </p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {tasks.filter((t) => t.status === "Pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {tasks.filter((t) => t.status === "Completed").length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Tasks ({filteredTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-card-foreground">{task.name}</h4>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FolderKanban className="h-3 w-3" />
                          {task.project}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckSquare className="h-3 w-3" />
                          {task.module}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem
                          onClick={() => updateTaskStatus(task.id, "Pending")}
                          className="text-card-foreground focus:bg-accent"
                        >
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateTaskStatus(task.id, "In Progress")}
                          className="text-card-foreground focus:bg-accent"
                        >
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateTaskStatus(task.id, "Completed")}
                          className="text-card-foreground focus:bg-accent"
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 border-border bg-transparent"
                        onClick={() => updateTaskStatus(task.id, "In Progress")}
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Start
                      </Button>
                    )}
                    {task.status === "In Progress" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 border-border bg-transparent"
                          onClick={() => updateTaskStatus(task.id, "Pending")}
                        >
                          <Pause className="mr-1 h-3 w-3" />
                          Pause
                        </Button>
                        <Button size="sm" className="h-7" onClick={() => updateTaskStatus(task.id, "Completed")}>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Complete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {filteredTasks.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">No tasks found matching your filters.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
