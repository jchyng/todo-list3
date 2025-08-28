import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClearButtonProps {
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  stopPropagation?: boolean;
}

const sizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5"
};

export function ClearButton({
  onClick,
  size = "sm",
  className,
  stopPropagation = true,
}: ClearButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "p-0.5 rounded transition-colors hover:bg-gray-100",
        className
      )}
    >
      <X className={cn("text-gray-400 hover:text-gray-600", sizeMap[size])} />
    </button>
  );
}