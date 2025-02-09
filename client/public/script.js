const reviewForm = document.getElementById('reviewForm');
const reviewsList = document.getElementById('reviewsList');
const searchReviews = document.getElementById('searchReviews');

// Fetch all reviews
const fetchReviews = async () => {
    try {
        const response = await fetch('http://localhost:3000/');
        const data = await response.json();
        return data.reviews || [];
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
};

// Handle review form submission
reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const company = document.getElementById('company').value;
    const pros = document.getElementById('pros').value;
    const cons = document.getElementById('cons').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value || 0;
    console.log({ company, pros, cons, rating })
    try {
        await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company, pros, cons, rating })
        });
        renderReviews();
        reviewForm.reset();
    } catch (error) {
        console.error('Error adding review:', error);
    }
});

// Render reviews
const renderReviews = async () => {
    const reviews = await fetchReviews();
    reviewsList.innerHTML = '';
    reviews.forEach((review) => {
        const div = document.createElement('div');
        div.classList.add('card', 'p-3', 'mb-3');
        div.innerHTML = `
            <h5>${review.company} - ${'★'.repeat(Math.max(1, Math.min(5, review.rating)))}${'☆'.repeat(Math.max(0, 5 - Math.max(1, Math.min(5, review.rating))))}</h5>
            <p><strong>Pros:</strong> ${review.pros}</p>
            <p><strong>Cons:</strong> ${review.cons}</p>
        `;
        reviewsList.appendChild(div);
    });
};

// Search reviews
searchReviews.addEventListener('input', async (e) => {
    const query = e.target.value.toLowerCase();
    const reviews = await fetchReviews();
    const filteredReviews = reviews.filter(review => review.company.toLowerCase().includes(query));
    reviewsList.innerHTML = '';

    filteredReviews.forEach((review) => {
        const safeRating = Math.max(1, Math.min(5, review.rating || 1)); // Ensure rating is between 1 and 5
        const div = document.createElement('div');
        div.classList.add('card', 'p-3', 'mb-3');
        div.innerHTML = `
            <h5>${review.company} - ${'★'.repeat(safeRating)}${'☆'.repeat(5 - safeRating)}</h5>
            <p><strong>Pros:</strong> ${review.pros}</p>
            <p><strong>Cons:</strong> ${review.cons}</p>
        `;
        reviewsList.appendChild(div);
    });
});

renderReviews();
