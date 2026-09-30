const { test, expect } = require("@playwright/test");

test("new review appears in the full list after being added", async ({ page }) => {
	await page.goto("/");

	await page.fill("#user", "Playwright Test");
	await page.fill("#book", "E2E Testing 101");
	await page.fill("#rating", "7");
	await page.click("#submit-btn");

	const newReview = page.locator("#review-list li", { hasText: "E2E Testing 101" });
	await expect(newReview).toBeVisible();
});

test("edit existing review", async ({ page }) => {
	await page.goto("/");

	await page.fill("#edit-id", "1");
	await page.fill("#edit-user", "Playwright Edit Test");
	await page.fill("#edit-book", "E2E Testing Edit");
	await page.fill("#edit-rating", "9");
	await page.click("#edit-btn");

	const newReview = page.locator("#review-list li", { hasText: "E2E Testing Edit" });
	await expect(newReview).toBeVisible();

});