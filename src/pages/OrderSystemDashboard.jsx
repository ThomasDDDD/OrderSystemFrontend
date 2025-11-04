import { useContext, useState } from "react";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";
import { FaPlusSquare } from "react-icons/fa";

const OrderSystemDashboard = () => {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [deleteName, setDeleteName] = useState("");

  const [activeForm, setActiveForm] = useState(null);

  const APIKEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_BACKEND_URL;

  const toggleForm = (formName) => {
    setActiveForm((prev) => (prev === formName ? null : formName));
  };

  const handleChangeUser = async (e) => {
    try {
      const response = await fetch(`${URL}/user/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "Application/json",
          "api-key": APIKEY,
        },
        credentials: "include",
        body: JSON.stringify({ userName }),
      });
      const data = await response.json();

      if (response.status !== 200) {
        console.log("Change Username failed");
      } else {
        console.log("Change Username successfully");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (deleteName === user.userName) {
      try {
        const response = await fetch(`${URL}/user/deleteUser`, {
          method: "PATCH",
          headers: {
            "Content-Type": "Application/json",
            "api-key": APIKEY,
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.status === 200) {
          console.log("delete Account successfully!");
          logout();
          navigate("/");
        }
        if (response.status !== 200) {
          console.log("delete Account failed: " + data.message);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("The name in the Textfield is not your Username!");
      setDeleteName("");
    }
  };

  return (
    <div className="bg-[var(--background-main)] text-(--text-color) min-h-screen  ">
      <NavBar />
      <div className="flex flex-col items-center justify-center w-full p-4 max-w-[1920px] mx-auto">
        {isLoggedIn && user && (
          <>
            <h2 className="text-(length:--font-size-largerStandard) font-bold font-(family-name:--style-font) pb-2 mb-4 border-b w-full ">
              Dashboard
            </h2>
            <h4 className="text-(length:--font-size-large) mb-8">
              Hallo {user.userName}
            </h4>

            <div className="w-[80%] mb-8 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-(length:--font-size-largerStandard) ">
                  Benutzerdaten ändern ?
                </h2>
                <button
                  type="button"
                  onClick={() => toggleForm("userName")}
                  className="text-(length:--font-size-large) hover:scale-[110%] transition-all duration-500 ease-in-out hover:text-[var(--accent-color-100)]"
                >
                  <FaPlusSquare
                    className={`transition-transform duration-300 ${
                      activeForm === "userName" ? "rotate-90 " : ""
                    }`}
                  />
                </button>
              </div>

              <div
                className={`transition-all duration-500 overflow-hidden ease-in-out ${
                  activeForm === "userName"
                    ? "max-h-[500px] opacity-100 scale-100"
                    : "max-h-0 opacity-0 scale-95"
                }`}
              >
                <form
                  onSubmit={handleChangeUser}
                  className="flex flex-wrap items-start justify-between gap-2 pb-8 w-full border-b text-(length:--font-size-standard) "
                >
                  <p className="w-[100%]">Benutzername:</p>
                  <input
                    className="px-4 py-2 mb-4 border border-[var(--text-color)] rounded-lg  bg-[var(--input-primary)] text-(--text-color) w-[100%] max-w-[1000px] "
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      e.preventDefault();
                      setUserName(e.target.value);
                    }}
                  ></input>

                  <button
                    className="cursor-pointer px-6 py-2 rounded-md bg-[var(--primary-color-100)] text-(--text-color-rev) w-[60%] max-w-[300px] "
                    type="submit"
                  >
                    ändern
                  </button>
                </form>
              </div>
            </div>

            <div className="w-[80%] mb-8 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-(length:--font-size-largerStandard) ">
                  Account löschen ?
                </h2>
                <button
                  type="button"
                  onClick={() => toggleForm("delete")}
                  className="text-(length:--font-size-large) hover:scale-[110%] transition-all duration-500 ease-in-out hover:text-[var(--accent-color-100)]"
                >
                  <FaPlusSquare
                    className={`transition-transform duration-300 ${
                      activeForm === "delete" ? "rotate-90 " : ""
                    }`}
                  />
                </button>
              </div>
              <div
                className={`transition-all duration-500 overflow-hidden ease-in-out ${
                  activeForm === "delete"
                    ? "max-h-[500px] opacity-100 scale-100"
                    : "max-h-0 opacity-0 scale-95"
                }`}
              >
                <form
                  onSubmit={handleDeleteAccount}
                  className="flex flex-wrap items-start justify-between gap-2 pb-8 w-full border-b text-(length:--font-size-standard) "
                >
                  <p className="w-[100%]">schreibe deinen Benutzername:</p>
                  <input
                    className="px-4 py-2 mb-4 border border-[var(--text-color)] rounded-lg  bg-[var(--input-primary)] text-(--text-color) w-[100%] max-w-[1000px] "
                    type="text"
                    value={deleteName}
                    onChange={(e) => {
                      e.preventDefault();
                      setDeleteName(e.target.value);
                    }}
                  ></input>

                  <button
                    className="cursor-pointer px-6 py-2 rounded-md bg-[var(--primary-color-100)] text-(--text-color-rev) w-[60%] max-w-[300px]  "
                    type="submit"
                  >
                    Account löschen
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default OrderSystemDashboard;
