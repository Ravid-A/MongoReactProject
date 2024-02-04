// pages/authors/update/[id].js
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import GetAPIURL from "../helpers/getAPIURL";

import styles from "../styles/UpdateAuthor.module.css"; // Create this CSS module

const UpdateAuthor = () => {
  const router = useRouter();
  const { id } = router.query;

  const [author, setAuthor] = useState({
    name: "",
    country: "",
    image: "",
  });

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(`${GetAPIURL()}/authors/${id}`);

        if (response.data === null) {
          throw new Error("Author not found");
        }

        setAuthor(response.data);
      } catch (error) {
        console.error("Error fetching author:", error);
        router.push("/authors");
      }
    };

    if (id) {
      fetchAuthor();
    }
  }, [id]);

  const handleInputChange = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  const handleUpdateAuthor = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${GetAPIURL()}/authors/${id}`, author);
      router.push("/authors");
    } catch (error) {
      console.error("Error updating author:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Update Author</h1>
      <form className={styles.form} onSubmit={handleUpdateAuthor}>
        <label className={styles.label}>
          Author Name:
          <input
            type="text"
            name="name"
            value={author.name}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Author Country:
          <input
            type="text"
            name="country"
            value={author.country}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Author Image:
          <input
            type="text"
            name="image"
            value={author.image}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>
          Update Author
        </button>
      </form>
    </div>
  );
};

export default UpdateAuthor;
