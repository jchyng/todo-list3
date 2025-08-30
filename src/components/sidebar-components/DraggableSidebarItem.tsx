import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { GripVertical, Trash2Icon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { DeleteConfirmDialog } from "../common";
import type { SidebarItemProps } from "./types";

interface DraggableSidebarItemProps extends Omit<SidebarItemProps, "icon"> {
  isOver?: boolean; // Keep for potential future use
  dropPosition?: 'above' | 'below' | null; // Keep for potential future use
}

export function DraggableSidebarItem({
  id,
  name,
  count,
  colorDot,
  isSelected,
  onClick,
  isNested = false,
  isOver: _isOver = false,
  dropPosition: _dropPosition = null,
  isDragOverlay = false,
}: DraggableSidebarItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteList = () => {
    // TODO: Implement list deletion logic
  };

  const content = (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-full transition-colors relative select-none",
        isSelected && "bg-blue-100 text-blue-700",
        isDragging && "opacity-50",
        isDragOverlay && "bg-white border border-gray-200 rounded-md shadow-lg"
      )}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-blue-600" />
      )}
      <div
        className={cn(
          "flex items-center justify-between py-2 hover:bg-gray-100 transition-colors",
          isNested ? "pl-6 pr-4" : "px-4"
        )}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3 w-3 text-gray-400" />
          </button>
          {colorDot && (
            <div
              className={cn("w-3 h-3 rounded-full flex-shrink-0", colorDot)}
            />
          )}
          <span
            className="text-sm truncate cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            {name}
          </span>
        </div>
        {count !== undefined && (
          <span className="text-xs text-gray-500 flex-shrink-0">{count}</span>
        )}
      </div>
    </div>
  );

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