import { useNavigate } from "react-router-dom";
import { CgDarkMode } from "react-icons/cg";
import { FaUser } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const NavBar = () => {
  const { logout, isLoggedIn, getMode } = useContext(AuthContext);
  const navigate = useNavigate();
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const [dashboard, setDashboard] = useState(false);

  const handleDarkMode = (e) => {
    e.preventDefault();
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "lm");
      getMode();
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dm");
      getMode();
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "lm";
    document.documentElement.classList.toggle("dark", storedTheme === "dm");
    getMode();
  }, []);

  return (
    <nav
      className={`bg-[var(--background-main)]  text-[var(--text-color)] shadow-sm shadow-(color:--accent-color-100) sticky top-0 z-50`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-1">
        <h1
          className={`text-(length:--font-size-headline) text-[var(--primary-color-100)] font-bold font-(family-name:--style-font) tracking-wider cursor-pointer`}
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          SteLu - Bestellungen
        </h1>
        <ul className="flex space-x-4 justify-between items-center ">
          {/* <li>
            <a
              className="hover:underline cursor-pointer text-(length:--font-size-nav) font-(family-name:--style-font) transition-all duration-500 ease-in-out hover:text-[var(--accent-color-100)]"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              ToDo
            </a>
          </li> */}

          {isLoggedIn && (
            <>
              <li
                onClick={(e) => {
                  e.preventDefault();
                  setBurgerMenuOpen(!burgerMenuOpen);
                  setDashboard(!dashboard);
                }}
              >
                <FaUser className="cursor-pointer text-(length:--font-size-nav) hover:scale-[120%] transition-all duration-500 ease-in-out hover:text-[var(--accent-color-100)]" />
              </li>
              <li
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/options");
                }}
              >
                <FaGear className="cursor-pointer text-(length:--font-size-nav) hover:scale-[120%] transition-all duration-500 ease-in-out hover:text-[var(--accent-color-100)] " />
              </li>
            </>
          )}

          <li onClick={handleDarkMode}>
            <CgDarkMode className="cursor-pointer text-(length:--font-size-nav) hover:scale-[120%] transition-all duration-500 ease-in-out hover:text-[var(--accent-color-100)] " />
          </li>
        </ul>
      </div>

      {isLoggedIn && burgerMenuOpen && (
        <div className="container mx-auto shadow-(color:--accent-color-50) sticky z-50">
          {dashboard && (
            <ul className="flex justify-end gap-4 pb-4 mr-4">
              <li className="px-2 py-1 border cursor-pointer  hover:scale-[105%] transition-all duration-500 ease-in-out hover:text-[var(--accent-color-100)]">
                <a
                  className="hover:underline text-(length:--font-size-sub-nav) font-(family-name:--style-font) "
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/dashboard");
                  }}
                >
                  Benutzer
                </a>
              </li>

              <li className="px-2 py-1 border cursor-pointer  hover:scale-[105%] transition-all duration-500 ease-in-out hover:text-[var(--accent-color-100)]">
                <a
                  className="hover:underline text-(length:--font-size-sub-nav) font-(family-name:--style-font)"
                  onClick={(e) => {
                    handleLogout(e);
                    navigate("/");
                  }}
                >
                  LogOut
                </a>
              </li>
            </ul>
          )}
        </div>
      )}
    </nav>
  );
};
export default NavBar;
