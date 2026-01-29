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
import { Cpu, Plus, Search, Trash2 } from "lucide-react"

// Mock data
const mockTechnologies = [
  { techID: 1, techName: "React", category: "Frontend", usedIn: 3 },
  { techID: 2, techName: "Node.js", category: "Backend", usedIn: 4 },
  { techID: 3, techName: "PostgreSQL", category: "Database", usedIn: 2 },
  { techID: 4, techName: "Redis", category: "Cache", usedIn: 1 },
  { techID: 5, techName: "Docker", category: "DevOps", usedIn: 4 },
  { techID: 6, techName: "TypeScript", category: "Language", usedIn: 5 },
  { techID: 7, techName: "Tailwind CSS", category: "Frontend", usedIn: 2 },
  { techID: 8, techName: ".NET Core", category: "Backend", usedIn: 3 },
]

const categories = ["Frontend", "Backend", "Database", "Cache", "DevOps", "Language", "Testing", "Other"]

export default function TechnologiesPage() {
  const [technologies, setTechnologies] = useState(mockTechnologies)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [newTech, setNewTech] = useState({
    techName: "",
    category: "",
  })

  const filteredTechnologies = technologies.filter((t) => {
    const matchesSearch = t.techName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || t.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return "bg-info/20 text-info"
      case "Backend":
        return "bg-primary/20 text-primary"
      case "Database":
        return "bg-warning/20 text-warning"
      case "Cache":
        return "bg-destructive/20 text-destructive"
      case "DevOps":
        return "bg-chart-4/20 text-chart-4"
      case "Language":
        return "bg-chart-5/20 text-chart-5"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleCreateTechnology = () => {
    const newId = Math.max(...technologies.map((t) => t.techID)) + 1
    setTechnologies([...technologies, { ...newTech, techID: newId, usedIn: 0 }])
    setNewTech({ techName: "", category: "" })
    setIsOpen(false)
  }

  const handleDeleteTechnology = (id: number) => {
    setTechnologies(technologies.filter((t) => t.techID !== id))
  }

  return (
    <div className="flex flex-col">
      <Header title="Technologies" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary border-border pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full bg-secondary border-border sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Technology
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Add Technology</DialogTitle>
                <DialogDescription>Add a new technology to the stack</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="techName">Technology Name</Label>
                  <Input
                    id="techName"
                    value={newTech.techName}
                    onChange={(e) => setNewTech({ ...newTech, techName: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTech.category}
                    onValueChange={(value) => setNewTech({ ...newTech, category: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
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
                <Button onClick={handleCreateTechnology}>Add Technology</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Technologies Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredTechnologies.map((tech) => (
            <Card key={tech.techID} className="border-border bg-card">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <Cpu className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-card-foreground">{tech.techName}</CardTitle>
                    <Badge className={`mt-1 ${getCategoryColor(tech.category)}`}>{tech.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Used in {tech.usedIn} modules</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDeleteTechnology(tech.techID)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
