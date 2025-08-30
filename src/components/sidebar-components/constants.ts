import { CheckSquare, Star, Sun } from "lucide-react";
import type { SidebarItemType } from "./types";

export const SYSTEM_ITEMS = [
  { id: "today", name: "오늘 할 일", icon: Sun, count: 5 },
  { id: "important", name: "중요", icon: Star, count: 3 },
  { id: "tasks", name: "작업", icon: CheckSquare, count: 12 },
];

export const INITIAL_SIDEBAR_ITEMS: SidebarItemType[] = [
  { 
    type: 'list', 
    data: { id: "ideas", name: "아이디어", count: 5, colorDot: "bg-blue-400" }, 
    sortOrder: 1 
  },
  { 
    type: 'group', 
    data: {
      id: "work",
      name: "공부",
      icon: "folder",
      isExpanded: true,
      lists: [
        { id: "development", name: "개발", count: 7, groupId: "work", colorDot: "bg-green-400" },
        { id: "db", name: "DB", count: 2, groupId: "work", colorDot: "bg-purple-400" },
        { id: "cloud", name: "Cloud", count: 4, groupId: "work", colorDot: "bg-sky-400" },
        { id: "korean", name: "기획", count: 2, groupId: "work", colorDot: "bg-yellow-400" },
        { id: "design", name: "디자인", count: 1, groupId: "work", colorDot: "bg-pink-400" },
      ],
    },
    sortOrder: 2 
  },
  { 
    type: 'list', 
    data: { 
      id: "shopping", 
      name: "시가시 청자와할 물건", 
      count: 3, 
      colorDot: "bg-gray-400" 
    }, 
    sortOrder: 3 
  },
  { 
    type: 'group', 
    data: {
      id: "personal",
      name: "자기개발",
      icon: "users",
      isExpanded: true,
      lists: [
        { id: "reading", name: "독서", count: 6, groupId: "personal", colorDot: "bg-indigo-400" },
        { id: "writing", name: "글쓰기", count: 1, groupId: "personal", colorDot: "bg-orange-400" },
      ],
    },
    sortOrder: 4 
  },
  { 
    type: 'list', 
    data: { id: "daily", name: "나중에 할 일", count: 1, colorDot: "bg-red-400" }, 
    sortOrder: 5 
  },
];

export const INITIAL_EXPANDED_GROUPS = new Set(["work", "personal"]);

export const DND_SENSOR_CONFIG = {
  activationConstraint: {
    distance: 3,
    tolerance: 5,
  },
};