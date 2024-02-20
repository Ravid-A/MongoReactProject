import { useRouter } from "next/router";
import { useState } from "react";

import { faSpinner, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../../styles/User/Settings.module.css";

import DeleteAccountPopUP from "./DeleteAccountPopUP";
import ChangePasswordPopUP from "./ChangePasswordPopUP";

const Settings = ({ handleSubmit, user, setUser, loading }) => {
  const router = useRouter();

  const [popup, setPopup] = useState("none");

  const handleBackButton = () => {
    if (loading || popup !== "none") return;

    router.push("/");
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.id]: event.target.value, msg: "" });
  };

  const handleUpdate = () => {
    handleSubmit();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleChangePassword = () => {
    setPopup("change_password");
  };

  const handleDelete = () => {
    setPopup("delete_account");
  };

  return (
    <div className={styles.settings}>
      <div className={styles.settings_container}>
        <div
          className={styles.backButton}
          disabled={loading || popup != "none"}
          onClick={handleBackButton}
        >
          <FontAwesomeIcon icon={faLeftLong} />
        </div>
        <div className={styles.Titles}>
          <div className={styles.Title}>2048</div>
          <div className={styles.SubTitle}>Multiplayer</div>
        </div>

        <h2 className={styles.page_title}>Settings</h2>
        <div className={styles.settings_form}>
          <div className={styles.settings_form}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              onChange={handleChange}
              disabled={loading || popup !== "none"}
              placeholder={user.placeholder.username}
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              onChange={handleChange}
              disabled={loading || popup !== "none"}
              placeholder={user.placeholder.email}
            />
            {user.msg && <div className={styles.error}>{user.msg}</div>}
            <br />
            <button
              className={styles.update_button}
              onClick={handleUpdate}
              disabled={loading || popup !== "none"}
            >
              {loading ? (
                <>
                  {"Updating "}
                  <FontAwesomeIcon icon={faSpinner} spinPulse />
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
          <br />
          <br />

          <button
            className={styles.change_password_button}
            onClick={handleChangePassword}
            disabled={loading || popup !== "none"}
          >
            Change Password
          </button>
          <br />
          <br />
          <button
            className={styles.delete_button}
            onClick={handleDelete}
            disabled={loading || popup !== "none"}
          >
            Delete Account
          </button>
          <br />
          <br />
          <button
            className={styles.logout_button}
            onClick={handleLogout}
            disabled={loading || popup !== "none"}
          >
            Logout
          </button>
        </div>
      </div>
      {popup === "change_password" && (
        <ChangePasswordPopUP setPopup={setPopup} />
      )}

      {popup === "delete_account" && <DeleteAccountPopUP setPopup={setPopup} />}
    </div>
  );
};

export default Settings;
