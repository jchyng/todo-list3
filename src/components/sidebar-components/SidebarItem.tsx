import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { DeleteConfirmDialog } from "../common";
import type { SidebarItemProps } from "./types";

export function SidebarItem({
  id: _id,
  name,
  count,
  icon: Icon,
  colorDot,
  isSelected,
  onClick,
  isNested = false,
  isDragOverlay = false,
}: SidebarItemProps) {
  const handleDeleteList = () => {
    // TODO: Implement item deletion logic
  };

  const content = (
    <div
      className={cn(
        "w-full transition-colors relative select-none",
        isSelected && "bg-blue-100 text-blue-700",
        isDragOverlay && "shadow-lg border"
      )}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-blue-600" />
      )}
      <div
        onClick={
          !isDragOverlay
            ? (e) => {
                e.stopPropagation();
                onClick();
              }
            : undefined
        }
        className={cn(
          "flex items-center justify-between py-2 transition-colors",
          isNested ? "pl-10 pr-4" : "px-4",
          !isDragOverlay && "cursor-pointer hover:bg-gray-100"
        )}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
          {colorDot && (
            <div
              className={cn("w-3 h-3 rounded-full flex-shrink-0", colorDot)}
            />
          )}
          <span className="text-sm truncate">{name}</span>
        </div>
        {count !== undefined && (
          <span className="text-xs text-gray-500 flex-shrink-0">{count}</span>
        )}
      </div>
    </div>
  );

  if (isDragOverlay) {
    return content;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{content}</ContextMenuTrigger>
      <ContextMenuContent>
        <DeleteConfirmDialog
          trigger={
            <ContextMenuItem
              className="text-red-700 focus:text-red-800 focus:bg-red-50 data-[highlighted]:text-red-800 data-[highlighted]:bg-red-50"
              onSelect={(e) => e.preventDefault()}
            >
              <div className="flex gap-3 items-center">
                <Trash2Icon className="text-red-700" />
                목록 삭제
              </div>
            </ContextMenuItem>
          }
          title={`"${name}"이(가) 영구적으로 삭제됩니다.`}
          onConfirm={handleDeleteList}
          confirmText="목록 삭제"
        />
      </ContextMenuContent>
    </ContextMenu>
  );
}