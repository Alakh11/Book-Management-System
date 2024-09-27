document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addBookForm');
    const bookList = document.getElementById('book-list');
    const genreFilter = document.getElementById('genreFilter'); // New element
    const searchForm = document.getElementById('searchBookForm');
    const authorFilter = document.getElementById('authorFilter');
    const ageFilter = document.getElementById('ageFilter');


    console.log('Form Element:', form);
    console.log('Book List Element:', bookList);
    console.log('Genre Filter Element:', genreFilter);

    if (!form) {
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
//Event Listener
    form.addEventListener('submit', handleFormSubmit);
    genreFilter.addEventListener('change', handleGenreFilter);
    searchForm.addEventListener('submit', handleSearchSubmit);
    authorFilter.addEventListener('change', handleAdvancedFilters);
    ageFilter.addEventListener('change', handleAdvancedFilters);

    // Loading Indicator Functions
    function showLoadingIndicator(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'flex' : 'none';
        }
    }

     // Simulate a server request to add a book
     function addBookToServer(book) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Simulate success response 90% of the time
                if (Math.random() < 0.9) {
                    resolve({ status: 'success', data: book });
                } else {
                    reject({ status: 'error', message: 'Failed to add book to server.' });
                }
            }, 1000); // 1-second delay
        });
    }

    // Fetch books from Open Library API based on a search query
    function fetchBooksFromAPI(query) {
        const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.docs) {
                    throw new Error('Invalid data format received from API.');
                }
                const fetchedBooks = data.docs.map(doc => ({
                    id: Date.now() + Math.random(), // Unique ID
                    title: doc.title || 'No Title',
                    author: (doc.author_name && doc.author_name.join(', ')) || 'Unknown Author',
                    isbn: (doc.isbn && doc.isbn[0]) || 'N/A',
                    pubDate: (doc.first_publish_year && `${doc.first_publish_year}-01-01`) || 'N/A',
                    genre: doc.subject ? doc.subject[0] : 'General',
                }));
                return fetchedBooks;
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                throw error; // Re-throw to be handled by the caller
            });
    }

    // Handle form submission to add a new book
    function handleFormSubmit(event) {
        event.preventDefault();

        const bookData = getFormData();

        if (!validateFormData(bookData)) return;

        showLoadingIndicator(true);

        // Call the simulated server request
        addBookToServer(bookData)
            .then(response => {
                books.push(response.data);
                localStorage.setItem('books', JSON.stringify(books)); // Save to localStorage
                renderBooks();
                populateGenreFilter();
                showLoadingIndicator(false);
                alert('Book added successfully!');
            })
            .catch(error => {
                console.error(error.message);
                alert('Error: ' + error.message);
                showLoadingIndicator(false);
            });

    }

    function handleGenreFilter() {
        renderBooks();
    }


    // Handle search form submission
    function handleSearchSubmit(event) {
        event.preventDefault();
        const query = document.getElementById('searchQuery').value.trim();
        if (!query) {
            alert('Please enter a search query.');
            return;
        }

        showLoadingIndicator(true);

        fetchBooksFromAPI(query)
            .then(fetchedBooks => {
                integrateFetchedBooks(fetchedBooks);
                showLoadingIndicator(false);
            })
            .catch(error => {
                console.error(error);
                alert('Error fetching books: ' + error.message);
                showLoadingIndicator(false);
            });
    }

    // Get form data
    function getFormData() {
        return {
            title: document.getElementById('title').value.trim(),
            author: document.getElementById('author').value.trim(),
            isbn: document.getElementById('isbn').value.trim(),
            pubDate: document.getElementById('pub_date').value.trim(),
            genre: document.getElementById('genre').value.trim(),
        };
    }
 // Validate form data
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

     // Render books based on current filters
    function renderBooks() {
        bookList.innerHTML = ''; // Clear the list

        // Get selected genre from filter
        const selectedGenre = genreFilter.value;
        const selectedAuthor = authorFilter.value;
        const selectedAge = ageFilter.value;


        // Group books by genre
        const genres = {};

        books.forEach(book => {
            // Apply genre filter
            if (selectedGenre !== 'All' && book.genre !== selectedGenre) {
                return; // Skip books that don't match the selected genre
            }

             // Apply author filter
            if (selectedAuthor !== 'All' && book.author !== selectedAuthor) {
                return; // Skip books that don't match the selected author
            }

            // Apply age filter
            if (selectedAge !== 'All') {
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

                 if (selectedAge === '0-5' && age > 5) return;
                 if (selectedAge === '6-10' && (age < 6 || age > 10)) return;
                 if (selectedAge === '11+' && age < 11) return;
             }

            // Grouping logic
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

    function showLoadingIndicator(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'flex' : 'none';
        }
    }
    

    // Create a book list item
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

    // Create a button with a label and click handler
    function createButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.marginLeft = '10px'; // Optional: Add some spacing
        button.addEventListener('click', onClick);
        return button;
    }
     
     // Edit a book
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

    // Delete a book
    function deleteBook(id) {
        if (confirm('Are you sure you want to delete this book?')) {
            books = books.filter(book => book.id !== id);
            localStorage.setItem('books', JSON.stringify(books)); // Update localStorage
            renderBooks();
            populateGenreFilter();
        }
    }

    // Populate genre filter
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
        // Also populate author filter based on current books
        populateAuthorFilter();
    }

    // Populate author filter
    function populateAuthorFilter() {
        // Get unique authors
        const uniqueAuthors = [...new Set(books.map(book => book.author))];

        // Clear existing options except 'All'
        authorFilter.innerHTML = '<option value="All">All</option>';

        // Populate dropdown with unique authors
        uniqueAuthors.forEach(author => {
            const option = document.createElement('option');
            option.value = author;
            option.textContent = author;
            authorFilter.appendChild(option);
        });
    }

    // Integrate fetched books into the existing books array
    function integrateFetchedBooks(fetchedBooks) {
        fetchedBooks.forEach(book => {
            // Check if the book already exists based on ISBN to prevent duplicates
            if (!books.some(existingBook => existingBook.isbn === book.isbn)) {
                books.push(book);
            }
        });
        localStorage.setItem('books', JSON.stringify(books)); // Save to localStorage
        renderBooks();
        populateGenreFilter();
        populateAuthorFilter();
        alert('Fetched books added successfully!');
    }

     // Validate date format (YYYY-MM-DD)
    function isValidDate(dateString) {
        // Check if dateString is in YYYY-MM-DD format and is a valid date
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;
        const date = new Date(dateString);
        const timestamp = date.getTime();
        if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;
        return date.toISOString().startsWith(dateString);
    }
    // Debounce function to limit the rate of function execution
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Refactored addBookToServer using async/await
    async function handleFormSubmit(event) {
        event.preventDefault();

    const bookData = getFormData();

    if (!validateFormData(bookData)) return;

    showLoadingIndicator(true);

    try {
        const response = await addBookToServer(bookData);
        books.push(response.data);
        localStorage.setItem('books', JSON.stringify(books)); // Save to localStorage
        renderBooks();
        populateGenreFilter();
        populateAuthorFilter();
        showLoadingIndicator(false);
        alert('Book added successfully!');
    } catch (error) {
        console.error(error.message);
        alert('Error: ' + error.message);
        showLoadingIndicator(false);
    }
    }


    // Modify the search handler to use debounce
    const debouncedHandleSearchSubmit = debounce(handleSearchSubmit, 500); // 500ms delay
    searchForm.addEventListener('submit', debouncedHandleSearchSubmit);


    // Initial population of genre filter and rendering
    populateGenreFilter();
    populateAuthorFilter();
    renderBooks(); // Initial render on page load
});