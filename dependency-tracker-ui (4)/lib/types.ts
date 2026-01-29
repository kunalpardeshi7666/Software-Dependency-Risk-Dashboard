// Auth Types
export interface User {
  id: number
  email: string
  name: string
  role: "Admin" | "Developer"
  developerId?: number
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: "Admin" | "Developer"
}

// Project Types
export interface Project {
  projectID: number
  projectName: string
  description: string
  startDate: string
  endDate: string
  status: string
}

export interface CreateProjectRequest {
  projectName: string
  description: string
  startDate: string
  endDate: string
  status: string
}

// Module Types
export interface Module {
  moduleID: number
  moduleName: string
  version: string
  projectID: number
  project: Project | null
  moduleTechnologies: ModuleTechnology[]
}

export interface CreateModuleRequest {
  moduleName: string
  projectID: number
  version?: string
}

// Developer Types
export interface Developer {
  developerID: number
  developerName: string
  email: string
  role: string
  experience: number
}

export interface CreateDeveloperRequest {
  developerName: string
  email: string
  role: string
  experience: number
}

// Task Types
export interface Task {
  taskID: number
  taskName: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  moduleID: number
  module: Module | null
  developerID: number
  developer: Developer | null
}

export interface CreateTaskRequest {
  taskName: string
  description: string
  priority: string
  status: string
  dueDate: string
  moduleID: number
  developerID: number
}

// Dependency Types
export interface Dependency {
  dependencyID: number
  moduleID: number
  module: Module | null
  dependsOnModuleID: number
}

export interface CreateDependencyRequest {
  moduleID: number
  dependsOnModuleID: number
}

// Technology Types
export interface Technology {
  techID: number
  techName: string
  category: string
  moduleTechnologies: ModuleTechnology[]
}

export interface CreateTechnologyRequest {
  techName: string
  category: string
}

// Module Technology Types
export interface ModuleTechnology {
  moduleID: number
  techID: number
}

// Dependency Graph Types
export interface DependencyGraphNode {
  id: number
  label: string
}

export interface DependencyGraphEdge {
  from: number
  to: number
}

export interface DependencyGraph {
  nodes: DependencyGraphNode[]
  edges: DependencyGraphEdge[]
}
