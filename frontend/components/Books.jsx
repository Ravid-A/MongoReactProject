import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Select from "react-select";

import GetAPIURL from "../helpers/getAPIURL";

import styles from "../styles/Books.module.css";

const BooksList = ({ pages }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    publishingYear: "",
    cover_image: "",
    author: "", // New field for author
  });
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Fetch books for the current page
        const response = await axios.get(`${GetAPIURL()}/books/${currentPage}`);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    const fetchAuthors = async () => {
      try {
        const response = await axios.get(`${GetAPIURL()}/authors`);
        setAuthors(response.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchBooks();
    fetchAuthors();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleInputChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleAuthorChange = (selectedOption) => {
    setSelectedAuthor(selectedOption);
  };

  const handleAddBook = async () => {
    try {
      if (newBook.title === "") {
        alert("Please enter a title for the book.");
        return;
      }

      if (newBook.publishingYear === "") {
        alert("Please enter a publishing year for the book.");
        return;
      }

      if (newBook.cover_image === "") {
        alert("Please enter a cover image URL for the book.");
        return;
      }

      if (selectedAuthor?.value == null) {
        alert("Please select an author for the book.");
        return;
      }

      const authorResponse = await axios.get(
        `${GetAPIURL()}/authors/${selectedAuthor?.value}`
      );

      console.log("Author response:", authorResponse);

      if (!authorResponse.data) {
        alert("Please select a valid author for the book.");
        return;
      }

      await axios.post(`${GetAPIURL()}/books`, {
        ...newBook,
        author: selectedAuthor?.value, // Use the selected author's ID
      });
      setShowAddBookForm(false);
      setNewBook({
        title: "",
        publishingYear: "",
        cover_image: "",
        author: "",
      });
      setSelectedAuthor(null);
      // Refresh the book list
      const response = await axios.get(`${GetAPIURL()}/books/${currentPage}`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Books</h1>
      <p>Total Pages: {pages}</p>

      <button
        onClick={() => setShowAddBookForm(true)}
        className={styles.addButton}
      >
        Add Book
      </button>

      {showAddBookForm && (
        <div className={styles.addBookForm}>
          <h2>Add New Book</h2>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={newBook.title}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Publishing Year:
            <input
              type="text"
              name="publishingYear"
              value={newBook.publishingYear}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Cover Image URL:
            <input
              type="text"
              name="cover_image"
              value={newBook.cover_image}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Author:
            <Select
              value={selectedAuthor}
              onChange={handleAuthorChange}
              options={authors.map((author) => ({
                label: author.name,
                value: author._id,
              }))}
              isSearchable
              placeholder="Select or search for an author..."
            />
          </label>
          <button onClick={handleAddBook}>Add Book</button>
        </div>
      )}

      <ul className={styles.booksList}>
        {books.map((book) => (
          <li key={book._id} className={styles.bookItem}>
            <Link href={`/books/${book._id}`}>
              <img
                src={book.cover_image}
                alt={`${book.title}'s cover`}
                className={styles.bookCover}
              />
              <div className={styles.bookTitle}>{book.title}</div>
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.pagination}>
        <span>
          Page {currentPage} of {pages}
        </span>
        {Array.from({ length: pages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? styles.activePage : ""}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BooksList;
