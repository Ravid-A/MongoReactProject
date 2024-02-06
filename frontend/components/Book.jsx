// pages/books/about/[id].js
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/Book.module.css";

import { useBorrowListUpdate } from "../contexts/BorrowListProvider";

import GetAPIUrl from "../helpers/GetAPIUrl";

const Book = () => {
  const router = useRouter();

  const setBorrowList = useBorrowListUpdate();

  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${GetAPIUrl()}/books/book/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await axios.get(`${GetAPIUrl()}/users/me`, {
          headers: {
            Authorization: token,
          },
          validateStatus: (status) => {
            return status < 500;
          },
        });

        if (response.status !== 200) {
          localStorage.removeItem("token");
          return;
        }

        setLoggedIn(true);
      } catch (error) {
        console.error("Error checking token:", error);
        localStorage.removeItem("token");
      }
    };

    if (id) {
      fetchBook();
      checkToken();
    }
  }, [id]);

  const handleAddToBorrowList = () => {
    setBorrowList((prevBorrowList) => {
      const item = prevBorrowList.find((item) => item.id === book._id);
      if (item) {
        const index = prevBorrowList.indexOf(item);
        prevBorrowList[index].amount += 1;
        return [...prevBorrowList];
      }

      return [
        ...prevBorrowList,
        {
          id: book._id,
          amount: 1,
        },
      ];
    });
  };

  return (
    <div className={styles.bookAboutContainer}>
      {book ? (
        <div className={styles.bookDetails}>
          <img
            src={book.cover_image}
            alt={`${book.title} Cover`}
            className={styles.bookCover}
          />
          <div className={styles.bookInfo}>
            <h1>{book.title}</h1>
            <p>
              Author:{" "}
              {book.authors.map((author, index) => (
                <>
                  <Link
                    style={{
                      color: "blue",
                      textDecoration: "none",
                    }}
                    href={`/authors/${author._id}`}
                    key={author._id}
                  >
                    {author.name}
                  </Link>
                  {index < book.authors.length - 1 && ", "}
                </>
              ))}
            </p>
            <p>Publishing Year: {book.publishingYear}</p>
            <p>Genres: {book.genres.join(", ")}</p>
            <p>Quantity: {book.quantity}</p>
          </div>

          {loggedIn && (
            <button
              onClick={handleAddToBorrowList}
              className={styles.actionButton}
              disabled={book.quantity <= 0}
            >
              {book.quantity <= 0 ? "Out of Stock" : "Add to Borrow List"}
            </button>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Book;
