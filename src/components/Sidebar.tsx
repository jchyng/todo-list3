/**
 * Main Sidebar component - refactored for better maintainability
 * 
 * This component has been completely restructured into smaller, focused modules:
 * - Separated drag-and-drop logic into utilities and hooks
 * - Extracted individual UI components for better reusability
 * - Centralized state management with custom hooks
 * - Organized constants and types into dedicated files
 * 
 * The modular structure improves:
 * - Code maintainability and readability
 * - Component reusability and testability
 * - Separation of concerns
 * - Easier debugging and feature additions
 */

// Re-export the new modular Sidebar implementation
export { Sidebar } from "./sidebar-components";

// Export types for backward compatibility
export type { 
  SidebarProps, 
  SidebarItemType, 
  SidebarItemProps, 
  SidebarGroupProps, 
  DraggableGroupHeaderProps 
} from "./sidebar-components";

// Export individual components for advanced usage
export { 
  SidebarItem,
  DraggableSidebarItem,
  SidebarGroup,
  DraggableGroupHeader,
  GroupInnerDropZone,
  GroupBottomDropZone,
  AddActions
} from "./sidebar-components";

// Hooks and utilities are available through direct import:
// import { useSidebarState, useDragDrop } from "@/components/sidebar";
// import { SYSTEM_ITEMS, INITIAL_SIDEBAR_ITEMS } from "@/components/sidebar";