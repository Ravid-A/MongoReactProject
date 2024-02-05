import axios from "axios";

import GetAPIUrl from "../../helpers/GetAPIUrl";

import Books from "../../components/Books";
import NavBar from "../../components/NavBar";

const BooksPage = () => {
  return (
    <>
      <NavBar />
      <Books />
    </>
  );
};

export default BooksPage;
