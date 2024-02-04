// components/NavBar.js
import Link from "next/link";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  return (
    <nav className={styles.navBar}>
      <div className={styles.leftNav}>
        <ul className={styles.navList}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/books">Books</Link>
          </li>
          <li>
            <Link href="/authors">Authors</Link>
          </li>
          {/* Add more links for other pages */}
        </ul>
      </div>
      <div className={styles.rightNav}>
        <Link href="/cart" className={styles.cartButton}>
          Cart
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
