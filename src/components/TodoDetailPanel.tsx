import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
  const [repeatOption, setRepeatOption] = useState<string>("");
  const [customRepeatInterval, setCustomRepeatInterval] = useState(1);
  const [customRepeatUnit, setCustomRepeatUnit] = useState("주");
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [openRepeat, setOpenRepeat] = useState(false);

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

  const handleRepeatOptionChange = (value: string) => {
    setRepeatOption(value);
  };

  const toggleWeekday = (day: string) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
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
                  <div className="flex items-center gap-1">
                    {startDate && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStartDate(undefined);
                          handleSave();
                        }}
                        className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                      >
                        <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
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
                  <div className="flex items-center gap-1">
                    {endDate && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEndDate(undefined);
                          handleSave();
                        }}
                        className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                      >
                        <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
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
          </div>
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
                  onValueChange={setCustomRepeatUnit}
                >
                  <SelectTrigger className="w-24 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="일">일</SelectItem>
                    <SelectItem value="주">주</SelectItem>
                    <SelectItem value="월">월</SelectItem>
                    <SelectItem value="년">년</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Weekday Selection */}
              {customRepeatUnit === "주" && (
                <div className="flex gap-0">
                  {["일", "월", "화", "수", "목", "금", "토"].map(
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

          <div className="relative">
            <Select
              value={repeatOption}
              onValueChange={handleRepeatOptionChange}
              open={openRepeat}
              onOpenChange={setOpenRepeat}
            >
              <SelectTrigger className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-gray-200 [&>svg]:hidden">
                <div className="flex items-center gap-2">
                  <RotateCcwIcon className="h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="반복" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekdays">평일</SelectItem>
                <SelectItem value="weekends">주말</SelectItem>
                <SelectItem value="daily">매일</SelectItem>
                <div className="px-2 py-1">
                  <div className="border-t border-gray-200"></div>
                </div>
                <SelectItem value="custom">사용자 지정</SelectItem>
              </SelectContent>
            </Select>
            {repeatOption && repeatOption !== "" && (
              <div className="flex items-center gap-1 absolute right-4 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => {
                    setRepeatOption("");
                  }}
                  className="p-0.5 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            )}
          </div>
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
