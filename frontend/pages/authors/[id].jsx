import { useState, useEffect } from "react";
import axios from "axios";

import GetAPIUrl from "../../helpers/GetAPIUrl";

import Author from "../../components/Authors/Author";

const AuthorPage = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(GetAPIUrl() + "/countries");
        setCountries(response.data.countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <>
      <Author countries={countries} />
    </>
  );
};

export default AuthorPage;
