// pages/authors/update/[id].js
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import CountryFlag from "react-country-flag";
import Select from "react-select";

import GetAPIUrl from "../helpers/GetAPIUrl";

import styles from "../styles/UpdateAuthor.module.css"; // Create this CSS module

const UpdateAuthor = ({ countries }) => {
  const router = useRouter();
  const { id } = router.query;

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryError, setCountryError] = useState("");
  const [author, setAuthor] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(`${GetAPIUrl()}/authors/${id}`);

        if (response.data === null) {
          throw new Error("Author not found");
        }

        setAuthor(response.data);
        setSelectedCountry(
          formatCountryOption({
            name: response.data.country,
            code: getCountryCode(response.data.country),
          })
        );
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
    if (!selectedCountry) {
      setCountryError("Please select a country");
      return;
    }

    e.preventDefault();

    try {
      await axios.put(`${GetAPIUrl()}/authors/${id}`, {
        ...author,
        country: selectedCountry.value,
      });
      router.push("/authors");
    } catch (error) {
      console.error("Error updating author:", error);
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
      <h1 className={styles.title}>Update Author</h1>
      <form className={styles.form} onSubmit={handleUpdateAuthor}>
        <label className={styles.label}>
          Name:
          <input
            type="text"
            name="name"
            value={author.name}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Country:
          <Select
            options={countries.map(formatCountryOption)}
            value={selectedCountry}
            onChange={(selectedOption) => {
              setSelectedCountry(selectedOption);
            }}
          />
          {countryError && <p className={styles.error}>{countryError}</p>}
        </label>
        <label className={styles.label}>
          Image:
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
