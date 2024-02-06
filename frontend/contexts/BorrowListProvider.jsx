import { createContext, useContext, useState } from "react";

const BorrowListContext = createContext();
const BorrowListUpdateContext = createContext();

const BorrowListProvider = ({ children }) => {
  const [borrowList, setBorrowList] = useState([]);

  return (
    <BorrowListContext.Provider value={borrowList}>
      <BorrowListUpdateContext.Provider value={setBorrowList}>
        {children}
      </BorrowListUpdateContext.Provider>
    </BorrowListContext.Provider>
  );
};

export default BorrowListProvider;

export const useBorrowList = () => {
  return useContext(BorrowListContext);
};

export const useBorrowListUpdate = () => {
  return useContext(BorrowListUpdateContext);
};
