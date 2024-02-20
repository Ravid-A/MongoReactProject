// components/BorrowItem.js
import { useState, useEffect } from "react";
import axios from "axios";
import GetAPIUrl from "../../helpers/GetAPIUrl";
import styles from "../../styles/Borrows/BorrowItem.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

const BorrowItem = ({ borrow, onReturn }) => {
  const router = useRouter();

  const [error, setError] = useState("");

  const handleReturn = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.put(
        `${GetAPIUrl()}/borrows/${borrow._id}/return`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          validateStatus: (status) => {
            return status < 500;
          },
        }
      );

      if (response.status !== 200) {
        setError(response.data.message);
        return;
      }

      onReturn();
    } catch (error) {
      console.error("Error returning borrow:", error);

      if (error.response && error.response.data) {
        setError(`Internal Server Error: ${error.response.data.message}`);
        return;
      }

      setError(`Internal Server Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const now = new Date();
    const returnDate = new Date(borrow.returnDate);

    if (now > returnDate && !borrow.returned) {
      handleReturn();
    }
  }, []);

  return (
    <div className={styles.borrowItem}>
      <h3>
        Borrow Date:{" "}
        {new Date(borrow.date).toLocaleDateString() +
          " " +
          new Date(borrow.date).toLocaleTimeString()}
      </h3>

      {borrow.returned ? (
        <h3>
          Returned Date:{" "}
          {new Date(borrow.returnedDate).toLocaleDateString() +
            " " +
            new Date(borrow.returnedDate).toLocaleTimeString()}
        </h3>
      ) : (
        <h3>
          Return Due Date:{" "}
          {new Date(borrow.returnDate).toLocaleDateString() +
            " " +
            new Date(borrow.returnDate).toLocaleTimeString()}
        </h3>
      )}
      <ul className={styles.booksList}>
        {borrow.items.map((item) => (
          <li key={item.book._id} className={styles.bookItem}>
            <img
              src={item.book.cover_image}
              alt={item.book.title}
              className={styles.cover}
            />
            <Link href={`/books/${item.book._id}`} className={styles.title}>
              {item.book.title}
            </Link>
            <span className={styles.quantity}>Amount: {item.amount}</span>
          </li>
        ))}
      </ul>
      {error && <p className={styles.error}>{error}</p>}
      <button
        className={styles.returnButton}
        onClick={handleReturn}
        disabled={borrow.returned}
      >
        {borrow.returned ? "Returned" : "Return"}
      </button>
    </div>
  );
};

export default BorrowItem;
