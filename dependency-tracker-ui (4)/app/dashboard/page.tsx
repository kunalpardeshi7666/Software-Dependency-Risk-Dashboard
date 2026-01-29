"use client"

import { useAuth } from "@/lib/auth-context"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { DeveloperDashboard } from "@/components/dashboard/developer-dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  if (user?.role === "Admin") {
    return <AdminDashboard />
  }

  return <DeveloperDashboard />
}
