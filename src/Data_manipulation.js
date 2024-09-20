let books = [];

const addBook = (title, author, isbn, pubDate, genre) => {
    const newBook = {
        id: Date.now(),
        title,
        author,
        isbn,
        pubDate,
        genre,
    };
    books.push(newBook);
    renderBooks();
};

const editBook = (id, updatedBook) => {
    books = books.map(book => book.id === id ? { ...book, ...updatedBook } : book);
    renderBooks();
};

const deleteBook = (id) => {
    books = books.filter(book => book.id !== id);
    renderBooks();
};

const renderBooks = () => {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    books.forEach(book => {
        const bookItem = document.createElement('li');
        bookItem.innerHTML = `
            ${book.title} by ${book.author} - ${book.genre} (${book.pubDate})
            <button onclick="editBook(${book.id}, { title: 'Updated Title' })">Edit</button>
            <button onclick="deleteBook(${book.id})">Delete</button>
        `;
        bookList.appendChild(bookItem);
    });
};

document.getElementById('addBookForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const isbn = document.getElementById('isbn').value.trim();
    const pubDate = document.getElementById('pub_date').value.trim();
    const genre = document.getElementById('genre').value.trim();
    
    if (!title || !author || !isbn || !pubDate || !genre) {
        alert('All fields must be filled!');
    } else if (isNaN(isbn)) {
        alert('ISBN must be a number!');
    } else {
        addBook(title, author, isbn, pubDate, genre);
    }
});
const calculateBookAge = (pubDate) => {
    const currentYear = new Date().getFullYear();
    const bookYear = new Date(pubDate).getFullYear();
    return currentYear - bookYear;
};
