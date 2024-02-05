// components/NavBar.js
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const router = useRouter();
  return (
    <nav className={styles.navBar}>
      <div className={styles.leftNav}>
        <ul className={styles.navList}>
          <li onClick={() => router.push("/")}>Home</li>
          <li onClick={() => router.push("/books")}>Books</li>
          <li onClick={() => router.push("/authors")}>Authors</li>
          {/* Add more links for other pages */}
        </ul>
      </div>
      <div className={styles.rightNav} onClick={() => router.push("/cart")}>
        Cart
      </div>
    </nav>
  );
};

export default NavBar;
