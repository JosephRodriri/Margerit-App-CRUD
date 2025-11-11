import { test, expect } from "@playwright/test"

test.describe("MAGERIT Matrix - Automated Testing Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/clasificacion")
  })

  // Helper function to get all asset cards
  async function getAssetCards(page: any) {
    return await page.locator("article").all()
  }

  // Helper function to fill a cell in the matrix using data attributes
  async function fillCell(page: any, assetCardIndex: number, threatRowIndex: number, dimensionCode: string, value: number) {
    const cards = await getAssetCards(page)
    if (assetCardIndex >= cards.length) {
      throw new Error(`Asset card ${assetCardIndex} not found. Total cards: ${cards.length}`)
    }

    const card = cards[assetCardIndex]
    const testId = `cell-${assetCardIndex}-${threatRowIndex}-${dimensionCode}`
    const input = card.locator(`[data-testid="${testId}"]`)

    await input.waitFor({ state: "visible", timeout: 5000 })
    await input.fill(String(value))
    await input.blur()
    await page.waitForTimeout(100)

    console.log(`Filled cell ${testId} with value ${value}`)
  }

  test("TC-001: Fill matrix with low risk values", async ({ page }) => {
    console.log("TC-001: Starting low risk test")

    // Fill first asset card, first threat with low values
    await fillCell(page, 0, 0, "D", 2)
    await fillCell(page, 0, 0, "I", 1)
    await fillCell(page, 0, 0, "C", 2)

    const input = page.locator('[data-testid="cell-0-0-D"]')
    const value = await input.inputValue()
    expect(Number.parseInt(value)).toBe(2)

    console.log("TC-001: PASSED")
  })

  test("TC-002: Fill matrix with medium risk values", async ({ page }) => {
    console.log("[TC-002: Starting medium risk test")

    await fillCell(page, 0, 1, "D", 5)
    await fillCell(page, 0, 1, "I", 4)
    await fillCell(page, 0, 1, "C", 5)

    const input = page.locator('[data-testid="cell-0-1-D"]')
    const value = await input.inputValue()
    expect(Number.parseInt(value)).toBe(5)

    console.log("TC-002: PASSED")
  })

  test("TC-003: Fill matrix with high risk values", async ({ page }) => {
    console.log("TC-003: Starting high risk test")

    await fillCell(page, 0, 2, "D", 8)
    await fillCell(page, 0, 2, "I", 7)
    await fillCell(page, 0, 2, "C", 8)

    const input = page.locator('[data-testid="cell-0-2-D"]')
    const value = await input.inputValue()
    expect(Number.parseInt(value)).toBe(8)

    console.log("TC-003: PASSED")
  })

  test("TC-004: Save button functionality", async ({ page }) => {
    console.log("TC-004: Testing save functionality")

    // Fill some cells
    await fillCell(page, 0, 0, "D", 5)

    // Click save button
    const saveButton = page.locator('button:has-text("Guardar")')
    await expect(saveButton).toBeVisible()
    await saveButton.click()

    // Check that alert shows save time with role="alert"
    const alert = page.locator('[role="alert"]')
    await expect(alert).toContainText("Última actualización")

    console.log("TC-004: PASSED")
  })

  test("TC-005: Data persistence across reload", async ({ page }) => {
    console.log("TC-005: Testing data persistence")

    // Fill a cell
    await fillCell(page, 1, 0, "D", 7)

    // Save
    await page.locator('button:has-text("Guardar")').click()
    await page.waitForTimeout(500)

    // Reload page
    await page.reload()

    // Check that value persists
    const input = page.locator('[data-testid="cell-1-0-D"]')
    const value = await input.inputValue()
    expect(Number.parseInt(value)).toBe(7)

    console.log("TC-005: PASSED")
  })

  test("TC-006: Stress test - fill multiple cells", async ({ page }) => {
    console.log("TC-006: Starting stress test")

    const dimensions = ["D", "I", "C", "A", "T"]
    let filledCount = 0

    // Fill first 5 rows of first asset with random values
    for (let row = 0; row < 5; row++) {
      for (const dim of dimensions) {
        const randomValue = Math.floor(Math.random() * 11) // 0-10
        await fillCell(page, 0, row, dim, randomValue)
        filledCount++
      }
    }

    console.log(`TC-006: Filled ${filledCount} cells`)

    // Save
    await page.locator('button:has-text("Guardar")').click()

    console.log("TC-006: PASSED")
  })

  test("TC-007: Export functionality", async ({ page }) => {
    console.log("TC-007: Testing export")

    // Fill some data
    await fillCell(page, 0, 0, "D", 5)

    // Save
    await page.locator('button:has-text("Guardar")').click()
    await page.waitForTimeout(500)

    // Listen for download
    const downloadPromise = page.waitForEvent("download")

    // Click export button
    const exportButton = page.locator('button:has-text("Exportar")')
    await expect(exportButton).toBeVisible()
    await exportButton.click()

    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain("magerit-matrix")

    console.log("TC-007: PASSED")
  })

  test("TC-008: Matrix loads all asset types", async ({ page }) => {
    console.log("TC-008: Checking asset types")

    const cards = await getAssetCards(page)

    // Should have 13 asset types
    expect(cards.length).toBe(13)

    console.log(`TC-008: Found ${cards.length} asset cards`)
    console.log("TC-008: PASSED")
  })
})

//pnpm test matrix.spec.ts
