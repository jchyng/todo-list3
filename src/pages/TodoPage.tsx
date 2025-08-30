import { useState } from "react";
import { Menu, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TodoItem } from "@/components/TodoItem";
import { TodoDetailPanel } from "@/components/TodoDetailPanel";
import { AddTodoInput } from "@/components/AddTodoInput";
import { SortDropdown, type SortField, type SortDirection } from "@/components/SortDropdown";
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
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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
      status: "in_progress",
      dueDate: new Date(Date.now() + 86400000 * 3), // 3일 후
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
      dueDate: new Date(Date.now() + 86400000 * 7), // 1주일 후
      repeat: {
        type: "weekly",
        interval: 1,
      },
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
      dueDate: new Date(Date.now() - 86400000), // 1일 전 (완료됨)
      createdAt: new Date(Date.now() - 86400000 * 2), // 2일 전
      updatedAt: new Date(),
    },
    {
      id: "4",
      title: "Notion에 오늘 할 작업계획하기",
      description: undefined,
      completed: false,
      priority: "medium",
      status: "in_progress",
      dueDate: new Date(), // 오늘
      repeat: {
        type: "daily",
        interval: 1,
      },
      createdAt: new Date(Date.now() - 172800000), // 2일 전
      updatedAt: new Date(),
    },
    {
      id: "5",
      title: "스트레칭",
      description: "매일 30분씩 스트레칭하기",
      completed: false,
      priority: "low",
      status: "pending",
      repeat: {
        type: "daily",
        interval: 1,
      },
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
      dueDate: new Date(Date.now() - 345600000), // 4일 전 (완료됨)
      createdAt: new Date(Date.now() - 345600000 * 2), // 8일 전
      updatedAt: new Date(),
    },
    {
      id: "7",
      title: "회의 준비",
      description: "발표 자료 준비",
      completed: true,
      priority: "high",
      status: "completed",
      dueDate: new Date(Date.now() - 432000000), // 5일 전 (완료됨)
      createdAt: new Date(Date.now() - 432000000 * 2), // 10일 전
      updatedAt: new Date(),
    },
    {
      id: "8",
      title: "월간 보고서 작성",
      description: "지난 달 성과 정리 및 다음 달 계획 수립",
      completed: false,
      priority: "high",
      status: "pending",
      dueDate: new Date(Date.now() + 86400000 * 14), // 2주일 후
      repeat: {
        type: "monthly",
        interval: 1,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "9",
      title: "백업 점검",
      description: "시스템 백업 상태 확인 및 테스트",
      completed: false,
      priority: "medium",
      status: "in_progress",
      dueDate: new Date(Date.now() + 86400000 * 2), // 2일 후
      repeat: {
        type: "weekly",
        interval: 2, // 2주마다
      },
      createdAt: new Date(Date.now() - 86400000), // 1일 전
      updatedAt: new Date(),
    },
    {
      id: "10",
      title: "연간 건강검진",
      description: "종합병원 예약 및 검진 받기",
      completed: false,
      priority: "medium",
      status: "pending",
      dueDate: new Date(Date.now() + 86400000 * 30), // 1달 후
      repeat: {
        type: "yearly",
        interval: 1,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "11",
      title: "세금 신고",
      description: "종합소득세 신고 및 서류 제출",
      completed: false,
      priority: "high",
      status: "pending",
      dueDate: new Date(Date.now() - 86400000 * 3), // 3일 전 (마감일 지남)
      createdAt: new Date(Date.now() - 86400000 * 30), // 30일 전
      updatedAt: new Date(),
    },
    {
      id: "12",
      title: "도서관 책 반납",
      description: "대출한 책 반납하기",
      completed: false,
      priority: "medium",
      status: "pending",
      dueDate: new Date(Date.now() - 86400000 * 1), // 1일 전 (마감일 지남)
      createdAt: new Date(Date.now() - 86400000 * 14), // 14일 전
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

  // 정렬 함수
  const sortTodos = (todos: TodoItemType[], field: SortField | null, direction: SortDirection): TodoItemType[] => {
    const sortedTodos = [...todos];
    
    if (!field) {
      // 기본 정렬 (업데이트된 시간 기준 내림차순)
      return sortedTodos.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    
    const multiplier = direction === 'asc' ? 1 : -1;
    
    switch (field) {
      case 'priority':
        return sortedTodos.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[a.priority] - priorityOrder[b.priority]) * multiplier;
        });
      case 'dueDate':
        return sortedTodos.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * multiplier;
        });
      case 'created':
        return sortedTodos.sort((a, b) => 
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * multiplier
        );
      case 'title':
        return sortedTodos.sort((a, b) => a.title.localeCompare(b.title) * multiplier);
      case 'status':
        return sortedTodos.sort((a, b) => {
          const statusOrder = { pending: 1, in_progress: 2, completed: 3 };
          return (statusOrder[a.status] - statusOrder[b.status]) * multiplier;
        });
      default:
        return sortedTodos;
    }
  };

  const handleSortChange = (field: SortField | null, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
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

  // 완료된 할 일과 미완료 할 일 분리 및 정렬
  const incompleteTodos = sortTodos(filteredTodos.filter(todo => !todo.completed), sortField, sortDirection);
  const completedTodos = sortTodos(filteredTodos.filter(todo => todo.completed), sortField, sortDirection);

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
              <div className="flex items-center justify-between">
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
                <SortDropdown 
                  sortField={sortField} 
                  sortDirection={sortDirection} 
                  onSortChange={handleSortChange} 
                />
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
