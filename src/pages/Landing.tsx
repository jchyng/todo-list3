import { CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function Landing() {
  const navigate = useNavigate()

  const handleGoogleLogin = () => {
    // TODO: Google 로그인 구현
    // 임시로 todo 페이지로 이동
    navigate("/todo")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ToDo List</h1>
          </div>
          <Button onClick={handleGoogleLogin} className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 로그인
          </Button>
        </header>

        {/* Hero Section */}
        <main className="flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center space-y-8 px-4">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                할 일을 스마트하게
                <br />
                관리하세요
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                효율적인 작업 관리와 일정 계획을 위한 올인원 솔루션입니다.
                <br />
                할 일 목록과 캘린더를 하나로 통합해보세요.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                size="lg" 
                onClick={handleGoogleLogin}
                className="px-8 py-3 text-lg bg-primary hover:bg-primary/90"
              >
                지금 시작하기
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                무료로 시작 • 로그인 후 바로 사용 가능
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto">
                  <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">간단한 할 일 관리</h3>
                <p className="text-gray-600 dark:text-gray-300">직관적인 인터페이스로 할 일을 쉽게 추가하고 관리하세요.</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">스마트 캘린더</h3>
                <p className="text-gray-600 dark:text-gray-300">일정을 시각적으로 관리하고 중요한 일정을 놓치지 마세요.</p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">강력한 검색</h3>
                <p className="text-gray-600 dark:text-gray-300">원하는 작업을 빠르게 찾고 효율적으로 관리하세요.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}