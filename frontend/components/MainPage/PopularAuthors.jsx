import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../../styles/MainPage/PopularAuthors.module.css";

const PopularAuthors = ({ authors }) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Popular Authors</h2>
      <Link className={styles.viewAll} href="/authors">
        View All Authors
      </Link>
      <div className={styles.info}>
        <p>Check out books by these popular authors.</p>
        <p>Click on an author to view their books.</p>
      </div>

      <ul>
        {authors.map((author) => (
          <li
            className={styles.author}
            key={author._id}
            onClick={() => router.push(`/authors/${author._id}`)}
          >
            <img src={author.image} alt={author.name} />
            {author.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularAuthors;
