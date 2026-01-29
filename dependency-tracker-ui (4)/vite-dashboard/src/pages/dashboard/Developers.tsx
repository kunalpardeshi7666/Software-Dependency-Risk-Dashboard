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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Plus, Mail, Briefcase, Clock, Search, Edit, Trash2 } from "lucide-react"

// Mock data
const mockDevelopers = [
  { developerID: 1, developerName: "Rahul Sharma", email: "rahul@company.com", role: "Senior Developer", experience: 5, activeTasks: 3 },
  { developerID: 2, developerName: "Ram Patel", email: "ram@company.com", role: "Full Stack Developer", experience: 3, activeTasks: 4 },
  { developerID: 3, developerName: "Shrikant Kumar", email: "shrikant@company.com", role: "Backend Developer", experience: 4, activeTasks: 2 },
  { developerID: 4, developerName: "Sham Singh", email: "sham@company.com", role: "Frontend Developer", experience: 2, activeTasks: 5 },
  { developerID: 5, developerName: "Priya Gupta", email: "priya@company.com", role: "DevOps Engineer", experience: 6, activeTasks: 1 },
]

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState(mockDevelopers)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newDeveloper, setNewDeveloper] = useState({
    developerName: "",
    email: "",
    role: "",
    experience: 0,
  })

  const filteredDevelopers = developers.filter((d) =>
    d.developerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateDeveloper = () => {
    const newId = Math.max(...developers.map((d) => d.developerID)) + 1
    setDevelopers([...developers, { ...newDeveloper, developerID: newId, activeTasks: 0 }])
    setNewDeveloper({ developerName: "", email: "", role: "", experience: 0 })
    setIsOpen(false)
  }

  const handleDeleteDeveloper = (id: number) => {
    setDevelopers(developers.filter((d) => d.developerID !== id))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex flex-col">
      <Header title="Developers" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-secondary border-border pl-10"
            />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Developer
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Add New Developer</DialogTitle>
                <DialogDescription>Add a new developer to the team</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="developerName">Full Name</Label>
                  <Input
                    id="developerName"
                    value={newDeveloper.developerName}
                    onChange={(e) => setNewDeveloper({ ...newDeveloper, developerName: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newDeveloper.email}
                    onChange={(e) => setNewDeveloper({ ...newDeveloper, email: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newDeveloper.role}
                    onValueChange={(value) => setNewDeveloper({ ...newDeveloper, role: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Junior Developer">Junior Developer</SelectItem>
                      <SelectItem value="Senior Developer">Senior Developer</SelectItem>
                      <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                      <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                      <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                      <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={newDeveloper.experience}
                    onChange={(e) => setNewDeveloper({ ...newDeveloper, experience: parseInt(e.target.value) || 0 })}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)} className="border-border bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleCreateDeveloper}>Add Developer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Developers Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDevelopers.map((developer) => (
            <Card key={developer.developerID} className="border-border bg-card">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(developer.developerName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-card-foreground">{developer.developerName}</CardTitle>
                    <Badge variant="outline" className="mt-1 border-border">
                      {developer.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{developer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{developer.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Badge className="bg-primary/20 text-primary">{developer.activeTasks} active tasks</Badge>
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
                      onClick={() => handleDeleteDeveloper(developer.developerID)}
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
