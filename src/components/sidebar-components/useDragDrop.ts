import type { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import type { SidebarItemType, DragDropHandlers } from "./types";
import type { SidebarGroup } from "@/types/sidebar";
import {
  updateSidebarItems,
  handleTopLevelReordering,
  moveListToGroup,
  moveListAfterGroup,
  moveListBetweenGroups,
  reorderWithinGroup,
  moveListFromGroupToIndividual,
} from "./dragDropUtils";

export function useDragDrop(
  sidebarItems: SidebarItemType[],
  setSidebarItems: React.Dispatch<React.SetStateAction<SidebarItemType[]>>,
  setCurrentOverId: React.Dispatch<React.SetStateAction<string | null>>,
  setDropPosition: React.Dispatch<React.SetStateAction<'above' | 'below' | null>>,
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>
): DragDropHandlers {
  const handleDragStart = (event: import("@dnd-kit/core").DragStartEvent) => {
    // Set active item being dragged
    setActiveId(event.active.id as string);
    // Reset any lingering over state when drag starts
    setCurrentOverId(null);
    setDropPosition(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;
    if (!over || !active) {
      setCurrentOverId(null);
      setDropPosition(null);
      return;
    }

    const overId = over.id.toString();
    const activeId = active.id.toString();
    
    // Don't show indicator when hovering over self
    if (overId === activeId) {
      setCurrentOverId(null);
      setDropPosition(null);
      return;
    }

    // Determine if we're moving up or down in the list
    const activeIndex = sidebarItems.findIndex(item => item.data.id === activeId);
    const overIndex = sidebarItems.findIndex(item => item.data.id === overId);
    
    if (activeIndex !== -1 && overIndex !== -1) {
      // If dragging down, show indicator below target
      // If dragging up, show indicator above target
      setDropPosition(activeIndex < overIndex ? 'below' : 'above');
    } else {
      setDropPosition('above'); // Default to above for other cases
    }

    setCurrentOverId(overId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Always clear the drag state first, regardless of other conditions
    setCurrentOverId(null);
    setDropPosition(null);
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Helper function to update sidebar items
    const updateItems = (newItems: SidebarItemType[]) => {
      const updatedItems = updateSidebarItems(newItems);
      setSidebarItems(updatedItems);
    };

    // 1. Handle top-level reordering (groups and individual lists)
    const activeTopLevelIndex = sidebarItems.findIndex(item => 
      (item.type === 'group' && item.data.id === activeId) ||
      (item.type === 'list' && item.data.id === activeId)
    );
    
    const overTopLevelIndex = sidebarItems.findIndex(item => 
      (item.type === 'group' && item.data.id === overId) ||
      (item.type === 'list' && item.data.id === overId)
    );

    if (activeTopLevelIndex !== -1 && overTopLevelIndex !== -1) {
      const newItems = handleTopLevelReordering(sidebarItems, activeTopLevelIndex, overTopLevelIndex);
      updateItems(newItems);
      return;
    }

    // 2. Handle moving from individual list to group or group list
    const activeIndividualIndex = sidebarItems.findIndex(item => 
      item.type === 'list' && item.data.id === activeId
    );

    if (activeIndividualIndex !== -1) {
      const result = handleIndividualListMovement(
        sidebarItems, 
        activeIndividualIndex, 
        activeId, 
        overId
      );
      
      if (result) {
        updateItems(result);
        return;
      }
    }

    // 3. Handle moving from group list to individual or other groups
    const sourceGroupItem = sidebarItems.find(item => 
      item.type === 'group' && (item.data as SidebarGroup).lists.some(l => l.id === activeId)
    );

    if (sourceGroupItem && sourceGroupItem.type === 'group') {
      const result = handleGroupListMovement(
        sidebarItems,
        sourceGroupItem.data as SidebarGroup,
        activeId,
        overId
      );
      
      if (result) {
        updateItems(result);
      }
    }
  };

  return {
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
  };
}

function handleIndividualListMovement(
  sidebarItems: SidebarItemType[],
  activeIndividualIndex: number,
  _activeId: string,
  overId: string
): SidebarItemType[] | null {
  // Check if dropping on group inner zone
  if (overId.endsWith('-inner')) {
    const targetGroupId = overId.replace('-inner', '');
    return moveListToGroup(sidebarItems, activeIndividualIndex, targetGroupId);
  }

  // Check if dropping on group bottom zone
  if (overId.endsWith('-bottom')) {
    const targetGroupId = overId.replace('-bottom', '');
    const targetGroupIndex = sidebarItems.findIndex(item => 
      item.type === 'group' && item.data.id === targetGroupId
    );
    
    if (targetGroupIndex !== -1) {
      return moveListAfterGroup(sidebarItems, activeIndividualIndex, targetGroupIndex);
    }
  }

  // Handle other drop scenarios for individual lists
  return handleOtherIndividualListDrops(sidebarItems, activeIndividualIndex, overId);
}

function handleOtherIndividualListDrops(
  sidebarItems: SidebarItemType[],
  activeIndividualIndex: number,
  overId: string
): SidebarItemType[] | null {
  // Find target group or list
  let targetGroupItem = sidebarItems.find(item => 
    item.type === 'group' && item.data.id === overId
  );
  
  // Or dropping on a list within a group
  if (!targetGroupItem) {
    targetGroupItem = sidebarItems.find(item => 
      item.type === 'group' && item.data.lists.some(l => l.id === overId)
    );
  }

  if (targetGroupItem) {
    return moveListToGroup(sidebarItems, activeIndividualIndex, targetGroupItem.data.id);
  }

  return null;
}

function handleGroupListMovement(
  sidebarItems: SidebarItemType[],
  sourceGroupData: SidebarGroup,
  activeId: string,
  overId: string
): SidebarItemType[] | null {
  const sourceList = sourceGroupData.lists.find(l => l.id === activeId);
  if (!sourceList) return null;

  // Check if dropping on group inner zone
  if (overId.endsWith('-inner')) {
    const targetGroupId = overId.replace('-inner', '');
    if (targetGroupId !== sourceGroupData.id) {
      const targetGroupItem = sidebarItems.find(item => 
        item.type === 'group' && item.data.id === targetGroupId
      );
      
      if (targetGroupItem) {
        return moveListBetweenGroups(
          sidebarItems, 
          activeId, 
          sourceGroupData, 
          targetGroupItem.data as SidebarGroup
        );
      }
    }
  }

  // Check if dropping on individual list (move out of group)
  const targetIndividualIndex = sidebarItems.findIndex(item => 
    item.type === 'list' && item.data.id === overId
  );
  
  if (targetIndividualIndex !== -1) {
    return moveListFromGroupToIndividual(
      sidebarItems,
      activeId,
      sourceGroupData.id,
      targetIndividualIndex
    );
  }

  // Check if dropping after a group (move out of current group)
  if (overId.endsWith('-bottom')) {
    const targetGroupId = overId.replace('-bottom', '');
    const targetGroupIndex = sidebarItems.findIndex(item => 
      item.type === 'group' && item.data.id === targetGroupId
    );
    
    if (targetGroupIndex !== -1) {
      return moveListFromGroupToIndividual(
        sidebarItems,
        activeId,
        sourceGroupData.id,
        targetGroupIndex + 1
      );
    }
  }

  // Handle reordering within same group
  const targetGroupItem = sidebarItems.find(item => 
    item.type === 'group' && (
      item.data.id === overId || 
      (item.data as SidebarGroup).lists.some(l => l.id === overId)
    )
  );

  if (targetGroupItem && targetGroupItem.type === 'group') {
    const targetGroupData = targetGroupItem.data as SidebarGroup;
    const newItems = [...sidebarItems];
    
    const sourceGroupIndex = newItems.findIndex(item => 
      item.type === 'group' && item.data.id === sourceGroupData.id
    );
    const targetGroupIndex = newItems.findIndex(item => 
      item.type === 'group' && item.data.id === targetGroupData.id
    );

    if (sourceGroupIndex !== -1 && targetGroupIndex !== -1 && 
        newItems[sourceGroupIndex].type === 'group' && newItems[targetGroupIndex].type === 'group') {
      
      const updatedSourceGroupData = newItems[sourceGroupIndex].data as SidebarGroup;
      // Target group data available but not needed for same-group reordering
      
      // Same group reordering
      if (sourceGroupIndex === targetGroupIndex) {
        updatedSourceGroupData.lists = reorderWithinGroup(
          updatedSourceGroupData.lists,
          activeId,
          overId
        );
      } else {
        // Move between different groups
        return moveListBetweenGroups(sidebarItems, activeId, sourceGroupData, targetGroupData);
      }
    }
    
    return newItems;
  }

  return null;
}