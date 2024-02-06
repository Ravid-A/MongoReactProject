// components/BorrowList.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  useBorrowList,
  useBorrowListUpdate,
} from "../contexts/BorrowListProvider";
import axios from "axios";
import GetAPIUrl from "../helpers/GetAPIUrl";
import styles from "../styles/BorrowList.module.css";
import Link from "next/link";

const BorrowList = () => {
  const router = useRouter();

  const borrowList = useBorrowList();
  const setBorrowList = useBorrowListUpdate();

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${GetAPIUrl()}/books/0`);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
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
          router.push("/login");
          return;
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchUser();
    fetchBooks();
  }, []);

  const removeFromList = (id) => {
    setBorrowList((prevBorrowList) => {
      return prevBorrowList.filter((item) => item.id !== id);
    });
  };

  const clearList = () => {
    setBorrowList([]);
  };

  const increaseQuantity = (id) => {
    setBorrowList((prevBorrowList) => {
      return prevBorrowList.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );
    });
  };

  const decreaseQuantity = (id) => {
    setBorrowList((prevBorrowList) => {
      return prevBorrowList.map((item) =>
        item.id === id && item.amount > 1
          ? { ...item, amount: item.amount - 1 }
          : item
      );
    });
  };

  const handleBorrow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await axios.post(
        `${GetAPIUrl()}/borrows`,
        {
          books: borrowList,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setBorrowList([]);
      router.push("/borrowed");
    } catch (error) {
      console.error("Error borrowing books:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Borrow Book List</h2>
      <ul className={styles.list}>
        {books.length > 0 &&
          borrowList.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <button
                className={`${styles.actionButton} ${styles.removeButton}`}
                onClick={() => removeFromList(item.id)}
              >
                x
              </button>
              <img
                src={books.find((book) => book._id === item.id).cover_image}
                className={styles.cover}
              />
              <Link href={`/books/${item.id}`} className={styles.title}>
                {books.find((book) => book._id === item.id).title}
              </Link>
              <span className={styles.quantity}>Amount: {item.amount}</span>
              <div className={styles.buttonsContainer}>
                <button
                  className={`${styles.actionButton} ${styles.increaseButton}`}
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>
                <button
                  className={`${styles.actionButton} ${styles.decreaseButton}`}
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>
              </div>
            </li>
          ))}
      </ul>

      {borrowList.length === 0 ? (
        <>
          <p className={styles.emptyCartMessage}>Your cart is empty</p>
          <button
            className={styles.returnButton}
            onClick={() => router.push("/")}
          >
            Return to Home
          </button>
        </>
      ) : (
        <>
          <button className={styles.borrowButton} onClick={handleBorrow}>
            Borrow
          </button>
          <button className={styles.clearButton} onClick={clearList}>
            Clear List
          </button>
        </>
      )}
    </div>
  );
};

export default BorrowList;
