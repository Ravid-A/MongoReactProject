// Authors.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

import GetAPIURL from "../helpers/getAPIURL";

import styles from "../styles/Authors.module.css";

const Authors = () => {
  const router = useRouter();
  const [authors, setAuthors] = useState([]);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    country: "",
  });

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get(GetAPIURL() + "/authors");
        setAuthors(response.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchAuthors();
  }, []);

  const handleInputChange = (e) => {
    setNewAuthor({ ...newAuthor, [e.target.name]: e.target.value });
  };

  const handleCreateAuthor = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(GetAPIURL() + "/authors", newAuthor);
      setAuthors([...authors, response.data]);
      setNewAuthor({
        name: "",
        country: "",
      });
    } catch (error) {
      console.error("Error creating author:", error);
    }
  };

  const handleUpdateAuthor = (authorId) => {
    router.push(`/authors/update/${authorId}`);
  };

  const handleDeleteAuthor = async (authorId) => {
    try {
      await axios.delete(`${GetAPIURL()}/authors/${authorId}`);
      setAuthors(authors.filter((author) => author._id !== authorId));
    } catch (error) {
      console.error("Error deleting author:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Authors</h1>
      <form className={styles.form} onSubmit={handleCreateAuthor}>
        <label className={styles.label}>
          Author Name:
          <input
            type="text"
            name="name"
            value={newAuthor.name}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Author Country:
          <input
            type="text"
            name="country"
            value={newAuthor.country}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Author Image:
          <input
            type="text"
            name="image"
            value={newAuthor.image}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>
          Create Author
        </button>
      </form>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headerCell}>Image</th>
            <th className={styles.headerCell}>Name</th>
            <th className={styles.headerCell}>Country</th>
            <th className={styles.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author._id}>
              <td className={styles.cell}>
                {author.image && (
                  <img
                    src={author.image}
                    alt={`${author.name}'s profile`}
                    className={styles.image}
                  />
                )}
              </td>
              <td className={styles.cell}>
                <Link href={`/authors/${author._id}`}>{author.name}</Link>
              </td>
              <td className={styles.cell}>{author.country}</td>
              <td className={styles.cell}>
                <button
                  onClick={() => handleUpdateAuthor(author._id)}
                  className={styles.button}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteAuthor(author._id)}
                  className={styles.button + " " + styles.deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
