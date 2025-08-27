import { useState } from "react"
import { Header } from "@/components/Header"

export function CalendarPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="min-h-screen bg-background mx-auto max-w-7xl">
      <Header
        currentPage="calendar"
        onPageChange={() => {}}
        onSearch={handleSearch}
      />
      <main className="p-4">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Calendar</h2>
          {searchQuery && (
            <p className="text-sm text-muted-foreground">
              검색: "{searchQuery}"
            </p>
          )}
          {/* Calendar content will be added here */}
          <div className="text-center text-muted-foreground py-8">
            캘린더 기능이 곧 추가될 예정입니다.
          </div>
        </div>
      </main>
    </div>
  )
}