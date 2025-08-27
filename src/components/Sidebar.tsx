import { useState } from "react";
import {
  Sun,
  Star,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Plus,
  Folder,
  FolderOpen,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { SidebarGroup, SidebarFilter } from "@/types/sidebar";

interface SidebarProps {
  selectedFilter: SidebarFilter;
  onFilterChange: (filter: SidebarFilter) => void;
  className?: string;
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

  return (
    <div
      className={cn(
        "w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col",
        className
      )}
    >
      <div className="p-4 space-y-1">
        {/* System Items */}
        {systemItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onFilterChange(item.id as SidebarFilter)}
              className={cn(
                "flex items-center justify-between px-2 py-2 rounded cursor-pointer hover:bg-gray-100 transition-colors",
                isSelected(item.id) && "bg-blue-100 text-blue-700"
              )}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm truncate">{item.name}</span>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {item.count}
              </span>
            </div>
          );
        })}
        <div className="h-4" /> {/* Spacing */}
        {/* User Lists and Groups */}
        <div className="space-y-1">
          {/* Individual Lists */}
          <div
            onClick={() => onFilterChange("ideas")}
            className={cn(
              "flex items-center justify-between px-2 py-2 rounded cursor-pointer hover:bg-gray-100 transition-colors",
              isSelected("ideas") && "bg-blue-100 text-blue-700"
            )}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-3 h-3 bg-blue-400 rounded-full flex-shrink-0" />
              <span className="text-sm truncate">아이디어</span>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">5</span>
          </div>

          <div
            onClick={() => onFilterChange("shopping")}
            className={cn(
              "flex items-center justify-between px-2 py-2 rounded cursor-pointer hover:bg-gray-100 transition-colors",
              isSelected("shopping") && "bg-blue-100 text-blue-700"
            )}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0" />
              <span className="text-sm truncate">시가시 청자와할 물건</span>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">3</span>
          </div>

          <div
            onClick={() => onFilterChange("daily")}
            className={cn(
              "flex items-center justify-between px-2 py-2 rounded cursor-pointer hover:bg-gray-100 transition-colors",
              isSelected("daily") && "bg-blue-100 text-blue-700"
            )}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-3 h-3 bg-red-400 rounded-full flex-shrink-0" />
              <span className="text-sm truncate">나중에 할 일</span>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">1</span>
          </div>

          {/* Groups */}
          {groups.map((group) => (
            <Collapsible
              key={group.id}
              open={expandedGroups.has(group.id)}
              onOpenChange={() => toggleGroup(group.id)}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between w-full px-2 py-2 rounded cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 flex-1">
                    {expandedGroups.has(group.id) ? (
                      <FolderOpen className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Folder className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="text-sm font-medium">{group.name}</span>
                  </div>
                  {expandedGroups.has(group.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-1">
                {group.lists.map((list) => (
                  <div
                    key={list.id}
                    onClick={() => onFilterChange(list.id)}
                    className={cn(
                      "flex items-center justify-between px-2 py-2 ml-6 rounded cursor-pointer hover:bg-gray-100 transition-colors",
                      isSelected(list.id) && "bg-blue-100 text-blue-700"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-3 h-3 bg-orange-400 rounded-full flex-shrink-0" />
                      <span className="text-sm truncate">{list.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {list.count}
                    </span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}

          {/* Add Actions */}
          <div className="space-y-2 pt-2">
            {/* Group Add Input - appears above buttons */}
            <div
              className={cn(
                "flex items-center gap-2 px-2 transition-all duration-200",
                isAddingGroup
                  ? "opacity-100 max-h-10"
                  : "opacity-0 max-h-0 overflow-hidden"
              )}
            >
              <FolderOpen className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleInputBlur}
                placeholder="새 그룹 이름"
                className="flex-1 h-8 text-sm"
                autoFocus={isAddingGroup}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="flex-1 justify-start gap-2 p-2 h-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">새 목록</span>
              </Button>

              <Button
                variant="ghost"
                className="p-2 h-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={handleAddGroup}
              >
                <FolderPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
