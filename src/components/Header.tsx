import { Search, Calendar, CheckSquare, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";

interface HeaderProps {
  currentPage?: "todo" | "calendar";
  onPageChange?: (page: "todo" | "calendar") => void;
  onSearch?: (query: string) => void;
}

export function Header({
  currentPage = "todo",
  onPageChange,
  onSearch,
}: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <CheckSquare className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">ToDo List</h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="작업 검색..."
              className="pl-10"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Navigation Menu */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onPageChange?.("todo");
                navigate("/todo");
              }}
              className={`h-9 w-9 p-0 ${
                currentPage === "todo"
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onPageChange?.("calendar");
                navigate("/calendar");
              }}
              className={`h-9 w-9 p-0 ${
                currentPage === "calendar"
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>

          {/* User Avatar & Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="https://ui.shadcn.com/avatars/shadcn.jpg"
                    alt="사용자"
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://ui.shadcn.com/avatars/shadcn.jpg"
                      alt="사용자"
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">사용자 이름</p>
                    <p className="text-xs text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4 " />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
