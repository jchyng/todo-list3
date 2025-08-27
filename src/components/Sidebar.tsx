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
  FolderOpen,
  FolderPlus,
  Plus,
  Star,
  Sun,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SidebarProps {
  selectedFilter: SidebarFilter;
  onFilterChange: (filter: SidebarFilter) => void;
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
}

function SidebarItem({
  id,
  name,
  count,
  icon: Icon,
  colorDot,
  isSelected,
  onClick,
  isNested = false,
}: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full rounded cursor-pointer hover:bg-gray-100 transition-colors relative",
        isSelected && "bg-blue-100 text-blue-700"
      )}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-blue-600" />
      )}
      <div
        className={cn(
          "flex items-center justify-between py-2",
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
}

export function Sidebar({
  selectedFilter,
  onFilterChange,
  className,
}: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["work", "personal"])
  );
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newListName, setNewListName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 샘플 데이터
  const groups: SidebarGroup[] = [
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
  ];

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
    if (isAddingGroup && inputRef.current) {
      // 애니메이션이 완료된 후 포커스
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAddingGroup]);

  const handleSaveGroup = () => {
    if (newGroupName.trim()) {
      // 여기에 실제 그룹 추가 로직이 들어갈 예정
      console.log("새 그룹 추가:", newGroupName);
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

  return (
    <TooltipProvider>
      <div
        className={cn(
          "w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col",
          className
        )}
      >
        <div className="space-y-1">
          {/* System Items */}
          <div className="pt-4" />
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
          <div className="h-4" /> {/* Spacing */}
          {/* User Lists and Groups */}
          <div className="space-y-1">
            {/* Individual Lists */}
            <SidebarItem
              id="ideas"
              name="아이디어"
              count={5}
              colorDot="bg-blue-400"
              isSelected={isSelected("ideas")}
              onClick={() => onFilterChange("ideas")}
            />

            <SidebarItem
              id="shopping"
              name="시가시 청자와할 물건"
              count={3}
              colorDot="bg-gray-400"
              isSelected={isSelected("shopping")}
              onClick={() => onFilterChange("shopping")}
            />

            <SidebarItem
              id="daily"
              name="나중에 할 일"
              count={1}
              colorDot="bg-red-400"
              isSelected={isSelected("daily")}
              onClick={() => onFilterChange("daily")}
            />

            {/* Groups */}
            {groups.map((group) => (
              <Collapsible
                key={group.id}
                open={expandedGroups.has(group.id)}
                onOpenChange={() => toggleGroup(group.id)}
              >
                <CollapsibleTrigger asChild>
                  <div className="w-full rounded cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between px-4 py-2">
                      <div className="flex items-center gap-2 flex-1">
                        {expandedGroups.has(group.id) ? (
                          <FolderOpen className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Folder className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-sm font-medium">
                          {group.name}
                        </span>
                      </div>
                      {expandedGroups.has(group.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-1">
                  {group.lists.map((list) => (
                    <SidebarItem
                      key={list.id}
                      id={list.id}
                      name={list.name}
                      count={list.count}
                      colorDot="bg-orange-400"
                      isSelected={isSelected(list.id)}
                      onClick={() => onFilterChange(list.id)}
                      isNested={true}
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}

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
    </TooltipProvider>
  );
}
