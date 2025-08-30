import { useState, useEffect } from "react";
import { INITIAL_SIDEBAR_ITEMS, INITIAL_EXPANDED_GROUPS } from "./constants";
import type { SidebarItemType, UseSidebarStateReturn } from "./types";
import type { SidebarFilter } from "@/types/sidebar";

export function useSidebarState(selectedFilter: SidebarFilter): UseSidebarStateReturn {
  const [sidebarItems, setSidebarItems] = useState<SidebarItemType[]>(INITIAL_SIDEBAR_ITEMS);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(INITIAL_EXPANDED_GROUPS);
  const [currentOverId, setCurrentOverId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });

    // Update the sidebar items state to reflect expansion changes
    setSidebarItems(prev => prev.map(item => 
      item.type === 'group' && item.data.id === groupId 
        ? { ...item, data: { ...item.data, isExpanded: !item.data.isExpanded }}
        : item
    ));
  };

  const isSelected = (filterId: string) => selectedFilter === filterId;

  // Cleanup function to reset drag state
  const resetDragState = () => {
    setCurrentOverId(null);
    setDropPosition(null);
    setActiveId(null);
  };

  // Reset drag state on component unmount or when filter changes
  useEffect(() => {
    return () => {
      resetDragState();
    };
  }, [selectedFilter]);

  return {
    sidebarItems,
    setSidebarItems,
    expandedGroups,
    toggleGroup,
    currentOverId,
    setCurrentOverId,
    dropPosition,
    setDropPosition,
    activeId,
    setActiveId,
    isSelected,
    resetDragState,
  };
}