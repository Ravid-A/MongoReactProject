import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../styles/Users.module.css";
import GetAPIUrl from "../helpers/GetAPIUrl";

const Users = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await axios.get(`${GetAPIUrl()}/users`, {
        headers: {
          Authorization: token,
        },
        validateStatus: (status) => {
          return status < 500;
        },
      });

      if (response.status !== 200) {
        if (response.status === 401) {
          localStorage.removeItem("token");
        }

        router.push("/");
        return;
      }

      setUsers(response.data);
    } catch (error) {
      console.error("An error occurred fetching user data", error);
      router.push("/");
    }
  };

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
          validateStatus: (status) => {
            return status < 500;
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

        setUser(user);
      } catch (error) {
        console.error("An error occurred fetching user data", error);
        localStorage.removeItem("token");
        router.push("/");
      }
    };

    fetchUser();
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`${GetAPIUrl()}/users/${userId}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        console.log("User deleted successfully");
        fetchUsers();
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("An error occurred while deleting user", error);
    }
  };

  const updateAdmin = async (userId, privilage) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${GetAPIUrl()}/users/${userId}`,
        { privilage: privilage },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        fetchUsers();
      } else {
        console.error("Failed to make user admin");
      }
    } catch (error) {
      console.error("An error occurred while making user admin", error);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      {user && user.privilage && (
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Create Time</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((current_user) => (
                <tr key={current_user._id}>
                  <td>{current_user.username}</td>
                  <td>{current_user.email}</td>
                  <td>
                    {new Date(current_user.created_at).toLocaleDateString() +
                      " " +
                      new Date(current_user.created_at).toLocaleTimeString()}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteUser(current_user._id)}
                      disabled={current_user.privilage >= user.privilage}
                    >
                      Delete
                    </button>
                    {!current_user.privilage ? (
                      <button
                        onClick={() => updateAdmin(current_user._id, 1)}
                        disabled={current_user.privilage >= user.privilage}
                      >
                        Set Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => updateAdmin(current_user._id, 0)}
                        disabled={current_user.privilage >= user.privilage}
                      >
                        Revoke Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {!users && <p>Loading...</p>}
      {users && users.length === 0 && <p>No users found</p>}
    </div>
  );
};

export default Users;
