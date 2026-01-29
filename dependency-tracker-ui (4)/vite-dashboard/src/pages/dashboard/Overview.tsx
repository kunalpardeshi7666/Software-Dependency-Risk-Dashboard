'use client';

import { useAuth } from "@/lib/auth-context"
import { AdminDashboard } from "@/components/dashboard/AdminDashboard"
import { DeveloperDashboard } from "@/components/dashboard/DeveloperDashboard"

export default function DashboardOverview() {
  const { user } = useAuth()

  if (user?.role === "Admin") {
    return <AdminDashboard />
  }

  return <DeveloperDashboard />
}
