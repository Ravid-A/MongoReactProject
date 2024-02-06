// Authors.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import Select from "react-select";
import CountryFlag from "react-country-flag";

import GetAPIUrl from "../helpers/GetAPIUrl";

import styles from "../styles/Authors.module.css";

const Authors = () => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [authors, setAuthors] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryError, setCountryError] = useState("");
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get(GetAPIUrl() + "/authors");
        setAuthors(response.data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await axios.get(GetAPIUrl() + "/countries");
        setCountries(response.data.countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await axios.get(GetAPIUrl() + "/users/me", {
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

        setUser(response.data);
      } catch (error) {
        console.error("Error checking token:", error);
        localStorage.removeItem("token");
      }
    };

    checkToken();
    fetchAuthors();
    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    setNewAuthor({ ...newAuthor, [e.target.name]: e.target.value });
  };

  const handleCreateAuthor = async (e) => {
    e.preventDefault();

    if (!selectedCountry) {
      setCountryError("Please select a country");
      return;
    }

    try {
      const response = await axios.post(GetAPIUrl() + "/authors", {
        ...newAuthor,
        country: selectedCountry.value,
      });
      setAuthors([...authors, response.data]);
      setNewAuthor({
        name: "",
        country: "",
        image: "",
      });
      setSelectedCountry(null);
    } catch (error) {
      console.error("Error creating author:", error);
    }
  };

  const handleUpdateAuthor = (authorId) => {
    router.push(`/authors/update/${authorId}`);
  };

  const handleDeleteAuthor = async (authorId) => {
    try {
      await axios.delete(`${GetAPIUrl()}/authors/${authorId}`);
      setAuthors(authors.filter((author) => author._id !== authorId));
    } catch (error) {
      console.error("Error deleting author:", error);
    }
  };

  const getCountryCode = (country) => {
    const countryData = countries.find((c) => c.name === country);
    return countryData ? countryData.code : "";
  };

  const formatCountry = (country) => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <CountryFlag
          className="emojiFlag"
          countryCode={country.code}
          svg
          style={{ marginRight: "8px", fontSize: "1.5em" }}
        />
        <span>{country.name}</span>
      </div>
    );
  };

  const formatCountryOption = (country) => ({
    value: country.name,
    label: formatCountry(country),
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Authors</h1>
      {user.privilage > 0 && (
        <form className={styles.form} onSubmit={handleCreateAuthor}>
          <h2 className={styles.subtitle}>Create Author</h2>
          <label className={styles.label}>
            Name:
            <input
              type="text"
              name="name"
              value={newAuthor.name}
              onChange={handleInputChange}
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Country:
            <Select
              options={countries.map(formatCountryOption)}
              value={selectedCountry}
              onChange={(selectedCountry) => {
                setSelectedCountry(selectedCountry);
                setCountryError("");
              }}
            />
            {countryError && <p className={styles.error}>{countryError}</p>}
          </label>

          <label className={styles.label}>
            Image:
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
      )}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headerCell}>Image</th>
            <th className={styles.headerCell}>Name</th>
            <th className={styles.headerCell}>Country</th>
            {user.privilage >= 1 && (
              <th className={styles.headerCell}>Actions</th>
            )}
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
              <td className={styles.cell}>
                {formatCountry({
                  name: author.country,
                  code: getCountryCode(author.country),
                })}
              </td>
              {user.privilage >= 1 && (
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
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
