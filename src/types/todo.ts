export interface TodoItem {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  status?: 'pending' | 'in_progress' | 'completed'
  startedAt?: Date
  dueDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

export type TodoPriority = TodoItem['priority']