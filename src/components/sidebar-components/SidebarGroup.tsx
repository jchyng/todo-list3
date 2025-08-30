import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { DraggableGroupHeader } from "./DraggableGroupHeader";
import { DraggableSidebarItem } from "./DraggableSidebarItem";
import { GroupInnerDropZone, GroupBottomDropZone } from "./DropZones";
import type { SidebarGroupProps } from "./types";

interface ExtendedSidebarGroupProps extends SidebarGroupProps {
  currentOverId?: string | null;
  dropPosition?: 'above' | 'below' | null;
}

export function SidebarGroup({
  group,
  isExpanded,
  onToggle,
  onFilterChange,
  isSelected,
  onDelete,
  currentOverId,
  dropPosition,
}: ExtendedSidebarGroupProps) {
  // 세로선은 그룹 내부 작업(들어오기, 내부 이동)에서만 표시
  const shouldShowGroupLine = currentOverId === `${group.id}-inner` ||
    (group.lists.some(list => currentOverId === list.id));

  return (
    <div className="relative overflow-visible">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <DraggableGroupHeader
          group={group}
          isExpanded={isExpanded}
          onToggle={onToggle}
          onDelete={onDelete}
          isOver={currentOverId === group.id}
        />

        <CollapsibleContent className="px-2 pb-0 relative overflow-visible">
          {/* 드래그 중일 때만 표시되는 그룹 범위 세로 선 */}
          {shouldShowGroupLine && (
            <div className="absolute left-4 top-0 bottom-0 w-px bg-blue-500" />
          )}
          
          <SortableContext
            items={[
              ...group.lists.map((l) => l.id),
              `${group.id}-inner`,
              `${group.id}-bottom`
            ]}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-0.5">
              {group.lists.length === 0 ? (
                <GroupInnerDropZone 
                  groupId={group.id} 
                  isOver={currentOverId === `${group.id}-inner`}
                />
              ) : (
                <>
                  {group.lists.map((list) => (
                    <DraggableSidebarItem
                      key={list.id}
                      id={list.id}
                      name={list.name}
                      count={list.count}
                      colorDot={list.colorDot || "bg-gray-400"}
                      isSelected={isSelected(list.id)}
                      onClick={() => onFilterChange(list.id)}
                      isNested={true}
                      isOver={currentOverId === list.id}
                      dropPosition={currentOverId === list.id ? dropPosition : null}
                    />
                  ))}
                  <GroupInnerDropZone 
                    groupId={group.id} 
                    isOver={currentOverId === `${group.id}-inner`}
                  />
                </>
              )}
              <GroupBottomDropZone 
                groupId={group.id} 
                isOver={currentOverId === `${group.id}-bottom`} 
              />
            </div>
          </SortableContext>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}