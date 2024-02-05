import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../styles/PopularBooks.module.css";

const PopularBooks = ({ books }) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Popular Books</h2>
      <Link className={styles.viewAll} href="/books">
        View All Books
      </Link>
      <div className={styles.info}>
        <p>Check out the most popular books in our collection.</p>
        <p>Click on a book to view more details.</p>
      </div>

      <ul>
        {books.map((book) => (
          <li
            key={book._id}
            className={styles.book}
            onClick={() => router.push(`/books/${book._id}`)}
          >
            <img src={book.cover_image} alt={book.title} />
            {book.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularBooks;
