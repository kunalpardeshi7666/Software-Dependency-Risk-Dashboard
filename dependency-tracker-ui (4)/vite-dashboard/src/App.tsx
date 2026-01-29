'use client';

import React from "react"

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/auth-context'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardOverview from './pages/dashboard/Overview'
import ProjectsPage from './pages/dashboard/Projects'
import ModulesPage from './pages/dashboard/Modules'
import DevelopersPage from './pages/dashboard/Developers'
import TasksPage from './pages/dashboard/Tasks'
import MyTasksPage from './pages/dashboard/MyTasks'
import DependenciesPage from './pages/dashboard/Dependencies'
import TechnologiesPage from './pages/dashboard/Technologies'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="modules" element={<ModulesPage />} />
        <Route path="developers" element={<DevelopersPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="my-tasks" element={<MyTasksPage />} />
        <Route path="dependencies" element={<DependenciesPage />} />
        <Route path="technologies" element={<TechnologiesPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
