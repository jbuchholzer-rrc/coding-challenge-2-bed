import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import * as bookService from "../services/bookService";
import { Book } from "../models/bookModel";

export const getAllBooks = (_req: Request, res: Response): void => {
    try {
        const books = bookService.getAllBooks();
        res.status(HTTP_STATUS.OK).json({
            message: "Books retrieved",
            data: books,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error retrieving books",
        });
    }
};

export const addBook = (req: Request, res: Response): void => {
    try {
        // I need to get the fields from the request body
        const { title, author, genre } = req.body;
        
        // I trim whitespace before checking if they're valid
        const trimmedTitle = title?.trim();
        const trimmedAuthor = author?.trim();
        const trimmedGenre = genre?.trim();
        
        // I check each field to make sure it exists and isn't empty
        if (!trimmedTitle) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Title is required and cannot be empty",
            });
            return;
        }
        
        if (!trimmedAuthor) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Author is required and cannot be empty",
            });
            return;
        }
        
        if (!trimmedGenre) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Genre is required and cannot be empty",
            });
            return;
        }
        
        // I create the book data with trimmed values
        const bookData: Pick<Book, "title" | "author" | "genre"> = {
            title: trimmedTitle,
            author: trimmedAuthor,
            genre: trimmedGenre,
        };
        
        const createdBook = bookService.addBook(bookData);
        res.status(HTTP_STATUS.CREATED).json({
            message: "Book added",
            data: createdBook,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error adding book",
        });
    }
};

export const updateBook = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedBook = bookService.updateBook(id, updatedData);
        if (updatedBook) {
            res.status(HTTP_STATUS.OK).json({
                message: "Book updated",
                data: updatedBook,
            });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Book not found",
            });
        }
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error updating book",
        });
    }
};

export const deleteBook = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const success = bookService.deleteBook(id);
        if (success) {
            res.status(HTTP_STATUS.OK).json({ message: "Book deleted" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Book not found",
            });
        }
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error deleting book",
        });
    }
};

export const borrowBook = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const borrowerId = req.body.borrowerId;
        const result = bookService.borrowBook(id, borrowerId);
        if (result) {
            res.status(HTTP_STATUS.OK).json({
                message: "Book borrowed",
                data: result,
            });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Book not found or already borrowed",
            });
        }
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error borrowing book",
        });
    }
};

export const returnBook = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const result = bookService.returnBook(id);
        if (result) {
            res.status(HTTP_STATUS.OK).json({ message: "Book returned" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Book not found or not currently borrowed",
            });
        }
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error returning book",
        });
    }
};

export const getRecommendations = (_req: Request, res: Response): void => {
    try {
        const recommendations = bookService.getRecommendations();
        res.status(HTTP_STATUS.OK).json({
            message: "Recommendations retrieved",
            data: recommendations,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error fetching recommendations",
        });
    }
};

export const availableBooks = (_req: Request, res: Response): void => {
    try {
        const availableBooks = bookService.getAvailableBooks();
        res.status(HTTP_STATUS.OK).json({
            message: "Available books",
            data: availableBooks,
            count: availableBooks.length,
        });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Error retrieving available books",
        });
    }
};
