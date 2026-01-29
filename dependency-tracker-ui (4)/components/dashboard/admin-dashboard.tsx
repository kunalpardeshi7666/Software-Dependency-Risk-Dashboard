"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FolderKanban, Boxes, Users, CheckSquare, Network, TrendingUp, Clock, AlertTriangle, Plus } from "lucide-react"
import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for demo
const taskData = [
  { name: "Jan", completed: 12, pending: 8 },
  { name: "Feb", completed: 19, pending: 12 },
  { name: "Mar", completed: 25, pending: 10 },
  { name: "Apr", completed: 32, pending: 15 },
  { name: "May", completed: 28, pending: 8 },
  { name: "Jun", completed: 35, pending: 12 },
]

const projectStatusData = [
  { name: "Active", value: 8, color: "hsl(var(--chart-1))" },
  { name: "On Hold", value: 3, color: "hsl(var(--chart-3))" },
  { name: "Completed", value: 5, color: "hsl(var(--chart-2))" },
]

const recentProjects = [
  { id: 1, name: "Dependency Tracker", status: "Active", modules: 5, progress: 75 },
  { id: 2, name: "Auth Service", status: "Active", modules: 3, progress: 45 },
  { id: 3, name: "Reporting Module", status: "On Hold", modules: 2, progress: 30 },
  { id: 4, name: "API Gateway", status: "Active", modules: 4, progress: 90 },
]

const recentTasks = [
  { id: 1, name: "Implement Login API", priority: "High", status: "In Progress", developer: "Rahul" },
  { id: 2, name: "Design Database Schema", priority: "Medium", status: "Pending", developer: "Ram" },
  { id: 3, name: "Create Unit Tests", priority: "Low", status: "Completed", developer: "Shrikant" },
  { id: 4, name: "Setup CI/CD Pipeline", priority: "High", status: "In Progress", developer: "Sham" },
]

export function AdminDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Completed":
        return "bg-primary/20 text-primary"
      case "On Hold":
      case "Pending":
        return "bg-warning/20 text-warning"
      case "In Progress":
        return "bg-info/20 text-info"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive/20 text-destructive"
      case "Medium":
        return "bg-warning/20 text-warning"
      case "Low":
        return "bg-primary/20 text-primary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex flex-col">
      <Header title="Admin Dashboard" />

      <div className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Projects"
            value={16}
            description="4 active this week"
            icon={FolderKanban}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Modules"
            value={42}
            description="8 new this month"
            icon={Boxes}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Developers"
            value={12}
            description="2 added recently"
            icon={Users}
            trend={{ value: 20, isPositive: true }}
          />
          <StatsCard
            title="Active Tasks"
            value={28}
            description="15 high priority"
            icon={CheckSquare}
            trend={{ value: 5, isPositive: false }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-7">
          <Card className="border-border bg-card lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Task Completion Trend
              </CardTitle>
              <CardDescription>Tasks completed vs pending over time</CardDescription>
            </CardHeader>
            <CardContent>
              {mounted && (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={taskData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--card-foreground))",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="pending"
                      stackId="2"
                      stroke="hsl(var(--chart-3))"
                      fill="hsl(var(--chart-3))"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Network className="h-5 w-5 text-primary" />
                Project Status Distribution
              </CardTitle>
              <CardDescription>Overview of project statuses</CardDescription>
            </CardHeader>
            <CardContent>
              {mounted && (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--card-foreground))",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="mt-4 flex justify-center gap-4">
                {projectStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <FolderKanban className="h-5 w-5 text-primary" />
                  Recent Projects
                </CardTitle>
                <CardDescription>Latest project activity</CardDescription>
              </div>
              <Link href="/dashboard/projects">
                <Button variant="outline" size="sm" className="border-border bg-transparent">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Project
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{project.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Boxes className="h-3 w-3" />
                        <span>{project.modules} modules</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20">
                        <div className="h-2 rounded-full bg-secondary">
                          <div
                            className="h-2 rounded-full bg-primary transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <p className="mt-1 text-center text-xs text-muted-foreground">{project.progress}%</p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Recent Tasks
                </CardTitle>
                <CardDescription>Latest task assignments</CardDescription>
              </div>
              <Link href="/dashboard/tasks">
                <Button variant="outline" size="sm" className="border-border bg-transparent">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Task
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{task.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{task.developer}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alerts & Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">5 Overdue Tasks</p>
                  <p className="text-sm text-muted-foreground">Needs attention</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">3 Due Today</p>
                  <p className="text-sm text-muted-foreground">High priority</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/20">
                  <Network className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">2 Circular Deps</p>
                  <p className="text-sm text-muted-foreground">Review required</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">4 Unassigned</p>
                  <p className="text-sm text-muted-foreground">Tasks pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
