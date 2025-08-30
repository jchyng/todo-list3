import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  FolderMinus, 
  FolderOpen, 
  GripVertical 
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import type { DraggableGroupHeaderProps } from "./types";

interface ExtendedDraggableGroupHeaderProps extends DraggableGroupHeaderProps {
  isOver?: boolean;
}

export function DraggableGroupHeader({ 
  group, 
  isExpanded, 
  onToggle, 
  onDelete,
  isOver: _isOver
}: ExtendedDraggableGroupHeaderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          ref={setNodeRef}
          style={style}
          className={cn(
            "w-full hover:bg-gray-100 transition-colors relative p-2 select-none",
            isDragging && "opacity-50"
          )}
        >
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2 flex-1">
              <button
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-3 w-3 text-gray-400" />
              </button>
              <div 
                className="flex items-center gap-2 flex-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
              >
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-blue-500" />
                ) : (
                  <Folder className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-sm font-medium">{group.name}</span>
              </div>
            </div>
            <div 
              className="cursor-pointer p-1"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={onDelete}
          className="text-red-700 focus:text-red-800 focus:bg-red-50 data-[highlighted]:text-red-800 data-[highlighted]:bg-red-50"
        >
          <div className="flex gap-3 items-center">
            <FolderMinus className="text-red-700" />
            그룹 해제
          </div>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}