import { useEffect } from "react";
import { useRouter } from "next/router";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("token");
    router.push("/");
  }, []);

  return (
    <div>
      <h1>Logout</h1>
      <p>Logout</p>
    </div>
  );
};

export default Logout;
