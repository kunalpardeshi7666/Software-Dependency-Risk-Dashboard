"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CheckSquare,
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
  Boxes,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Play,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Mock data
const mockModules = [
  { moduleID: 1, moduleName: "Authentication" },
  { moduleID: 2, moduleName: "User Management" },
  { moduleID: 3, moduleName: "Reporting" },
  { moduleID: 4, moduleName: "Auth Module" },
  { moduleID: 5, moduleName: "Frontend" },
]

const mockDevelopers = [
  { developerID: 1, developerName: "Rahul Sharma" },
  { developerID: 2, developerName: "Ram Kumar" },
  { developerID: 3, developerName: "Shrikant Sharma" },
  { developerID: 4, developerName: "Sham Sharma" },
]

const initialTasks = [
  {
    taskID: 1,
    taskName: "Implement Login API",
    description: "Create JWT based login endpoint",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-02-15",
    moduleID: 1,
    moduleName: "Authentication",
    developerID: 1,
    developerName: "Rahul Sharma",
  },
  {
    taskID: 2,
    taskName: "Create User CRUD",
    description: "Implement user management endpoints",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-02-18",
    moduleID: 2,
    moduleName: "User Management",
    developerID: 2,
    developerName: "Ram Kumar",
  },
  {
    taskID: 3,
    taskName: "Design Dashboard UI",
    description: "Create reporting dashboard components",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-02-10",
    moduleID: 3,
    moduleName: "Reporting",
    developerID: 3,
    developerName: "Shrikant Sharma",
  },
  {
    taskID: 4,
    taskName: "Token Refresh Logic",
    description: "Implement JWT token refresh mechanism",
    priority: "High",
    status: "Pending",
    dueDate: "2026-02-20",
    moduleID: 4,
    moduleName: "Auth Module",
    developerID: 1,
    developerName: "Rahul Sharma",
  },
  {
    taskID: 5,
    taskName: "React Components",
    description: "Build reusable UI components",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-02-25",
    moduleID: 5,
    moduleName: "Frontend",
    developerID: 4,
    developerName: "Sham Sharma",
  },
  {
    taskID: 6,
    taskName: "API Documentation",
    description: "Write Swagger documentation",
    priority: "Low",
    status: "Pending",
    dueDate: "2026-02-28",
    moduleID: 1,
    moduleName: "Authentication",
    developerID: 3,
    developerName: "Shrikant Sharma",
  },
]

interface Task {
  taskID: number
  taskName: string
  description: string
  priority: string
  status: string
  dueDate: string
  moduleID: number
  moduleName: string
  developerID: number
  developerName: string
}

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    taskName: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    moduleID: "",
    developerID: "",
  })

  const isAdmin = user?.role === "Admin"

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.developerName.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleAddTask = () => {
    const module = mockModules.find((m) => m.moduleID.toString() === newTask.moduleID)
    const developer = mockDevelopers.find((d) => d.developerID.toString() === newTask.developerID)

    const task: Task = {
      taskID: Math.max(...tasks.map((t) => t.taskID), 0) + 1,
      taskName: newTask.taskName,
      description: newTask.description,
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.dueDate,
      moduleID: parseInt(newTask.moduleID),
      moduleName: module?.moduleName || "",
      developerID: parseInt(newTask.developerID),
      developerName: developer?.developerName || "",
    }

    setTasks([...tasks, task])
    setNewTask({
      taskName: "",
      description: "",
      priority: "Medium",
      status: "Pending",
      dueDate: "",
      moduleID: "",
      developerID: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditTask = () => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.taskID === editingTask.taskID ? editingTask : t)))
      setIsEditDialogOpen(false)
      setEditingTask(null)
    }
  }

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.taskID !== id))
  }

  const handleStatusChange = (taskId: number, newStatus: string) => {
    setTasks(tasks.map((t) => (t.taskID === taskId ? { ...t, status: newStatus } : t)))
  }

  return (
    <div className="flex flex-col">
      <Header title="Tasks" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary border-border pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 bg-secondary border-border text-foreground">
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

          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-card-foreground">Add New Task</DialogTitle>
                  <DialogDescription>Create a new task and assign it to a developer</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="taskName" className="text-card-foreground">
                      Task Name
                    </Label>
                    <Input
                      id="taskName"
                      value={newTask.taskName}
                      onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-card-foreground">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-card-foreground">Module</Label>
                      <Select value={newTask.moduleID} onValueChange={(value) => setNewTask({ ...newTask, moduleID: value })}>
                        <SelectTrigger className="bg-secondary border-border text-foreground">
                          <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {mockModules.map((mod) => (
                            <SelectItem key={mod.moduleID} value={mod.moduleID.toString()}>
                              {mod.moduleName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-card-foreground">Developer</Label>
                      <Select value={newTask.developerID} onValueChange={(value) => setNewTask({ ...newTask, developerID: value })}>
                        <SelectTrigger className="bg-secondary border-border text-foreground">
                          <SelectValue placeholder="Select developer" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {mockDevelopers.map((dev) => (
                            <SelectItem key={dev.developerID} value={dev.developerID.toString()}>
                              {dev.developerName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-card-foreground">Priority</Label>
                      <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                        <SelectTrigger className="bg-secondary border-border text-foreground">
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
                      <Label className="text-card-foreground">Status</Label>
                      <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value })}>
                        <SelectTrigger className="bg-secondary border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate" className="text-card-foreground">
                        Due Date
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="bg-secondary border-border text-foreground"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-border bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={handleAddTask}>Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <CheckSquare className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{tasks.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
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
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
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
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
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
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {tasks.filter((t) => t.priority === "High" && t.status !== "Completed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Tasks ({filteredTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Task</TableHead>
                    <TableHead className="text-muted-foreground">Module</TableHead>
                    <TableHead className="text-muted-foreground">Developer</TableHead>
                    <TableHead className="text-muted-foreground">Priority</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Due Date</TableHead>
                    {isAdmin && <TableHead className="text-muted-foreground text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.taskID} className="border-border hover:bg-secondary/30">
                      <TableCell>
                        <div>
                          <p className="font-medium text-card-foreground">{task.taskName}</p>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border">
                          <Boxes className="mr-1 h-3 w-3" />
                          {task.moduleName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-info/20 text-info">
                          <Users className="mr-1 h-3 w-3" />
                          {task.developerName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card border-border">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingTask(task)
                                  setIsEditDialogOpen(true)
                                }}
                                className="text-card-foreground focus:bg-accent"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border" />
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(task.taskID, "Pending")}
                                className="text-card-foreground focus:bg-accent"
                              >
                                Mark Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(task.taskID, "In Progress")}
                                className="text-card-foreground focus:bg-accent"
                              >
                                Mark In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(task.taskID, "Completed")}
                                className="text-card-foreground focus:bg-accent"
                              >
                                Mark Completed
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border" />
                              <DropdownMenuItem
                                onClick={() => handleDeleteTask(task.taskID)}
                                className="text-destructive focus:bg-accent focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                  {filteredTasks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 7 : 6} className="py-8 text-center text-muted-foreground">
                        No tasks found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Edit Task</DialogTitle>
              <DialogDescription>Update task details</DialogDescription>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Task Name</Label>
                  <Input
                    value={editingTask.taskName}
                    onChange={(e) => setEditingTask({ ...editingTask, taskName: e.target.value })}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-card-foreground">Description</Label>
                  <Textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-card-foreground">Priority</Label>
                    <Select
                      value={editingTask.priority}
                      onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border text-foreground">
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
                    <Label className="text-card-foreground">Status</Label>
                    <Select
                      value={editingTask.status}
                      onValueChange={(value) => setEditingTask({ ...editingTask, status: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-card-foreground">Due Date</Label>
                    <Input
                      type="date"
                      value={editingTask.dueDate}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-border bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleEditTask}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
