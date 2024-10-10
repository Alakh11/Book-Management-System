document.addEventListener('DOMContentLoaded', () => {
  // Interface for book data
  interface IBook {
    id: number;
    title: string;
    author: string;
    isbn: string;
    pubDate: string;
    genre: string;
    calculateAge?: () => number;
  }

  interface IEBook extends IBook {
    fileSize: number;
  }

  interface IPrintedBook extends IBook {
    pageSize: number;
  }

  // Decorator for logging
  function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.log(`Calling ${propertyKey} with arguments:`, args);
      return originalMethod.apply(this, args);
    };
    return descriptor;
  }

  // BaseBook class
  class BaseBook implements IBook {
    id: number;
    title: string;
    author: string;
    isbn: string;
    pubDate: string;
    genre: string;

    constructor(id: number, title: string, author: string, isbn: string, pubDate: string, genre: string) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.isbn = isbn;
      this.pubDate = pubDate;
      this.genre = genre;
    }

    // Method to calculate the age of the book
    calculateAge(): number {
      const publicationDate = new Date(this.pubDate);
      const currentDate = new Date();
      let age = currentDate.getFullYear() - publicationDate.getFullYear();
      const monthDifference = currentDate.getMonth() - publicationDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < publicationDate.getDate())) {
        age--;
      }
      return age >= 0 ? age : 0;
    }

    // Placeholder method for calculating the discount (to be overridden by subclasses)
    calculateDiscount(): number {
      return 0;
    }
  }

  // EBook subclass
  class EBook extends BaseBook implements IEBook {
    fileSize: number;

    constructor(id: number, title: string, author: string, isbn: string, pubDate: string, genre: string, fileSize: number) {
      super(id, title, author, isbn, pubDate, genre);
      this.fileSize = fileSize;
    }

    @logMethod
    calculateDiscount(): number {
      return 0.10;
    }
  }

  // PrintedBook subclass
  class PrintedBook extends BaseBook implements IPrintedBook {
    pageSize: number;

    constructor(id: number, title: string, author: string, isbn: string, pubDate: string, genre: string, pageSize: number) {
      super(id, title, author, isbn, pubDate, genre);
      this.pageSize = pageSize;
    }

    @logMethod
    calculateDiscount(): number {
      return 0.05;
    }
  }

  // Generic function for sorting
  function sortBooks<T extends IBook>(books: T[], sortBy: keyof T): T[] {
    return books.sort((a, b) => {
      if (a[sortBy] > b[sortBy]) {
        return 1;
      } else if (a[sortBy] < b[sortBy]) {
        return -1;
      }
      return 0;
    });
  }

  class BookManager {
    private form: HTMLFormElement;
    private bookList: HTMLElement;
    private genreFilter: HTMLSelectElement;
    private searchForm: HTMLFormElement;
    private authorFilter: HTMLSelectElement;
    private ageFilter: HTMLSelectElement;
    private sortOptions: HTMLSelectElement;
    private books: IBook[];

    constructor() {
      this.form = document.getElementById('addBookForm') as HTMLFormElement;
      this.bookList = document.getElementById('book-list') as HTMLElement;
      this.genreFilter = document.getElementById('genreFilter') as HTMLSelectElement;
      this.searchForm = document.getElementById('searchBookForm') as HTMLFormElement;
      this.authorFilter = document.getElementById('authorFilter') as HTMLSelectElement;
      this.ageFilter = document.getElementById('ageFilter') as HTMLSelectElement;
      this.sortOptions = document.getElementById('sortOptions') as HTMLSelectElement;
      this.books = JSON.parse(localStorage.getItem('books')!) || [];

      this.init();
    }

    init(): void {
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

    @logMethod
    async handleFormSubmit(event: Event): Promise<void> {
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
      } catch (error: any) {
        alert('Error: ' + error.message);
      } finally {
        this.showLoadingIndicator(false);
      }
    }

    createBook(bookData: IBook): BaseBook {
      const { id, title, author, isbn, pubDate, genre } = bookData;
      if ('fileSize' in bookData) {
        return new EBook(id, title, author, isbn, pubDate, genre, (bookData as IEBook).fileSize);
      } else if ('pageSize' in bookData) {
        return new PrintedBook(id, title, author, isbn, pubDate, genre, (bookData as IPrintedBook).pageSize);
      } else {
        throw new Error('Invalid book type');
      }
    }

    async handleSearchSubmit(event: Event): Promise<void> {
      event.preventDefault();
      const query = (document.getElementById('searchQuery') as HTMLInputElement).value.trim();
      if (!query) {
        alert('Please enter a search query.');
        return;
      }

      this.showLoadingIndicator(true);
      try {
        const fetchedBooks = await this.fetchBooksFromAPI(query);
        this.books = [...fetchedBooks, ...this.books];
        localStorage.setItem('books', JSON.stringify(this.books));
        this.renderBooks();
      } catch (error) {
        alert('Error fetching books: ' + error);
      } finally {
        this.showLoadingIndicator(false);
      }
    }

    @logMethod
    handleSort(): void {
      const sortOption = this.sortOptions.value as keyof IBook;
      this.books = sortBooks(this.books, sortOption);
      this.renderBooks();
    }

    renderBooks(): void {
      this.bookList.innerHTML = '';
      const filteredBooks = this.getFilteredBooks();
      this.books = sortBooks(filteredBooks, 'title');
      filteredBooks.forEach((book) => {
        const li = document.createElement('li');
        li.textContent = `${book.title} by ${book.author} (Published: ${book.pubDate})`;
        this.bookList.appendChild(li);
      });
    }

    showLoadingIndicator(show: boolean): void {
      const loadingIndicator = document.getElementById('loadingIndicator');
      if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
      }
    }

    getFormData(): IBook {
      return {
        id: Date.now(),
        title: (document.getElementById('title') as HTMLInputElement).value.trim(),
        author: (document.getElementById('author') as HTMLInputElement).value.trim(),
        isbn: (document.getElementById('isbn') as HTMLInputElement).value.trim(),
        pubDate: (document.getElementById('pub_date') as HTMLInputElement).value.trim(),
        genre: (document.getElementById('genre') as HTMLInputElement).value.trim(),
      };
    }

    validateFormData(bookData: IBook): boolean {
      const { title, author, isbn, pubDate, genre } = bookData;
      if (!title || !author || !isbn || !pubDate || !genre) {
        alert('All fields must be filled!');
        return false;
      }
      if (isNaN(Number(isbn))) {
        alert('ISBN must be a number!');
        return false;
      }
      if (this.books.some((book) => book.isbn === isbn)) {
        alert('A book with this ISBN already exists!');
        return false;
      }
      return true;
    }

    fetchBooksFromAPI(query: string): Promise<IBook[]> {
      const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;
      return fetch(url)
        .then((response) => response.json())
        .then((data) => {
          return data.docs.slice(0, 10).map((doc: any) => ({
            id: Date.now(),
            title: doc.title,
            author: doc.author_name ? doc.author_name[0] : 'Unknown Author',
            isbn: doc.isbn ? doc.isbn[0] : 'N/A',
            pubDate: doc.first_publish_year ? doc.first_publish_year.toString() : 'N/A',
            genre: 'Unknown Genre',
          }));
        });
    }

    addBookToServer(bookData: IBook): Promise<{ data: IBook }> {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ data: bookData }), 1000);
      });
    }

    getFilteredBooks(): IBook[] {
      let filteredBooks = this.books;

      const selectedGenre = this.genreFilter.value;
      if (selectedGenre) {
        filteredBooks = filteredBooks.filter((book) => book.genre === selectedGenre);
      }

      const selectedAuthor = this.authorFilter.value;
      if (selectedAuthor) {
        filteredBooks = filteredBooks.filter((book) => book.author === selectedAuthor);
      }

      const selectedAge = this.ageFilter.value;
      if (selectedAge) {
        filteredBooks = filteredBooks.filter((book) => {
      // Ensure that calculateAge exists before calling it
      return book.calculateAge?.().toString() === selectedAge;
    });
  }
      return filteredBooks;
    }

    populateGenreFilter(): void {
      const genres = Array.from(new Set(this.books.map((book) => book.genre)));
      this.populateFilterOptions(this.genreFilter, genres);
    }

    populateAuthorFilter(): void {
      const authors = Array.from(new Set(this.books.map((book) => book.author)));
      this.populateFilterOptions(this.authorFilter, authors);
    }

    populateFilterOptions(filter: HTMLSelectElement, options: string[]): void {
      filter.innerHTML = '';
      filter.appendChild(new Option('All', ''));
      options.forEach((option) => {
        filter.appendChild(new Option(option, option));
      });
    }
  }

  const bookManager = new BookManager();
});
