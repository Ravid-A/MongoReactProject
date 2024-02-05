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
  });
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [authorError, setAuthorError] = useState("");
  const [genresError, setGenresError] = useState("");

  const fetchBooks = async () => {
    try {
      // Fetch books for the current page
      const response = await axios.get(`${GetAPIUrl()}/books/${currentPage}`);
      setBooks(response.data);

      // Fetch the total number of pages
      const response2 = await axios.get(`${GetAPIUrl()}/books/pages`);
      setPages(response2.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchValue(""); // Clear previous search value when changing search type

    if (e.target.value === "") {
      fetchBooks();
    }
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
          searchEndpoint = `genre/1?genre=${searchValue.value}`;
          break;
        case "country":
          searchEndpoint = `country/1?str=${searchValue}`;
          break;
        case "publishedYear":
          const years = searchValue.split("-");
          searchEndpoint = `published/1?startYear=${years[0]}&endYear=${years[1]}`;
          break;
      }

      if (searchType) {
        const response = await axios.get(
          `${GetAPIUrl()}/books/${searchEndpoint}`
        );

        console.log("Search results:", response.data);
        setBooks(response.data.books);
        setPages(response.data.pageCount);
      } else {
        fetchBooks();
      }
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get(`${GetAPIUrl()}/authors`);
        setAuthors(response.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${GetAPIUrl()}/books/genres`);
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchBooks();
    fetchAuthors();
    fetchGenres();
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

  const handleGenreChange = (selectedOptions) => {
    setSelectedGenres(selectedOptions);
  };

  const handleAddBook = async () => {
    // Check if at least one author is selected
    if (selectedAuthors.length === 0) {
      setAuthorError("Please select at least one author.");
      return;
    }

    if (selectedGenres.length === 0) {
      setGenresError("Please select at least one genre.");
      return;
    }

    try {
      const authorsIds = selectedAuthors.map((author) => author.value);
      const genresValues = selectedGenres.map((genre) => genre.value);

      await axios.post(`${GetAPIUrl()}/books`, {
        ...newBook,
        authors: authorsIds,
        genres: genresValues,
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
            Genres:
            <Select
              value={selectedGenres}
              onChange={handleGenreChange}
              options={genres.map((genre) => ({
                label: genre,
                value: genre,
              }))}
              isMulti
              isSearchable
              placeholder="Select or search for genres..."
            />
            {genresError && (
              <p className={styles.validationError}>{genresError}</p>
            )}
          </label>
          <label>
            Authors:
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
            {searchType === "publishedYear" && (
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="e.g. 1990-2000"
              />
            )}
            {searchType === "genre" && (
              <Select
                value={searchValue}
                onChange={(selectedOptions) => setSearchValue(selectedOptions)}
                options={genres.map((genre) => ({
                  label: genre,
                  value: genre,
                }))}
                isSearchable
                placeholder="Select or search for genres..."
              />
            )}
            {searchType !== "publishedYear" && searchType !== "genre" && (
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            )}
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
