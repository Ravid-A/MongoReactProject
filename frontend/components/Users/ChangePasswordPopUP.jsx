import { useRouter } from "next/router";
import { useState } from "react";

import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";

import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../../styles/Users/ChangePasswordPopUP.module.css";

import GetAPIUrl from "../../helpers/GetAPIUrl";

export default function ChangePasswordPopUP({ setChangePassword }) {
  const router = useRouter();

  const [user, setUser] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    msg: "",
  });

  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.id]: event.target.value, msg: "" });
  };

  const handleCancel = () => {
    setChangePassword(false);
  };

  const handleUpdate = () => {
    if (!user.oldPassword || !user.newPassword || !user.confirmPassword) {
      setUser({ ...user, msg: "Please fill all the fields" });
      return;
    }

    if (user.newPassword.length < 8) {
      setUser({ ...user, msg: "Password must be at least 8 characters" });
      return;
    }

    if (user.newPassword !== user.confirmPassword) {
      setUser({ ...user, msg: "Passwords do not match" });
      return;
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setUser({ ...user, msg: "" });
      setLoading(true);

      const token = localStorage.getItem("token");
      const url = GetAPIUrl() + "/users/updatepassword";
      const data = {
        old_password: user.oldPassword,
        new_password: user.newPassword,
      };

      if (!token) {
        router.push("/");
      }

      const response = await axios.patch(url, data, {
        headers: {
          Authorization: token,
        },
        validateStatus: (status) => {
          return status < 500;
        },
      });

      const update = await response.data;

      if (response.status !== 200) {
        setUser({ ...user, msg: update.message });
        return;
      }

      setChangePassword(false);
    } catch (error) {
      if (!error.response) {
        setUser({
          ...user,
          msg: `Internal Server Error: ${error.message}`,
        });
        return;
      }

      setUser({
        ...user,
        msg: `Internal Server Error: ${error.response.data.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.PopUp}>
      <h1>Change Password</h1>

      <input
        id="oldPassword"
        type={showOldPassword ? "text" : "password"}
        placeholder="Old Password"
        value={user.oldPassword}
        onChange={handleChange}
        disabled={loading}
      />
      <div
        className={styles.showPasswordButton}
        onClick={handleShowOldPassword}
      >
        <FontAwesomeIcon icon={showOldPassword ? faEye : faEyeSlash} />
      </div>
      <input
        id="newPassword"
        type={showNewPassword ? "text" : "password"}
        placeholder="New Password"
        value={user.newPassword}
        onChange={handleChange}
        disabled={loading}
      />
      <div
        className={styles.showPasswordButton}
        onClick={handleShowNewPassword}
      >
        <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
      </div>
      <input
        id="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm New Password"
        value={user.confirmPassword}
        onChange={handleChange}
        disabled={loading}
      />
      <div
        className={styles.showPasswordButton}
        onClick={handleShowConfirmPassword}
      >
        <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
      </div>

      <br />
      <br />

      <button
        className={styles.UpdateButton}
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <>
            {"Changing "}
            <FontAwesomeIcon icon={faSpinner} spinPulse />
          </>
        ) : (
          "Change Password"
        )}
      </button>
      <button
        className={styles.CancelButton}
        onClick={handleCancel}
        disabled={loading}
      >
        Cancel
      </button>

      <div className={styles.msg}>{user.msg}</div>
    </div>
  );
}
