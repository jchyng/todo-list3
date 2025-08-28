import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriorityStarButtonProps {
  isPriority: boolean;
  onToggle: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: (e: React.MouseEvent) => void;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5", 
  lg: "h-6 w-6"
};

export function PriorityStarButton({
  isPriority,
  onToggle,
  className,
  size = "md",
  onClick,
}: PriorityStarButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none focus-visible:ring-0",
        className
      )}
      aria-label={isPriority ? "우선순위 해제" : "우선순위 설정"}
    >
      <Star
        className={cn(
          "transition-colors",
          sizeMap[size],
          isPriority
            ? "fill-blue-500 text-blue-500"
            : "text-gray-300 hover:text-gray-400"
        )}
      />
    </button>
  );
}