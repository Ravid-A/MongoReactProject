import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import GetAPIUrl from "../helpers/GetAPIUrl";

const Statistics = () => {
  const router = useRouter();

  const [statistics, setStatistics] = useState(null);
  const [popularBooks, setPopularBooks] = useState(null);
  const [popularAuthors, setPopularAuthors] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const response = await axios.get(`${GetAPIUrl()}/users/me`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status !== 200) {
          localStorage.removeItem("token");
          router.push("/");
          return;
        }

        const user = response.data;

        if (!user.privilage) {
          router.push("/");
          return;
        }
      } catch (error) {
        console.error("An error occurred fetching user data", error);
        localStorage.removeItem("token");
        router.push("/");
      }
    };

    const fetchStatistics = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const response = await axios.get(`${GetAPIUrl()}/statistics`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status !== 200) {
          if (response.status === 401) {
            localStorage.removeItem("token");
          }

          router.push("/");
          return;
        }

        setStatistics(response.data);
      } catch (error) {
        console.error("An error occurred fetching statistics", error);
        router.push("/");
        return;
      }
    };

    const fetchPopularBooks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const response = await axios.get(`${GetAPIUrl()}/statistics/books`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status !== 200) {
          if (response.status === 401) {
            localStorage.removeItem("token");
          }

          router.push("/");
          return;
        }

        setPopularBooks(response.data);
      } catch (error) {
        console.error("An error occurred fetching popular books", error);
        router.push("/");
        return;
      }
    };

    const fetchPopularAuthors = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const response = await axios.get(`${GetAPIUrl()}/statistics/authors`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status !== 200) {
          if (response.status === 401) {
            localStorage.removeItem("token");
          }

          router.push("/");
          return;
        }

        setPopularAuthors(response.data);
      } catch (error) {
        console.error("An error occurred fetching popular authors", error);
        router.push("/");
        return;
      }
    };

    fetchUser();
    fetchStatistics();
    fetchPopularBooks();
    fetchPopularAuthors();
  }, []);

  return (
    <div>
      <h1>Statistics</h1>
      <p>
        <strong>Number of users:</strong> {statistics?.users || 0}
      </p>
      <p>
        <strong>Number of books:</strong> {statistics?.books || 0}
      </p>
      <p>
        <strong>Number of authors:</strong> {statistics?.authors || 0}
      </p>
      <p>
        <strong>Number of borrows:</strong> {statistics?.borrows || 0}
      </p>

      <h2>Popular Books</h2>
      <ul>
        {popularBooks?.map((book) => (
          <li key={book._id}>
            {book.title} - {book.precent}% of borrows
          </li>
        ))}
      </ul>

      <h2>Popular Authors</h2>
      <ul>
        {popularAuthors?.map((author) => (
          <li key={author._id}>
            {author.name} - {author.precent}% of borrows
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Statistics;
