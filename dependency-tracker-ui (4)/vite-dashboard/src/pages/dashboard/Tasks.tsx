'use client';

import { useState } from "react"
import { Header } from "@/components/dashboard/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, Plus, User, Calendar, Search, Edit, Trash2 } from "lucide-react"

// Mock data
const mockTasks = [
  { taskID: 1, taskName: "Implement Login API", description: "Create authentication endpoints", status: "In Progress", priority: "High", dueDate: "2026-02-15", moduleName: "Authentication", developerName: "Rahul Sharma" },
  { taskID: 2, taskName: "Design Database Schema", description: "Define table structures", status: "Pending", priority: "Medium", dueDate: "2026-02-18", moduleName: "Core API", developerName: "Ram Patel" },
  { taskID: 3, taskName: "Create Unit Tests", description: "Write test cases", status: "Completed", priority: "Low", dueDate: "2026-02-10", moduleName: "Testing", developerName: "Shrikant Kumar" },
  { taskID: 4, taskName: "Setup CI/CD Pipeline", description: "Configure deployment", status: "In Progress", priority: "High", dueDate: "2026-02-20", moduleName: "DevOps", developerName: "Sham Singh" },
  { taskID: 5, taskName: "JWT Token Refresh", description: "Implement token refresh", status: "Pending", priority: "High", dueDate: "2026-02-22", moduleName: "Security", developerName: "Priya Gupta" },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [newTask, setNewTask] = useState({
    taskName: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  })

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.taskName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = activeTab === "all" || t.status.toLowerCase().replace(" ", "-") === activeTab
    return matchesSearch && matchesStatus
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

  const handleCreateTask = () => {
    const newId = Math.max(...tasks.map((t) => t.taskID)) + 1
    setTasks([
      ...tasks,
      {
        ...newTask,
        taskID: newId,
        moduleName: "New Module",
        developerName: "Unassigned",
      },
    ])
    setNewTask({ taskName: "", description: "", status: "Pending", priority: "Medium", dueDate: "" })
    setIsOpen(false)
  }

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.taskID !== id))
  }

  return (
    <div className="flex flex-col">
      <Header title="Tasks" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary border-border pl-10"
            />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Create New Task</DialogTitle>
                <DialogDescription>Add a new task to the project</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="taskName">Task Name</Label>
                  <Input
                    id="taskName"
                    value={newTask.taskName}
                    onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newTask.status}
                      onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="border-border bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                        <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {task.developerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <Badge variant="outline" className="border-border">
                          {task.moduleName}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-border bg-transparent">
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDeleteTask(task.taskID)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
