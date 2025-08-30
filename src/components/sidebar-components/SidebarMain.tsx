import { DndContext, PointerSensor, useSensor, useSensors, closestCorners, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { SYSTEM_ITEMS, DND_SENSOR_CONFIG } from "./constants";
import { useSidebarState } from "./useSidebarState";
import { useDragDrop } from "./useDragDrop";
import { SidebarItem } from "./SidebarItem";
import { DraggableSidebarItem } from "./DraggableSidebarItem";
import { SidebarGroup } from "./SidebarGroup";
import { AddActions } from "./AddActions";
import type { SidebarProps } from "./types";
import type { SidebarFilter } from "@/types/sidebar";

export function SidebarMain({
  selectedFilter,
  onFilterChange,
  onToggleSidebar,
  className,
}: SidebarProps) {
  const {
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
  } = useSidebarState(selectedFilter);

  const sensors = useSensors(useSensor(PointerSensor, DND_SENSOR_CONFIG));

  const { onDragStart, onDragOver, onDragEnd } = useDragDrop(
    sidebarItems,
    setSidebarItems,
    setCurrentOverId,
    setDropPosition,
    setActiveId
  );

  const handleDeleteGroup = (_groupId: string) => {
    // TODO: Implement group deletion logic
  };

  const handleAddGroup = (_name: string) => {
    // TODO: Implement group addition logic
  };

  const handleAddList = (_name: string) => {
    // TODO: Implement list addition logic
  };

  // Find the active drag item for overlay
  const getActiveDragItem = () => {
    if (!activeId) return null;

    // Check top-level items first
    const topLevelItem = sidebarItems.find(item => item.data.id === activeId);
    if (topLevelItem) {
      return topLevelItem;
    }

    // Check items within groups
    for (const item of sidebarItems) {
      if (item.type === 'group') {
        const groupItem = item.data.lists.find(list => list.id === activeId);
        if (groupItem) {
          return {
            type: 'list' as const,
            data: {
              id: groupItem.id,
              name: groupItem.name,
              count: groupItem.count,
              colorDot: groupItem.colorDot || "bg-gray-400"
            },
            sortOrder: 0
          };
        }
      }
    }

    return null;
  };

  const activeDragItem = getActiveDragItem();

  const sortableItems = [
    // Top-level items (groups and individual lists)
    ...sidebarItems.map(item => 
      item.type === 'group' ? item.data.id : item.data.id
    ),
    // Group inner drop zones
    ...sidebarItems
      .filter(item => item.type === 'group')
      .map(item => `${item.data.id}-inner`),
    // Group bottom drop zones
    ...sidebarItems
      .filter(item => item.type === 'group')
      .map(item => `${item.data.id}-bottom`),
    // Lists inside groups (needed for dragging out of groups)
    ...sidebarItems
      .filter(item => item.type === 'group')
      .flatMap(item => item.data.lists.map(list => list.id))
  ];

  return (
    <TooltipProvider>
      <DndContext
        id="sidebar-dnd"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={resetDragState}
      >
        <div
          className={cn(
            "w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col select-none",
            className
          )}
        >
          {/* Header with hamburger menu */}
          <div className="flex items-center justify-between p-2 pt-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="space-y-1">
              {/* System Items */}
              {SYSTEM_ITEMS.map((item) => (
                <SidebarItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  count={item.count}
                  icon={item.icon}
                  isSelected={isSelected(item.id)}
                  onClick={() => onFilterChange(item.id as SidebarFilter)}
                />
              ))}

              {/* Separator */}
              <div className="px-4 my-4">
                <div className="border-t border-gray-300"></div>
              </div>
            </div>

            {/* Unified Lists and Groups */}
            <div className="space-y-1 flex-1 overflow-y-auto">
              <SortableContext
                items={sortableItems}
                strategy={verticalListSortingStrategy}
              >
                {sidebarItems
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((item) => {
                    if (item.type === 'list') {
                      return (
                        <DraggableSidebarItem
                          key={item.data.id}
                          id={item.data.id}
                          name={item.data.name}
                          count={item.data.count}
                          colorDot={item.data.colorDot}
                          isSelected={isSelected(item.data.id)}
                          onClick={() => onFilterChange(item.data.id)}
                          isNested={false}
                          isOver={currentOverId === item.data.id}
                          dropPosition={currentOverId === item.data.id ? dropPosition : null}
                        />
                      );
                    } else {
                      return (
                        <SidebarGroup
                          key={item.data.id}
                          group={item.data}
                          isExpanded={expandedGroups.has(item.data.id)}
                          onToggle={() => toggleGroup(item.data.id)}
                          onFilterChange={onFilterChange}
                          isSelected={isSelected}
                          onDelete={() => handleDeleteGroup(item.data.id)}
                          currentOverId={currentOverId}
                          dropPosition={dropPosition}
                        />
                      );
                    }
                  })}
              </SortableContext>

              {/* Add Actions */}
              <AddActions
                onAddGroup={handleAddGroup}
                onAddList={handleAddList}
              />
            </div>
          </div>
        </div>
        
        <DragOverlay>
          {activeDragItem && activeDragItem.type === 'list' ? (
            <DraggableSidebarItem
              id={activeDragItem.data.id}
              name={activeDragItem.data.name}
              count={activeDragItem.data.count}
              colorDot={activeDragItem.data.colorDot}
              isSelected={false}
              onClick={() => {}}
              isNested={false}
              isDragOverlay={true}
            />
          ) : activeDragItem && activeDragItem.type === 'group' ? (
            <div className="bg-white border border-gray-200 rounded-md shadow-lg p-2 cursor-grabbing">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{activeDragItem.data.name}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </TooltipProvider>
  );
}