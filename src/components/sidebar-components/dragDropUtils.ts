import { arrayMove } from "@dnd-kit/sortable";
import type { SidebarItemType } from "./types";
import type { SidebarGroup, SidebarList } from "@/types/sidebar";

export function updateSidebarItems(items: SidebarItemType[]): SidebarItemType[] {
  return items.map((item, index) => ({
    ...item,
    sortOrder: index + 1
  }));
}

export function handleTopLevelReordering(
  sidebarItems: SidebarItemType[],
  activeTopLevelIndex: number,
  overTopLevelIndex: number
): SidebarItemType[] {
  return arrayMove(sidebarItems, activeTopLevelIndex, overTopLevelIndex);
}

export function moveListToGroup(
  sidebarItems: SidebarItemType[],
  activeIndividualIndex: number,
  targetGroupId: string
): SidebarItemType[] {
  const newItems = [...sidebarItems];
  const sourceListData = newItems[activeIndividualIndex].data as { id: string; name: string; count: number; colorDot: string };
  
  // Remove from individual lists
  newItems.splice(activeIndividualIndex, 1);
  
  // Add to target group
  const targetGroupData = newItems.find(item => 
    item.type === 'group' && item.data.id === targetGroupId
  )?.data as SidebarGroup;
  
  if (targetGroupData) {
    const newList: SidebarList = {
      id: sourceListData.id,
      name: sourceListData.name,
      count: sourceListData.count,
      groupId: targetGroupId,
      colorDot: sourceListData.colorDot,
    };
    
    targetGroupData.lists.push(newList);
  }
  
  return newItems;
}

export function moveListAfterGroup(
  sidebarItems: SidebarItemType[],
  activeIndividualIndex: number,
  targetGroupIndex: number
): SidebarItemType[] {
  const newItems = [...sidebarItems];
  const sourceListData = newItems[activeIndividualIndex].data as { id: string; name: string; count: number; colorDot: string };
  
  // Remove item from current position
  newItems.splice(activeIndividualIndex, 1);
  
  const adjustedIndex = activeIndividualIndex < targetGroupIndex ? targetGroupIndex : targetGroupIndex + 1;
  
  const newIndividualItem: SidebarItemType = {
    type: 'list',
    data: {
      id: sourceListData.id,
      name: sourceListData.name,
      count: sourceListData.count,
      colorDot: sourceListData.colorDot
    },
    sortOrder: adjustedIndex + 1
  };
  
  newItems.splice(adjustedIndex, 0, newIndividualItem);
  return newItems;
}

export function moveListBetweenGroups(
  sidebarItems: SidebarItemType[],
  activeId: string,
  sourceGroupData: SidebarGroup,
  targetGroupData: SidebarGroup
): SidebarItemType[] {
  const newItems = [...sidebarItems];
  const sourceList = sourceGroupData.lists.find(l => l.id === activeId);
  if (!sourceList) return sidebarItems;

  // Find source and target group indices
  const sourceGroupIndex = newItems.findIndex(item => 
    item.type === 'group' && item.data.id === sourceGroupData.id
  );
  const targetGroupIndex = newItems.findIndex(item => 
    item.type === 'group' && item.data.id === targetGroupData.id
  );

  if (sourceGroupIndex !== -1 && targetGroupIndex !== -1 && 
      newItems[sourceGroupIndex].type === 'group' && newItems[targetGroupIndex].type === 'group') {
    
    const updatedSourceGroupData = newItems[sourceGroupIndex].data as SidebarGroup;
    const updatedTargetGroupData = newItems[targetGroupIndex].data as SidebarGroup;
    
    // Remove from source
    updatedSourceGroupData.lists = updatedSourceGroupData.lists.filter(
      l => l.id !== activeId
    );
    
    // Add to target
    const updatedList = { 
      ...sourceList, 
      groupId: targetGroupData.id, 
      colorDot: sourceList.colorDot || "bg-gray-400" 
    };
    updatedTargetGroupData.lists.push(updatedList);
  }
  
  return newItems;
}

export function reorderWithinGroup(
  groupLists: SidebarList[],
  activeId: string,
  overId: string
): SidebarList[] {
  const oldIndex = groupLists.findIndex(l => l.id === activeId);
  const newIndex = groupLists.findIndex(l => l.id === overId);
  
  if (oldIndex !== -1 && newIndex !== -1) {
    return arrayMove(groupLists, oldIndex, newIndex);
  }
  
  return groupLists;
}

export function moveListFromGroupToIndividual(
  sidebarItems: SidebarItemType[],
  activeId: string,
  sourceGroupId: string,
  targetIndex: number
): SidebarItemType[] {
  const newItems = [...sidebarItems];
  
  // Find source group and remove the list from it
  const sourceGroupIndex = newItems.findIndex(item => 
    item.type === 'group' && item.data.id === sourceGroupId
  );
  
  if (sourceGroupIndex === -1) return newItems;
  
  const sourceGroupData = newItems[sourceGroupIndex].data as SidebarGroup;
  const listToMove = sourceGroupData.lists.find(list => list.id === activeId);
  
  if (!listToMove) return newItems;
  
  // Remove list from source group
  const updatedSourceGroupData = {
    ...sourceGroupData,
    lists: sourceGroupData.lists.filter(list => list.id !== activeId)
  };
  newItems[sourceGroupIndex] = {
    type: 'group',
    data: updatedSourceGroupData,
    sortOrder: newItems[sourceGroupIndex].sortOrder
  };
  
  // Convert to individual list and insert at target position
  const individualListItem: SidebarItemType = {
    type: 'list',
    data: {
      id: listToMove.id,
      name: listToMove.name,
      count: listToMove.count,
      colorDot: listToMove.colorDot || "bg-gray-400"
    },
    sortOrder: targetIndex + 1
  };
  
  newItems.splice(targetIndex, 0, individualListItem);
  
  return newItems;
}