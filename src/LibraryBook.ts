import { IBook } from './IBook';
import { IBorrowable } from './IBorrowable';

// ISP: LibraryBook implements both IBook and IBorrowable, focusing on specific interfaces
export class LibraryBook implements IBook, IBorrowable {
  constructor(
    public title: string,
    public author: string,
    public checkoutDate: Date,
    public returnDate: Date
  ) {}

  calculateLateFee(): number {
    const lateDays = (new Date().getTime() - this.returnDate.getTime()) / (1000 * 3600 * 24);
    return lateDays > 0 ? lateDays * 0.5 : 0;
  }

  getDetails(): string {
    return `${this.title} by ${this.author}`;
  }
}
