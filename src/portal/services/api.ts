import { projects as seedProjects, seedTasks, students } from '../mocks/seed'
import type { Project, Task } from '../types'

/** Replace this mock implementation with a real API adapter without changing the UI. */
export interface PortalApi {
  getProjects(): Promise<Project[]>
  getTasks(): Promise<Task[]>
  getStudents(): Promise<typeof students>
  saveTask(task: Task): Promise<Task>
  createProject(project: Project): Promise<Project>
  reset(): Promise<void>
}
export const mockApi: PortalApi = {
  async getProjects() { return structuredClone(seedProjects) },
  async getTasks() { return structuredClone(seedTasks) },
  async getStudents() { return structuredClone(students) },
  async saveTask(task) { return structuredClone(task) },
  async createProject(project) { return structuredClone(project) },
  async reset() {}
}