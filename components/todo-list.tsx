"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TodoItem, type Todo } from "@/components/todo-item"
import { Plus } from "lucide-react"

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState("")

  const addTodo = () => {
    const text = inputValue.trim()
    if (!text) return

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    }
    setTodos((prev) => [...prev, newTodo])
    setInputValue("")
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex gap-3">
        <Input
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          data-testid="todo-input"
          className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-base transition-all focus:bg-white focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:bg-gray-800"
        />
        <Button
          onClick={addTodo}
          aria-label="Add todo"
          className="h-12 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-6 font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 dark:from-violet-500 dark:to-cyan-500"
        >
          <Plus className="mr-1 h-5 w-5" />
          Add
        </Button>
      </div>

      <ul className="space-y-3" data-testid="todo-list">
        {todos.length === 0 ? (
          <li className="flex flex-col items-center justify-center py-12 list-none" data-testid="empty-message">
            <div className="mb-3 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-muted-foreground">No todos yet</p>
            <p className="text-sm text-muted-foreground/60">Add your first task above</p>
          </li>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className="list-none">
              <TodoItem
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            </li>
          ))
        )}
      </ul>

      {todos.length > 0 && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 py-3 dark:bg-gray-800/50" data-testid="todo-count">
          <div className="h-2 w-2 rounded-full bg-violet-500" />
          <p className="text-sm font-medium text-muted-foreground">
            {todos.filter((t) => !t.completed).length} of {todos.length} remaining
          </p>
        </div>
      )}
    </div>
  )
}
