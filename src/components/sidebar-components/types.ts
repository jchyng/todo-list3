import type { SidebarFilter, SidebarGroup } from "@/types/sidebar";

export type SidebarItemType = 
  | { type: 'list'; data: { id: string; name: string; count: number; colorDot: string }; sortOrder: number }
  | { type: 'group'; data: SidebarGroup; sortOrder: number };

export interface SidebarProps {
  selectedFilter: SidebarFilter;
  onFilterChange: (filter: SidebarFilter) => void;
  onToggleSidebar?: () => void;
  className?: string;
}

export interface SidebarItemProps {
  id: string;
  name: string;
  count?: number;
  icon?: React.ElementType;
  colorDot?: string;
  isSelected: boolean;
  onClick: () => void;
  isNested?: boolean;
  isDragOverlay?: boolean;
}

export interface SidebarGroupProps {
  group: SidebarGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onFilterChange: (filter: SidebarFilter) => void;
  isSelected: (filterId: string) => boolean;
  onDelete: () => void;
}

export interface DraggableGroupHeaderProps {
  group: SidebarGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export interface DragDropHandlers {
  onDragStart: (event: import("@dnd-kit/core").DragStartEvent) => void;
  onDragOver: (event: import("@dnd-kit/core").DragOverEvent) => void;
  onDragEnd: (event: import("@dnd-kit/core").DragEndEvent) => void;
}

export interface UseSidebarStateReturn {
  sidebarItems: SidebarItemType[];
  setSidebarItems: React.Dispatch<React.SetStateAction<SidebarItemType[]>>;
  expandedGroups: Set<string>;
  toggleGroup: (groupId: string) => void;
  currentOverId: string | null;
  setCurrentOverId: React.Dispatch<React.SetStateAction<string | null>>;
  dropPosition: 'above' | 'below' | null;
  setDropPosition: React.Dispatch<React.SetStateAction<'above' | 'below' | null>>;
  activeId: string | null;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
  isSelected: (filterId: string) => boolean;
  resetDragState: () => void;
}