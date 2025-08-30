// Main component
export { SidebarMain as Sidebar } from "./SidebarMain";

// Individual components
export { SidebarItem } from "./SidebarItem";
export { DraggableSidebarItem } from "./DraggableSidebarItem";
export { SidebarGroup } from "./SidebarGroup";
export { DraggableGroupHeader } from "./DraggableGroupHeader";
export { GroupInnerDropZone, GroupBottomDropZone } from "./DropZones";
export { AddActions } from "./AddActions";

// Hooks
export { useSidebarState } from "./useSidebarState";
export { useDragDrop } from "./useDragDrop";

// Types
export type * from "./types";

// Constants
export * from "./constants";

// Utils
export * from "./dragDropUtils";