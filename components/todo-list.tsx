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
    <div className="w-full max-w-md space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new todo..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          data-testid="todo-input"
        />
        <Button onClick={addTodo} aria-label="Add todo">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="space-y-2" data-testid="todo-list">
        {todos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8" data-testid="empty-message">
            No todos yet. Add one above!
          </p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>

      {todos.length > 0 && (
        <p className="text-sm text-muted-foreground text-center" data-testid="todo-count">
          {todos.filter((t) => !t.completed).length} of {todos.length} remaining
        </p>
      )}
    </div>
  )
}
