export type Role = 'Student' | 'Faculty'
export type TaskStatus = 'To do' | 'In progress' | 'In review' | 'Done'
export type Priority = 'High' | 'Medium' | 'Low'
export type Health = 'On track' | 'At risk' | 'Overdue'
export interface PortalUser { id: number; name: string; email: string; role: 'student' | 'faculty'; skills: string[]; interests?: string[]; designation?: string | null; experience_years?: number | null }
export interface Student { id: string; name: string; initials: string; course: string; skills: string[]; availability: string }
export interface Task { id: string; title: string; projectId: string; assignee: string; assigneeId?: number | null; status: TaskStatus; priority: Priority; due: string; description: string; comments: string[] }
export interface Milestone { id: string; title: string; due: string; status: 'Complete' | 'Upcoming' | 'In review' }
export interface Project { id: string; title: string; summary: string; health: Health; progress: number; due: string; team: string[]; nextMilestone: string; lastActivity: string; milestones: Milestone[]; facultyId?: number | null }
