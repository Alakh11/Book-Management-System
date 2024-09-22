document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addBookForm');
    const bookList = document.getElementById('book-list');
    const genreFilter = document.getElementById('genreFilter'); // New element

    console.log('Form Element:', form);
    console.log('Book List Element:', bookList);
    console.log('Genre Filter Element:', genreFilter);

    if (!form) 
        console.error("Form with id 'addBookForm' not found!");
        return; // Exit if form is not found
    }

    if (!bookList) {
        console.error("Element with id 'book-list' not found!");
        return; // Exit if book list is not found
    }

    if (!genreFilter) {
        console.error("Element with id 'genreFilter' not found!");
        return; // Exit if genre filter is not found
    }

    let books = JSON.parse(localStorage.getItem('books')) || []; // Retrieve books from localStorage

    form.addEventListener('submit', handleFormSubmit);
    genreFilter.addEventListener('change', handleGenreFilter);

    function handleFormSubmit(event) {
        event.preventDefault();

        const bookData = getFormData();

        if (!validateFormData(bookData)) return;

        addBook(bookData);
        renderBooks();
        populateGenreFilter();
        form.reset();
    }

    function handleGenreFilter() {
        renderBooks();
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
        if (!isValidDate(pubDate)) {
            alert('Please enter a valid publication date in YYYY-MM-DD format.');
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

        // Get selected genre from filter
        const selectedGenre = genreFilter.value;

        // Group books by genre
        const genres = {};

        books.forEach(book => {
            if (selectedGenre !== 'All' && book.genre !== selectedGenre) {
                return; // Skip books that don't match the selected genre
            }

            if (!genres[book.genre]) {
                genres[book.genre] = [];
            }
            genres[book.genre].push(book);
        });

        // Iterate over each genre and create sections
        for (const genre in genres) {
            if (genres.hasOwnProperty(genre)) {
                // Create a genre header
                const genreHeader = document.createElement('h2');
                genreHeader.textContent = genre;
                bookList.appendChild(genreHeader);

                // Create a sub-list for books in this genre
                const genreList = document.createElement('ul');
                genreList.style.listStyleType = 'none'; // Remove default bullets
                genreList.style.paddingLeft = '20px'; // Indent sub-list

                genres[genre].forEach(book => {
                    genreList.appendChild(createBookItem(book));
                });

                bookList.appendChild(genreList);
            }
        }

        // If no books match the filter, display a message
        if (Object.keys(genres).length === 0) {
            const noBooksMessage = document.createElement('p');
            noBooksMessage.textContent = 'No books found for the selected genre.';
            bookList.appendChild(noBooksMessage);
        }
    }

    function createBookItem(book) {
        const bookItem = document.createElement('li');

        // Calculate the age of the book
        const publicationDate = new Date(book.pubDate);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - publicationDate.getFullYear();
        const monthDifference = currentDate.getMonth() - publicationDate.getMonth();

        // Adjust age if the current month is before the publication month
        if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < publicationDate.getDate())) {
            age--;
        }

        // Handle cases where age might be negative or zero
        age = age >= 0 ? age : 0;

        bookItem.innerHTML = `
            <strong>${book.title}</strong> by ${book.author} - ${book.genre} (${book.pubDate}) | ISBN: ${book.isbn} | Age: ${age} year(s)
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
            const updatedPubDate = prompt('Enter new publication date (YYYY-MM-DD):', bookToEdit.pubDate);
            const updatedGenre = prompt('Enter new genre:', bookToEdit.genre);

            if (
                updatedTitle && updatedTitle.trim() &&
                updatedAuthor && updatedAuthor.trim() &&
                updatedISBN && !isNaN(updatedISBN) &&
                updatedPubDate && isValidDate(updatedPubDate) &&
                updatedGenre && updatedGenre.trim()
            ) {
                // Check for unique ISBN if changed
                if (updatedISBN !== bookToEdit.isbn && books.some(book => book.isbn === updatedISBN)) {
                    alert('A book with this ISBN already exists!');
                    return;
                }

                bookToEdit.title = updatedTitle.trim();
                bookToEdit.author = updatedAuthor.trim();
                bookToEdit.isbn = updatedISBN.trim();
                bookToEdit.pubDate = updatedPubDate.trim();
                bookToEdit.genre = updatedGenre.trim();

                localStorage.setItem('books', JSON.stringify(books)); // Update localStorage
                renderBooks();
                populateGenreFilter();
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
            populateGenreFilter();
        }
    }

    function populateGenreFilter() {
        // Get unique genres
        const uniqueGenres = [...new Set(books.map(book => book.genre))];

        // Clear existing options except 'All'
        genreFilter.innerHTML = '<option value="All">All</option>';

        // Populate dropdown with unique genres
        uniqueGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    }

    function isValidDate(dateString) {
        // Check if dateString is in YYYY-MM-DD format and is a valid date
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;
        const date = new Date(dateString);
        const timestamp = date.getTime();
        if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;
        return date.toISOString().startsWith(dateString);
    }

    // Initial population of genre filter and rendering
    populateGenreFilter();
    renderBooks(); // Initial render on page load
});
