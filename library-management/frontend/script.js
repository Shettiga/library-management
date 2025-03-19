const apiUrl = "http://localhost:5000/books";

// Function to fetch books from the database
async function fetchBooks() {
    const response = await fetch(apiUrl);
    const books = await response.json();
    const bookList = document.getElementById("bookList");
    
    bookList.innerHTML = ""; // Clear previous data
    books.forEach(book => {
        const row = `<tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.available ? "✅" : "❌"}</td>
            <td>
                <button onclick="toggleAvailability('${book._id}', ${book.available})">Toggle</button>
                <button onclick="deleteBook('${book._id}')">Delete</button>
            </td>
        </tr>`;
        bookList.innerHTML += row;
    });
}

// Function to add a new book
document.getElementById("bookForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const bookData = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        isbn: document.getElementById("isbn").value,
        available: true,
    };

    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
    });

    document.getElementById("bookForm").reset();
    fetchBooks();
});

// Function to toggle book availability
async function toggleAvailability(id, currentStatus) {
    await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !currentStatus }),
    });
    fetchBooks();
}

// Function to delete a book
async function deleteBook(id) {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    fetchBooks();
}

// Load books on page load
fetchBooks();
