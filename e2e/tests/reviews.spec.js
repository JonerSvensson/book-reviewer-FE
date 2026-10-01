const { test, expect } = require("@playwright/test");

const API_URL = process.env.API_URL || "https://book-reviewer-dev.onrender.com/api/reviews";

test("backend API responds before running tests", async () => {
	await expect
		.poll(
			async () => {
				try {
					const response = await fetch(API_URL);
					return response.status;
				} catch {
					return null;
				}
			},
			{
				message: "waiting for backend",
				timeout: 60000,
				intervals: [2000],
			}
		)
		.toBe(200);
});

test("review appears in full list after being added", async ({ page }) => {
	await page.goto("/");

	await page.fill("#user", "Playwright Test");
	await page.fill("#book", "E2E Testing 101");
	await page.fill("#rating", "7");
	await page.click("#submit-btn");

	const newReview = page.locator("#review-list li", { hasText: "E2E Testing 101" }).last();
	await expect(newReview).toBeVisible();

	const reviewText = await newReview.textContent();
	const id = reviewText.match(/#(\d+)/)[1];

	await page.fill("#delete-id", id);
	await page.click("#delete-btn");
});

test("edit review", async ({ page }) => {
	await page.goto("/");

	await page.fill("#edit-id", "1");
	await page.fill("#edit-user", "Playwright Edit Test");
	await page.fill("#edit-book", "E2E Testing Edit");
	await page.fill("#edit-rating", "9");
	await page.click("#edit-btn");

	const editedReview = page.locator("#review-list li", { hasText: "E2E Testing Edit" });
	await expect(editedReview).toBeVisible();
});

test("delete review", async ({ page }) => {
	await page.goto("/");

	await page.fill("#user", "Playwright delete Test");
	await page.fill("#book", "E2E Delete Test");
	await page.fill("#rating", "5");
	await page.click("#submit-btn");

	const newReview = page.locator("#review-list li", { hasText: "E2E Delete Test" });
	await expect(newReview).toBeVisible();

	const reviewText = await newReview.textContent();
	const id = reviewText.match(/#(\d+)/)[1];

	await page.fill("#delete-id", id);
	await page.click("#delete-btn");

	await expect(newReview).not.toBeVisible();
});