import { useState } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { TodoItem } from "@/components/TodoItem"
import { TodoDetailPanel } from "@/components/TodoDetailPanel"
import { AddTodoInput } from "@/components/AddTodoInput"
import type { TodoItem as TodoItemType } from "@/types/todo"
import type { SidebarFilter } from "@/types/sidebar"

export function TodoPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTodo, setSelectedTodo] = useState<TodoItemType | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<SidebarFilter>('tasks')
  
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

  const handleAddTodo = (title: string) => {
    const newTodo: TodoItemType = {
      id: Date.now().toString(),
      title,
      description: undefined,
      completed: false,
      priority: 'low',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setTodos(prev => [newTodo, ...prev])
  }

  const getFilterTitle = (filter: SidebarFilter) => {
    switch (filter) {
      case 'today': return '오늘 할 일'
      case 'important': return '중요'
      case 'tasks': return '작업'
      default: return '목록'
    }
  }

  const filteredTodos = todos.filter(todo => {
    // 검색 필터
    const matchesSearch = searchQuery === '' || todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    // 사이드바 필터
    let matchesFilter = true
    switch (selectedFilter) {
      case 'today':
        // 오늘 날짜에 해당하는 할 일들
        matchesFilter = Boolean(todo.dueDate && new Date(todo.dueDate).toDateString() === new Date().toDateString())
        break
      case 'important':
        matchesFilter = todo.priority === 'high'
        break
      case 'tasks':
      default:
        matchesFilter = true // 모든 작업 표시
        break
    }
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header
        currentPage="todo"
        onPageChange={() => {}}
        onSearch={handleSearch}
      />
      
      {/* Main Layout - Outlook style 3-panel */}
      <div className="flex-1 flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <Sidebar
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {/* Main Content Area - Contains both List and Detail Panel */}
        <main className="flex-1 flex">
          {/* Todo List Panel */}
          <div className={`${selectedTodo ? 'flex-1' : 'flex-1'} p-4 transition-all duration-300 ${selectedTodo ? 'border-r border-gray-200' : ''}`}>
            <div className="flex flex-col space-y-4 h-full">
              <h2 className="text-2xl font-bold">{getFilterTitle(selectedFilter)}</h2>
              {searchQuery && (
                <p className="text-sm text-muted-foreground">
                  검색: "{searchQuery}"
                </p>
              )}
              
              {/* Add Todo Input */}
              <AddTodoInput onAddTodo={handleAddTodo} />
              
              {/* Todo List */}
              <div className="flex-1 overflow-y-auto">
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
                      {searchQuery ? '검색 결과가 없습니다.' : `${getFilterTitle(selectedFilter)}에 할 일이 없습니다.`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detail Panel - Inside Main Area */}
          {selectedTodo && (
            <TodoDetailPanel
              todo={selectedTodo}
              onClose={handleCloseDetailPanel}
              onUpdate={(updates) => handleUpdateTodo(selectedTodo.id, updates)}
              onDelete={handleDeleteTodo}
            />
          )}
        </main>
      </div>
    </div>
  )
}