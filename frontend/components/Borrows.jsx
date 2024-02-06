// pages/borrows.js
import { useEffect, useState } from "react";
import axios from "axios";
import BorrowItem from "../components/BorrowItem";
import GetAPIUrl from "../helpers/GetAPIUrl";
import styles from "../styles/Borrows.module.css";
import { useRouter } from "next/router";

const Borrows = () => {
  const router = useRouter();

  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    const fetchBorrows = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(`${GetAPIUrl()}/borrows/me`, {
          headers: {
            Authorization: token,
          },
          validateStatus: (status) => {
            return status < 500;
          },
        });
        setBorrows(response.data);
      } catch (error) {
        console.error("Error fetching borrows:", error);
      }
    };

    fetchBorrows();
  }, []);

  const handleReturn = (borrowId) => {
    setBorrows((prevBorrows) =>
      prevBorrows.filter((borrow) => borrow._id !== borrowId)
    );
  };

  return (
    <div className={styles.container}>
      <h1>Your Borrows</h1>
      <div className={styles.borrowList}>
        {borrows.map((borrow) => (
          <BorrowItem
            key={borrow._id}
            borrow={borrow}
            onReturn={handleReturn}
          />
        ))}

        {borrows.length <= 0 && (
          <p className={styles.emptyMessage}>No books borrowed yet</p>
        )}
      </div>
    </div>
  );
};

export default Borrows;
