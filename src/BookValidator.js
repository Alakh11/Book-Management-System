"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookValidator = void 0;
var BookValidator = /** @class */ (function () {
    function BookValidator() {
    }
    BookValidator.prototype.validate = function (book) {
        return book.title.length > 0 && book.author.length > 0;
    };
    return BookValidator;
}());
exports.BookValidator = BookValidator;
