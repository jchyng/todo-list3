export interface TodoItem {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

export type TodoPriority = TodoItem['priority']