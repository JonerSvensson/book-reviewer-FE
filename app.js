const API_URL = "https://book-reviewer-dev.onrender.com/api/reviews";

const form = document.getElementById("review-form");
const userField = document.getElementById("user");
const bookField = document.getElementById("book");
const ratingField = document.getElementById("rating");
const list = document.getElementById("review-list");

const deleteIdField = document.getElementById("delete-id");
const deleteBtn = document.getElementById("delete-btn");


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

	list.innerHTML = "";
	data.forEach(review => {
		const li = document.createElement("li");
		li.textContent = `#${review.id} — ${review.book} by ${review.user} — ${review.rating}/10`;
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

loadReviews();