const API_URL = "https://book-reviewer-dev.onrender.com/api/reviews";

const form = document.getElementById("review-form");
const userField = document.getElementById("user");
const bookField = document.getElementById("book");
const ratingField = document.getElementById("rating");
const list = document.getElementById("review-list");

async function loadReviews() {
    const response = await fetch(API_URL);
    const reviews = await response.json();

    list.innerHTML = "";
    reviews.forEach(review => {
        const li = document.createElement("li");
        li.textContent = `ID: ${review.id} | ${review.book} by ${review.user} — ${review.rating}/10`;
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

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview)
    });

    form.reset();
    loadReviews();
});

loadReviews();