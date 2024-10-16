// ISP: Split large interfaces into smaller, more focused ones
export interface IBorrowable {
    checkoutDate: Date;
    returnDate: Date;
    calculateLateFee(): number;
  }
  