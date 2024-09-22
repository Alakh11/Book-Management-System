document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addBookForm');
    const bookList = document.getElementById('book-list');

    console.log('Form Element:', form);
    console.log('Book List Element:', bookList);

    if (!form) {
        console.error("Form with id 'addBookForm' not found!");
        return; // Exit if form is not found
    }

    if (!bookList) {
        console.error("Element with id 'book-list' not found!");
        return; // Exit if book list is not found
    }

    let books = JSON.parse(localStorage.getItem('books')) || []; // Retrieve books from localStorage

    form.addEventListener('submit', handleFormSubmit);

    function handleFormSubmit(event) {
        event.preventDefault();

        const bookData = getFormData();

        if (!validateFormData(bookData)) return;

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
            genre: document.getElementById('genre').value.trim(),
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
        const isbnExists = books.some(book => book.isbn === isbn);
        if (isbnExists) {
            alert('A book with this ISBN already exists!');
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
        localStorage.setItem('books', JSON.stringify(books)); // Save to localStorage
    }

    function renderBooks() {
        bookList.innerHTML = ''; // Clear the list
        books.forEach(book => bookList.appendChild(createBookItem(book)));
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
        button.style.marginLeft = '10px'; // Optional: Add some spacing
        button.addEventListener('click', onClick);
        return button;
    }

    function editBook(id) {
        const bookToEdit = books.find(book => book.id === id);
        if (bookToEdit) {
            const updatedTitle = prompt('Enter new title:', bookToEdit.title);
            const updatedAuthor = prompt('Enter new author:', bookToEdit.author);
            const updatedISBN = prompt('Enter new ISBN:', bookToEdit.isbn);
            const updatedPubDate = prompt('Enter new publication date:', bookToEdit.pubDate);
            const updatedGenre = prompt('Enter new genre:', bookToEdit.genre);

            if (
                updatedTitle && updatedTitle.trim() &&
                updatedAuthor && updatedAuthor.trim() &&
                updatedISBN && !isNaN(updatedISBN) &&
                updatedPubDate && updatedPubDate.trim() &&
                updatedGenre && updatedGenre.trim()
            ) {
                bookToEdit.title = updatedTitle.trim();
                bookToEdit.author = updatedAuthor.trim();
                bookToEdit.isbn = updatedISBN.trim();
                bookToEdit.pubDate = updatedPubDate.trim();
                bookToEdit.genre = updatedGenre.trim();

                localStorage.setItem('books', JSON.stringify(books)); // Update localStorage
                renderBooks();
            } else {
                alert('Please provide valid inputs for all fields.');
            }
        }
    }

    function deleteBook(id) {
        if (confirm('Are you sure you want to delete this book?')) {
            books = books.filter(book => book.id !== id);
            localStorage.setItem('books', JSON.stringify(books)); // Update localStorage
            renderBooks();
        }
    }

    renderBooks(); // Initial render on page load
});
