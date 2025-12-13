import { FaPlusSquare } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { OrderContext } from "../context/OrderContext.jsx";

const BottomBar = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const {
    newOrderPopUp,
    setNewOrderPopUp,
    status,
    setStatus,
    statisticsPopUp,
    setStatisticsPopUp,
  } = useContext(OrderContext);

  return (
    <nav
      className={`bg-[var(--background-main)] text-[var(--text-color)] shadow-[0_-1px_3px] shadow-(color:--accent-color-100) fixed bottom-0 z-50 w-full`}
    >
      {isLoggedIn && (
        <div className="container mx-auto max-w-[1400px] ">
          <ul className="flex justify-between gap-2 p-2 lg:p-8 mx-auto ">
            <li
              className="w-[25%]  md:w-[20%] text-center cursor-pointer px-2 py-1 border border-[var(--text-color)]"
              onClick={(e) => {
                e.preventDefault();
                setStatus("pending");
              }}
            >
              <a className="hover:underline  text-(length:--font-size-sub-nav) font-(family-name:--style-font) transition-all duration-500 ease-in-out hover:text-[var(--accent-color-100)]">
                Offen
              </a>
            </li>
            <li
              className="w-[25%] md:w-[20%] text-center cursor-pointer px-2 py-1 border border-[var(--text-color)]"
              onClick={(e) => {
                e.preventDefault();
                setStatus("completed");
              }}
            >
              <a className="hover:underline  text-(length:--font-size-sub-nav) font-(family-name:--style-font) transition-all duration-500 ease-in-out hover:text-[var(--accent-color-100)]">
                Fertig
              </a>
            </li>

            <li
              className="md:w-[20%] text-center border-[var(--text-color)] relative  "
              onClick={(e) => {
                e.preventDefault();

                setNewOrderPopUp(!newOrderPopUp);
              }}
            >
              <a className=" hover:underline cursor-pointer text-(length:--font-size-XXXL) font-(family-name:--style-font) absolute translate-y-[-120%] md:translate-y-[-60%] translate-x-[-50%] hover:scale-[120%] transition-all duration-500 ease-in-out ">
                <div className="bg-[var(--accent-color-50)]">
                  <FaPlusSquare className="scale-[120%]  text-[var(--primary-color-100)]" />
                </div>
              </a>
            </li>
            <li
              className="w-[25%]  md:w-[20%] text-center cursor-pointer px-2 py-1 border border-[var(--text-color)]"
              onClick={(e) => {
                e.preventDefault();
                setStatus("");
              }}
            >
              <a className="hover:underline  text-(length:--font-size-sub-nav) font-(family-name:--style-font) transition-all duration-500 ease-in-out hover:text-[var(--accent-color-100)]">
                Alle
              </a>
            </li>

            <li
              className="w-[25%]  md:w-[20%] text-center cursor-pointer px-2 py-1 border border-[var(--text-color)]"
              onClick={(e) => {
                e.preventDefault();
                setStatisticsPopUp(!statisticsPopUp);
              }}
            >
              <a className="hover:underline text-(length:--font-size-sub-nav) font-(family-name:--style-font) transition-all duration-500 ease-in-out hover:text-[var(--accent-color-100)]">
                Statistic
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
export default BottomBar;
