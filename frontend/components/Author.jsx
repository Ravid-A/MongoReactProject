// pages/authors/about/[id].js
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import GetAPIUrl from "../helpers/GetAPIUrl";

import styles from "../styles/Author.module.css"; // Create this CSS module

const Author = () => {
  const router = useRouter();
  const { id } = router.query;

  const [author, setAuthor] = useState({
    name: "",
    country: "",
    image: "",
    books: [],
  });

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(`${GetAPIUrl()}/authors/${id}`);

        if (response.data === null) {
          throw new Error("Author not found");
        }

        setAuthor({ ...author, ...response.data });

        // Fetch books using the new route
        const booksResponse = await axios.get(
          `${GetAPIUrl()}/authors/${id}/books`
        );

        if (booksResponse.data !== null) {
          setAuthor((prevAuthor) => ({
            ...prevAuthor,
            books: booksResponse.data,
          }));
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    if (id) {
      fetchAuthor();
    }
  }, [id]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About {author.name}</h1>
      {author.image && (
        <img
          src={author.image}
          alt={`${author.name}'s profile`}
          className={styles.image}
        />
      )}
      <p>
        <strong>Name:</strong> {author.name}
      </p>
      <p>
        <strong>Country:</strong> {author.country}
      </p>
      <h2 className={styles.subtitle}>Books by {author.name}</h2>
      {author.books.length > 0 ? (
        <ul className={styles.booksList}>
          {author.books.map((book) => (
            <li key={book._id}>
              {book.cover_image && (
                <img
                  src={book.cover_image}
                  alt={`${book.title}'s cover`}
                  className={styles.bookCover}
                />
              )}
              <span className={styles.bookDetails}>
                <strong>{book.title}</strong>
                Published in {book.publishingYear}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books found for {author.name}</p>
      )}
    </div>
  );
};

export default Author;
