"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Boxes, Plus, Search, MoreVertical, Pencil, Trash2, FolderKanban, Cpu } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Mock data
const mockProjects = [
  { projectID: 1, projectName: "Dependency Tracker" },
  { projectID: 2, projectName: "Auth Service" },
  { projectID: 3, projectName: "API Gateway" },
]

const mockModules = [
  { moduleID: 1, moduleName: "Authentication", version: "2.0", projectID: 1, projectName: "Dependency Tracker" },
  { moduleID: 2, moduleName: "User Management", version: "1.1", projectID: 1, projectName: "Dependency Tracker" },
  { moduleID: 3, moduleName: "Reporting", version: "2.0", projectID: 1, projectName: "Dependency Tracker" },
  { moduleID: 4, moduleName: "Auth Module", version: "1.0", projectID: 2, projectName: "Auth Service" },
  { moduleID: 5, moduleName: "Frontend", version: "1.0", projectID: 1, projectName: "Dependency Tracker" },
  { moduleID: 6, moduleName: "Gateway Core", version: "3.0", projectID: 3, projectName: "API Gateway" },
  { moduleID: 7, moduleName: "Rate Limiter", version: "1.5", projectID: 3, projectName: "API Gateway" },
  { moduleID: 8, moduleName: "Token Service", version: "2.1", projectID: 2, projectName: "Auth Service" },
]

const mockTechnologies = [
  { techID: 1, techName: "ASP.NET Core", category: "Backend" },
  { techID: 2, techName: "MySQL", category: "Database" },
  { techID: 3, techName: "React", category: "Frontend" },
  { techID: 4, techName: "Redis", category: "Cache" },
]

interface Module {
  moduleID: number
  moduleName: string
  version: string
  projectID: number
  projectName: string
}

export default function ModulesPage() {
  const { user } = useAuth()
  const [modules, setModules] = useState(mockModules)
  const [searchQuery, setSearchQuery] = useState("")
  const [projectFilter, setProjectFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [newModule, setNewModule] = useState({
    moduleName: "",
    version: "1.0",
    projectID: "",
  })

  const isAdmin = user?.role === "Admin"

  const filteredModules = modules.filter((mod) => {
    const matchesSearch = mod.moduleName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProject = projectFilter === "all" || mod.projectID.toString() === projectFilter
    return matchesSearch && matchesProject
  })

  const handleAddModule = () => {
    const project = mockProjects.find((p) => p.projectID.toString() === newModule.projectID)
    const module: Module = {
      moduleID: Math.max(...modules.map((m) => m.moduleID)) + 1,
      moduleName: newModule.moduleName,
      version: newModule.version,
      projectID: parseInt(newModule.projectID),
      projectName: project?.projectName || "",
    }
    setModules([...modules, module])
    setNewModule({ moduleName: "", version: "1.0", projectID: "" })
    setIsAddDialogOpen(false)
  }

  const handleEditModule = () => {
    if (editingModule) {
      setModules(modules.map((m) => (m.moduleID === editingModule.moduleID ? editingModule : m)))
      setIsEditDialogOpen(false)
      setEditingModule(null)
    }
  }

  const handleDeleteModule = (id: number) => {
    setModules(modules.filter((m) => m.moduleID !== id))
  }

  return (
    <div className="flex flex-col">
      <Header title="Modules" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary border-border pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-48 bg-secondary border-border text-foreground">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Projects</SelectItem>
                {mockProjects.map((project) => (
                  <SelectItem key={project.projectID} value={project.projectID.toString()}>
                    {project.projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Module
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-card-foreground">Add New Module</DialogTitle>
                  <DialogDescription>Create a new module for a project</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="moduleName" className="text-card-foreground">
                      Module Name
                    </Label>
                    <Input
                      id="moduleName"
                      value={newModule.moduleName}
                      onChange={(e) => setNewModule({ ...newModule, moduleName: e.target.value })}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version" className="text-card-foreground">
                      Version
                    </Label>
                    <Input
                      id="version"
                      value={newModule.version}
                      onChange={(e) => setNewModule({ ...newModule, version: e.target.value })}
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectID" className="text-card-foreground">
                      Project
                    </Label>
                    <Select value={newModule.projectID} onValueChange={(value) => setNewModule({ ...newModule, projectID: value })}>
                      <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {mockProjects.map((project) => (
                          <SelectItem key={project.projectID} value={project.projectID.toString()}>
                            {project.projectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-border bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={handleAddModule}>Create Module</Button>
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
                  <Boxes className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{modules.length}</p>
                  <p className="text-sm text-muted-foreground">Total Modules</p>
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
                  <p className="text-2xl font-bold text-card-foreground">{mockProjects.length}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20">
                  <Cpu className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{mockTechnologies.length}</p>
                  <p className="text-sm text-muted-foreground">Technologies</p>
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
                    {(modules.length / mockProjects.length).toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg per Project</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Modules ({filteredModules.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">ID</TableHead>
                    <TableHead className="text-muted-foreground">Module Name</TableHead>
                    <TableHead className="text-muted-foreground">Version</TableHead>
                    <TableHead className="text-muted-foreground">Project</TableHead>
                    {isAdmin && <TableHead className="text-muted-foreground text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.map((mod) => (
                    <TableRow key={mod.moduleID} className="border-border hover:bg-secondary/30">
                      <TableCell className="text-muted-foreground">{mod.moduleID}</TableCell>
                      <TableCell className="font-medium text-card-foreground">{mod.moduleName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border">
                          v{mod.version}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-info/20 text-info">{mod.projectName}</Badge>
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
                                  setEditingModule(mod)
                                  setIsEditDialogOpen(true)
                                }}
                                className="text-card-foreground focus:bg-accent"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteModule(mod.moduleID)}
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
                  {filteredModules.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 5 : 4} className="py-8 text-center text-muted-foreground">
                        No modules found.
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
              <DialogTitle className="text-card-foreground">Edit Module</DialogTitle>
              <DialogDescription>Update module details</DialogDescription>
            </DialogHeader>
            {editingModule && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-moduleName" className="text-card-foreground">
                    Module Name
                  </Label>
                  <Input
                    id="edit-moduleName"
                    value={editingModule.moduleName}
                    onChange={(e) => setEditingModule({ ...editingModule, moduleName: e.target.value })}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-version" className="text-card-foreground">
                    Version
                  </Label>
                  <Input
                    id="edit-version"
                    value={editingModule.version}
                    onChange={(e) => setEditingModule({ ...editingModule, version: e.target.value })}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-border bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleEditModule}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
