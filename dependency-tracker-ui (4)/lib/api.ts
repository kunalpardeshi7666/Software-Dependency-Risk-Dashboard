import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Project,
  CreateProjectRequest,
  Module,
  CreateModuleRequest,
  Developer,
  CreateDeveloperRequest,
  Task,
  CreateTaskRequest,
  Dependency,
  CreateDependencyRequest,
  Technology,
  CreateTechnologyRequest,
  DependencyGraph,
} from "./types"

const API_BASE_URL = "https://localhost:44361/api"

class ApiService {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
    if (token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token)
      }
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || `HTTP error! status: ${response.status}`)
    }

    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
    this.setToken(response.token)
    return response
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
    this.setToken(response.token)
    return response
  }

  logout() {
    this.setToken(null)
  }

  // Projects endpoints
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>("/projects")
  }

  async getProject(id: number): Promise<Project> {
    return this.request<Project>(`/projects/${id}`)
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    return this.request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateProject(id: number, data: Project): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: number): Promise<void> {
    return this.request<void>(`/projects/${id}`, {
      method: "DELETE",
    })
  }

  // Modules endpoints
  async getModulesByProject(projectId: number): Promise<Module[]> {
    return this.request<Module[]>(`/modules/project/${projectId}`)
  }

  async createModule(data: CreateModuleRequest): Promise<Module> {
    return this.request<Module>("/modules", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateModule(id: number, data: Module): Promise<Module> {
    return this.request<Module>(`/modules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteModule(id: number): Promise<void> {
    return this.request<void>(`/modules/${id}`, {
      method: "DELETE",
    })
  }

  // Developers endpoints
  async getDevelopers(): Promise<Developer[]> {
    return this.request<Developer[]>("/developers")
  }

  async createDeveloper(data: CreateDeveloperRequest): Promise<Developer> {
    return this.request<Developer>("/developers", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateDeveloper(id: number, data: Developer): Promise<Developer> {
    return this.request<Developer>(`/developers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteDeveloper(id: number): Promise<void> {
    return this.request<void>(`/developers/${id}`, {
      method: "DELETE",
    })
  }

  // Tasks endpoints
  async getTasksByModule(moduleId: number): Promise<Task[]> {
    return this.request<Task[]>(`/tasks/module/${moduleId}`)
  }

  async getAllTasks(): Promise<Task[]> {
    return this.request<Task[]>("/tasks")
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    return this.request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateTask(id: number, data: Task): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteTask(id: number): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: "DELETE",
    })
  }

  // Dependencies endpoints
  async getDependencies(): Promise<Dependency[]> {
    return this.request<Dependency[]>("/dependencies")
  }

  async getDependenciesByProject(projectId: number): Promise<Dependency[]> {
    return this.request<Dependency[]>(`/dependencies/project/${projectId}`)
  }

  async createDependency(data: CreateDependencyRequest): Promise<Dependency> {
    return this.request<Dependency>("/dependencies", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async deleteDependency(id: number): Promise<void> {
    return this.request<void>(`/dependencies/${id}`, {
      method: "DELETE",
    })
  }

  // Dependency Graph endpoint
  async getDependencyGraph(projectId: number): Promise<DependencyGraph> {
    return this.request<DependencyGraph>(`/dependency-graph/${projectId}`)
  }

  // Technologies endpoints
  async getTechnologies(): Promise<Technology[]> {
    return this.request<Technology[]>("/technologies")
  }

  async createTechnology(data: CreateTechnologyRequest): Promise<Technology> {
    return this.request<Technology>("/technologies", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async deleteTechnology(id: number): Promise<void> {
    return this.request<void>(`/technologies/${id}`, {
      method: "DELETE",
    })
  }
}

export const api = new ApiService()
