"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicalBook = void 0;
// OCP: PhysicalBook implements IBook and can be extended or replaced by other types of books
var PhysicalBook = /** @class */ (function () {
    function PhysicalBook(title, author) {
        this.title = title;
        this.author = author;
    }
    PhysicalBook.prototype.getDetails = function () {
        return "Physical Book: ".concat(this.title, " by ").concat(this.author);
    };
    return PhysicalBook;
}());
exports.PhysicalBook = PhysicalBook;
