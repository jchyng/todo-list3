import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TodoItem } from "@/types/todo";
import { Calendar, PanelRightClose, Repeat, Star, Trash2 } from "lucide-react";
import { useState } from "react";

interface TodoDetailPanelProps {
  todo: TodoItem;
  onClose: () => void;
  onUpdate: (updates: Partial<TodoItem>) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export function TodoDetailPanel({
  todo,
  onClose,
  onUpdate,
  onDelete,
  className,
}: TodoDetailPanelProps) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [dueDate, setDueDate] = useState(
    todo.dueDate ? todo.dueDate.toISOString().split("T")[0] : ""
  );
  const [repeatOption, setRepeatOption] = useState<string>("none");

  const handleSave = () => {
    onUpdate({
      title: title.trim() || todo.title,
      description: description.trim() || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      updatedAt: new Date(),
    });
  };

  const handleToggleComplete = () => {
    onUpdate({
      completed: !todo.completed,
      updatedAt: new Date(),
    });
  };

  const handleTogglePriority = () => {
    onUpdate({
      priority: todo.priority === "high" ? "low" : "high",
      updatedAt: new Date(),
    });
  };

  const handleDelete = () => {
    if (confirm("이 작업을 삭제하시겠습니까?")) {
      onDelete(todo.id);
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className={cn(
        "w-96 h-full bg-white border-l border-t border-gray-200 flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-1">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
            className="h-5 w-5 rounded-full"
          />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="border-0 p-0 text-sm font-medium bg-transparent focus:ring-0 focus:border-0"
            placeholder="작업 제목"
          />
          <button
            onClick={handleTogglePriority}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label={
              todo.priority === "high" ? "우선순위 해제" : "우선순위 설정"
            }
          >
            <Star
              className={cn(
                "h-5 w-5 transition-colors",
                todo.priority === "high"
                  ? "fill-blue-500 text-blue-500"
                  : "text-gray-300 hover:text-gray-400"
              )}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Description */}
        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            메모 추가
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleSave}
            placeholder="작업에 대한 세부 정보를 추가하세요..."
            className="min-h-[100px] text-sm"
          />
        </div>

        {/* Due Date */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Label
              htmlFor="dueDate"
              className="text-sm font-medium text-gray-700"
            >
              기한 설정
            </Label>
          </div>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            onBlur={handleSave}
            className="text-sm"
          />
        </div>

        {/* Repeat */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Repeat className="h-4 w-4 text-gray-500" />
            <Label className="text-sm font-medium text-gray-700">반복</Label>
          </div>
          <Select value={repeatOption} onValueChange={setRepeatOption}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="반복 안함" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">반복 안함</SelectItem>
              <SelectItem value="daily">매일</SelectItem>
              <SelectItem value="weekdays">평일</SelectItem>
              <SelectItem value="weekly">매주</SelectItem>
              <SelectItem value="monthly">매월</SelectItem>
              <SelectItem value="yearly">매년</SelectItem>
              <SelectItem value="custom">사용자 지정</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 h-auto text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <PanelRightClose className="h-4 w-4" />
          </Button>

          {/* Created date */}
          <div className="text-xs text-gray-500">
            {formatDate(todo.createdAt).split(" ").slice(0, 3).join(" ")}
          </div>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="p-2 h-auto text-gray-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
