import { FileText } from "lucide-react";
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

        {/* Note indicator */}
        {todo.description && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FileText className="h-3 w-3" />
            <span>노트</span>
          </div>
        )}
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
