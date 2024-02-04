import Link from "next/link";
import NavBar from "../components/NavBar";
import styles from "../styles/Home.module.css";

const HomePage = () => {
  return (
    <div>
      <NavBar />
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
        {/* Add more content or links as needed */}
      </div>
    </div>
  );
};

export default HomePage;
