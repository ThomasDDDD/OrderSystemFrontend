import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./styles/index.css";

import { AuthContext, AuthProvider } from "./context/AuthContext";
import { router } from "./routes/router";
import { OrderProvider } from "./context/OrderContext";

const AuthenticatedApp = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <h1>Loading authentication...</h1>;
  }

  return <RouterProvider router={router} />;
};

export const App = () => {
  return (
    <StrictMode>
      <AuthProvider>
        <OrderProvider>
          <AuthenticatedApp />
        </OrderProvider>
      </AuthProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<App />);
