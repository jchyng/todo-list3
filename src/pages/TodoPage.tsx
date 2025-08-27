import { useState } from "react"
import { Header } from "@/components/Header"
import { TodoItem } from "@/components/TodoItem"
import type { TodoItem as TodoItemType } from "@/types/todo"

export function TodoPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  // 샘플 데이터
  const [todos, setTodos] = useState<TodoItemType[]>([
    {
      id: '1',
      title: '패스트캠퍼스 기획 강의',
      description: '강의 내용을 정리하고 슬라이드를 준비해야 합니다.',
      completed: false,
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: '오로나오르',
      description: undefined,
      completed: false,
      priority: 'low',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleToggleComplete = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ))
  }

  const handleTogglePriority = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            priority: todo.priority === 'high' ? 'low' : 'high',
            updatedAt: new Date()
          }
        : todo
    ))
  }

  const filteredTodos = todos.filter(todo =>
    searchQuery === '' || todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background mx-auto max-w-7xl">
      <Header
        currentPage="todo"
        onPageChange={() => {}}
        onSearch={handleSearch}
      />
      <main className="p-4">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Todo List</h2>
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              검색: "{searchQuery}"
            </p>
          )}
          
          {/* Todo List */}
          <div className="space-y-2">
            {filteredTodos.length > 0 ? (
              filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={handleToggleComplete}
                  onTogglePriority={handleTogglePriority}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                {searchQuery ? '검색 결과가 없습니다.' : '할 일이 없습니다.'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}