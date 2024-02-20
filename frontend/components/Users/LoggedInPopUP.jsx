import { useRouter } from "next/router";
import styles from "../../styles/Users/LoggedInPopUP.module.css";

export default function LoggedInPopUP({ handleDisconnect }) {
  const router = useRouter();

  const handleStay = () => {
    router.push("/");
  };

  return (
    <div className={styles.PopUp}>
      <h1>Already logged In!</h1>
      <p>Want to disconnect??</p>
      <button onClick={handleDisconnect}>Disconnect</button>
      <button onClick={handleStay}>Stay</button>
    </div>
  );
}
