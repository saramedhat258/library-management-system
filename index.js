const library = [
    {
        id: 1,
        title: "JavaScript Basics",
        author: "John Doe",
        year: 2020,
        available: true,
        borrower: "",
        dueDate: "",
    },
    {
        id: 2,
        title: "Web Development",
        author: "Jane Smith",
        year: 2019,
        available: false,
        borrower: "Ahmed",
        dueDate: "2024-01-15",
    },
    {
        id: 3,
        title: "Programming Fundamentals",
        author: "Bob Johnson",
        year: 2021,
        available: true,
        borrower: "",
        dueDate: "",
    },
];


function generateId() {
    return library.length > 0 ? library[library.length - 1].id + 1 : 1;
}

function addBook(title, author, year) {
    if (title && author && year) {
        let newBook = {
            id: generateId(),
            title: title,
            author: author,
            year: year,
            available: true,
            borrower: '',
            dueDate: ''
        }
        library.push(newBook)
        displayAllBooks()
        return "Book added successfully";
    }
    return "Book can not be added";
}

function removeBook(bookId) {
    for (let i = 0; i < library.length; i++) {
        if (library[i].id === bookId && library[i].available) {
            library.splice(i, 1)
            displayAllBooks()
            return 'Book removed successfully'
        }
        if (library[i].id === bookId && !library[i].available) {
            return 'you can not delete borrowed book'
        }
    }
    return 'book not available or wrong id'
}

function searchBooks(query) {
    const matchingBooks = [];
    for (let i = 0; i < library.length; i++) {
        if (query === library[i].title.toLowerCase() || query === library[i].author.toLowerCase()) {
            matchingBooks.push(library[i]);
        }
    }
    return matchingBooks;
}

function borrowBook(bookId, borrowerName) {
    let today = new Date();
    today.setDate(today.getDate() + 14);
    for (let i = 0; i < library.length; i++) {
        if (library[i].id === bookId && library[i].available) {
            library[i].available = false;
            library[i].borrower = borrowerName;
            library[i].dueDate = today
            displayAllBooks()
            return 'Book borrowed successfully'
        }
    }
    return 'book not available or wrong id'
}

function returnBook(bookId) {
    let overDue;
    for (let i = 0; i < library.length; i++) {
        if (library[i].id === bookId) {
            overDue = calculateOverdueFee(library[i].dueDate)
            library[i].available = true;
            library[i].borrower = '';
            library[i].dueDate = '';
            displayAllBooks()
            return `book returned successfully`;
        }
    }
    return 'book id not found'
}

function displayAllBooks() {
    const displayDiv = document.getElementById('books-display')
    displayDiv.innerHTML = ''
    for (book in library) { 
        displayDiv.appendChild(createBookElement(library[book]))
    }
}

/* calculate fee */
function calculateOverdueFee(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffInMs = today - due;
    const daysOverdue = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return daysOverdue > 0 ? `your fees: ${daysOverdue * 1}` : '';
}

function formatDate(date) {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


function formatBookInfo(book) {
    return `
                <strong>${book.title}</strong><br>
                Author: ${book.author}<br>
                Year: ${book.year}<br>
                Status: ${book.available ? 'Available' : `Borrowed by ${book.borrower}`}<br>
                ${book.dueDate ? `Due: ${formatDate(book.dueDate)} ${calculateOverdueFee(book.dueDate)}` :''}
            `;
}

function createBookElement(book) {
    const bookDiv = document.createElement('div');
    bookDiv.className = `book-item ${book.available ? 'available' : 'borrowed'}`;
    bookDiv.innerHTML = `
                <div class="book-info">${formatBookInfo(book)}</div>
                <div class="book-actions">
                    ${book.available ?
            `<button onclick="quickBorrow(${book.id})">Borrow</button>` :
            `<button onclick="quickReturn(${book.id})">Return</button>`
        }
                    ${book.available ? `<button onclick="quickRemove(${book.id})">Remove</button>` : ''}
                </div>
            `;
    return bookDiv;
}

function showStatus(message, isError = false) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.className = `status ${isError ? 'error' : 'success'}`;
    setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status';
    }, 5000);
}

// Event handler functions
function handleAddBook() {

    let title = document.getElementById('add-title');
    let author = document.getElementById('add-author')
    let year = document.getElementById('add-year')
    const result = addBook(title.value.trim(), author.value.trim(), year.value.trim());
    showStatus(result, result !== "Book added successfully");
    title.value = '';
    author.value = '';
    year.value = '';
}

function handleRemoveBook() {
    let bookId = document.getElementById('remove-id');
    let result = removeBook(+bookId.value.trim());
    showStatus(result, result !== "Book removed successfully");
    bookId.value = '';
}

function handleSearchBooks() {
    const query = document.getElementById('search-query').value.trim();
    const results = searchBooks(query.toLowerCase());
    document.getElementById('search-query').value=''
    console.log(results)
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';

    if (results.length === 0) {
        searchResults.innerHTML = '<p>No books found.</p>';
        return;
    }
    for (const book of results) {
        const bookElement = createBookElement(book);
        searchResults.appendChild(bookElement);
    }
}

function handleBorrowBook() {
    const bookId = document.getElementById('borrow-id');
    const borrowerName = document.getElementById('borrower-name');
    const result = borrowBook(+bookId.value.trim(), borrowerName.value.trim());
    showStatus(result, result !== "Book borrowed successfully");
    bookId.value = '';
    borrowerName.value = '';
}

function handleReturnBook() {
    const bookId = document.getElementById('return-id');
    const result = returnBook(+bookId.value.trim());
    showStatus(result, !result.includes("successfully"));
    bookId.value = '';
}


/* quick functions */
function quickBorrow(bookId) {
    const borrowerName = prompt("Enter your name:");
    if (borrowerName) {
        const result = borrowBook(bookId, borrowerName);
        showStatus(result, result !== "Book borrowed successfully");
    }
}

function quickReturn(bookId) {
    const result = returnBook(bookId);
    showStatus(result, !result.includes("successfully"));
}

function quickRemove(bookId) {
    if (confirm("Are you sure you want to remove this book?")) {
        const result = removeBook(bookId);
        showStatus(result, result !== "Book removed successfully");
    }
}


displayAllBooks();

document.getElementById('add-book-btn').onclick = handleAddBook;
document.getElementById('remove-book-btn').onclick = handleRemoveBook;
document.getElementById('search-books-btn').onclick = handleSearchBooks;
document.getElementById('borrow-book-btn').onclick = handleBorrowBook;
document.getElementById('return-book-btn').onclick = handleReturnBook;
document.getElementById('display-all-btn').onclick = displayAllBooks;
