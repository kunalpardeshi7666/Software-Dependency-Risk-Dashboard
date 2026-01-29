'use client';

import { useState } from "react"
import { Header } from "@/components/dashboard/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Boxes, Plus, FolderKanban, Search, Edit, Trash2, GitBranch } from "lucide-react"

// Mock data
const mockModules = [
  { moduleID: 1, moduleName: "Authentication", version: "1.0.0", projectID: 1, projectName: "Dependency Tracker" },
  { moduleID: 2, moduleName: "User Management", version: "2.1.0", projectID: 1, projectName: "Dependency Tracker" },
  { moduleID: 3, moduleName: "Core API", version: "1.5.0", projectID: 2, projectName: "Auth Service" },
  { moduleID: 4, moduleName: "JWT Handler", version: "1.0.2", projectID: 2, projectName: "Auth Service" },
  { moduleID: 5, moduleName: "Dashboard", version: "3.0.0", projectID: 3, projectName: "Reporting Module" },
  { moduleID: 6, moduleName: "Gateway Core", version: "2.0.0", projectID: 4, projectName: "API Gateway" },
]

const projects = [
  { projectID: 1, projectName: "Dependency Tracker" },
  { projectID: 2, projectName: "Auth Service" },
  { projectID: 3, projectName: "Reporting Module" },
  { projectID: 4, projectName: "API Gateway" },
]

export default function ModulesPage() {
  const [modules, setModules] = useState(mockModules)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterProject, setFilterProject] = useState<string>("all")
  const [newModule, setNewModule] = useState({
    moduleName: "",
    version: "1.0.0",
    projectID: "",
  })

  const filteredModules = modules.filter((m) => {
    const matchesSearch = m.moduleName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProject = filterProject === "all" || m.projectID.toString() === filterProject
    return matchesSearch && matchesProject
  })

  const handleCreateModule = () => {
    const project = projects.find((p) => p.projectID.toString() === newModule.projectID)
    const newId = Math.max(...modules.map((m) => m.moduleID)) + 1
    setModules([
      ...modules,
      {
        ...newModule,
        moduleID: newId,
        projectID: parseInt(newModule.projectID),
        projectName: project?.projectName || "",
      },
    ])
    setNewModule({ moduleName: "", version: "1.0.0", projectID: "" })
    setIsOpen(false)
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary border-border pl-10"
              />
            </div>
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger className="w-full bg-secondary border-border sm:w-48">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.projectID} value={p.projectID.toString()}>
                    {p.projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Module
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Create New Module</DialogTitle>
                <DialogDescription>Add a new module to a project</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="moduleName">Module Name</Label>
                  <Input
                    id="moduleName"
                    value={newModule.moduleName}
                    onChange={(e) => setNewModule({ ...newModule, moduleName: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={newModule.version}
                    onChange={(e) => setNewModule({ ...newModule, version: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select
                    value={newModule.projectID}
                    onValueChange={(value) => setNewModule({ ...newModule, projectID: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {projects.map((p) => (
                        <SelectItem key={p.projectID} value={p.projectID.toString()}>
                          {p.projectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="border-border bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleCreateModule}>Create Module</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((module) => (
            <Card key={module.moduleID} className="border-border bg-card">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Boxes className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-card-foreground">{module.moduleName}</CardTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <GitBranch className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">v{module.version}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="border-border">
                      {module.projectName}
                    </Badge>
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
                      onClick={() => handleDeleteModule(module.moduleID)}
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
