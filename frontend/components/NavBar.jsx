// components/NavBar.js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

import { useBorrowList } from "../contexts/BorrowListProvider";

import GetAPIUrl from "../helpers/GetAPIUrl";

import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const router = useRouter();
  const borrowList = useBorrowList();

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [showSubNav, setShowSubNav] = useState(false);
  const [showAdminSubNav, setShowAdminSubNav] = useState(false);

  let timeout;

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
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <nav className={styles.navBar}>
      <div className={styles.leftNav}>
        <ul className={styles.navList}>
          <li onClick={() => router.push("/")}>Home</li>
          <li onClick={() => router.push("/books")}>Books</li>
          <li onClick={() => router.push("/authors")}>Authors</li>
        </ul>
      </div>
      <div className={styles.rightNav}>
        <ul className={styles.navList}>
          {loggedIn ? (
            <>
              <li onClick={() => router.push("/borrowlist")}>
                Borrow List {borrowList.length > 0 && `[${borrowList.length}]`}
              </li>
              {user.privilage >= 1 && (
                <li
                  onPointerEnter={() => setShowAdminSubNav(true)}
                  onPointerLeave={() => {
                    timeout = setTimeout(() => {
                      setShowAdminSubNav(false);
                    }, 100);
                  }}
                >
                  Admin
                  <ul
                    onPointerEnter={() => {
                      clearTimeout(timeout);
                      setShowAdminSubNav(true);
                    }}
                    onPointerLeave={() => {
                      setShowAdminSubNav(false);
                    }}
                    className={styles.subNavList}
                    style={{
                      display: showAdminSubNav ? "block" : "none",
                      transform: "translate(-70%, 25%)",
                    }}
                  >
                    <li onClick={() => router.push("/statistics")}>
                      Statistics
                    </li>
                    <li onClick={() => router.push("/users")}>Users</li>
                  </ul>
                </li>
              )}
              <li
                onPointerEnter={() => setShowSubNav(true)}
                onPointerLeave={() => {
                  timeout = setTimeout(() => {
                    setShowSubNav(false);
                  }, 100);
                }}
              >
                {user.username}
                <ul
                  onPointerEnter={() => {
                    clearTimeout(timeout);
                    setShowSubNav(true);
                  }}
                  onPointerLeave={() => {
                    setShowSubNav(false);
                  }}
                  className={styles.subNavList}
                  style={{
                    display: showSubNav ? "block" : "none",
                  }}
                >
                  <li onClick={() => router.push("/borrowed")}>Borrows</li>
                  <li onClick={() => router.push("/logout")}>Logout</li>
                </ul>
              </li>
            </>
          ) : (
            <li onClick={() => router.push("/login")}>Login / Register</li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
