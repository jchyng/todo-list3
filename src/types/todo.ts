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
  repeat?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval?: number // 매 n일/주/월/년
    endDate?: Date
  }
}

export type TodoPriority = TodoItem['priority']