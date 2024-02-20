// pages/login.js
import { useState, useEffect, use } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  faSpinner,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import LoggedInPopUP from "./LoggedInPopUP";

import styles from "../../styles/Users/LoginForm.module.css";

import GetAPIUrl from "../../helpers/GetAPIUrl";

const LoginForm = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleInputChange = (e) => {
    setError("");
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loggedIn) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${GetAPIUrl()}/users/login`,
        credentials,
        {
          validateStatus: (status) => {
            return status < 500;
          },
        }
      );

      if (response.status === 200) {
        // Login successful, redirect to another page or perform actions
        localStorage.setItem("token", response.data.token);
        router.push("/");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (!error.response) {
        setError("Network error, please try again later.");
        return;
      }

      setError(`Internal server error: ${error.response.data.message}`);
    } finally {
      setLoading(false);
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
      <form className={styles.form} onSubmit={handleLogin}>
        <h1>Login Page</h1>
        <label>
          Username/Email:
          <input
            type="text"
            name="identifier"
            value={credentials.identifier}
            onChange={handleInputChange}
            disabled={loggedIn || loading}
            required
          />
        </label>
        <label>
          Password:
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            disabled={loggedIn || loading}
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword(!showPassword)}
          />{" "}
          {showPassword ? "Hide" : "Show"} Password
        </label>
        <Link className={styles.Link} href="/register">
          Don't have an account? Register here
        </Link>
        <button type="submit" disabled={loggedIn || loading}>
          {loading ? (
            <>
              {"Logging in "}
              <FontAwesomeIcon icon={faSpinner} spinPulse />
            </>
          ) : (
            "Login"
          )}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
      {loggedIn && <LoggedInPopUP handleDisconnect={handleDisconnect} />}
    </div>
  );
};

export default LoginForm;
