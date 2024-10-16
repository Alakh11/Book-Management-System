import { IBook } from './IBook';

// OCP: PhysicalBook implements IBook and can be extended or replaced by other types of books
export class PhysicalBook implements IBook {
  constructor(public title: string, public author: string) {}

  getDetails(): string {
    return `Physical Book: ${this.title} by ${this.author}`;
  }
}
