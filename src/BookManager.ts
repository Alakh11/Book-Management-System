import { IBook } from './IBook';
import { IValidator } from './BookValidator';

// DIP: BookManager depends on abstractions (IValidator and IBook), not concrete implementations
export class BookManager {
  private books: IBook[] = [];
  private validator: IValidator;

  constructor(validator: IValidator) {
    this.validator = validator;
  }

  addBook(book: IBook) {
    if (this.validator.validate(book)) {
      this.books.push(book);
    }
  }

  renderBookList() {
    this.books.forEach((book) => {
      console.log(book.getDetails());
    });
  }
}
