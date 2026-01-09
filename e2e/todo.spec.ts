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

  // ============================================
  // バリデーション関連のテスト
  // ============================================

  test("does not add todo with empty text", async ({ page }) => {
    const input = page.getByTestId("todo-input")
    const addButton = page.getByRole("button", { name: /add todo/i })

    // 空のまま追加ボタンをクリック
    await addButton.click()

    // Todoが追加されていないことを確認
    await expect(page.getByTestId("empty-message")).toBeVisible()
    await expect(page.getByTestId("todo-count")).not.toBeVisible()

    // Enterキーでも同様に追加されないことを確認
    await input.press("Enter")
    await expect(page.getByTestId("empty-message")).toBeVisible()
  })

  test("does not add todo with whitespace only text", async ({ page }) => {
    const input = page.getByTestId("todo-input")
    const addButton = page.getByRole("button", { name: /add todo/i })

    // 空白のみを入力
    await input.fill("   ")
    await addButton.click()

    // Todoが追加されていないことを確認
    await expect(page.getByTestId("empty-message")).toBeVisible()
    await expect(page.getByTestId("todo-count")).not.toBeVisible()

    // タブや改行を含む空白のみの場合も確認
    await input.fill("  \t  ")
    await input.press("Enter")
    await expect(page.getByTestId("empty-message")).toBeVisible()
  })

  test("clears input field after adding todo", async ({ page }) => {
    const input = page.getByTestId("todo-input")
    const addButton = page.getByRole("button", { name: /add todo/i })

    // ボタンクリックで追加した場合
    await input.fill("First task")
    await addButton.click()

    await expect(input).toHaveValue("")
    await expect(page.getByText("First task")).toBeVisible()

    // Enterキーで追加した場合
    await input.fill("Second task")
    await input.press("Enter")

    await expect(input).toHaveValue("")
    await expect(page.getByText("Second task")).toBeVisible()
  })

  // ============================================
  // 状態管理関連のテスト
  // ============================================

  test("toggles completed todo back to incomplete", async ({ page }) => {
    const input = page.getByTestId("todo-input")
    const addButton = page.getByRole("button", { name: /add todo/i })

    await input.fill("Toggle test")
    await addButton.click()

    const checkbox = page.getByRole("checkbox")
    const todoText = page.getByTestId("todo-text")

    // 初期状態: 未完了
    await expect(checkbox).not.toBeChecked()
    await expect(todoText).not.toHaveClass(/line-through/)

    // 完了状態にする
    await checkbox.click()
    await expect(checkbox).toBeChecked()
    await expect(todoText).toHaveClass(/line-through/)
    await expect(page.getByTestId("todo-count")).toContainText("0 of 1 remaining")

    // 未完了状態に戻す
    await checkbox.click()
    await expect(checkbox).not.toBeChecked()
    await expect(todoText).not.toHaveClass(/line-through/)
    await expect(page.getByTestId("todo-count")).toContainText("1 of 1 remaining")
  })

  test("deletes individual todos from multiple todos", async ({ page }) => {
    const input = page.getByTestId("todo-input")
    const addButton = page.getByRole("button", { name: /add todo/i })

    // 3つのTodoを追加
    await input.fill("Todo A")
    await addButton.click()
    await input.fill("Todo B")
    await addButton.click()
    await input.fill("Todo C")
    await addButton.click()

    await expect(page.getByTestId("todo-count")).toContainText("3 of 3 remaining")

    // 中間のTodo (B) を削除
    const deleteButtonB = page.getByRole("button", { name: /delete "Todo B"/i })
    await deleteButtonB.click()

    await expect(page.getByText("Todo A")).toBeVisible()
    await expect(page.getByText("Todo B")).not.toBeVisible()
    await expect(page.getByText("Todo C")).toBeVisible()
    await expect(page.getByTestId("todo-count")).toContainText("2 of 2 remaining")

    // 最初のTodo (A) を削除
    const deleteButtonA = page.getByRole("button", { name: /delete "Todo A"/i })
    await deleteButtonA.click()

    await expect(page.getByText("Todo A")).not.toBeVisible()
    await expect(page.getByText("Todo C")).toBeVisible()
    await expect(page.getByTestId("todo-count")).toContainText("1 of 1 remaining")

    // 最後のTodo (C) を削除
    const deleteButtonC = page.getByRole("button", { name: /delete "Todo C"/i })
    await deleteButtonC.click()

    await expect(page.getByText("Todo C")).not.toBeVisible()
    await expect(page.getByTestId("empty-message")).toBeVisible()
  })

  // ============================================
  // アクセシビリティ関連のテスト
  // ============================================

  test("has accessible input field", async ({ page }) => {
    const input = page.getByTestId("todo-input")

    // プレースホルダーが設定されていることを確認
    await expect(input).toHaveAttribute("placeholder", "Add a new todo...")
  })

  test("has accessible add button with aria-label", async ({ page }) => {
    const addButton = page.getByRole("button", { name: /add todo/i })

    await expect(addButton).toBeVisible()
    await expect(addButton).toHaveAttribute("aria-label", "Add todo")
  })

  test("has accessible checkbox with dynamic aria-label", async ({ page }) => {
    const input = page.getByTestId("todo-input")
    const addButton = page.getByRole("button", { name: /add todo/i })

    await input.fill("Accessible task")
    await addButton.click()

    // 未完了時のaria-labelを確認
    const checkbox = page.getByRole("checkbox")
    await expect(checkbox).toHaveAttribute(
      "aria-label",
      'Mark "Accessible task" as complete'
    )

    // 完了時のaria-labelを確認
    await checkbox.click()
    await expect(checkbox).toHaveAttribute(
      "aria-label",
      'Mark "Accessible task" as incomplete'
    )
  })

  test("has accessible delete button with aria-label", async ({ page }) => {
    const input = page.getByTestId("todo-input")
    const addButton = page.getByRole("button", { name: /add todo/i })

    await input.fill("Task to delete")
    await addButton.click()

    // 削除ボタンのaria-labelを確認
    const deleteButton = page.getByRole("button", { name: /delete "Task to delete"/i })
    await expect(deleteButton).toBeVisible()
    await expect(deleteButton).toHaveAttribute("aria-label", 'Delete "Task to delete"')
  })

  test("todo list uses semantic HTML structure", async ({ page }) => {
    const input = page.getByTestId("todo-input")
    const addButton = page.getByRole("button", { name: /add todo/i })

    // Todoを追加
    await input.fill("Semantic test")
    await addButton.click()

    // ulタグが使用されていることを確認
    const todoList = page.getByTestId("todo-list")
    await expect(todoList).toBeVisible()

    // liタグ内にTodoアイテムが含まれていることを確認
    const listItem = todoList.locator("li")
    await expect(listItem).toHaveCount(1)
    await expect(listItem.getByTestId("todo-item")).toBeVisible()
  })
})
