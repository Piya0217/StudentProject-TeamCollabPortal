/**
 * services/api.test.ts
 * Tests for the mock backend API and schema validations.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { mockApi } from './mockApi'
import { ProjectSchema, TaskSchema, UserSchema } from '@/lib/schemas'

describe('Backend Mock API Integration', () => {
  beforeEach(async () => {
    await mockApi.resetDemoData()
  })

  it('retrieves student list and validates against User schema', async () => {
    const students = await mockApi.listStudents()
    expect(students.length).toBeGreaterThan(0)
    for (const student of students) {
      expect(() => UserSchema.parse(student)).not.toThrow()
    }
  })

  it('lists seed projects with valid schema properties', async () => {
    const projects = await mockApi.listProjects()
    expect(projects.length).toBe(4)
    for (const project of projects) {
      expect(() => ProjectSchema.parse(project)).not.toThrow()
    }
  })

  it('creates, reads, and moves tasks correctly', async () => {
    const projects = await mockApi.listProjects()
    const projectId = projects[0].id

    // Create a new task
    const newTask = await mockApi.createTask({
      projectId,
      title: 'Integrated Test Task',
      description: 'End-to-end task test',
      status: 'todo',
      priority: 'high',
    })
    expect(newTask.id).toBeDefined()
    expect(newTask.status).toBe('todo')
    expect(() => TaskSchema.parse(newTask)).not.toThrow()

    // Move task to in-progress
    const moved = await mockApi.moveTask({
      taskId: newTask.id,
      status: 'in-progress',
      order: 0,
    })
    expect(moved.status).toBe('in-progress')

    // Add subtask
    const withSub = await mockApi.addSubtask(newTask.id, 'Subtask 1')
    expect(withSub.subtasks.length).toBe(1)
    expect(withSub.subtasks[0].completed).toBe(false)

    // Toggle subtask
    const toggled = await mockApi.toggleSubtask(newTask.id, withSub.subtasks[0].id, true)
    expect(toggled.subtasks[0].completed).toBe(true)
  })

  it('handles faculty review workflow', async () => {
    const projects = await mockApi.listProjects()
    const projectId = projects[0].id
    const milestones = await mockApi.listMilestones(projectId)
    expect(milestones.length).toBeGreaterThan(0)

    const targetMilestone = milestones[0]
    const reviewed = await mockApi.reviewMilestone({
      milestoneId: targetMilestone.id,
      decision: 'approve',
      feedback: 'Excellent work on the architecture and test coverage.',
      rubricScores: [
        { criterion: 'Requirements', score: 5, maxScore: 5 },
        { criterion: 'Documentation', score: 4, maxScore: 5 },
      ],
    })
    expect(reviewed.status).toBe('approved')
    expect(reviewed.facultyFeedback).toBe('Excellent work on the architecture and test coverage.')
  })
})
