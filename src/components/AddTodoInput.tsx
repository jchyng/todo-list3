import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface AddTodoInputProps {
  onAddTodo: (title: string) => void
  className?: string
}

export function AddTodoInput({ onAddTodo, className }: AddTodoInputProps) {
  const [title, setTitle] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddTodo(title.trim())
      setTitle('')
      setIsExpanded(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      setTitle('')
      setIsExpanded(false)
    }
  }

  const handleBlur = () => {
    if (!title.trim()) {
      setIsExpanded(false)
    }
  }

  if (isExpanded) {
    return (
      <div className={cn(
        "flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors",
        className
      )}>
        <Checkbox 
          className="h-5 w-5 rounded-full opacity-50" 
          disabled 
        />
        <form onSubmit={handleSubmit} className="flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder="작업 제목을 입력하세요..."
            className="border-0 p-0 text-sm bg-transparent focus:ring-0 focus:border-0 w-full"
            autoFocus
          />
        </form>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      onClick={() => setIsExpanded(true)}
      className={cn(
        "w-full justify-start gap-2 p-4 h-auto text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-lg",
        className
      )}
    >
      <Plus className="h-4 w-4" />
      <span className="text-sm">작업 추가</span>
    </Button>
  )
}