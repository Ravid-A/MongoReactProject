// pages/register.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../styles/RegisterForm.module.css";

import GetAPIUrl from "../helpers/GetAPIUrl";

import LoggedInPopUP from "./LoggedInPopUP";

const RegisterForm = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleInputChange = (e) => {
    setError("");
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loggedIn) return;

    if (credentials.password !== credentials.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${GetAPIUrl()}/users/register`,
        credentials,
        {
          validateStatus: (status) => {
            return status < 500;
          },
        }
      );

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        return router.push("/");
      }

      setError(response.data.message);
    } catch (error) {
      if (!error.response) {
        setError("Network error, please try again later.");
        return;
      }

      setError(`Registration error: ${error.response.data.message}`);
    }
  };

  const checkToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await axios.get(`${GetAPIUrl()}/users/me`, {
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

      setLoggedIn(true);
    } catch (error) {
      localStorage.removeItem("token");
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleRegister}>
        <h1>Registration Page</h1>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleInputChange}
            disabled={loggedIn}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            disabled={loggedIn}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            disabled={loggedIn}
            required
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            name="confirm_password"
            value={credentials.confirm_password}
            onChange={handleInputChange}
            disabled={loggedIn}
            required
          />
        </label>
        <button type="submit" disabled={loggedIn}>
          Register
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
      {loggedIn && <LoggedInPopUP handleDisconnect={handleDisconnect} />}
    </div>
  );
};

export default RegisterForm;
