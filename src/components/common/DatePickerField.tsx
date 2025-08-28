import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";

interface DatePickerFieldProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder: string;
  className?: string;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePickerField({
  date,
  onDateChange,
  placeholder,
  className,
  disabled,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange(undefined);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-gray-200",
            !date && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span>
              {date
                ? date.toLocaleDateString("ko-KR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : placeholder}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {date && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={handleDateSelect}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}