import { createContext, useState, useEffect } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [newOrderPopUp, setNewOrderPopUp] = useState(false);
  const [status, setStatus] = useState("pending");
  const [statisticsPopUp, setStatisticsPopUp] = useState(false);

  const APIKEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_BACKEND_URL;

  return (
    <OrderContext.Provider
      value={{
        newOrderPopUp,
        setNewOrderPopUp,
        status,
        setStatus,
        statisticsPopUp,
        setStatisticsPopUp,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
