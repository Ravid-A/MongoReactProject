import BorrowListProvider from "../contexts/BorrowListProvider";
import NavBar from "../components/NavBar";

import "../styles/global.css";

export default function App({ Component, pageProps }) {
  return (
    <BorrowListProvider>
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <NavBar />
        <br />
        <Component {...pageProps} />
      </div>
    </BorrowListProvider>
  );
}
