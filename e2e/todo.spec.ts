import { test, expect } from "@playwright/test"

test.describe("Todo List", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("displays the todo list page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Todo List" })).toBeVisible()
    await expect(page.getByTestId("empty-message")).toBeVisible()
    await expect(page.getByTestId("todo-input")).toBeVisible()
  })

  test("adds a new todo", async ({ page }) => {
    const input = page.getByTestId("todo-input")
    const addButton = page.getByRole("button", { name: /add todo/i })

    await input.fill("Buy groceries")
    await addButton.click()

    await expect(page.getByText("Buy groceries")).toBeVisible()
    await expect(page.getByTestId("empty-message")).not.toBeVisible()
    await expect(page.getByTestId("todo-count")).toContainText("1 of 1 remaining")
  })

  test("adds a todo with Enter key", async ({ page }) => {
    const input = page.getByTestId("todo-input")

    await input.fill("Walk the dog")
    await input.press("Enter")

    await expect(page.getByText("Walk the dog")).toBeVisible()
  })

  test("toggles todo completion", async ({ page }) => {
    const input = page.getByTestId("todo-input")
    const addButton = page.getByRole("button", { name: /add todo/i })

    await input.fill("Complete task")
    await addButton.click()

    const checkbox = page.getByRole("checkbox")
    await expect(checkbox).not.toBeChecked()

    await checkbox.click()
    await expect(checkbox).toBeChecked()

    const todoText = page.getByTestId("todo-text")
    await expect(todoText).toHaveClass(/line-through/)
  })

  test("deletes a todo", async ({ page }) => {
    const input = page.getByTestId("todo-input")
    const addButton = page.getByRole("button", { name: /add todo/i })

    await input.fill("Delete this")
    await addButton.click()

    await expect(page.getByText("Delete this")).toBeVisible()

    const deleteButton = page.getByRole("button", { name: /delete/i })
    await deleteButton.click()

    await expect(page.getByText("Delete this")).not.toBeVisible()
    await expect(page.getByTestId("empty-message")).toBeVisible()
  })

  test("manages multiple todos", async ({ page }) => {
    const input = page.getByTestId("todo-input")
    const addButton = page.getByRole("button", { name: /add todo/i })

    await input.fill("First todo")
    await addButton.click()
    await input.fill("Second todo")
    await addButton.click()
    await input.fill("Third todo")
    await addButton.click()

    await expect(page.getByTestId("todo-count")).toContainText("3 of 3 remaining")

    const checkboxes = page.getByRole("checkbox")
    await checkboxes.first().click()
    await checkboxes.nth(1).click()

    await expect(page.getByTestId("todo-count")).toContainText("1 of 3 remaining")
  })
})
