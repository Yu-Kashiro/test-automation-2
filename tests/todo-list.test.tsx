import { TodoList } from "@/components/todo-list"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"

describe("TodoList", () => {
  it("renders empty state", () => {
    render(<TodoList />)
    expect(screen.getByTestId("empty-message")).toBeInTheDocument()
    expect(screen.getByText("No todos yet. Add one above!")).toBeInTheDocument()
  })

  it("adds a new todo", () => {
    render(<TodoList />)
    const input = screen.getByTestId("todo-input")
    const addButton = screen.getByRole("button", { name: /add todo/i })

    fireEvent.change(input, { target: { value: "Test todo" } })
    fireEvent.click(addButton)

    expect(screen.getByText("Test todo")).toBeInTheDocument()
    expect(screen.queryByTestId("empty-message")).not.toBeInTheDocument()
  })

  it("adds a todo with Enter key", () => {
    render(<TodoList />)
    const input = screen.getByTestId("todo-input")

    fireEvent.change(input, { target: { value: "Enter todo" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(screen.getByText("Enter todo")).toBeInTheDocument()
  })

  it("does not add empty todo", () => {
    render(<TodoList />)
    const addButton = screen.getByRole("button", { name: /add todo/i })

    fireEvent.click(addButton)

    expect(screen.getByTestId("empty-message")).toBeInTheDocument()
  })

  it("toggles todo completion", () => {
    render(<TodoList />)
    const input = screen.getByTestId("todo-input")
    const addButton = screen.getByRole("button", { name: /add todo/i })

    fireEvent.change(input, { target: { value: "Toggle test" } })
    fireEvent.click(addButton)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it("deletes a todo", () => {
    render(<TodoList />)
    const input = screen.getByTestId("todo-input")
    const addButton = screen.getByRole("button", { name: /add todo/i })

    fireEvent.change(input, { target: { value: "Delete me" } })
    fireEvent.click(addButton)

    expect(screen.getByText("Delete me")).toBeInTheDocument()

    const deleteButton = screen.getByRole("button", { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(screen.queryByText("Delete me")).not.toBeInTheDocument()
    expect(screen.getByTestId("empty-message")).toBeInTheDocument()
  })

  it("shows correct remaining count", () => {
    render(<TodoList />)
    const input = screen.getByTestId("todo-input")
    const addButton = screen.getByRole("button", { name: /add todo/i })

    fireEvent.change(input, { target: { value: "Todo 1" } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: "Todo 2" } })
    fireEvent.click(addButton)

    expect(screen.getByTestId("todo-count")).toHaveTextContent("2 of 2 remaining")

    const checkboxes = screen.getAllByRole("checkbox")
    fireEvent.click(checkboxes[0])

    expect(screen.getByTestId("todo-count")).toHaveTextContent("1 of 2 remaining")
  })
})
