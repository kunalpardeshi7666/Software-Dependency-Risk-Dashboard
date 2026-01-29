'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"
import { api } from "./api"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: "Admin" | "Developer") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const token = api.getToken()
    if (token) {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password })
    setUser(response.user)
    localStorage.setItem("user", JSON.stringify(response.user))
  }

  const register = async (name: string, email: string, password: string, role: "Admin" | "Developer") => {
    const response = await api.register({ name, email, password, role })
    setUser(response.user)
    localStorage.setItem("user", JSON.stringify(response.user))
  }

  const logout = () => {
    api.logout()
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
