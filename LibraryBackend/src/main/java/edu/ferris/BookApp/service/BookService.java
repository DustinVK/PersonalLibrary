package edu.ferris.BookApp.service;

import edu.ferris.BookApp.domain.Book;
import edu.ferris.BookApp.domain.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BookService {

    @Autowired
    BookRepository bookRepository;

    public void deleteBook(long id) throws Exception {
        Optional<Book> optionalBook = bookRepository.findById(id);
        if (optionalBook.isPresent()) {
            Book book = optionalBook.get();
            bookRepository.delete(book);
        } else {
            throw new Exception("Book not found");
        }
    }

    public void updateBook(long id, Book updatedBook) throws Exception {
        Optional<Book> optionalBook = bookRepository.findById(id);
        if (optionalBook.isPresent()) {
            bookRepository.save(updatedBook);
        } else {
            throw new Exception("Book not found");
        }
    }
}
