import { IBook } from './IBook';

// OCP: EBook is another implementation of IBook
export class EBook implements IBook {
  constructor(public title: string, public author: string, public fileSize: number) {}

  getDetails(): string {
    return `EBook: ${this.title} by ${this.author}, Size: ${this.fileSize}MB`;
  }
}
