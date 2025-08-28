import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddTodoInputProps {
  onAddTodo: (title: string) => void;
  className?: string;
}

export function AddTodoInput({ onAddTodo, className }: AddTodoInputProps) {
  const [title, setTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTodo(title.trim());
      setTitle("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    } else if (e.key === "Escape") {
      setTitle("");
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClick = () => {
    // Input에 focus를 주기 위해 다음 tick에서 실행
    setTimeout(() => {
      const input = document.querySelector(
        ".add-todo-input"
      ) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 0);
  };

  return (
    <div
      className={cn(
        "w-full justify-start gap-2 p-4 h-auto text-gray-600 hover:text-gray-900 border border-transparent rounded-lg transition-colors cursor-text relative",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <Plus className="h-4 w-4 flex-shrink-0" />
        <form onSubmit={handleSubmit} className="flex-1">
          <Input
            className="add-todo-input border-0 outline-0 p-0 text-sm bg-transparent w-full placeholder:text-gray-600 focus:outline-none focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            style={{ border: "none", outline: "none", boxShadow: "none" }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="작업 추가"
          />
        </form>
      </div>
    </div>
  );
}
