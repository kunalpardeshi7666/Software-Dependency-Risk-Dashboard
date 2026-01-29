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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FolderKanban, Plus, Search, MoreVertical, Pencil, Trash2, Boxes, Calendar } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { Project } from "@/lib/types"

// Mock data
const mockProjects: Project[] = [
  {
    projectID: 1,
    projectName: "Dependency Tracker",
    description: "Track module dependencies across projects",
    startDate: "2026-01-01",
    endDate: "2026-06-30",
    status: "Active",
  },
  {
    projectID: 2,
    projectName: "Auth Service",
    description: "JWT-based authentication microservice",
    startDate: "2026-01-15",
    endDate: "2026-04-30",
    status: "Active",
  },
  {
    projectID: 3,
    projectName: "Reporting Module",
    description: "Analytics and reporting dashboard",
    startDate: "2025-11-01",
    endDate: "2026-03-31",
    status: "On Hold",
  },
  {
    projectID: 4,
    projectName: "API Gateway",
    description: "Central API gateway for microservices",
    startDate: "2025-09-01",
    endDate: "2026-01-15",
    status: "Completed",
  },
  {
    projectID: 5,
    projectName: "User Management",
    description: "User roles and permissions system",
    startDate: "2026-02-01",
    endDate: "2026-08-30",
    status: "Active",
  },
]

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState(mockProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Active",
  })

  const isAdmin = user?.role === "Admin"

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-primary/20 text-primary"
      case "On Hold":
        return "bg-warning/20 text-warning"
      case "Completed":
        return "bg-info/20 text-info"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleAddProject = () => {
    const project: Project = {
      projectID: Math.max(...projects.map((p) => p.projectID)) + 1,
      ...newProject,
    }
    setProjects([...projects, project])
    setNewProject({
      projectName: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "Active",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditProject = () => {
    if (editingProject) {
      setProjects(projects.map((p) => (p.projectID === editingProject.projectID ? editingProject : p)))
      setIsEditDialogOpen(false)
      setEditingProject(null)
    }
  }

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.projectID !== id))
  }

  return (
    <div className="flex flex-col">
      <Header title="Projects" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-card-foreground">Add New Project</DialogTitle>
                  <DialogDescription>Create a new project to track dependencies</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-card-foreground">
                      Project Name
                    </Label>
                    <Input
                      id="name"
                      value={newProject.projectName}
                      onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-card-foreground">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-card-foreground">
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newProject.startDate}
                        onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                        className="bg-secondary border-border text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-card-foreground">
                        End Date
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newProject.endDate}
                        onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                        className="bg-secondary border-border text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-card-foreground">
                      Status
                    </Label>
                    <Select
                      value={newProject.status}
                      onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-border bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={handleAddProject}>Create Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <FolderKanban className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Boxes className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {projects.filter((p) => p.status === "Active").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20">
                  <Calendar className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {projects.filter((p) => p.status === "On Hold").length}
                  </p>
                  <p className="text-sm text-muted-foreground">On Hold</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/20">
                  <FolderKanban className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {projects.filter((p) => p.status === "Completed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Projects ({filteredProjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Project Name</TableHead>
                    <TableHead className="text-muted-foreground">Description</TableHead>
                    <TableHead className="text-muted-foreground">Start Date</TableHead>
                    <TableHead className="text-muted-foreground">End Date</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    {isAdmin && <TableHead className="text-muted-foreground text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.projectID} className="border-border hover:bg-secondary/30">
                      <TableCell className="font-medium text-card-foreground">{project.projectName}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">{project.description}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(project.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(project.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
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
                                  setEditingProject(project)
                                  setIsEditDialogOpen(true)
                                }}
                                className="text-card-foreground focus:bg-accent"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteProject(project.projectID)}
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
                  {filteredProjects.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 6 : 5} className="py-8 text-center text-muted-foreground">
                        No projects found.
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
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Edit Project</DialogTitle>
              <DialogDescription>Update project details</DialogDescription>
            </DialogHeader>
            {editingProject && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-card-foreground">
                    Project Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingProject.projectName}
                    onChange={(e) => setEditingProject({ ...editingProject, projectName: e.target.value })}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-card-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate" className="text-card-foreground">
                      Start Date
                    </Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={editingProject.startDate}
                      onChange={(e) => setEditingProject({ ...editingProject, startDate: e.target.value })}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate" className="text-card-foreground">
                      End Date
                    </Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={editingProject.endDate}
                      onChange={(e) => setEditingProject({ ...editingProject, endDate: e.target.value })}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-card-foreground">
                    Status
                  </Label>
                  <Select
                    value={editingProject.status}
                    onValueChange={(value) => setEditingProject({ ...editingProject, status: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-border bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleEditProject}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
