import { IBook } from "./IBook";
// SRP: BookValidator handles only the validation logic
export interface IValidator {
    validate(book: IBook): boolean;
  }
  
  export class BookValidator implements IValidator {
    validate(book: IBook): boolean {
      return book.title.length > 0 && book.author.length > 0;
    }
  }
  