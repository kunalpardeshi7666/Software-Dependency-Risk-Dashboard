"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Network, Plus, MoreVertical, Trash2, ArrowRight, AlertTriangle, GitBranch } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Mock data
const mockProjects = [
  { projectID: 1, projectName: "Dependency Tracker" },
  { projectID: 2, projectName: "Auth Service" },
  { projectID: 3, projectName: "API Gateway" },
]

const mockModules = [
  { moduleID: 1, moduleName: "Authentication", projectID: 1 },
  { moduleID: 2, moduleName: "User Management", projectID: 1 },
  { moduleID: 3, moduleName: "Reporting", projectID: 1 },
  { moduleID: 4, moduleName: "Auth Module", projectID: 2 },
  { moduleID: 5, moduleName: "Frontend", projectID: 1 },
  { moduleID: 6, moduleName: "Gateway Core", projectID: 3 },
  { moduleID: 7, moduleName: "Rate Limiter", projectID: 3 },
]

const initialDependencies = [
  { dependencyID: 1, moduleID: 2, moduleName: "User Management", dependsOnModuleID: 1, dependsOnModuleName: "Authentication" },
  { dependencyID: 2, moduleID: 3, moduleName: "Reporting", dependsOnModuleID: 2, dependsOnModuleName: "User Management" },
  { dependencyID: 3, moduleID: 5, moduleName: "Frontend", dependsOnModuleID: 1, dependsOnModuleName: "Authentication" },
  { dependencyID: 4, moduleID: 7, moduleName: "Rate Limiter", dependsOnModuleID: 6, dependsOnModuleName: "Gateway Core" },
]

interface Dependency {
  dependencyID: number
  moduleID: number
  moduleName: string
  dependsOnModuleID: number
  dependsOnModuleName: string
}

// Simple Dependency Graph Visualization Component
function DependencyGraphView({ dependencies, modules }: { dependencies: Dependency[]; modules: typeof mockModules }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Build graph data
  const nodes = new Set<string>()
  dependencies.forEach((d) => {
    nodes.add(d.moduleName)
    nodes.add(d.dependsOnModuleName)
  })

  const nodeArray = Array.from(nodes)
  const nodePositions: Record<string, { x: number; y: number }> = {}

  // Position nodes in a circle
  const centerX = 250
  const centerY = 200
  const radius = 150
  nodeArray.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / nodeArray.length - Math.PI / 2
    nodePositions[node] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg border border-border bg-secondary/30">
      <svg width="100%" height="100%" viewBox="0 0 500 400">
        {/* Draw edges */}
        {dependencies.map((dep) => {
          const from = nodePositions[dep.moduleName]
          const to = nodePositions[dep.dependsOnModuleName]
          if (!from || !to) return null

          // Calculate arrow position
          const angle = Math.atan2(to.y - from.y, to.x - from.x)
          const arrowLength = 10
          const nodeRadius = 40

          const startX = from.x + nodeRadius * Math.cos(angle)
          const startY = from.y + nodeRadius * Math.sin(angle)
          const endX = to.x - nodeRadius * Math.cos(angle)
          const endY = to.y - nodeRadius * Math.sin(angle)

          return (
            <g key={dep.dependencyID}>
              <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrowhead)" />
            </g>
          )
        })}

        {/* Arrowhead marker */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
          </marker>
        </defs>

        {/* Draw nodes */}
        {nodeArray.map((node) => {
          const pos = nodePositions[node]
          return (
            <g key={node}>
              <circle cx={pos.x} cy={pos.y} r="40" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
              <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fill="hsl(var(--card-foreground))" fontSize="10" fontWeight="500">
                {node.length > 12 ? node.substring(0, 12) + "..." : node}
              </text>
            </g>
          )
        })}
      </svg>

      {nodeArray.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          No dependencies to display
        </div>
      )}
    </div>
  )
}

export default function DependenciesPage() {
  const { user } = useAuth()
  const [dependencies, setDependencies] = useState(initialDependencies)
  const [projectFilter, setProjectFilter] = useState("1")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [error, setError] = useState("")
  const [newDependency, setNewDependency] = useState({
    moduleID: "",
    dependsOnModuleID: "",
  })

  const isAdmin = user?.role === "Admin"

  const projectModules = mockModules.filter((m) => m.projectID.toString() === projectFilter)
  const projectDependencies = dependencies.filter((d) => {
    const module = mockModules.find((m) => m.moduleID === d.moduleID)
    return module?.projectID.toString() === projectFilter
  })

  const checkCircularDependency = (moduleID: number, dependsOnModuleID: number): boolean => {
    // Simple circular dependency check
    const visited = new Set<number>()
    const stack = [dependsOnModuleID]

    while (stack.length > 0) {
      const current = stack.pop()!
      if (current === moduleID) return true
      if (visited.has(current)) continue
      visited.add(current)

      const deps = dependencies.filter((d) => d.moduleID === current)
      deps.forEach((d) => stack.push(d.dependsOnModuleID))
    }

    return false
  }

  const handleAddDependency = () => {
    setError("")
    const moduleID = parseInt(newDependency.moduleID)
    const dependsOnModuleID = parseInt(newDependency.dependsOnModuleID)

    if (moduleID === dependsOnModuleID) {
      setError("A module cannot depend on itself")
      return
    }

    // Check for existing dependency
    const exists = dependencies.some((d) => d.moduleID === moduleID && d.dependsOnModuleID === dependsOnModuleID)
    if (exists) {
      setError("This dependency already exists")
      return
    }

    // Check for circular dependency
    if (checkCircularDependency(moduleID, dependsOnModuleID)) {
      setError("Circular dependency detected!")
      return
    }

    const module = mockModules.find((m) => m.moduleID === moduleID)
    const dependsOnModule = mockModules.find((m) => m.moduleID === dependsOnModuleID)

    const dependency: Dependency = {
      dependencyID: Math.max(...dependencies.map((d) => d.dependencyID), 0) + 1,
      moduleID,
      moduleName: module?.moduleName || "",
      dependsOnModuleID,
      dependsOnModuleName: dependsOnModule?.moduleName || "",
    }

    setDependencies([...dependencies, dependency])
    setNewDependency({ moduleID: "", dependsOnModuleID: "" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteDependency = (id: number) => {
    setDependencies(dependencies.filter((d) => d.dependencyID !== id))
  }

  return (
    <div className="flex flex-col">
      <Header title="Dependencies" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-48 bg-secondary border-border text-foreground">
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

          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); setError(""); }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Dependency
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-card-foreground">Add New Dependency</DialogTitle>
                  <DialogDescription>Create a dependency between modules</DialogDescription>
                </DialogHeader>
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-card-foreground">Module</Label>
                    <Select value={newDependency.moduleID} onValueChange={(value) => setNewDependency({ ...newDependency, moduleID: value })}>
                      <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {projectModules.map((mod) => (
                          <SelectItem key={mod.moduleID} value={mod.moduleID.toString()}>
                            {mod.moduleName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">depends on</span>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-card-foreground">Depends On Module</Label>
                    <Select value={newDependency.dependsOnModuleID} onValueChange={(value) => setNewDependency({ ...newDependency, dependsOnModuleID: value })}>
                      <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {projectModules.map((mod) => (
                          <SelectItem key={mod.moduleID} value={mod.moduleID.toString()}>
                            {mod.moduleName}
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
                  <Button onClick={handleAddDependency}>Create Dependency</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Network className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{projectDependencies.length}</p>
                  <p className="text-sm text-muted-foreground">Dependencies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/20">
                  <GitBranch className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{projectModules.length}</p>
                  <p className="text-sm text-muted-foreground">Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Network className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {projectModules.length > 0 ? (projectDependencies.length / projectModules.length).toFixed(1) : 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Deps/Module</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dependency Graph */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Network className="h-5 w-5 text-primary" />
              Dependency Graph
            </CardTitle>
            <CardDescription>Visual representation of module dependencies</CardDescription>
          </CardHeader>
          <CardContent>
            <DependencyGraphView dependencies={projectDependencies} modules={projectModules} />
          </CardContent>
        </Card>

        {/* Dependencies Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Dependencies ({projectDependencies.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">ID</TableHead>
                    <TableHead className="text-muted-foreground">Module</TableHead>
                    <TableHead className="text-muted-foreground text-center">Relation</TableHead>
                    <TableHead className="text-muted-foreground">Depends On</TableHead>
                    {isAdmin && <TableHead className="text-muted-foreground text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectDependencies.map((dep) => (
                    <TableRow key={dep.dependencyID} className="border-border hover:bg-secondary/30">
                      <TableCell className="text-muted-foreground">{dep.dependencyID}</TableCell>
                      <TableCell>
                        <Badge className="bg-info/20 text-info">{dep.moduleName}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <ArrowRight className="inline h-4 w-4 text-primary" />
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/20 text-primary">{dep.dependsOnModuleName}</Badge>
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
                                onClick={() => handleDeleteDependency(dep.dependencyID)}
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
                  {projectDependencies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 5 : 4} className="py-8 text-center text-muted-foreground">
                        No dependencies found for this project.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
