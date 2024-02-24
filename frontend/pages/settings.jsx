import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import axios from "axios";

axios.defaults.headers.common["Content-Type"] = "application/json";

import GetAPIUrl from "../helpers/GetAPIUrl";

import Settings from "../components/Users/Settings";

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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

      setUser({
        placeholder: {
          username: user.username,
          email: user.email,
        },
        username: "",
        email: "",
        msg: "",
      });
    } catch (error) {
      console.error("An error occurred fetching user data", error);
      localStorage.removeItem("token");
      router.push("/");
    }
  };

  const handleUpdate = async () => {
    try {
      setUser({ ...user, msg: "" });
      setLoading(true);

      const token = localStorage.getItem("token");
      const url = GetAPIUrl() + "/users/update";
      const data = {
        username: user.username,
        email: user.email,
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

      fetchUser();
      setUser(null);
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

  const handleSubmit = () => {
    if (!user.username && !user.email) {
      return;
    }

    handleUpdate();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {user && (
        <>
          <Settings
            handleSubmit={handleSubmit}
            user={user}
            setUser={setUser}
            loading={loading}
          />
        </>
      )}
    </>
  );
}
