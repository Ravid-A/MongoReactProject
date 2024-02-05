import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Select from "react-select";

import GetAPIUrl from "../helpers/GetAPIUrl";

import styles from "../styles/Books.module.css";

const BooksList = () => {
  const [pages, setPages] = useState(1);
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
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [authorError, setAuthorError] = useState("");

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchValue(""); // Clear previous search value when changing search type
  };

  const handleSearch = async () => {
    try {
      let searchEndpoint = "";

      setCurrentPage(1); // Reset to the first page when searching

      switch (searchType) {
        case "title":
          searchEndpoint = `search/1?str=${searchValue}`;
          break;
        case "genre":
          searchEndpoint = `genre/1?str=${searchValue}`;
          break;
        case "country":
          searchEndpoint = `country/1?str=${searchValue}`;
          break;
        case "publishedYear":
          searchEndpoint = `published/1?str=${searchValue}`;
          break;
      }

      if (searchType) {
        const response = await axios.get(
          `${GetAPIUrl()}/books/${searchEndpoint}`
        );
        setBooks(response.data.books);
        setPages(response.data.pageCount);
      } else {
        const response = await axios.get(`${GetAPIUrl()}/books/1`);
        setBooks(response.data);

        const response2 = await axios.get(`${GetAPIUrl()}/books/pages`);
        setPages(response2.data);
      }
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Fetch books for the current page
        const response = await axios.get(`${GetAPIUrl()}/books/${currentPage}`);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    const fetchPages = async () => {
      try {
        // Fetch the total number of pages
        const response = await axios.get(`${GetAPIUrl()}/books/pages`);
        setPages(response.data);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    const fetchAuthors = async () => {
      try {
        const response = await axios.get(`${GetAPIUrl()}/authors`);
        setAuthors(response.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchPages();
    fetchBooks();
    fetchAuthors();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleInputChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleAuthorChange = (selectedOptions) => {
    setSelectedAuthors(selectedOptions);
  };

  const handleAddBook = async () => {
    // Check if at least one author is selected
    if (selectedAuthors.length === 0) {
      setAuthorError("Please select at least one author.");
      return;
    }

    try {
      const authorIds = selectedAuthors.map((author) => author.value);

      await axios.post(`${GetAPIUrl()}/books`, {
        ...newBook,
        authors: authorIds,
      });

      setShowAddBookForm(false);
      setNewBook({
        title: "",
        publishingYear: "",
        cover_image: "",
      });
      setSelectedAuthors([]);
      setAuthorError(""); // Clear the validation error

      // Refresh the book list
      const response = await axios.get(`${GetAPIUrl()}/books/${currentPage}`);
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
              value={selectedAuthors}
              onChange={handleAuthorChange}
              options={authors.map((author) => ({
                label: author.name,
                value: author._id,
              }))}
              isMulti
              isSearchable
              placeholder="Select or search for authors..."
            />
            {authorError && (
              <p className={styles.validationError}>{authorError}</p>
            )}
          </label>
          <button onClick={handleAddBook}>Add Book</button>
          <button
            style={{ marginLeft: 10 }}
            onClick={() => setShowAddBookForm(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <div className={styles.searchOptions}>
        <label>
          Search Type:
          <br />
          <select value={searchType} onChange={handleSearchTypeChange}>
            <option value="">None</option>
            <option value="title">String in Title</option>
            <option value="genre">By Genre</option>
            <option value="country">By Country of Author</option>
            <option value="publishedYear">By Publishing Year Range</option>
          </select>
        </label>
        <br />
        {searchType && (
          <label>
            Search Value:
            <br />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </label>
        )}

        <button onClick={handleSearch}>Search</button>
      </div>

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
