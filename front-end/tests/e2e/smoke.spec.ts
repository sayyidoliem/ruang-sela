import { expect, test } from "@playwright/test";
test("halaman utama dapat diakses", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/FutureReady/i);
  await expect(page.locator("main")).toBeVisible();
});
test("health endpoint merespons sehat", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.data.status).toBe("healthy");
});
