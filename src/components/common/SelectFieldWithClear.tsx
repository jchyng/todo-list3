import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClearButton } from "./ClearButton";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldWithClearProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: SelectOption[];
  icon?: React.ReactNode;
  className?: string;
  onClear?: () => void;
  clearButtonPosition?: "inside" | "outside";
}

export function SelectFieldWithClear({
  value,
  onValueChange,
  placeholder,
  options,
  icon,
  className,
  onClear,
  clearButtonPosition = "outside",
}: SelectFieldWithClearProps) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onValueChange("");
    }
  };

  const showClearButton = value && value !== "";

  if (clearButtonPosition === "outside") {
    return (
      <div className="relative">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger
            className={cn(
              "w-full focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-gray-200 [&>svg]:hidden",
              className
            )}
          >
            <div className="flex items-center gap-2">
              {icon}
              <SelectValue placeholder={placeholder} />
            </div>
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showClearButton && (
          <div className="flex items-center gap-1 absolute right-4 top-1/2 -translate-y-1/2">
            <ClearButton onClick={handleClear} />
          </div>
        )}
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "w-full focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none border-gray-200",
          className
        )}
      >
        <div className="flex items-center gap-2 flex-1">
          {icon}
          <SelectValue placeholder={placeholder} />
        </div>
        {showClearButton && <ClearButton onClick={handleClear} />}
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}