import { useState } from "react";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "../../styles/Users/Settings.module.css";

import ChangePasswordPopUP from "./ChangePasswordPopUP";

const Settings = ({ handleSubmit, user, setUser, loading }) => {
  const [changePassword, setChangePassword] = useState(false);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.id]: event.target.value, msg: "" });
  };

  const handleUpdate = () => {
    handleSubmit();
  };

  const handleChangePassword = () => {
    setChangePassword(true);
  };

  return (
    <div className={styles.settings}>
      <div className={styles.settings_container}>
        <h2 className={styles.page_title}>Settings</h2>
        <div className={styles.settings_form}>
          <div className={styles.settings_form}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              onChange={handleChange}
              disabled={loading || changePassword}
              placeholder={user.placeholder.username}
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              onChange={handleChange}
              disabled={loading || changePassword}
              placeholder={user.placeholder.email}
            />
            {user.msg && <div className={styles.error}>{user.msg}</div>}
            <br />
            <button
              className={styles.update_button}
              onClick={handleUpdate}
              disabled={loading || changePassword}
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
            disabled={loading || changePassword}
          >
            Change Password
          </button>
        </div>
      </div>
      {changePassword && (
        <ChangePasswordPopUP setChangePassword={setChangePassword} />
      )}
    </div>
  );
};

export default Settings;
