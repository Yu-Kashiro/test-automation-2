import { TodoList } from "@/components/todo-list"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-16 px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-8">
          Todo List
        </h1>
        <TodoList />
      </main>
    </div>
  )
}
