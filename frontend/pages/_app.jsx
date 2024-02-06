import BorrowListProvider from "../contexts/BorrowListProvider";

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
        <Component {...pageProps} />
      </div>
    </BorrowListProvider>
  );
}
