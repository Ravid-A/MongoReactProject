// pages/borrows.js
import { useEffect, useState } from "react";
import axios from "axios";
import BorrowItem from "./BorrowItem";
import GetAPIUrl from "../../helpers/GetAPIUrl";
import styles from "../../styles/Borrows/Borrows.module.css";
import { useRouter } from "next/router";

const Borrows = () => {
  const router = useRouter();

  const [borrows, setBorrows] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const fetchBorrows = async (all) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${GetAPIUrl()}/borrows/me/${parseInt(all == true ? 1 : 0)}`,
        {
          headers: {
            Authorization: token,
          },
          validateStatus: (status) => {
            return status < 500;
          },
        }
      );
      setBorrows(response.data);
    } catch (error) {
      console.error("Error fetching borrows:", error);
    }
  };

  const handleShowAll = (e) => {
    const all = e.target.checked;
    setShowAll(all);
    fetchBorrows(all);
  };

  useEffect(() => {
    fetchBorrows(showAll);
  }, []);

  const handleReturn = (borrowId) => {
    setBorrows((prevBorrows) =>
      prevBorrows.filter((borrow) => borrow._id !== borrowId)
    );
  };

  return (
    <div className={styles.container}>
      <h1>Your Borrows</h1>
      <label className={styles.checkbox}>
        <input value={showAll} type="checkbox" onChange={handleShowAll} />
        Show All Returns
      </label>
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
