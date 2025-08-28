import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const COLORS = [
  { name: "기본", value: "bg-gray-400", class: "bg-gray-400" },
  { name: "빨강", value: "bg-red-500", class: "bg-red-500" },
  { name: "주황", value: "bg-orange-500", class: "bg-orange-500" },
  { name: "노랑", value: "bg-yellow-500", class: "bg-yellow-500" },
  { name: "초록", value: "bg-green-500", class: "bg-green-500" },
  { name: "파랑", value: "bg-blue-500", class: "bg-blue-500" },
  { name: "보라", value: "bg-purple-500", class: "bg-purple-500" },
  { name: "핑크", value: "bg-pink-500", class: "bg-pink-500" },
] as const;

export type ColorValue = typeof COLORS[number]["value"];

interface ColorPaletteProps {
  currentColor?: ColorValue;
  onColorChange: (color: ColorValue) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function ColorPalette({
  currentColor = "bg-gray-400",
  onColorChange,
  children,
  disabled = false,
}: ColorPaletteProps) {
  const [open, setOpen] = useState(false);

  const handleColorSelect = (color: ColorValue) => {
    onColorChange(color);
    setOpen(false);
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorSelect(color.value)}
              className={cn(
                "w-8 h-8 rounded-full transition-all hover:scale-110",
                color.class,
                currentColor === color.value && "ring-2 ring-blue-500 ring-offset-2"
              )}
              title={color.name}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}