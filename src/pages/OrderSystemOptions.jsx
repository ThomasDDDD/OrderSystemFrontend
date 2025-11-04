import { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/AuthContext";

const OrderSystemOptions = () => {
  const { user, isLoggedIn, mode } = useContext(AuthContext);

  const [formOpen, setFormOpen] = useState(false);

  const [openPopUp, setOpenPopUp] = useState(false);

  const APIKEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_BACKEND_URL;

  const toggleForm = (e) => {
    e.preventDefault();
    setFormOpen(!formOpen);
  };

  const handleOpenPopUp = (categoryName) => {
    setOpenPopUp(true);
  };

  useEffect(() => {
    const getColors = async () => {
      try {
        const response = await fetch(`${URL}/tasks/getColors`, {
          method: "GET",
          headers: {
            "Content-Type": "Application/json",
            "api-key": APIKEY,
          },
          credentials: "include",
        });
        const data = await response.json();

        if (response.status !== 200) {
          console.log("load colors failed");
        }
      } catch (e) {
        console.log(e);
      }
    };
    // getColors();
  }, []);

  /* debugging Logs */

  /*  useEffect(() => {
    console.log(colors);
    console.log(categories);
  }, [colors, categories]); */

  return (
    <div className="bg-[var(--background-main)] text-(--text-color) min-h-screen relative">
      <NavBar />

      {/* delete category PopUp */}

      {isLoggedIn && user && openPopUp && (
        <div className=" fixed inset-0 bg-[var(--background-main-80)] flex items-center justify-center z-60 ">
          <div className="flex flex-col p-4 lg:p-8 m-4 gap-4 items-center justify-between bg-[var(--background-main)] text-(--text-color) border rounded-md  border-(color:--shadow-color) shadow-md shadow-(color:--shadow-color)">
            <h2 className="text-(length:--font-size-largerStandard) text-center font-bold pb-2 mb-4 border-b w-full">
              irgendwas löschen?
            </h2>
            <p>alle Tasks aus der Kategorie gehen unwiederruflich verloren?</p>
            <p>sind Sie sicher?</p>
            <div className="flex gap-4 w-[100%] ">
              <button
                type="button"
                className="cursor-pointer px-6 py-2 rounded-md bg-[var(--primary-color-100)] text-(--text-color-rev) w-[60%] max-w-[300px] "
                onClick={(e) => {
                  e.preventDefault();
                  setOpenPopUp(false);
                }}
              >
                abbrechen
              </button>
              <button
                type="button"
                className="cursor-pointer px-6 py-2 rounded-md bg-[var(--accent-color-100)] text-(--text-color-rev) w-[60%] max-w-[300px] "
                onClick={(e) => console.log("irgendwas gelöscht")}
              >
                löschen
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center w-full p-4 max-w-[1920px] mx-auto ">
        <h2>Inhalt hier</h2>
      </div>
    </div>
  );
};
export default OrderSystemOptions;
