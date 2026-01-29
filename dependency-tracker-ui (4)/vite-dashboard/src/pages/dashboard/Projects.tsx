'use client';

import { useState } from "react"
import { Header } from "@/components/dashboard/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { FolderKanban, Plus, Boxes, Calendar, Edit, Trash2, Search } from "lucide-react"

// Mock data
const mockProjects = [
  { projectID: 1, projectName: "Dependency Tracker", description: "Track software dependencies", startDate: "2026-01-01", endDate: "2026-06-30", status: "Active", modules: 5 },
  { projectID: 2, projectName: "Auth Service", description: "Authentication microservice", startDate: "2026-02-01", endDate: "2026-04-30", status: "Active", modules: 3 },
  { projectID: 3, projectName: "Reporting Module", description: "Analytics and reporting", startDate: "2026-01-15", endDate: "2026-05-15", status: "On Hold", modules: 2 },
  { projectID: 4, projectName: "API Gateway", description: "API management gateway", startDate: "2025-11-01", endDate: "2026-02-28", status: "Completed", modules: 4 },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newProject, setNewProject] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Active",
  })

  const filteredProjects = projects.filter((p) =>
    p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  const handleCreateProject = () => {
    const newId = Math.max(...projects.map((p) => p.projectID)) + 1
    setProjects([...projects, { ...newProject, projectID: newId, modules: 0 }])
    setNewProject({ projectName: "", description: "", startDate: "", endDate: "", status: "Active" })
    setIsOpen(false)
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
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary border-border pl-10 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Create New Project</DialogTitle>
                <DialogDescription>Add a new project to your dashboard</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={newProject.projectName}
                    onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
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
                <Button variant="outline" onClick={() => setIsOpen(false)} className="border-border bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.projectID} className="border-border bg-card">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-card-foreground">{project.projectName}</CardTitle>
                    <CardDescription className="mt-1">{project.description}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Boxes className="h-4 w-4" />
                    <span>{project.modules} modules</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 border-border bg-transparent">
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDeleteProject(project.projectID)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
