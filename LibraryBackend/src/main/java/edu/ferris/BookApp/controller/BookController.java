package edu.ferris.BookApp.controller;

import edu.ferris.BookApp.domain.Book;
import edu.ferris.BookApp.domain.BookRepository;
import edu.ferris.BookApp.service.BookService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class BookController {

    private BookRepository bookRepository;
    private BookService bookService;

    public BookController(BookRepository bookRepository, BookService bookService) {
        this.bookRepository = bookRepository;
        this.bookService = bookService;
    }

    @RequestMapping("/books")
    public Iterable<Book> getBooks() { return bookRepository.findAll(); }

    @DeleteMapping("/books/{id}")
    public void deleteBook(@PathVariable("id") long id) throws Exception {
        bookService.deleteBook(id);
        System.out.println("deleted");
    }

    @PostMapping("/books")
    public void addBook(@RequestBody Book book) {
        bookRepository.save(book);
    }


    @PutMapping("/books")
    public void updateBook(@RequestBody Book book) throws Exception {
        bookService.updateBook(book.getId(), book);
    }
}
