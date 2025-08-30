import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Star, Calendar, Clock, CheckCircle, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export type SortField = 
  | 'priority' 
  | 'dueDate' 
  | 'created'
  | 'title'
  | 'status';

export type SortDirection = 'asc' | 'desc';

interface SortDropdownProps {
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSortChange: (field: SortField | null, direction: SortDirection) => void;
}

export function SortDropdown({ sortField, sortDirection, onSortChange }: SortDropdownProps) {
  const getSortLabel = (field: SortField): string => {
    switch (field) {
      case 'priority':
        return '중요도';
      case 'dueDate':
        return '기한';
      case 'created':
        return '만든 날짜';
      case 'title':
        return '제목';
      case 'status':
        return '상태';
      default:
        return '';
    }
  };

  const getSortIcon = (field: SortField) => {
    switch (field) {
      case 'priority':
        return <Star className="h-4 w-4" />;
      case 'dueDate':
        return <Calendar className="h-4 w-4" />;
      case 'created':
        return <Clock className="h-4 w-4" />;
      case 'status':
        return <CheckCircle className="h-4 w-4" />;
      case 'title':
        return <ArrowUpDown className="h-4 w-4" />;
      default:
        return <ArrowUpDown className="h-4 w-4" />;
    }
  };

  const toggleDirection = () => {
    if (sortField) {
      onSortChange(sortField, sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  const clearSort = () => {
    onSortChange(null, 'asc');
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {/* 정렬 드롭다운 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost" 
            size="sm"
            className="h-8 gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="h-4 w-4" />
            정렬
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>정렬 기준</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup 
            value={sortField || ''} 
            onValueChange={(val) => onSortChange(val as SortField, sortDirection)}
          >
            <DropdownMenuRadioItem value="priority">
              <Star className="h-4 w-4" />
              중요도
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dueDate">
              <Calendar className="h-4 w-4" />
              기한
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="created">
              <Clock className="h-4 w-4" />
              만든 날짜
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="title">
              제목
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="status">
              <CheckCircle className="h-4 w-4" />
              상태
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 선택된 정렬 기준 표시 */}
      {sortField && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDirection}
            className="h-6 w-6 p-0 hover:bg-accent"
            title={sortDirection === 'asc' ? '내림차순으로 변경' : '오름차순으로 변경'}
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
          </Button>
          
          <span className="text-xs">
            {getSortLabel(sortField)}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSort}
            className="h-6 w-6 p-0 hover:bg-accent"
            title="정렬 제거"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}