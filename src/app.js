document.addEventListener('DOMContentLoaded', () => {
    class BookManager {
      constructor() {
        this.form = document.getElementById('addBookForm');
        this.bookList = document.getElementById('book-list');
        this.genreFilter = document.getElementById('genreFilter');
        this.searchForm = document.getElementById('searchBookForm');
        this.authorFilter = document.getElementById('authorFilter');
        this.ageFilter = document.getElementById('ageFilter');
        this.sortOptions = document.getElementById('sortOptions');
        this.books = JSON.parse(localStorage.getItem('books')) || [];
  
        this.init();
      }
  
      init() {
        // Add event listeners
        this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
        this.genreFilter.addEventListener('change', this.renderBooks.bind(this));
        this.searchForm.addEventListener('submit', this.handleSearchSubmit.bind(this));
        this.authorFilter.addEventListener('change', this.renderBooks.bind(this));
        this.ageFilter.addEventListener('change', this.renderBooks.bind(this));
        this.sortOptions.addEventListener('change', this.handleSort.bind(this));
  
        // Initial rendering and filter population
        this.populateGenreFilter();
        this.populateAuthorFilter();
        this.renderBooks();
      }
  
      async handleFormSubmit(event) {
        event.preventDefault();
        const bookData = this.getFormData();
        if (!this.validateFormData(bookData)) return;
  
        this.showLoadingIndicator(true);
        try {
          const response = await this.addBookToServer(bookData);
          this.books.push(response.data);
          localStorage.setItem('books', JSON.stringify(this.books));
          this.renderBooks();
          this.populateGenreFilter();
          this.populateAuthorFilter();
          alert('Book added successfully!');
        } catch (error) {
          console.error(error.message);
          alert('Error: ' + error.message);
        } finally {
          this.showLoadingIndicator(false);
        }
      }
  
      handleSearchSubmit(event) {
        event.preventDefault();
        const query = document.getElementById('searchQuery').value.trim();
        if (!query) {
          alert('Please enter a search query.');
          return;
        }
  
        this.showLoadingIndicator(true);
        this.fetchBooksFromAPI(query)
          .then(fetchedBooks => {
            this.integrateFetchedBooks(fetchedBooks);
            this.showLoadingIndicator(false);
          })
          .catch(error => {
            console.error(error);
            alert('Error fetching books: ' + error.message);
            this.showLoadingIndicator(false);
          });
      }
  
      showLoadingIndicator(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
          loadingIndicator.style.display = show ? 'flex' : 'none';
        }
      }
  
      addBookToServer(book) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() < 0.9) {
              resolve({ status: 'success', data: book });
            } else {
              reject({ status: 'error', message: 'Failed to add book to server.' });
            }
          }, 1000);
        });
      }
  
      fetchBooksFromAPI(query) {
        const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;
        return fetch(url)
          .then(response => {
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return response.json();
          })
          .then(data => {
            if (!data.docs) throw new Error('Invalid data format received from API.');
            return data.docs.map(doc => ({
              id: Date.now() + Math.random(),
              title: doc.title || 'No Title',
              author: (doc.author_name && doc.author_name.join(', ')) || 'Unknown Author',
              isbn: (doc.isbn && doc.isbn[0]) || 'N/A',
              pubDate: (doc.first_publish_year && `${doc.first_publish_year}-01-01`) || 'N/A',
              genre: doc.subject ? doc.subject[0] : 'General',
            }));
          })
          .catch(error => {
            console.error('Fetch Error:', error);
            throw error;
          });
      }
  
      getFormData() {
        return {
          title: document.getElementById('title').value.trim(),
          author: document.getElementById('author').value.trim(),
          isbn: document.getElementById('isbn').value.trim(),
          pubDate: document.getElementById('pub_date').value.trim(),
          genre: document.getElementById('genre').value.trim(),
        };
      }
  
      validateFormData({ title, author, isbn, pubDate, genre }) {
        if (!title || !author || !isbn || !pubDate || !genre) {
          alert('All fields must be filled!');
          return false;
        }
        if (isNaN(isbn)) {
          alert('ISBN must be a number!');
          return false;
        }
        if (this.books.some(book => book.isbn === isbn)) {
          alert('A book with this ISBN already exists!');
          return false;
        }
        if (!this.isValidDate(pubDate)) {
          alert('Please enter a valid publication date in YYYY-MM-DD format.');
          return false;
        }
        return true;
      }
  
      isValidDate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;
        const date = new Date(dateString);
        return date.toISOString().startsWith(dateString);
      }
  
      renderBooks() {
        this.bookList.innerHTML = ''; // Clear the list
        const selectedGenre = this.genreFilter.value;
        const selectedAuthor = this.authorFilter.value;
        const selectedAge = this.ageFilter.value;
  
        const genres = {};
  
        this.books.forEach(book => {
          if (selectedGenre !== 'All' && book.genre !== selectedGenre) return;
          if (selectedAuthor !== 'All' && book.author !== selectedAuthor) return;
  
          const age = this.calculateBookAge(book.pubDate);
          if (selectedAge === '0-5' && age > 5) return;
          if (selectedAge === '6-10' && (age < 6 || age > 10)) return;
          if (selectedAge === '11+' && age < 11) return;
  
          if (!genres[book.genre]) genres[book.genre] = [];
          genres[book.genre].push(book);
        });
  
        for (const genre in genres) {
          const genreHeader = document.createElement('h2');
          genreHeader.textContent = genre;
          this.bookList.appendChild(genreHeader);
  
          const genreList = document.createElement('ul');
          genreList.style.listStyleType = 'none';
          genreList.style.paddingLeft = '20px';
  
          genres[genre].forEach(book => {
            genreList.appendChild(this.createBookItem(book));
          });
  
          this.bookList.appendChild(genreList);
        }
  
        if (Object.keys(genres).length === 0) {
          const noBooksMessage = document.createElement('p');
          noBooksMessage.textContent = 'No books found for the selected genre.';
          this.bookList.appendChild(noBooksMessage);
        }
      }
  
      calculateBookAge(pubDate) {
        const publicationDate = new Date(pubDate);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - publicationDate.getFullYear();
        const monthDifference = currentDate.getMonth() - publicationDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < publicationDate.getDate())) {
          age--;
        }
        return age >= 0 ? age : 0;
      }
  
      createBookItem(book) {
        const bookItem = document.createElement('li');
        const age = this.calculateBookAge(book.pubDate);
  
        bookItem.className = 'bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center';
        bookItem.innerHTML = `
          <div class="flex-1 cursor-pointer" onclick="showBookDetails(${book.id})">
            <strong>${book.title}</strong> by ${book.author} - ${book.genre} (${book.pubDate}) | ISBN: ${book.isbn} | Age: ${age} year(s)
          </div>
        `;
        const editButton = this.createButton('Edit', () => this.editBook(book.id));
        const deleteButton = this.createButton('Delete', () => this.deleteBook(book.id));
  
        bookItem.appendChild(editButton);
        bookItem.appendChild(deleteButton);
        return bookItem;
      }
  
      createButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.marginLeft = '10px';
        button.addEventListener('click', onClick);
        return button;
      }
  
      editBook(id) {
        const bookToEdit = this.books.find(book => book.id === id);
        if (bookToEdit) {
          const updatedTitle = prompt('Enter new title:', bookToEdit.title);
          const updatedAuthor = prompt('Enter new author:', bookToEdit.author);
          const updatedISBN = prompt('Enter new ISBN:', bookToEdit.isbn);
          const updatedPubDate = prompt('Enter new publication date (YYYY-MM-DD):', bookToEdit.pubDate);
          const updatedGenre = prompt('Enter new genre:', bookToEdit.genre);
  
          bookToEdit.title = updatedTitle || bookToEdit.title;
          bookToEdit.author = updatedAuthor || bookToEdit.author;
          bookToEdit.isbn = updatedISBN || bookToEdit.isbn;
          bookToEdit.pubDate = updatedPubDate || bookToEdit.pubDate;
          bookToEdit.genre = updatedGenre || bookToEdit.genre;
  
          localStorage.setItem('books', JSON.stringify(this.books));
          this.renderBooks();
        }
      }
  
      deleteBook(id) {
        if (confirm('Are you sure you want to delete this book?')) {
          this.books = this.books.filter(book => book.id !== id);
          localStorage.setItem('books', JSON.stringify(this.books));
          this.renderBooks();
        }
      }
  
      integrateFetchedBooks(fetchedBooks) {
        const currentBooks = this.books;
  
        fetchedBooks.forEach(fetchedBook => {
          if (!currentBooks.some(book => book.isbn === fetchedBook.isbn)) {
            currentBooks.push(fetchedBook);
          }
        });
  
        this.books = currentBooks;
        localStorage.setItem('books', JSON.stringify(this.books));
        this.renderBooks();
      }
  
      handleSort() {
        const sortOption = this.sortOptions.value;
        switch (sortOption) {
          case 'titleAsc':
            this.books.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'titleDesc':
            this.books.sort((a, b) => b.title.localeCompare(a.title));
            break;
          case 'authorAsc':
            this.books.sort((a, b) => a.author.localeCompare(b.author));
            break;
          case 'authorDesc':
            this.books.sort((a, b) => b.author.localeCompare(a.author));
            break;
          case 'pubDateAsc':
            this.books.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
            break;
          case 'pubDateDesc':
            this.books.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            break;
          default:
            break;
        }
  
        this.renderBooks();
      }
  
      populateGenreFilter() {
        const uniqueGenres = [...new Set(this.books.map(book => book.genre))];
        this.populateFilterOptions(this.genreFilter, uniqueGenres);
      }
  
      populateAuthorFilter() {
        const uniqueAuthors = [...new Set(this.books.map(book => book.author))];
        this.populateFilterOptions(this.authorFilter, uniqueAuthors);
      }
  
      populateFilterOptions(filterElement, options) {
        filterElement.innerHTML = '<option value="All">All</option>';
        options.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          filterElement.appendChild(optionElement);
        });
      }
    }
  
    new BookManager();
  });
  