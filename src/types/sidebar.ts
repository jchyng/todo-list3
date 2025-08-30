export interface SidebarList {
  id: string
  name: string
  icon?: string
  count: number
  groupId?: string
  colorDot?: string
}

export interface SidebarGroup {
  id: string
  name: string
  icon?: string
  lists: SidebarList[]
  isExpanded: boolean
}

export interface SidebarItem {
  id: string
  name: string
  icon: string
  count?: number
  type: 'system' | 'list' | 'group'
  isSystem?: boolean
}

export type SidebarFilter = 'today' | 'important' | 'tasks' | string