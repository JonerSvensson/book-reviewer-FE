const API_URL = "https://book-reviewer-dev.onrender.com/api/reviews";

const form = document.getElementById("review-form");
const userField = document.getElementById("user");
const bookField = document.getElementById("book");
const ratingField = document.getElementById("rating");
const list = document.getElementById("review-list");

const deleteIdField = document.getElementById("delete-id");
const deleteBtn = document.getElementById("delete-btn");

const editIdField = document.getElementById("edit-id");
const editUserField = document.getElementById("edit-user");
const editBookField = document.getElementById("edit-book");
const editRatingField = document.getElementById("edit-rating");
const editBtn = document.getElementById("edit-btn");

const searchUserField = document.getElementById("search-user");
const searchBtn = document.getElementById("search-btn");
const searchResultList = document.getElementById("search-result-list");

let allReviews = [];

function setStatus(id, status, message) {
	const el = document.getElementById(id);
	if (!el) return;
	el.textContent = status;
	if (message) {
		el.title = message;
	} else {
		el.removeAttribute("title");
	}
}

function extractMessage(data) {
	if (!data) return "";
	if (data.error) return data.error;
	return Object.entries(data)
		.map(([field, msg]) => `${field}: ${msg}`)
		.join("; ");
}

async function loadReviews() {
	const response = await fetch(API_URL);
	const data = await response.json().catch(() => null);

	setStatus("list-status", response.status, !response.ok ? extractMessage(data) : "");

	if (!response.ok) return;

	allReviews = data;

	list.innerHTML = "";
	data.forEach(review => {
		const li = document.createElement("li");
		li.textContent = `#${review.id} - ${review.user} | ${review.book} — ${review.rating}/10`;
		list.appendChild(li);
	});
}

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const newReview = {
		user: userField.value,
		book: bookField.value,
		rating: Number(ratingField.value)
	};

	const response = await fetch(API_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(newReview)
	});
	const data = await response.json().catch(() => null);

	setStatus("add-status", response.status, !response.ok ? extractMessage(data) : "");

	if (response.ok) {
		form.reset();
		loadReviews();
	}
});

deleteBtn.addEventListener("click", async () => {
	const id = deleteIdField.value;
	if (!id) return;

	const response = await fetch(`${API_URL}/${id}`, {
		method: "DELETE"
	});

	let message = "";
	if (!response.ok) {
		const data = await response.json().catch(() => null);
		message = extractMessage(data);
	}
	setStatus("delete-status", response.status, message);

	if (response.ok) {
		deleteIdField.value = "";
		loadReviews();
	}
});

editBtn.addEventListener("click", async () => {
	const id = editIdField.value;
	if (!id) return;

	const updatedReview = {
		user: editUserField.value,
		book: editBookField.value,
		rating: Number(editRatingField.value)
	};

	const response = await fetch(`${API_URL}/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(updatedReview)
	});
	const data = await response.json().catch(() => null);

	setStatus("edit-status", response.status, !response.ok ? extractMessage(data) : "");

	if (response.ok) {
		editIdField.value = "";
		editUserField.value = "";
		editBookField.value = "";
		editRatingField.value = "";
		loadReviews();
	}
});

searchBtn.addEventListener("click", () => {
	const query = searchUserField.value.trim().toLowerCase();

	searchResultList.innerHTML = "";
	if (!query) return;

	const matches = allReviews.filter(review => review.user.toLowerCase().includes(query));

	matches.forEach(review => {
		const li = document.createElement("li");
		li.textContent = `#${review.id} — ${review.book} by ${review.user} — ${review.rating}/10`;
		searchResultList.appendChild(li);
	});
});

loadReviews();