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
import { Users, Plus, Search, MoreVertical, Pencil, Trash2, Mail, Briefcase, Star } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Mock data
const initialDevelopers = [
  {
    developerID: 1,
    developerName: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "Backend Developer",
    experience: 3,
  },
  {
    developerID: 2,
    developerName: "Ram Kumar",
    email: "ram@gmail.com",
    role: "Backend Developer",
    experience: 2,
  },
  {
    developerID: 3,
    developerName: "Shrikant Sharma",
    email: "shrikant@gmail.com",
    role: "Full Stack Developer",
    experience: 4,
  },
  {
    developerID: 4,
    developerName: "Sham Sharma",
    email: "sham@gmail.com",
    role: "Frontend Developer",
    experience: 3,
  },
  {
    developerID: 5,
    developerName: "Priya Patel",
    email: "priya@gmail.com",
    role: "DevOps Engineer",
    experience: 5,
  },
  {
    developerID: 6,
    developerName: "Amit Singh",
    email: "amit@gmail.com",
    role: "QA Engineer",
    experience: 2,
  },
]

const roles = ["Backend Developer", "Frontend Developer", "Full Stack Developer", "DevOps Engineer", "QA Engineer", "Tech Lead"]

interface Developer {
  developerID: number
  developerName: string
  email: string
  role: string
  experience: number
}

export default function DevelopersPage() {
  const { user } = useAuth()
  const [developers, setDevelopers] = useState(initialDevelopers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null)
  const [newDeveloper, setNewDeveloper] = useState({
    developerName: "",
    email: "",
    role: "Backend Developer",
    experience: 1,
  })

  const isAdmin = user?.role === "Admin"

  const filteredDevelopers = developers.filter((dev) => {
    const matchesSearch =
      dev.developerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || dev.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Backend Developer":
        return "bg-primary/20 text-primary"
      case "Frontend Developer":
        return "bg-info/20 text-info"
      case "Full Stack Developer":
        return "bg-chart-4/20 text-chart-4"
      case "DevOps Engineer":
        return "bg-warning/20 text-warning"
      case "QA Engineer":
        return "bg-chart-5/20 text-chart-5"
      case "Tech Lead":
        return "bg-destructive/20 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleAddDeveloper = () => {
    const developer: Developer = {
      developerID: Math.max(...developers.map((d) => d.developerID), 0) + 1,
      ...newDeveloper,
    }
    setDevelopers([...developers, developer])
    setNewDeveloper({
      developerName: "",
      email: "",
      role: "Backend Developer",
      experience: 1,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditDeveloper = () => {
    if (editingDeveloper) {
      setDevelopers(developers.map((d) => (d.developerID === editingDeveloper.developerID ? editingDeveloper : d)))
      setIsEditDialogOpen(false)
      setEditingDeveloper(null)
    }
  }

  const handleDeleteDeveloper = (id: number) => {
    setDevelopers(developers.filter((d) => d.developerID !== id))
  }

  // Group developers by role for stats
  const devByRole = developers.reduce(
    (acc, dev) => {
      acc[dev.role] = (acc[dev.role] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const avgExperience = (developers.reduce((sum, dev) => sum + dev.experience, 0) / developers.length).toFixed(1)

  return (
    <div className="flex flex-col">
      <Header title="Developers" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search developers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary border-border pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48 bg-secondary border-border text-foreground">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
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
                  Add Developer
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-card-foreground">Add New Developer</DialogTitle>
                  <DialogDescription>Add a new team member to the project</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="developerName" className="text-card-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="developerName"
                      value={newDeveloper.developerName}
                      onChange={(e) => setNewDeveloper({ ...newDeveloper, developerName: e.target.value })}
                      placeholder="John Doe"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-card-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newDeveloper.email}
                      onChange={(e) => setNewDeveloper({ ...newDeveloper, email: e.target.value })}
                      placeholder="john@company.com"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-card-foreground">Role</Label>
                      <Select
                        value={newDeveloper.role}
                        onValueChange={(value) => setNewDeveloper({ ...newDeveloper, role: value })}
                      >
                        <SelectTrigger className="bg-secondary border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-card-foreground">
                        Experience (years)
                      </Label>
                      <Input
                        id="experience"
                        type="number"
                        min="0"
                        max="30"
                        value={newDeveloper.experience}
                        onChange={(e) => setNewDeveloper({ ...newDeveloper, experience: parseInt(e.target.value) || 0 })}
                        className="bg-secondary border-border text-foreground"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-border bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={handleAddDeveloper} disabled={!newDeveloper.developerName || !newDeveloper.email}>
                    Add Developer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{developers.length}</p>
                  <p className="text-sm text-muted-foreground">Total Developers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/20">
                  <Star className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{avgExperience}</p>
                  <p className="text-sm text-muted-foreground">Avg Experience (yrs)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20">
                  <Briefcase className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{Object.keys(devByRole).length}</p>
                  <p className="text-sm text-muted-foreground">Unique Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">
                    {developers.filter((d) => d.experience >= 3).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Senior (3+ yrs)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Developer Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDevelopers.map((dev) => (
            <Card key={dev.developerID} className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
                      {dev.developerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">{dev.developerName}</h3>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {dev.email}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingDeveloper(dev)
                            setIsEditDialogOpen(true)
                          }}
                          className="text-card-foreground focus:bg-accent"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteDeveloper(dev.developerID)}
                          className="text-destructive focus:bg-accent focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge className={getRoleColor(dev.role)}>{dev.role}</Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3" />
                    {dev.experience} years
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredDevelopers.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">No developers found.</div>
          )}
        </div>

        {/* Developers Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Developers ({filteredDevelopers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">ID</TableHead>
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Role</TableHead>
                    <TableHead className="text-muted-foreground">Experience</TableHead>
                    {isAdmin && <TableHead className="text-muted-foreground text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevelopers.map((dev) => (
                    <TableRow key={dev.developerID} className="border-border hover:bg-secondary/30">
                      <TableCell className="text-muted-foreground">{dev.developerID}</TableCell>
                      <TableCell className="font-medium text-card-foreground">{dev.developerName}</TableCell>
                      <TableCell className="text-muted-foreground">{dev.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(dev.role)}>{dev.role}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{dev.experience} years</TableCell>
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
                                  setEditingDeveloper(dev)
                                  setIsEditDialogOpen(true)
                                }}
                                className="text-card-foreground focus:bg-accent"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteDeveloper(dev.developerID)}
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
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Edit Developer</DialogTitle>
              <DialogDescription>Update developer details</DialogDescription>
            </DialogHeader>
            {editingDeveloper && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Full Name</Label>
                  <Input
                    value={editingDeveloper.developerName}
                    onChange={(e) => setEditingDeveloper({ ...editingDeveloper, developerName: e.target.value })}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-card-foreground">Email</Label>
                  <Input
                    type="email"
                    value={editingDeveloper.email}
                    onChange={(e) => setEditingDeveloper({ ...editingDeveloper, email: e.target.value })}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-card-foreground">Role</Label>
                    <Select
                      value={editingDeveloper.role}
                      onValueChange={(value) => setEditingDeveloper({ ...editingDeveloper, role: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-card-foreground">Experience (years)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="30"
                      value={editingDeveloper.experience}
                      onChange={(e) =>
                        setEditingDeveloper({ ...editingDeveloper, experience: parseInt(e.target.value) || 0 })
                      }
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
              <Button onClick={handleEditDeveloper}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
