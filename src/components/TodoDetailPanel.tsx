import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  CalendarIcon,
  ChevronDownIcon,
  PanelRightClose,
  RotateCcwIcon,
  Star,
  Trash2,
  X,
} from "lucide-react";
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
  const [startDate, setStartDate] = useState<Date | undefined>(todo.dueDate);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [repeatOption, setRepeatOption] = useState<string>("none");

  const handleSave = () => {
    onUpdate({
      title: title.trim() || todo.title,
      description: description.trim() || undefined,
      dueDate: startDate,
      endDate: endDate,
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
        "w-80 h-full bg-white border-l border-gray-200 flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggleComplete}
          className="h-5 w-5 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          className="border-0 outline-0 p-0 text-sm font-medium bg-transparent focus:ring-0 focus:border-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 w-full"
          placeholder="작업 제목"
          style={{ border: "none", outline: "none", boxShadow: "none" }}
        />
        <button
          onClick={handleTogglePriority}
          className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none focus-visible:ring-0"
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

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Description */}
        <div>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleSave}
            placeholder="메모 추가"
            className="min-h-[100px] text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-gray-200 resize-none"
          />
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          {/* Start Date */}
          <div>
            <Popover open={openFrom} onOpenChange={setOpenFrom}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between font-normal focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-gray-200",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span>
                      {startDate
                        ? startDate.toLocaleDateString("ko-KR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "시작 날짜"}
                    </span>
                  </div>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setStartDate(date);
                    setOpenFrom(false);
                    handleSave();
                  }}
                />
              </PopoverContent>
            </Popover>
            {startDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStartDate(undefined);
                  handleSave();
                }}
                className="h-auto p-1 text-xs text-gray-500 hover:text-red-600 mt-1"
              >
                <X className="h-3 w-3 mr-1" />
                제거
              </Button>
            )}
          </div>

          {/* End Date */}
          <div>
            <Popover open={openTo} onOpenChange={setOpenTo}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between font-normal focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-gray-200",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span>
                      {endDate
                        ? endDate.toLocaleDateString("ko-KR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "종료 날짜"}
                    </span>
                  </div>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setEndDate(date);
                    setOpenTo(false);
                    handleSave();
                  }}
                  disabled={startDate && { before: startDate }}
                />
              </PopoverContent>
            </Popover>
            {endDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEndDate(undefined);
                  handleSave();
                }}
                className="h-auto p-1 text-xs text-gray-500 hover:text-red-600 mt-1"
              >
                <X className="h-3 w-3 mr-1" />
                제거
              </Button>
            )}
          </div>
        </div>

        {/* Repeat */}
        <div>
          <Select value={repeatOption} onValueChange={setRepeatOption}>
            <SelectTrigger className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-gray-200">
              <div className="flex items-center gap-2">
                <RotateCcwIcon className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="반복" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">반복</SelectItem>
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
