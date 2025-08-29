import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SidebarFilter, SidebarGroup } from "@/types/sidebar";
import {
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderMinus,
  FolderOpen,
  FolderPlus,
  Menu,
  Plus,
  Star,
  Sun,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { DeleteConfirmDialog } from "./common";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";

interface SidebarProps {
  selectedFilter: SidebarFilter;
  onFilterChange: (filter: SidebarFilter) => void;
  onToggleSidebar?: () => void;
  className?: string;
}

interface SidebarItemProps {
  id: string;
  name: string;
  count?: number;
  icon?: React.ElementType;
  colorDot?: string;
  isSelected: boolean;
  onClick: () => void;
  isNested?: boolean;
  isDraggable?: boolean;
}

interface SidebarGroupProps {
  group: SidebarGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onFilterChange: (filter: SidebarFilter) => void;
  isSelected: (filterId: string) => boolean;
  onDelete: () => void;
}

function DraggableSidebarItem({
  id,
  name,
  count,
  icon: Icon,
  colorDot,
  isSelected,
  onClick,
  isNested = false,
  isDraggable = false,
}: SidebarItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id,
    disabled: !isDraggable,
  });

  // 드래그 중에도 아이템이 움직이지 않도록 스타일 제거
  const style = {};

  const handleDeleteList = () => {
    // 실제 삭제 로직은 나중에 구현
    console.log(`삭제 예정 - ID: ${id}, Name: ${name}`);
  };

  const content = (
    <div
      className={cn(
        "w-full rounded transition-colors relative select-none",
        isSelected && "bg-blue-100 text-blue-700",
        isDragging && "opacity-50"
      )}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-blue-600" />
      )}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={cn(
          "flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100 transition-colors",
          isNested ? "pl-10 pr-4" : "px-4"
        )}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
          {colorDot && (
            <div
              className={cn("w-3 h-3 rounded-full flex-shrink-0", colorDot)}
            />
          )}
          <span className="text-sm truncate">{name}</span>
        </div>
        {count !== undefined && (
          <span className="text-xs text-gray-500 flex-shrink-0">{count}</span>
        )}
      </div>
    </div>
  );

  if (!isDraggable) {
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

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
          {content}
        </div>
      </ContextMenuTrigger>
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

// Non-draggable wrapper for system items
function SidebarItem(props: SidebarItemProps) {
  return <DraggableSidebarItem {...props} isDraggable={false} />;
}

// 그룹 헤더 위쪽 드롭 영역
function GroupTopDropZone({
  groupId,
  dropIndicator,
}: {
  groupId: string;
  dropIndicator: {
    type: "line" | "group";
    position?: "above" | "below";
    targetId?: string;
    groupId?: string;
  } | null;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `group-top-${groupId}`,
  });

  const showIndicator =
    dropIndicator?.type === "line" &&
    dropIndicator?.targetId === `group-top-${groupId}`;

  return (
    <div ref={setNodeRef} className="h-2 transition-colors relative">
      {(showIndicator || isOver) && (
        <DropIndicator type="line" position="above" />
      )}
    </div>
  );
}

// 그룹 헤더 드롭 영역 (그룹 헤더 자체에 드롭 가능)
function GroupHeaderDropZone({
  groupId,
  children,
}: {
  groupId: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id: `group-header-${groupId}`,
  });

  return (
    <div ref={setNodeRef} className="w-full">
      {children}
    </div>
  );
}

function DroppableGroup({
  group,
  isExpanded,
  onToggle,
  onFilterChange,
  isSelected,
  onDelete,
  dropIndicator,
  dragAttributes,
  dragListeners,
  dragRef,
}: SidebarGroupProps & {
  dropIndicator: {
    type: "line" | "group";
    position?: "above" | "below";
    targetId?: string;
    groupId?: string;
  } | null;
  dragAttributes?: any;
  dragListeners?: any;
  dragRef?: any;
}) {
  const { setNodeRef } = useDroppable({
    id: `group-${group.id}`,
  });

  // 그룹 드롭 시 시각적 피드백 없음

  return (
    <div className="relative">
      {/* 그룹 헤더 위쪽 드롭 영역 */}
      <GroupTopDropZone groupId={group.id} dropIndicator={dropIndicator} />

      <div
        ref={setNodeRef}
        className="droppable-group transition-colors relative rounded"
        data-group-id={group.id}
      >
        {/* 그룹 드롭 시 시각적 피드백 없음 - 가로선만 사용 */}

        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <ContextMenu>
            <ContextMenuTrigger>
              <GroupHeaderDropZone groupId={group.id}>
                <div 
                  ref={dragRef}
                  {...dragAttributes}
                  {...dragListeners}
                  className="w-full rounded hover:bg-gray-100 transition-colors relative p-2 select-none"
                >
                  <div className="flex items-center justify-between px-2 py-1">
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
              </GroupHeaderDropZone>
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

          <CollapsibleContent className="space-y-1 px-2 pb-2">
            <SortableContext items={group.lists.map((list) => list.id)}>
              {/* 그룹이 비어있을 때도 드롭 영역 제공 */}
              {group.lists.length === 0 && (
                <div className="h-8 w-full rounded" />
              )}

              {group.lists.map((list) => (
                <div key={list.id} className="relative">
                  {/* 그룹 내 목록 위쪽 드롭 인디케이터 */}
                  {dropIndicator?.type === "line" &&
                    dropIndicator?.targetId === list.id &&
                    dropIndicator?.position === "above" && (
                      <DropIndicator
                        type="line"
                        position="above"
                        nested={true}
                      />
                    )}

                  <DraggableSidebarItem
                    id={list.id}
                    name={list.name}
                    count={list.count}
                    colorDot="bg-orange-400"
                    isSelected={isSelected(list.id)}
                    onClick={() => onFilterChange(list.id)}
                    isNested={true}
                    isDraggable={true}
                  />

                  {/* 그룹 내 목록 아래쪽 드롭 인디케이터 */}
                  {dropIndicator?.type === "line" &&
                    dropIndicator?.targetId === list.id &&
                    dropIndicator?.position === "below" && (
                      <DropIndicator
                        type="line"
                        position="below"
                        nested={true}
                      />
                    )}
                </div>
              ))}
            </SortableContext>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

// 드래그 가능한 그룹 컴포넌트
function DraggableSidebarGroup({
  group,
  isExpanded,
  onToggle,
  onFilterChange,
  isSelected,
  onDelete,
  dropIndicator,
}: SidebarGroupProps & {
  dropIndicator: {
    type: "line" | "group";
    position?: "above" | "below";
    targetId?: string;
    groupId?: string;
  } | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: group.id,
  });

  const style = {};

  return (
    <div className={cn(isDragging && "opacity-50")}>
      <DroppableGroup
        group={group}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onFilterChange={onFilterChange}
        isSelected={isSelected}
        onDelete={onDelete}
        dropIndicator={dropIndicator}
        // 드래그 속성을 DroppableGroup에 전달
        dragAttributes={attributes}
        dragListeners={listeners}
        dragRef={setNodeRef}
      />
    </div>
  );
}

// 기존 함수명 유지를 위한 래퍼
function SidebarGroup(
  props: SidebarGroupProps & {
    dropIndicator: {
      type: "line" | "group";
      position?: "above" | "below";
      targetId?: string;
      groupId?: string;
    } | null;
  }
) {
  return <DraggableSidebarGroup {...props} />;
}

// 드롭 인디케이터 컴포넌트
function DropIndicator({
  type,
  position,
  nested = false,
}: {
  type: "line" | "group";
  position?: "above" | "below";
  nested?: boolean; // 그룹 내부에서 들여쓰기 적용할지 여부
}) {
  if (type === "line") {
    return (
      <div
        className={cn(
          "absolute right-0 h-0.5 bg-blue-500 z-10",
          position === "above" ? "-top-0.5" : "-bottom-0.5",
          nested ? "left-10" : "left-0" // 그룹 내부면 pl-10에 맞춰 left-10 적용
        )}
      />
    );
  }

  if (type === "group") {
    return (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 z-10" />
    );
  }

  return null;
}

// 개별 목록 영역을 위한 드롭 가능한 컴포넌트
function DroppableIndividualArea({
  individualLists,
  isSelected,
  onFilterChange,
  dropIndicator,
}: {
  individualLists: Array<{
    id: string;
    name: string;
    count: number;
    colorDot: string;
  }>;
  isSelected: (filterId: string) => boolean;
  onFilterChange: (filter: SidebarFilter) => void;
  dropIndicator: {
    type: "line" | "group";
    position?: "above" | "below";
    targetId?: string;
    groupId?: string;
  } | null;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: "individual-area",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "transition-colors rounded relative",
        isOver && "bg-blue-50"
      )}
    >
      <SortableContext items={individualLists.map((list) => list.id)}>
        {individualLists.map((list) => (
          <div key={list.id} className="relative">
            {/* 위쪽 드롭 인디케이터 */}
            {dropIndicator?.type === "line" &&
              dropIndicator?.targetId === list.id &&
              dropIndicator?.position === "above" && (
                <DropIndicator type="line" position="above" />
              )}

            <DraggableSidebarItem
              id={list.id}
              name={list.name}
              count={list.count}
              colorDot={list.colorDot}
              isSelected={isSelected(list.id)}
              onClick={() => onFilterChange(list.id)}
              isDraggable={true}
            />

            {/* 아래쪽 드롭 인디케이터 */}
            {dropIndicator?.type === "line" &&
              dropIndicator?.targetId === list.id &&
              dropIndicator?.position === "below" && (
                <DropIndicator type="line" position="below" />
              )}
          </div>
        ))}
      </SortableContext>

      {/* 빈 영역에 드롭할 때도 별도 표시 없이 처리 */}
    </div>
  );
}

export function Sidebar({
  selectedFilter,
  onFilterChange,
  onToggleSidebar,
  className,
}: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["work", "personal"])
  );
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const newGroupInputRef = useRef<HTMLInputElement>(null);
  const [newListName, setNewListName] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    type: "line" | "group";
    position?: "above" | "below";
    targetId?: string;
    groupId?: string;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 110, // 300ms 이상 눌러야 드래그 시작 (길게 누르기)
        tolerance: 5, // 5픽셀 허용 오차
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 샘플 데이터 - state로 변경하여 드래그 앤 드롭으로 변경할 수 있게 함
  const [groups, setGroups] = useState<SidebarGroup[]>([
    {
      id: "work",
      name: "공부",
      icon: "folder",
      isExpanded: expandedGroups.has("work"),
      lists: [
        { id: "development", name: "개발", count: 7, groupId: "work" },
        { id: "db", name: "DB", count: 2, groupId: "work" },
        { id: "cloud", name: "Cloud", count: 4, groupId: "work" },
        { id: "korean", name: "기획", count: 2, groupId: "work" },
        { id: "design", name: "디자인", count: 1, groupId: "work" },
      ],
    },
    {
      id: "personal",
      name: "자기개발",
      icon: "users",
      isExpanded: expandedGroups.has("personal"),
      lists: [
        { id: "reading", name: "독서", count: 6, groupId: "personal" },
        { id: "writing", name: "글쓰기", count: 1, groupId: "personal" },
      ],
    },
  ]);

  const [individualLists, setIndividualLists] = useState([
    { id: "ideas", name: "아이디어", count: 5, colorDot: "bg-blue-400" },
    {
      id: "shopping",
      name: "시가시 청자와할 물건",
      count: 3,
      colorDot: "bg-gray-400",
    },
    { id: "daily", name: "나중에 할 일", count: 1, colorDot: "bg-red-400" },
  ]);

  // 그룹과 개별 목록을 하나의 정렬 가능한 배열로 통합
  const [sortableItems, setSortableItems] = useState([
    { id: "ideas", type: "list" as const },
    { id: "shopping", type: "list" as const },
    { id: "daily", type: "list" as const },
    { id: "work", type: "group" as const },
    { id: "personal", type: "group" as const },
  ]);

  const systemItems = [
    { id: "today", name: "오늘 할 일", icon: Sun, count: 5 },
    { id: "important", name: "중요", icon: Star, count: 3 },
    { id: "tasks", name: "작업", icon: CheckSquare, count: 12 },
  ];

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
  };

  const isSelected = (filterId: string) => selectedFilter === filterId;

  const handleAddGroup = () => {
    setIsAddingGroup(true);
  };

  useEffect(() => {
    if (isAddingGroup && newGroupInputRef.current) {
      // 애니메이션이 완료된 후 포커스
      setTimeout(() => {
        newGroupInputRef.current?.focus();
      }, 100);
    }
  }, [isAddingGroup]);

  const handleSaveGroup = () => {
    if (newGroupName.trim()) {
      // 여기에 실제 그룹 추가 로직이 들어갈 예정
      setNewGroupName("");
    }
    setIsAddingGroup(false);
  };

  const handleCancelAddGroup = () => {
    setNewGroupName("");
    setIsAddingGroup(false);
  };

  const handleInputBlur = () => {
    // 입력값이 있으면 저장, 없으면 취소
    if (newGroupName.trim()) {
      handleSaveGroup();
    } else {
      handleCancelAddGroup();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveGroup();
    } else if (e.key === "Escape") {
      handleCancelAddGroup();
    }
  };

  const handleListBlur = () => {
    setNewListName("");
  };

  const handleDeleteGroup = (groupId: string) => {
    // 실제 그룹 해제 로직은 나중에 구현
    console.log(`그룹 해제 예정 - GroupID: ${groupId}`);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setDropIndicator(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      setDropIndicator(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    console.log('DragOver:', { activeId, overId }); // 디버깅용

    // 같은 아이템이면 무시
    if (activeId === overId) {
      setDropIndicator(null);
      return;
    }

    // 메인 영역에서 그룹/목록 간 순서 변경 감지
    const activeItem = sortableItems.find(item => item.id === activeId);
    const overItem = sortableItems.find(item => item.id === overId);

    if (activeItem && overItem) {
      console.log('Main area drop:', { activeItem, overItem }); // 디버깅용
      // 메인 영역에서의 순서 변경
      setDropIndicator({
        type: "line",
        targetId: overId,
        position: "above",
      });
      return;
    }

    // 기존 로직 유지 (그룹 내부 드롭 등)
    const overGroupId =
      overId.startsWith("group-") && !overId.startsWith("group-top-") && !overId.startsWith("group-header-")
        ? overId.replace("group-", "")
        : null;
    const overGroup = overGroupId
      ? groups.find((group) => group.id === overGroupId)
      : null;

    const overGroupTopId = overId.startsWith("group-top-")
      ? overId.replace("group-top-", "")
      : null;

    // 그룹 헤더 드롭 감지
    const overGroupHeaderId = overId.startsWith("group-header-")
      ? overId.replace("group-header-", "")
      : null;

    const overIndividual = individualLists.find((list) => list.id === overId);
    const overGroupItem = groups
      .flatMap((g) => g.lists)
      .find((list) => list.id === overId);

    if (overGroupTopId) {
      setDropIndicator({
        type: "line",
        targetId: `group-top-${overGroupTopId}`,
      });
    } else if (overGroupHeaderId) {
      console.log('Group header drop:', overGroupHeaderId); // 디버깅용
      // 그룹 헤더에 드롭하는 경우 - 그룹 위치에서 순서 변경
      setDropIndicator({
        type: "line",
        targetId: overGroupHeaderId,
        position: "above",
      });
    } else if (overGroup) {
      setDropIndicator(null);
    } else if (overIndividual) {
      setDropIndicator({
        type: "line",
        targetId: overIndividual.id,
        position: "above",
      });
    } else if (overGroupItem) {
      setDropIndicator({
        type: "line",
        targetId: overGroupItem.id,
        position: "above",
      });
    } else {
      setDropIndicator(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setDropIndicator(null);

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // 같은 위치로 드롭하면 무시
    if (activeId === overId) {
      setActiveId(null);
      return;
    }

    // 메인 영역에서 그룹/목록 간 순서 변경 처리
    const activeItem = sortableItems.find(item => item.id === activeId);
    let overItem = sortableItems.find(item => item.id === overId);

    // 그룹 헤더 드롭인 경우 처리
    if (!overItem && overId.startsWith("group-header-")) {
      const groupId = overId.replace("group-header-", "");
      overItem = sortableItems.find(item => item.id === groupId);
      console.log('Group header drag end:', { groupId, overItem }); // 디버깅용
    }

    if (activeItem && overItem) {
      console.log('Executing main area reorder:', { activeItem, overItem }); // 디버깅용
      const activeIndex = sortableItems.findIndex(item => item.id === activeId);
      const overIndex = sortableItems.findIndex(item => item.id === overItem.id);

      setSortableItems(prev => {
        const newItems = [...prev];
        const [removed] = newItems.splice(activeIndex, 1);
        newItems.splice(overIndex, 0, removed);
        console.log('New order:', newItems); // 디버깅용
        return newItems;
      });

      setActiveId(null);
      return;
    }

    // 활성 아이템이 어떤 그룹에 있는지 확인
    const activeGroup = groups.find((group) =>
      group.lists.some((list) => list.id === activeId)
    );
    const activeIndividual = individualLists.find(
      (list) => list.id === activeId
    );

    // 드롭 타겟 분석 - 단순화
    const overGroupId =
      overId.startsWith("group-") && !overId.startsWith("group-top-")
        ? overId.replace("group-", "")
        : null;
    const overGroup = overGroupId
      ? groups.find((group) => group.id === overGroupId)
      : null;

    // 그룹 상단 드롭 영역인지 확인
    const overGroupTopId = overId.startsWith("group-top-")
      ? overId.replace("group-top-", "")
      : null;

    // 드롭 타겟이 개별 아이템인지 확인
    const overIndividual = individualLists.find((list) => list.id === overId);
    const overGroupItem = groups
      .flatMap((g) => g.lists)
      .find((list) => list.id === overId);

    // 개별 영역으로 드롭하는 경우 확인
    const isOverIndividualArea = overId === "individual-area";

    if (overGroupTopId) {
      // 그룹 헤더 바로 위에 드롭하는 경우
      if (activeIndividual) {
        // 개별 아이템을 그룹 위쪽 개별 영역으로 이동 (일단 맨 끝에 추가)
        setIndividualLists((prev) => {
          const filtered = prev.filter((list) => list.id !== activeId);
          return [...filtered, activeIndividual];
        });
      } else if (activeGroup) {
        // 그룹 내 아이템을 그룹 위쪽 개별 영역으로 이동
        const activeItem = activeGroup.lists.find(
          (list) => list.id === activeId
        );
        if (activeItem) {
          // 그룹에서 제거
          setGroups((prev) =>
            prev.map((group) => {
              if (group.id === activeGroup.id) {
                return {
                  ...group,
                  lists: group.lists.filter((list) => list.id !== activeId),
                };
              }
              return group;
            })
          );

          // 개별 목록에 추가 (그룹 앞 위치)
          setIndividualLists((prev) => {
            const newItem = {
              id: activeItem.id,
              name: activeItem.name,
              count: activeItem.count,
              colorDot: "bg-blue-400",
            };

            // 일단 맨 끝에 추가 (나중에 정확한 위치 계산 로직 추가 가능)
            return [...prev, newItem];
          });
        }
      }
    } else if (overGroup) {
      // 그룹에 드롭하는 경우
      if (activeGroup && activeGroup.id !== overGroup.id) {
        // 그룹 간 이동
        const activeItem = activeGroup.lists.find(
          (list) => list.id === activeId
        );
        if (activeItem) {
          setGroups((prev) =>
            prev.map((group) => {
              if (group.id === activeGroup.id) {
                return {
                  ...group,
                  lists: group.lists.filter((list) => list.id !== activeId),
                };
              }
              if (group.id === overGroup.id) {
                return {
                  ...group,
                  lists: [
                    ...group.lists,
                    { ...activeItem, groupId: overGroup.id },
                  ],
                };
              }
              return group;
            })
          );
        }
      } else if (activeIndividual) {
        // 개별 아이템을 그룹으로 이동
        setIndividualLists((prev) =>
          prev.filter((list) => list.id !== activeId)
        );
        setGroups((prev) =>
          prev.map((group) => {
            if (group.id === overGroup.id) {
              return {
                ...group,
                lists: [
                  ...group.lists,
                  {
                    id: activeIndividual.id,
                    name: activeIndividual.name,
                    count: activeIndividual.count,
                    groupId: overGroup.id,
                  },
                ],
              };
            }
            return group;
          })
        );
      }
    } else if (isOverIndividualArea && activeGroup) {
      // 그룹 내 아이템을 개별 영역으로 이동
      const activeItem = activeGroup.lists.find((list) => list.id === activeId);
      if (activeItem) {
        setGroups((prev) =>
          prev.map((group) => {
            if (group.id === activeGroup.id) {
              return {
                ...group,
                lists: group.lists.filter((list) => list.id !== activeId),
              };
            }
            return group;
          })
        );

        setIndividualLists((prev) => [
          ...prev,
          {
            id: activeItem.id,
            name: activeItem.name,
            count: activeItem.count,
            colorDot: "bg-blue-400",
          },
        ]);
      }
    } else if (overIndividual && activeGroup) {
      // 그룹 내 아이템을 개별 아이템 영역으로 이동
      const activeItem = activeGroup.lists.find((list) => list.id === activeId);
      if (activeItem) {
        // 그룹에서 제거
        setGroups((prev) =>
          prev.map((group) => {
            if (group.id === activeGroup.id) {
              return {
                ...group,
                lists: group.lists.filter((list) => list.id !== activeId),
              };
            }
            return group;
          })
        );

        // 개별 목록에 추가
        const overIndex = individualLists.findIndex(
          (list) => list.id === overId
        );
        setIndividualLists((prev) => {
          const newList = [...prev];
          newList.splice(overIndex, 0, {
            id: activeItem.id,
            name: activeItem.name,
            count: activeItem.count,
            colorDot: "bg-blue-400",
          });
          return newList;
        });
      }
    } else if (activeIndividual && overIndividual) {
      // 개별 아이템들 간의 순서 변경
      const activeIndex = individualLists.findIndex(
        (list) => list.id === activeId
      );
      const overIndex = individualLists.findIndex((list) => list.id === overId);

      setIndividualLists((prev) => {
        const newList = [...prev];
        const [removed] = newList.splice(activeIndex, 1);
        newList.splice(overIndex, 0, removed);
        return newList;
      });
    } else if (activeIndividual && overGroupItem) {
      // 개별 아이템을 그룹 내 특정 위치로 이동
      const targetGroup = groups.find((g) =>
        g.lists.some((l) => l.id === overId)
      );
      if (targetGroup) {
        const overIndex = targetGroup.lists.findIndex(
          (list) => list.id === overId
        );

        setIndividualLists((prev) =>
          prev.filter((list) => list.id !== activeId)
        );
        setGroups((prev) =>
          prev.map((group) => {
            if (group.id === targetGroup.id) {
              const newLists = [...group.lists];
              newLists.splice(overIndex, 0, {
                id: activeIndividual.id,
                name: activeIndividual.name,
                count: activeIndividual.count,
                groupId: targetGroup.id,
              });
              return { ...group, lists: newLists };
            }
            return group;
          })
        );
      }
    } else if (activeGroup && overGroupItem) {
      // 그룹 내에서의 순서 변경 또는 그룹 간 이동
      const targetGroup = groups.find((g) =>
        g.lists.some((l) => l.id === overId)
      );
      if (targetGroup) {
        const activeItem = activeGroup.lists.find(
          (list) => list.id === activeId
        );
        const overIndex = targetGroup.lists.findIndex(
          (list) => list.id === overId
        );

        if (activeItem) {
          if (activeGroup.id === targetGroup.id) {
            // 같은 그룹 내 순서 변경
            const activeIndex = activeGroup.lists.findIndex(
              (list) => list.id === activeId
            );
            setGroups((prev) =>
              prev.map((group) => {
                if (group.id === activeGroup.id) {
                  const newLists = [...group.lists];
                  const [removed] = newLists.splice(activeIndex, 1);
                  newLists.splice(overIndex, 0, removed);
                  return { ...group, lists: newLists };
                }
                return group;
              })
            );
          } else {
            // 다른 그룹으로 이동
            setGroups((prev) =>
              prev.map((group) => {
                if (group.id === activeGroup.id) {
                  return {
                    ...group,
                    lists: group.lists.filter((list) => list.id !== activeId),
                  };
                }
                if (group.id === targetGroup.id) {
                  const newLists = [...group.lists];
                  newLists.splice(overIndex, 0, {
                    ...activeItem,
                    groupId: targetGroup.id,
                  });
                  return { ...group, lists: newLists };
                }
                return group;
              })
            );
          }
        }
      }
    }

    setActiveId(null);
  };

  return (
    <TooltipProvider>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
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

          <div className="space-y-1">
            {/* System Items */}
            {systemItems.map((item) => (
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

            {/* User Lists and Groups - 통합된 정렬 가능한 영역 */}
            <div className="space-y-1">
              <SortableContext items={sortableItems.map(item => item.id)}>
                {sortableItems.map((item) => {
                  // 드롭 인디케이터 확인
                  const showIndicatorAbove = dropIndicator?.type === 'line' && 
                                           dropIndicator?.targetId === item.id && 
                                           dropIndicator?.position === 'above';
                  const showIndicatorBelow = dropIndicator?.type === 'line' && 
                                           dropIndicator?.targetId === item.id && 
                                           dropIndicator?.position === 'below';

                  if (item.type === "list") {
                    const listData = individualLists.find(list => list.id === item.id);
                    if (!listData) return null;
                    
                    return (
                      <div key={item.id} className="relative">
                        {showIndicatorAbove && <DropIndicator type="line" position="above" />}
                        <DraggableSidebarItem
                          id={listData.id}
                          name={listData.name}
                          count={listData.count}
                          colorDot={listData.colorDot}
                          isSelected={isSelected(listData.id)}
                          onClick={() => onFilterChange(listData.id)}
                          isDraggable={true}
                        />
                        {showIndicatorBelow && <DropIndicator type="line" position="below" />}
                      </div>
                    );
                  } else if (item.type === "group") {
                    const groupData = groups.find(group => group.id === item.id);
                    if (!groupData) return null;
                    
                    return (
                      <div key={item.id} className="relative">
                        {showIndicatorAbove && <DropIndicator type="line" position="above" />}
                        <SidebarGroup
                          group={groupData}
                          isExpanded={expandedGroups.has(groupData.id)}
                          onToggle={() => toggleGroup(groupData.id)}
                          onFilterChange={onFilterChange}
                          isSelected={isSelected}
                          onDelete={() => handleDeleteGroup(groupData.id)}
                          dropIndicator={dropIndicator}
                        />
                        {showIndicatorBelow && <DropIndicator type="line" position="below" />}
                      </div>
                    );
                  }
                  return null;
                })}
              </SortableContext>

              {/* Add Actions */}
              <div className="space-y-2 pt-2 pb-4">
                {/* Group Add Input - appears above buttons */}
                <div
                  className={cn(
                    "px-4 transition-all duration-200",
                    isAddingGroup
                      ? "opacity-100 max-h-10"
                      : "opacity-0 max-h-0 overflow-hidden"
                  )}
                >
                  <div className="flex items-center gap-2 py-1.5">
                    <Folder className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <input
                      ref={newGroupInputRef}
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      onKeyDown={handleKeyPress}
                      onBlur={handleInputBlur}
                      placeholder="새 그룹 이름"
                      className="flex-1 h-auto p-0 text-sm bg-transparent border-none outline-none placeholder:text-gray-400"
                      autoFocus={isAddingGroup}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded hover:bg-blue-50 transition-colors overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 min-w-0">
                      <Plus className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        onBlur={handleListBlur}
                        placeholder="새 목록"
                        className="flex-1 min-w-0 text-sm text-gray-900 bg-transparent border-none outline-none placeholder:text-blue-600 cursor-text"
                      />
                    </div>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="rounded cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={handleAddGroup}
                      >
                        <div className="px-4 py-2">
                          <FolderPlus className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>그룹 만들기</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DragOverlay>
          {/* 마우스 감지를 위해 투명한 요소 유지 */}
          {activeId ? (
            <div
              className="w-4 h-4 opacity-0 pointer-events-none"
              style={{ background: "transparent" }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </TooltipProvider>
  );
}
