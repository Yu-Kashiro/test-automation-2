"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className={`group flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md ${
        todo.completed
          ? "border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30"
          : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50"
      }`}
      data-testid="todo-item"
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? "incomplete" : "complete"}`}
        className="h-5 w-5 rounded-md border-2 data-[state=checked]:border-violet-500 data-[state=checked]:bg-violet-500"
      />
      <span
        className={`flex-1 text-base transition-all ${
          todo.completed
            ? "text-muted-foreground/60 line-through"
            : "text-foreground"
        }`}
        data-testid="todo-text"
      >
        {todo.text}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.text}"`}
        className="opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
