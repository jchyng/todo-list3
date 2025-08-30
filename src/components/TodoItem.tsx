import { FileText, Calendar, RotateCw, Sun, CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { TodoItem as TodoItemType } from "@/types/todo";
import { PriorityStarButton } from "./common";

interface TodoItemProps {
  todo: TodoItemType;
  onToggleComplete?: (id: string) => void;
  onTogglePriority?: (id: string) => void;
  onClick?: (todo: TodoItemType) => void;
  className?: string;
}

export function TodoItem({
  todo,
  onToggleComplete,
  onTogglePriority,
  onClick,
  className,
}: TodoItemProps) {
  const handleToggleComplete = () => {
    onToggleComplete?.(todo.id);
  };

  const handleTogglePriority = () => {
    onTogglePriority?.(todo.id);
  };

  const isPriorityHigh = todo.priority === "high";

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer",
        todo.completed && "bg-gray-50",
        className
      )}
      onClick={() => onClick?.(todo)}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0 mt-1">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggleComplete}
          onClick={(e) => e.stopPropagation()}
          className="h-5 w-5 rounded-full"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <div
          className={cn(
            "text-sm font-medium text-gray-900 mb-1",
            todo.completed && "line-through text-gray-500"
          )}
        >
          {todo.title}
        </div>

        {/* Indicators */}
        {(todo.description ||
          todo.repeat ||
          todo.dueDate ||
          (todo.status && todo.status !== "pending" && !todo.completed)) &&
          (() => {
            // Count all indicators for text display logic
            const indicatorCount = [
              todo.description,
              todo.dueDate,
              todo.repeat,
              todo.status && todo.status !== "pending" && !todo.completed,
            ].filter(Boolean).length;

            const showTextForIndicators = indicatorCount < 2;
            const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

            return (
              <div className={cn("flex items-center gap-3 text-xs", isOverdue ? "text-red-700" : "text-gray-500")}>
                {/* Note indicator */}
                {todo.description && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {showTextForIndicators && <span>노트</span>}
                  </div>
                )}

                {/* Repeat indicator */}
                {todo.repeat && (
                  <div className="flex items-center gap-1">
                    <RotateCw className="h-3 w-3" />
                    {showTextForIndicators && (
                      <span>
                        {todo.repeat.interval && todo.repeat.interval > 1 ? (
                          "반복"
                        ) : (
                          <>
                            {todo.repeat.type === "daily" && "매일"}
                            {todo.repeat.type === "weekly" && "매주"}
                            {todo.repeat.type === "monthly" && "매월"}
                            {todo.repeat.type === "yearly" && "매년"}
                          </>
                        )}
                      </span>
                    )}
                  </div>
                )}

                {/* Due date indicator */}
                {todo.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(todo.dueDate).toISOString().split("T")[0]}
                    </span>
                  </div>
                )}

                {/* Progress status indicator */}
                {todo.status &&
                  todo.status !== "pending" &&
                  !todo.completed && (
                    <div className="flex items-center gap-1">
                      {todo.status === "in_progress" && (
                        <>
                          <Sun className="h-3 w-3 text-yellow-500" />
                          {showTextForIndicators && (
                            <span className="text-yellow-600">진행 중</span>
                          )}
                        </>
                      )}
                      {todo.status === "completed" && (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          {showTextForIndicators && <span>완료됨</span>}
                        </>
                      )}
                    </div>
                  )}
              </div>
            );
          })()}
      </div>

      {/* Priority Star */}
      <div className="flex-shrink-0">
        <PriorityStarButton
          isPriority={isPriorityHigh}
          onToggle={handleTogglePriority}
          size="md"
        />
      </div>
    </div>
  );
}
