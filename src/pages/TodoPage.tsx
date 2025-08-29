import { useState } from "react";
import { Menu, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TodoItem } from "@/components/TodoItem";
import { TodoDetailPanel } from "@/components/TodoDetailPanel";
import { AddTodoInput } from "@/components/AddTodoInput";
import { ColorPalette, type ColorValue } from "@/components/common";
import type { TodoItem as TodoItemType } from "@/types/todo";
import type { SidebarFilter } from "@/types/sidebar";

export function TodoPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTodo, setSelectedTodo] = useState<TodoItemType | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<SidebarFilter>("tasks");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);

  // 목록별 색상 관리
  const [listColors, setListColors] = useState<Record<string, ColorValue>>({
    today: "bg-blue-500",
    important: "bg-red-500",
    tasks: "bg-gray-400",
  });

  // 샘플 데이터
  const [todos, setTodos] = useState<TodoItemType[]>([
    {
      id: "1",
      title: "패스트캠퍼스 기획 강의",
      description: "강의 내용을 정리하고 슬라이드를 준비해야 합니다.",
      completed: false,
      priority: "high",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "오로나오르",
      description: undefined,
      completed: false,
      priority: "low",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "자원섭 재촬",
      description: "촬영 일정 조정 및 장비 준비",
      completed: true,
      priority: "high",
      status: "completed",
      createdAt: new Date(Date.now() - 86400000), // 1일 전
      updatedAt: new Date(),
    },
    {
      id: "4",
      title: "Notion에 오늘 할 작업계획하기",
      description: undefined,
      completed: true,
      priority: "low",
      status: "completed",
      createdAt: new Date(Date.now() - 172800000), // 2일 전
      updatedAt: new Date(),
    },
    {
      id: "5",
      title: "스트레칭",
      description: undefined,
      completed: true,
      priority: "low",
      status: "completed",
      createdAt: new Date(Date.now() - 259200000), // 3일 전
      updatedAt: new Date(),
    },
    {
      id: "6",
      title: "코드 리팩토링",
      description: "레거시 코드 정리 및 최적화",
      completed: true,
      priority: "medium",
      status: "completed",
      createdAt: new Date(Date.now() - 345600000), // 4일 전
      updatedAt: new Date(),
    },
    {
      id: "7",
      title: "회의 준비",
      description: "발표 자료 준비",
      completed: true,
      priority: "high",
      status: "completed",
      createdAt: new Date(Date.now() - 432000000), // 5일 전
      updatedAt: new Date(),
    },
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleToggleComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  };

  const handleTogglePriority = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              priority: todo.priority === "high" ? "low" : "high",
              updatedAt: new Date(),
            }
          : todo
      )
    );
  };

  const handleSelectTodo = (todo: TodoItemType) => {
    setSelectedTodo(todo);
  };

  const handleUpdateTodo = (id: string, updates: Partial<TodoItemType>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );

    // Update selected todo if it's the one being updated
    if (selectedTodo?.id === id) {
      setSelectedTodo((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleCloseDetailPanel = () => {
    setSelectedTodo(null);
  };

  const handleAddTodo = (title: string) => {
    const newTodo: TodoItemType = {
      id: Date.now().toString(),
      title,
      description: undefined,
      completed: false,
      priority: "low",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const getFilterTitle = (filter: SidebarFilter) => {
    switch (filter) {
      case "today":
        return "오늘 할 일";
      case "important":
        return "중요";
      case "tasks":
        return "작업";
      default:
        return "목록";
    }
  };

  const getCurrentListColor = (filter: SidebarFilter): ColorValue => {
    return listColors[filter] || "bg-gray-400";
  };

  const handleColorChange = (color: ColorValue) => {
    setListColors((prev) => ({
      ...prev,
      [selectedFilter]: color,
    }));
  };

  const handleTitleClick = () => {
    setEditingTitle(getFilterTitle(selectedFilter));
    setIsEditingTitle(true);
  };

  const handleTitleSubmit = () => {
    // 실제로는 사용자 정의 목록에만 적용되어야 하지만,
    // 현재는 기본 필터의 제목은 변경하지 않습니다
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSubmit();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
    }
  };

  const handleTitleBlur = () => {
    handleTitleSubmit();
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const filteredTodos = todos.filter((todo) => {
    // 검색 필터
    const matchesSearch =
      searchQuery === "" ||
      todo.title.toLowerCase().includes(searchQuery.toLowerCase());

    // 사이드바 필터
    let matchesFilter = true;
    switch (selectedFilter) {
      case "today":
        // 오늘 날짜에 해당하는 할 일들
        matchesFilter = Boolean(
          todo.dueDate &&
            new Date(todo.dueDate).toDateString() === new Date().toDateString()
        );
        break;
      case "important":
        matchesFilter = todo.priority === "high";
        break;
      case "tasks":
      default:
        matchesFilter = true; // 모든 작업 표시
        break;
    }

    return matchesSearch && matchesFilter;
  });

  // 완료된 할 일과 미완료 할 일 분리
  const incompleteTodos = filteredTodos.filter(todo => !todo.completed);
  const completedTodos = filteredTodos.filter(todo => todo.completed);

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
        {isSidebarVisible && (
          <Sidebar
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            onToggleSidebar={toggleSidebar}
          />
        )}

        {/* Main Content Area - Contains both List and Detail Panel */}
        <main className="flex-1 flex">
          {/* Todo List Panel */}
          <div
            className={`${
              selectedTodo ? "flex-1" : "flex-1"
            } p-4 transition-all duration-300 ${
              selectedTodo ? "border-r border-gray-200" : ""
            }`}
          >
            <div className="flex flex-col space-y-4 h-full">
              <div className="flex items-center gap-2">
                {!isSidebarVisible && (
                  <button onClick={toggleSidebar} className="p-2">
                    <Menu className="h-4 w-4" />
                  </button>
                )}
                <ColorPalette
                  currentColor={getCurrentListColor(selectedFilter)}
                  onColorChange={handleColorChange}
                >
                  <button className="flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full transition-all hover:scale-110 ${getCurrentListColor(
                        selectedFilter
                      )}`}
                      title="목록 색상 변경"
                    />
                  </button>
                </ColorPalette>
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    onBlur={handleTitleBlur}
                    className="border-0 outline-0 text-xl font-bold text-gray-900 bg-transparent focus:outline-none focus:ring-0 focus:border-0"
                    autoFocus
                  />
                ) : (
                  <h2
                    className="text-xl font-bold cursor-text"
                    onClick={handleTitleClick}
                  >
                    {getFilterTitle(selectedFilter)}
                  </h2>
                )}
              </div>
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
                  {/* 미완료 할 일 */}
                  {incompleteTodos.length > 0 ? (
                    incompleteTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggleComplete={handleToggleComplete}
                        onTogglePriority={handleTogglePriority}
                        onClick={handleSelectTodo}
                      />
                    ))
                  ) : null}

                  {/* 완료된 할 일 접기/펼치기 */}
                  {completedTodos.length > 0 && (
                    <div className="mt-4">
                      <button
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 w-full text-left"
                        onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
                      >
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform ${
                            isCompletedExpanded ? "rotate-90" : ""
                          }`} 
                        />
                        완료됨 {completedTodos.length}
                      </button>
                      
                      {isCompletedExpanded && (
                        <div className="space-y-2 mt-2">
                          {completedTodos.map((todo) => (
                            <TodoItem
                              key={todo.id}
                              todo={todo}
                              onToggleComplete={handleToggleComplete}
                              onTogglePriority={handleTogglePriority}
                              onClick={handleSelectTodo}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 빈 상태 */}
                  {filteredTodos.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      {searchQuery
                        ? "검색 결과가 없습니다."
                        : `${getFilterTitle(
                            selectedFilter
                          )}에 할 일이 없습니다.`}
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
  );
}
