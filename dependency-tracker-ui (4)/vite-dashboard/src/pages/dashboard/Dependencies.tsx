'use client';

import { useState } from "react"
import { Header } from "@/components/dashboard/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Network, Plus, ArrowRight, Trash2, AlertTriangle } from "lucide-react"

// Mock data
const mockDependencies = [
  { dependencyID: 1, moduleID: 2, moduleName: "User Management", dependsOnModuleID: 1, dependsOnModuleName: "Authentication", projectName: "Dependency Tracker" },
  { dependencyID: 2, moduleID: 3, moduleName: "Core API", dependsOnModuleID: 4, dependsOnModuleName: "JWT Handler", projectName: "Auth Service" },
  { dependencyID: 3, moduleID: 5, moduleName: "Dashboard", dependsOnModuleID: 3, dependsOnModuleName: "Core API", projectName: "Reporting Module" },
  { dependencyID: 4, moduleID: 6, moduleName: "Gateway Core", dependsOnModuleID: 1, dependsOnModuleName: "Authentication", projectName: "API Gateway" },
]

const modules = [
  { moduleID: 1, moduleName: "Authentication", projectName: "Dependency Tracker" },
  { moduleID: 2, moduleName: "User Management", projectName: "Dependency Tracker" },
  { moduleID: 3, moduleName: "Core API", projectName: "Auth Service" },
  { moduleID: 4, moduleName: "JWT Handler", projectName: "Auth Service" },
  { moduleID: 5, moduleName: "Dashboard", projectName: "Reporting Module" },
  { moduleID: 6, moduleName: "Gateway Core", projectName: "API Gateway" },
]

export default function DependenciesPage() {
  const [dependencies, setDependencies] = useState(mockDependencies)
  const [isOpen, setIsOpen] = useState(false)
  const [newDependency, setNewDependency] = useState({
    moduleID: "",
    dependsOnModuleID: "",
  })

  const handleCreateDependency = () => {
    const module = modules.find((m) => m.moduleID.toString() === newDependency.moduleID)
    const dependsOn = modules.find((m) => m.moduleID.toString() === newDependency.dependsOnModuleID)

    if (module && dependsOn) {
      const newId = Math.max(...dependencies.map((d) => d.dependencyID)) + 1
      setDependencies([
        ...dependencies,
        {
          dependencyID: newId,
          moduleID: parseInt(newDependency.moduleID),
          moduleName: module.moduleName,
          dependsOnModuleID: parseInt(newDependency.dependsOnModuleID),
          dependsOnModuleName: dependsOn.moduleName,
          projectName: module.projectName,
        },
      ])
    }
    setNewDependency({ moduleID: "", dependsOnModuleID: "" })
    setIsOpen(false)
  }

  const handleDeleteDependency = (id: number) => {
    setDependencies(dependencies.filter((d) => d.dependencyID !== id))
  }

  // Check for circular dependencies (simplified)
  const circularWarnings = dependencies.filter((dep) =>
    dependencies.some(
      (d) => d.moduleID === dep.dependsOnModuleID && d.dependsOnModuleID === dep.moduleID
    )
  )

  return (
    <div className="flex flex-col">
      <Header title="Dependencies" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Circular Dependency Warning */}
        {circularWarnings.length > 0 && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">Circular Dependencies Detected</p>
                <p className="text-sm text-muted-foreground">
                  {circularWarnings.length} circular dependency relationship(s) found. Please review.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Module Dependencies</h2>
            <p className="text-sm text-muted-foreground">Manage relationships between modules</p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Dependency
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Create Dependency</DialogTitle>
                <DialogDescription>Define a dependency relationship between modules</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Module</Label>
                  <Select
                    value={newDependency.moduleID}
                    onValueChange={(value) => setNewDependency({ ...newDependency, moduleID: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {modules.map((m) => (
                        <SelectItem key={m.moduleID} value={m.moduleID.toString()}>
                          {m.moduleName} ({m.projectName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Label>Depends On</Label>
                  <Select
                    value={newDependency.dependsOnModuleID}
                    onValueChange={(value) => setNewDependency({ ...newDependency, dependsOnModuleID: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select dependency" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {modules
                        .filter((m) => m.moduleID.toString() !== newDependency.moduleID)
                        .map((m) => (
                          <SelectItem key={m.moduleID} value={m.moduleID.toString()}>
                            {m.moduleName} ({m.projectName})
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
                <Button onClick={handleCreateDependency}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dependencies List */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dependencies.map((dep) => (
            <Card key={dep.dependencyID} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Network className="h-5 w-5 text-primary" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDeleteDependency(dep.dependencyID)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-card-foreground">{dep.moduleName}</CardTitle>
                <CardDescription>depends on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <Badge variant="outline" className="border-primary text-primary">
                      {dep.dependsOnModuleName}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="border-border">
                    {dep.projectName}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
