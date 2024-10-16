// OCP: IBook interface allows us to create new types of books without modifying existing code
export interface IBook {
    title: string;
    author: string;
    getDetails(): string;
  }
  