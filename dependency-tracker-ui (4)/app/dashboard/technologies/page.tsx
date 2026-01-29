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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Cpu, Plus, Search, MoreVertical, Trash2, Database, Globe, Server, Box } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Mock data
const initialTechnologies = [
  { techID: 1, techName: "ASP.NET Core", category: "Backend" },
  { techID: 2, techName: "MySQL", category: "Database" },
  { techID: 3, techName: "React", category: "Frontend" },
  { techID: 4, techName: "Redis", category: "Cache" },
  { techID: 5, techName: "Docker", category: "DevOps" },
  { techID: 6, techName: "PostgreSQL", category: "Database" },
  { techID: 7, techName: "TypeScript", category: "Frontend" },
  { techID: 8, techName: "Node.js", category: "Backend" },
  { techID: 9, techName: "MongoDB", category: "Database" },
  { techID: 10, techName: "Kubernetes", category: "DevOps" },
]

const categories = ["Backend", "Frontend", "Database", "Cache", "DevOps", "Testing", "Other"]

interface Technology {
  techID: number
  techName: string
  category: string
}

export default function TechnologiesPage() {
  const { user } = useAuth()
  const [technologies, setTechnologies] = useState(initialTechnologies)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTech, setNewTech] = useState({
    techName: "",
    category: "Backend",
  })

  const isAdmin = user?.role === "Admin"

  const filteredTechnologies = technologies.filter((tech) => {
    const matchesSearch = tech.techName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || tech.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Backend":
        return Server
      case "Frontend":
        return Globe
      case "Database":
        return Database
      case "Cache":
        return Box
      default:
        return Cpu
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Backend":
        return "bg-primary/20 text-primary"
      case "Frontend":
        return "bg-info/20 text-info"
      case "Database":
        return "bg-warning/20 text-warning"
      case "Cache":
        return "bg-destructive/20 text-destructive"
      case "DevOps":
        return "bg-chart-4/20 text-chart-4"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleAddTechnology = () => {
    const technology: Technology = {
      techID: Math.max(...technologies.map((t) => t.techID), 0) + 1,
      techName: newTech.techName,
      category: newTech.category,
    }
    setTechnologies([...technologies, technology])
    setNewTech({ techName: "", category: "Backend" })
    setIsAddDialogOpen(false)
  }

  const handleDeleteTechnology = (id: number) => {
    setTechnologies(technologies.filter((t) => t.techID !== id))
  }

  // Group technologies by category for stats
  const techByCategory = technologies.reduce(
    (acc, tech) => {
      acc[tech.category] = (acc[tech.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="flex flex-col">
      <Header title="Technologies" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary border-border pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border text-foreground">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
                  Add Technology
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-card-foreground">Add New Technology</DialogTitle>
                  <DialogDescription>Add a new technology to the stack</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="techName" className="text-card-foreground">
                      Technology Name
                    </Label>
                    <Input
                      id="techName"
                      value={newTech.techName}
                      onChange={(e) => setNewTech({ ...newTech, techName: e.target.value })}
                      placeholder="e.g., Next.js"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-card-foreground">
                      Category
                    </Label>
                    <Select value={newTech.category} onValueChange={(value) => setNewTech({ ...newTech, category: value })}>
                      <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
                  <Button onClick={handleAddTechnology} disabled={!newTech.techName}>
                    Add Technology
                  </Button>
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
                  <Cpu className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{technologies.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {Object.entries(techByCategory)
            .slice(0, 4)
            .map(([category, count]) => {
              const Icon = getCategoryIcon(category)
              return (
                <Card key={category} className="border-border bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getCategoryColor(category).split(" ")[0]}`}>
                        <Icon className={`h-5 w-5 ${getCategoryColor(category).split(" ")[1]}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-card-foreground">{count}</p>
                        <p className="text-sm text-muted-foreground">{category}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>

        {/* Technologies Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const categoryTechs = filteredTechnologies.filter((t) => t.category === category)
            if (categoryTechs.length === 0 && categoryFilter !== "all" && categoryFilter !== category) return null

            return (
              <Card key={category} className="border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    {(() => {
                      const Icon = getCategoryIcon(category)
                      return <Icon className="h-5 w-5 text-primary" />
                    })()}
                    {category}
                    <Badge variant="outline" className="ml-auto border-border">
                      {categoryTechs.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {categoryTechs.map((tech) => (
                      <Badge key={tech.techID} className={`${getCategoryColor(category)} group relative`}>
                        {tech.techName}
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteTechnology(tech.techID)}
                            className="ml-1 hidden h-4 w-4 items-center justify-center rounded-full bg-background/50 hover:bg-background group-hover:inline-flex"
                          >
                            <span className="sr-only">Delete</span>
                            <span className="text-xs">&times;</span>
                          </button>
                        )}
                      </Badge>
                    ))}
                    {categoryTechs.length === 0 && (
                      <p className="text-sm text-muted-foreground">No technologies</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Technologies Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Technologies ({filteredTechnologies.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">ID</TableHead>
                    <TableHead className="text-muted-foreground">Technology</TableHead>
                    <TableHead className="text-muted-foreground">Category</TableHead>
                    {isAdmin && <TableHead className="text-muted-foreground text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTechnologies.map((tech) => (
                    <TableRow key={tech.techID} className="border-border hover:bg-secondary/30">
                      <TableCell className="text-muted-foreground">{tech.techID}</TableCell>
                      <TableCell className="font-medium text-card-foreground">{tech.techName}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(tech.category)}>{tech.category}</Badge>
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
                                onClick={() => handleDeleteTechnology(tech.techID)}
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
                  {filteredTechnologies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 4 : 3} className="py-8 text-center text-muted-foreground">
                        No technologies found.
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
