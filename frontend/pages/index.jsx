import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

import GetAPIUrl from "../helpers/GetAPIUrl";

import PopularAuthors from "../components/MainPage/PopularAuthors";
import PopularBooks from "../components/MainPage/PopularBooks";
import NavBar from "../components/NavBar";

import styles from "../styles/Home.module.css";

const HomePage = () => {
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchPopularAuthors = async () => {
      try {
        const response = await axios.get(`${GetAPIUrl()}/statistics/authors`);
        setAuthors(response.data);
      } catch (error) {
        console.error("Error fetching popular authors:", error);
      }
    };

    const fetchPopularBooks = async () => {
      try {
        const response = await axios.get(`${GetAPIUrl()}/statistics/books`);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching popular books:", error);
      }
    };

    fetchPopularAuthors();
    fetchPopularBooks();
  }, []);

  return (
    <div className={styles.page}>
      <NavBar />
      <br />
      <div className={styles.container}>
        <h1 className={styles.heading}>Welcome to My Library</h1>
        <p className={styles.subheading}>
          Explore our collection of books and authors.
        </p>
        <Link href="/books" className={styles.linkButton}>
          View Books
        </Link>
        <Link href="/authors" className={styles.linkButton}>
          View Authors
        </Link>
      </div>

      {authors.length > 0 && <PopularAuthors authors={authors} />}
      {books.length > 0 && <PopularBooks books={books} />}
    </div>
  );
};

export default HomePage;
