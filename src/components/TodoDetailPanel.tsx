import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
  PanelRightClose,
  RotateCcwIcon,
  Trash2,
} from "lucide-react";
import { useState, useCallback } from "react";
import {
  PriorityStarButton,
  DatePickerField,
  SelectFieldWithClear,
  DeleteConfirmDialog,
} from "./common";

// Constants
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
const REPEAT_UNITS = ["일", "주", "월", "년"] as const;

// Types
type WeekdayType = typeof WEEKDAYS[number];
type RepeatUnitType = typeof REPEAT_UNITS[number];
type RepeatOptionType = "" | "weekdays" | "weekends" | "daily" | "custom";

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
  // Form state
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  
  // Date state
  const [startDate, setStartDate] = useState<Date | undefined>(todo.dueDate);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Repeat state
  const [repeatOption, setRepeatOption] = useState<RepeatOptionType>("");
  const [customRepeatInterval, setCustomRepeatInterval] = useState<number>(1);
  const [customRepeatUnit, setCustomRepeatUnit] = useState<RepeatUnitType>("주");
  const [selectedWeekdays, setSelectedWeekdays] = useState<WeekdayType[]>([]);

  const handleSave = useCallback(() => {
    onUpdate({
      title: title.trim() || todo.title,
      description: description.trim() || undefined,
      dueDate: startDate,
      endDate: endDate,
      updatedAt: new Date(),
    });
  }, [title, description, startDate, endDate, onUpdate, todo.title]);

  const handleToggleComplete = useCallback(() => {
    onUpdate({
      completed: !todo.completed,
      updatedAt: new Date(),
    });
  }, [todo.completed, onUpdate]);

  const handleTogglePriority = useCallback(() => {
    onUpdate({
      priority: todo.priority === "high" ? "low" : "high",
      updatedAt: new Date(),
    });
  }, [todo.priority, onUpdate]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleRepeatOptionChange = (value: string) => {
    setRepeatOption(value as RepeatOptionType);
  };

  const toggleWeekday = (day: string) => {
    const weekday = day as WeekdayType;
    setSelectedWeekdays((prev) =>
      prev.includes(weekday) ? prev.filter((d) => d !== weekday) : [...prev, weekday]
    );
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
        <PriorityStarButton
          isPriority={todo.priority === "high"}
          onToggle={handleTogglePriority}
          size="md"
        />
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
          <DatePickerField
            date={startDate}
            onDateChange={(date) => {
              setStartDate(date);
              handleSave();
            }}
            placeholder="시작 날짜"
          />

          {/* End Date */}
          <DatePickerField
            date={endDate}
            onDateChange={(date) => {
              setEndDate(date);
              handleSave();
            }}
            placeholder="종료 날짜"
            disabled={startDate ? (date) => date < startDate : undefined}
          />
        </div>

        {/* Repeat */}
        <div className="space-y-3">
          {/* Custom Repeat Configuration - shown when custom is selected */}
          {repeatOption === "custom" && (
            <div className="border border-gray-200 rounded-lg p-3 space-y-3 bg-white">
              {/* Interval and Unit */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    min="1"
                    value={customRepeatInterval}
                    onChange={(e) =>
                      setCustomRepeatInterval(parseInt(e.target.value) || 1)
                    }
                    className="w-full text-center border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none pr-6"
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                    <button
                      type="button"
                      className="h-3 w-3 flex items-center justify-center text-xs text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setCustomRepeatInterval((prev) => prev + 1)
                      }
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="h-3 w-3 flex items-center justify-center text-xs text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setCustomRepeatInterval((prev) => Math.max(1, prev - 1))
                      }
                    >
                      ▼
                    </button>
                  </div>
                </div>
                <Select
                  value={customRepeatUnit}
                  onValueChange={(value: string) => setCustomRepeatUnit(value as RepeatUnitType)}
                >
                  <SelectTrigger className="w-24 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REPEAT_UNITS.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Weekday Selection */}
              {customRepeatUnit === "주" && (
                <div className="flex gap-0">
                  {WEEKDAYS.map(
                    (day, index) => (
                      <Button
                        key={day}
                        variant={
                          selectedWeekdays.includes(day) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => toggleWeekday(day)}
                        className={`h-8 flex-1 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-xs ${
                          index === 0
                            ? "rounded-r-none"
                            : index === 6
                            ? "rounded-l-none"
                            : "rounded-none"
                        } ${index > 0 ? "border-l-0" : ""}`}
                      >
                        {day}
                      </Button>
                    )
                  )}
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-center pt-1">
                <Button
                  onClick={() => handleSave()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1 h-8 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                >
                  저장
                </Button>
              </div>
            </div>
          )}

          <SelectFieldWithClear
            value={repeatOption}
            onValueChange={handleRepeatOptionChange}
            placeholder="반복"
            options={[
              { value: "weekdays", label: "평일" },
              { value: "weekends", label: "주말" },
              { value: "daily", label: "매일" },
              { value: "custom", label: "사용자 지정" },
            ]}
            icon={<RotateCcwIcon className="h-4 w-4 text-gray-400" />}
            clearButtonPosition="outside"
            onClear={() => setRepeatOption("" as RepeatOptionType)}
          />
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
          <DeleteConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto text-gray-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="이 작업을 삭제하시겠습니까?"
            onConfirm={() => {
              onDelete(todo.id);
              onClose();
            }}
            confirmText="삭제"
          />
        </div>
      </div>
    </div>
  );
}
