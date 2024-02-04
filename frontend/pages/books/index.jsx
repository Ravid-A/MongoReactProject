import axios from "axios";

import GetAPIURL from "../../helpers/getAPIURL";

import Books from "../../components/Books";
import NavBar from "../../components/NavBar";

const BooksPage = ({ pages }) => {
  return (
    <>
      <NavBar />
      <Books pages={pages} />
    </>
  );
};

export async function getStaticProps() {
  try {
    // Fetch the total number of pages
    const response = await axios.get(`${GetAPIURL()}/books/pages`);
    const pages = response.data;

    return {
      props: {
        pages,
      },
    };
  } catch (error) {
    console.error("Error fetching total pages:", error);
    return {
      props: {
        pages: 0,
      },
    };
  }
}

export default BooksPage;
