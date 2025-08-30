import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Folder, FolderPlus, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AddActionsProps {
  onAddGroup?: (name: string) => void;
  onAddList?: (name: string) => void;
}

export function AddActions({ onAddGroup, onAddList }: AddActionsProps) {
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newListName, setNewListName] = useState("");
  const newGroupInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingGroup && newGroupInputRef.current) {
      // 애니메이션이 완료된 후 포커스
      setTimeout(() => {
        newGroupInputRef.current?.focus();
      }, 100);
    }
  }, [isAddingGroup]);

  const handleAddGroup = () => {
    setIsAddingGroup(true);
  };

  const handleSaveGroup = () => {
    if (newGroupName.trim()) {
      onAddGroup?.(newGroupName.trim());
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
    if (newListName.trim()) {
      onAddList?.(newListName.trim());
    }
    setNewListName("");
  };

  const handleListKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (newListName.trim()) {
        onAddList?.(newListName.trim());
      }
      setNewListName("");
    }
  };

  return (
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
              onKeyDown={handleListKeyPress}
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
  );
}