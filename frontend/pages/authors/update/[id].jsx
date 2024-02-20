import { useState, useEffect } from "react";
import axios from "axios";

import GetAPIUrl from "../../../helpers/GetAPIUrl";

import UpdateAuthor from "../../../components/Authors/UpdateAuthor";
import NavBar from "../../../components/NavBar";

const UpdateAuthorPage = () => {
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
      <NavBar />
      <UpdateAuthor countries={countries} />
    </>
  );
};

export default UpdateAuthorPage;
