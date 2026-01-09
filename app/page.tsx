import { TodoList } from "@/components/todo-list"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 font-sans">
      <main className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-cyan-400">
              Todo List
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Stay organized, get things done
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-gray-200/50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70 dark:shadow-none">
            <TodoList />
          </div>
        </div>
      </main>
    </div>
  )
}
