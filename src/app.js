"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { BookManager } from './BookManager';
var BookValidator_1 = require("./BookValidator");
document.addEventListener('DOMContentLoaded', function () {
    // Decorator for logging
    function logMethod(target, propertyKey, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log("Calling ".concat(propertyKey, " with arguments:"), args);
            return originalMethod.apply(this, args);
        };
        return descriptor;
    }
    // BaseBook class
    var BaseBook = /** @class */ (function () {
        function BaseBook(id, title, author, isbn, pubDate, genre) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.isbn = isbn;
            this.pubDate = pubDate;
            this.genre = genre;
        }
        // Method to calculate the age of the book
        BaseBook.prototype.calculateAge = function () {
            var publicationDate = new Date(this.pubDate);
            var currentDate = new Date();
            var age = currentDate.getFullYear() - publicationDate.getFullYear();
            var monthDifference = currentDate.getMonth() - publicationDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < publicationDate.getDate())) {
                age--;
            }
            return age >= 0 ? age : 0;
        };
        // Placeholder method for calculating the discount (to be overridden by subclasses)
        BaseBook.prototype.calculateDiscount = function () {
            return 0;
        };
        return BaseBook;
    }());
    // EBook subclass
    var EBook = function () {
        var _a;
        var _classSuper = BaseBook;
        var _instanceExtraInitializers = [];
        var _calculateDiscount_decorators;
        return _a = /** @class */ (function (_super) {
                __extends(EBook, _super);
                function EBook(id, title, author, isbn, pubDate, genre, fileSize) {
                    var _this = _super.call(this, id, title, author, isbn, pubDate, genre) || this;
                    _this.fileSize = __runInitializers(_this, _instanceExtraInitializers);
                    // Adding PhysicalBook and EBook
                    _this.printedBook = new PrintedBook(1, 'The Great Gatsby', 'F. Scott Fitzgerald', '1234567890', '1925-04-10', 'Fiction', 200);
                    _this.eBook = new _a(2, 'Clean Code', 'Robert C. Martin', '0987654321', '2008-08-01', 'Programming', 5);
                    _this.fileSize = fileSize;
                    return _this;
                }
                EBook.prototype.calculateDiscount = function () {
                    return 0.10;
                };
                return EBook;
            }(_classSuper)),
            (function () {
                var _b;
                var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
                _calculateDiscount_decorators = [logMethod];
                __esDecorate(_a, null, _calculateDiscount_decorators, { kind: "method", name: "calculateDiscount", static: false, private: false, access: { has: function (obj) { return "calculateDiscount" in obj; }, get: function (obj) { return obj.calculateDiscount; } }, metadata: _metadata }, null, _instanceExtraInitializers);
                if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            })(),
            _a;
    }();
    // PrintedBook subclass
    var PrintedBook = function () {
        var _a;
        var _classSuper = BaseBook;
        var _instanceExtraInitializers = [];
        var _calculateDiscount_decorators;
        return _a = /** @class */ (function (_super) {
                __extends(PrintedBook, _super);
                function PrintedBook(id, title, author, isbn, pubDate, genre, pageSize) {
                    var _this = _super.call(this, id, title, author, isbn, pubDate, genre) || this;
                    _this.pageSize = __runInitializers(_this, _instanceExtraInitializers);
                    _this.pageSize = pageSize;
                    return _this;
                }
                PrintedBook.prototype.calculateDiscount = function () {
                    return 0.05;
                };
                return PrintedBook;
            }(_classSuper)),
            (function () {
                var _b;
                var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
                _calculateDiscount_decorators = [logMethod];
                __esDecorate(_a, null, _calculateDiscount_decorators, { kind: "method", name: "calculateDiscount", static: false, private: false, access: { has: function (obj) { return "calculateDiscount" in obj; }, get: function (obj) { return obj.calculateDiscount; } }, metadata: _metadata }, null, _instanceExtraInitializers);
                if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            })(),
            _a;
    }();
    // Generic function for sorting
    function sortBooks(books, sortBy) {
        return books.sort(function (a, b) {
            if (a[sortBy] > b[sortBy]) {
                return 1;
            }
            else if (a[sortBy] < b[sortBy]) {
                return -1;
            }
            return 0;
        });
    }
    var BookManager = function () {
        var _a;
        var _instanceExtraInitializers = [];
        var _handleFormSubmit_decorators;
        var _handleSort_decorators;
        return _a = /** @class */ (function () {
                function BookManager() {
                    this.form = __runInitializers(this, _instanceExtraInitializers);
                    // Dependency Injection: BookValidator is passed into BookManager
                    this.validator = new BookValidator_1.BookValidator();
                    this.manager = new _a();
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
                BookManager.prototype.init = function () {
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
                };
                BookManager.prototype.handleFormSubmit = function (event) {
                    return __awaiter(this, void 0, void 0, function () {
                        var bookData, response, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    event.preventDefault();
                                    bookData = this.getFormData();
                                    if (!this.validateFormData(bookData))
                                        return [2 /*return*/];
                                    this.showLoadingIndicator(true);
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, this.addBookToServer(bookData)];
                                case 2:
                                    response = _b.sent();
                                    this.books.push(response.data);
                                    localStorage.setItem('books', JSON.stringify(this.books));
                                    this.renderBooks();
                                    this.populateGenreFilter();
                                    this.populateAuthorFilter();
                                    alert('Book added successfully!');
                                    return [3 /*break*/, 5];
                                case 3:
                                    error_1 = _b.sent();
                                    alert('Error: ' + error_1.message);
                                    return [3 /*break*/, 5];
                                case 4:
                                    this.showLoadingIndicator(false);
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    });
                };
                BookManager.prototype.createBook = function (bookData) {
                    var id = bookData.id, title = bookData.title, author = bookData.author, isbn = bookData.isbn, pubDate = bookData.pubDate, genre = bookData.genre;
                    if ('fileSize' in bookData) {
                        return new EBook(id, title, author, isbn, pubDate, genre, bookData.fileSize);
                    }
                    else if ('pageSize' in bookData) {
                        return new PrintedBook(id, title, author, isbn, pubDate, genre, bookData.pageSize);
                    }
                    else {
                        throw new Error('Invalid book type');
                    }
                };
                BookManager.prototype.handleSearchSubmit = function (event) {
                    return __awaiter(this, void 0, void 0, function () {
                        var query, fetchedBooks, error_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    event.preventDefault();
                                    query = document.getElementById('searchQuery').value.trim();
                                    if (!query) {
                                        alert('Please enter a search query.');
                                        return [2 /*return*/];
                                    }
                                    this.showLoadingIndicator(true);
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, 4, 5]);
                                    return [4 /*yield*/, this.fetchBooksFromAPI(query)];
                                case 2:
                                    fetchedBooks = _b.sent();
                                    this.books = __spreadArray(__spreadArray([], fetchedBooks, true), this.books, true);
                                    localStorage.setItem('books', JSON.stringify(this.books));
                                    this.renderBooks();
                                    return [3 /*break*/, 5];
                                case 3:
                                    error_2 = _b.sent();
                                    alert('Error fetching books: ' + error_2);
                                    return [3 /*break*/, 5];
                                case 4:
                                    this.showLoadingIndicator(false);
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    });
                };
                BookManager.prototype.handleSort = function () {
                    var sortOption = this.sortOptions.value;
                    this.books = sortBooks(this.books, sortOption);
                    this.renderBooks();
                };
                BookManager.prototype.renderBooks = function () {
                    var _this = this;
                    this.bookList.innerHTML = '';
                    var filteredBooks = this.getFilteredBooks();
                    this.books = sortBooks(filteredBooks, 'title');
                    filteredBooks.forEach(function (book) {
                        var li = document.createElement('li');
                        li.textContent = "".concat(book.title, " by ").concat(book.author, " (Published: ").concat(book.pubDate, ")");
                        _this.bookList.appendChild(li);
                    });
                };
                BookManager.prototype.showLoadingIndicator = function (show) {
                    var loadingIndicator = document.getElementById('loadingIndicator');
                    if (loadingIndicator) {
                        loadingIndicator.style.display = show ? 'flex' : 'none';
                    }
                };
                BookManager.prototype.getFormData = function () {
                    return {
                        id: Date.now(),
                        title: document.getElementById('title').value.trim(),
                        author: document.getElementById('author').value.trim(),
                        isbn: document.getElementById('isbn').value.trim(),
                        pubDate: document.getElementById('pub_date').value.trim(),
                        genre: document.getElementById('genre').value.trim(),
                    };
                };
                BookManager.prototype.validateFormData = function (bookData) {
                    var title = bookData.title, author = bookData.author, isbn = bookData.isbn, pubDate = bookData.pubDate, genre = bookData.genre;
                    if (!title || !author || !isbn || !pubDate || !genre) {
                        alert('All fields must be filled!');
                        return false;
                    }
                    if (isNaN(Number(isbn))) {
                        alert('ISBN must be a number!');
                        return false;
                    }
                    if (this.books.some(function (book) { return book.isbn === isbn; })) {
                        alert('A book with this ISBN already exists!');
                        return false;
                    }
                    return true;
                };
                BookManager.prototype.fetchBooksFromAPI = function (query) {
                    var url = "https://openlibrary.org/search.json?title=".concat(encodeURIComponent(query));
                    return fetch(url)
                        .then(function (response) { return response.json(); })
                        .then(function (data) {
                        return data.docs.slice(0, 10).map(function (doc) { return ({
                            id: Date.now(),
                            title: doc.title,
                            author: doc.author_name ? doc.author_name[0] : 'Unknown Author',
                            isbn: doc.isbn ? doc.isbn[0] : 'N/A',
                            pubDate: doc.first_publish_year ? doc.first_publish_year.toString() : 'N/A',
                            genre: 'Unknown Genre',
                        }); });
                    });
                };
                BookManager.prototype.addBookToServer = function (bookData) {
                    return new Promise(function (resolve) {
                        setTimeout(function () { return resolve({ data: bookData }); }, 1000);
                    });
                };
                BookManager.prototype.getFilteredBooks = function () {
                    var filteredBooks = this.books;
                    var selectedGenre = this.genreFilter.value;
                    if (selectedGenre) {
                        filteredBooks = filteredBooks.filter(function (book) { return book.genre === selectedGenre; });
                    }
                    var selectedAuthor = this.authorFilter.value;
                    if (selectedAuthor) {
                        filteredBooks = filteredBooks.filter(function (book) { return book.author === selectedAuthor; });
                    }
                    var selectedAge = this.ageFilter.value;
                    if (selectedAge) {
                        filteredBooks = filteredBooks.filter(function (book) {
                            var _b;
                            // Ensure that calculateAge exists before calling it
                            return ((_b = book.calculateAge) === null || _b === void 0 ? void 0 : _b.call(book).toString()) === selectedAge;
                        });
                    }
                    return filteredBooks;
                };
                BookManager.prototype.populateGenreFilter = function () {
                    var genres = Array.from(new Set(this.books.map(function (book) { return book.genre; })));
                    this.populateFilterOptions(this.genreFilter, genres);
                };
                BookManager.prototype.populateAuthorFilter = function () {
                    var authors = Array.from(new Set(this.books.map(function (book) { return book.author; })));
                    this.populateFilterOptions(this.authorFilter, authors);
                };
                BookManager.prototype.populateFilterOptions = function (filter, options) {
                    filter.innerHTML = '';
                    filter.appendChild(new Option('All', ''));
                    options.forEach(function (option) {
                        filter.appendChild(new Option(option, option));
                    });
                };
                return BookManager;
            }()),
            (function () {
                var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                _handleFormSubmit_decorators = [logMethod];
                _handleSort_decorators = [logMethod];
                __esDecorate(_a, null, _handleFormSubmit_decorators, { kind: "method", name: "handleFormSubmit", static: false, private: false, access: { has: function (obj) { return "handleFormSubmit" in obj; }, get: function (obj) { return obj.handleFormSubmit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(_a, null, _handleSort_decorators, { kind: "method", name: "handleSort", static: false, private: false, access: { has: function (obj) { return "handleSort" in obj; }, get: function (obj) { return obj.handleSort; } }, metadata: _metadata }, null, _instanceExtraInitializers);
                if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            })(),
            _a;
    }();
    var bookManager = new BookManager();
});
