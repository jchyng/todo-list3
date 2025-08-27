import { useState } from "react"
import { Header } from "@/components/Header"
import { TodoItem } from "@/components/TodoItem"
import { TodoDetailPanel } from "@/components/TodoDetailPanel"
import type { TodoItem as TodoItemType } from "@/types/todo"

export function TodoPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTodo, setSelectedTodo] = useState<TodoItemType | null>(null)
  
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

  const handleSelectTodo = (todo: TodoItemType) => {
    setSelectedTodo(todo)
  }

  const handleUpdateTodo = (id: string, updates: Partial<TodoItemType>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ))
    
    // Update selected todo if it's the one being updated
    if (selectedTodo?.id === id) {
      setSelectedTodo(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const handleCloseDetailPanel = () => {
    setSelectedTodo(null)
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
      <div className="flex h-[calc(100vh-64px)]">
        {/* Main Content */}
        <main className={`flex-1 p-4 transition-all duration-300 ${selectedTodo ? 'mr-96' : ''}`}>
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
                    onClick={handleSelectTodo}
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

        {/* Detail Panel */}
        {selectedTodo && (
          <div className="fixed right-0 top-16 h-[calc(100vh-64px)] z-10">
            <TodoDetailPanel
              todo={selectedTodo}
              onClose={handleCloseDetailPanel}
              onUpdate={(updates) => handleUpdateTodo(selectedTodo.id, updates)}
              onDelete={handleDeleteTodo}
            />
          </div>
        )}
      </div>
    </div>
  )
}