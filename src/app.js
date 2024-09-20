document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addBookForm');
    const bookList = document.getElementById('book-list');

    let books = [];

    form.addEventListener('submit', handleFormSubmit);

    function handleFormSubmit(event) {
        event.preventDefault();

        const bookData = getFormData();

        if (!validateFormData(bookData)) {
            return;
        }

        addBook(bookData);
        renderBooks();
        form.reset();
    }

    function getFormData() {
        return {
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            isbn: document.getElementById('isbn').value.trim(),
            pubDate: document.getElementById('pub_date').value.trim(),
            genre: document.getElementById('genre').value.trim()
        };
    }

    function validateFormData({ title, author, isbn, pubDate, genre }) {
        if (!title || !author || !isbn || !pubDate || !genre) {
            alert('All fields must be filled!');
            return false;
        }

        if (isNaN(isbn)) {
            alert('ISBN must be a number!');
            return false;
        }

        return true;
    }

    function addBook({ title, author, isbn, pubDate, genre }) {
        const newBook = {
            id: Date.now(),
            title,
            author,
            isbn,
            pubDate,
            genre,
        };

        books.push(newBook);
    }

    function renderBooks() {
        bookList.innerHTML = ''; // Clear the list

        books.forEach(book => {
            const bookItem = createBookItem(book);
            bookList.appendChild(bookItem);
        });
    }

    function createBookItem(book) {
        const bookItem = document.createElement('li');
        bookItem.innerHTML = `
            <strong>${book.title}</strong> by ${book.author} - ${book.genre} (${book.pubDate}) | ISBN: ${book.isbn}
        `;

        const editButton = createButton('Edit', () => editBook(book.id));
        const deleteButton = createButton('Delete', () => deleteBook(book.id));

        bookItem.appendChild(editButton);
        bookItem.appendChild(deleteButton);

        return bookItem;
    }

    function createButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.addEventListener('click', onClick);
        return button;
    }

    function editBook(id) {
        const bookToEdit = books.find(book => book.id === id);
        if (bookToEdit) {
            const updatedTitle = prompt('Enter new title:', bookToEdit.title);
            if (updatedTitle && updatedTitle.trim()) {
                bookToEdit.title = updatedTitle.trim();
                renderBooks();
            }
        }
    }

    function deleteBook(id) {
        if (confirm('Are you sure you want to delete this book?')) {
            books = books.filter(book => book.id !== id);
            renderBooks();
        }
    }
});
