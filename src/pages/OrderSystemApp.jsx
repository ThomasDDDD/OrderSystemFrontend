import { useContext, useEffect, useState } from "react";
import { FaGear } from "react-icons/fa6";
import LogInReg from "../components/LogInReg";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/AuthContext";
import BottomBar from "../components/BottomBar";

import CustomDateTimePicker from "../components/DatePicker";
import { OrderContext } from "../context/OrderContext";

const OrderSystemApp = () => {
  const { user, isLoggedIn, mode } = useContext(AuthContext);
  const { newOrderPopUp, setNewOrderPopUp } = useContext(OrderContext);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(31);
  const [maxPage, setMaxPage] = useState(1);

  const [ordersData, setOrdersData] = useState(null);
  const [totalOrders, setTotalOrders] = useState(1);

  const [productsData, setProductsData] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  const [sort, setSort] = useState("productCategory");
  const [sortOrder, setSortOrder] = useState(1);
  const [available, setAvailable] = useState(true);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState("");

  const [reload, setReload] = useState(false);

  const APIKEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_BACKEND_URL;

  const [date, setDate] = useState(new Date());

  const countryDateFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  //
  // const handleNewTask = async (e) => {
  //   e.preventDefault();
  //   const { dueStart, dueEnd } = newTask;

  //   const startDate = new Date(dueStart);
  //   const computedDueEnd = dueEnd
  //     ? new Date(dueEnd)
  //     : new Date(startDate.getTime() + 15 * 60 * 1000);

  //   const taskToSubmit = {
  //     ...newTask,
  //     taskName: newTask.taskName.trim(),
  //     description: newTask.description.trim(),
  //     dueStart: startDate,
  //     dueEnd: computedDueEnd,
  //   };

  //   try {
  //     const response = await fetch(`${URL}/tasks/createTask`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "Application/json",
  //         "api-key": APIKEY,
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(taskToSubmit),
  //     });
  //     const data = await response.json();

  //     if (response.status !== 201) {
  //       toast.error("Create Task failed!");
  //     } else {
  //       setNewTask({
  //         taskCategory: "",
  //         colorId: "",
  //         taskName: "",
  //         description: "",
  //         priority: "",
  //         dueStart: "",
  //         dueEnd: "",
  //         bulletPoints: [],
  //       });
  //       toast.success("Add Task successfully!");
  //       setReload(!reload);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   setNewTaskPopUp(false);
  //   console.log(taskToSubmit);
  // };

  // const handleTaskUpdate = async (e) => {
  //   e.preventDefault();

  //   const taskToUpdate = {
  //     ...updateTask,
  //     taskName: updateTask.taskName.trim(),
  //     description: updateTask.description.trim(),
  //   };

  //   try {
  //     const response = await fetch(
  //       `${URL}/tasks/updateTask/${taskIdToUpdate}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "Application/json",
  //           "api-key": APIKEY,
  //         },
  //         credentials: "include",
  //         body: JSON.stringify(taskToUpdate),
  //       }
  //     );
  //     const data = await response.json();

  //     if (response.status !== 200) {
  //       toast.error("update Task failed!");
  //     } else {
  //       setUpdateTask({
  //         taskName: "",
  //         description: "",
  //         priority: "",
  //         dueStart: "",
  //         dueEnd: "",
  //         bulletPoints: [],
  //         isCompleted: "",
  //       });
  //       setTaskIdToUpdate("");
  //       setUpdateTaskPopUp(false);

  //       toast.success("Update Task successfully!");
  //       setReload(!reload);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    let url = `&sort=${sort}&sortOrder=${sortOrder}`;
    if (category) {
      url += `&category=${category}`;
    }
    if (available) {
      url += `&available=${available}`;
    }
    if (search) {
      url += `&search=${search}`;
    }
    const getProducts = async () => {
      try {
        const response = await fetch(
          `${URL}/product/getProducts?page=${page}&limit=${limit}&${url}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "Application/json",
              "api-key": APIKEY,
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.status === 404) {
          return;
        } else if (response.status !== 200) {
          console.log("load tasks failed!");
        } else {
          setProductsData(data.products);
          setMaxPage(data.totalPages);
          setTotalProducts(data.totalProducts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

  /* debugging Log */

  useEffect(() => {
    console.log(productsData);
  }, [productsData]);

  return (
    <div className="bg-[var(--background-main)] text-(--text-color) min-h-screen relative pb-16 ">
      <NavBar />
      {/* popUp for new Order */}
      {isLoggedIn && user && newOrderPopUp && (
        <div className="fixed inset-0 bg-[var(--background-main-80)] flex items-center justify-center z-60 px-4">
          <div className=" w-full max-h-[95vh] overflow-auto grid grid-cols-3 p-1 gap-4 items-center justify-between bg-[var(--background-main)] text-(--text-color) border rounded-md  border-(color:--shadow-color) shadow-md shadow-(color:--shadow-color)">
            <h2 className="text-(length:--font-size-largerStandard) col-span-3  text-center font-bold  border-b w-full">
              Neue Bestellung
            </h2>

            {/* input form to create a new task */}
            {productsData && productsData.length > 0 && (
              <div className="w-full col-span-2 ">
                <h3 className="font-bold  text-start pl-4 ">Getränke</h3>
                <div className="grid grid-cols-4 gap-4 py-3 ">
                  {productsData.map(
                    (product) =>
                      product.productCategory === "Getraenke" && (
                        <div
                          key={product._id}
                          className="border p-2 rounded-md h-24 flex flex-col items-center justify-center"
                        >
                          <h3 className="font-bold mb-2 text-center">
                            {product.productName}
                          </h3>
                          <p className="mb-2 text-center">
                            Preis: {product.productPrice} €
                          </p>
                        </div>
                      )
                  )}
                </div>
                <h3 className="font-bold  text-start pl-4 ">Herzhaftes</h3>
                <div className="grid grid-cols-4 gap-4  py-3 ">
                  {productsData.map(
                    (product) =>
                      product.productCategory === "Herzhaftes" && (
                        <div
                          key={product._id}
                          className="border p-2 rounded-md h-24 flex flex-col items-center justify-center"
                        >
                          <h3 className="font-bold mb-2 text-center">
                            {product.productName}
                          </h3>
                          <p className="mb-2 text-center">
                            Preis: {product.productPrice} €
                          </p>
                        </div>
                      )
                  )}
                </div>
                <h3 className="font-bold  text-start pl-4 ">Süßes</h3>
                <div className="grid grid-cols-4 gap-4   py-3 ">
                  {productsData.map(
                    (product) =>
                      product.productCategory === "Sueßes" && (
                        <div
                          key={product._id}
                          className="border p-2 rounded-md h-24 flex flex-col items-center justify-center"
                        >
                          <h3 className="font-bold mb-2 text-center">
                            {product.productName}
                          </h3>
                          <p className="mb-2 text-center">
                            Preis: {product.productPrice} €
                          </p>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col items-start justify-between p-4 border-l col-span-1 h-full ">
              <div className="overflow-auto">Liste hier</div>
              <div className="w-full  ">
                <p className="text-end">Preis: 123 €</p>
                <button
                  type="button"
                  className="mt-2 cursor-pointer w-[100%] h-[50px] rounded-md bg-[var(--primary-color-100)] text-(--text-color-rev) "
                >
                  Bestellen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* main Container */}

      <div className="flex flex-col items-center justify-center  w-full p-4 max-w-[1920px] mx-auto ">
        {!isLoggedIn && <LogInReg />}
        {isLoggedIn && user && (
          <>
            {/* Seitenkopf Name & Datum */}
            <div className="flex items-center justify-between w-full max-w-[1920px] pb-2 mb-4 border-b font-(family-name:--style-font) ">
              <h2 className="text-(length:--font-size-largerStandard) font-bold  w-full ">
                {user.userName}
              </h2>
              <p className="text-(length:--font-size-largerStandard) font-(family-name:--standard-font) w-full text-end">
                {countryDateFormat} Uhr
              </p>
            </div>
            {/* Seitenansicht toggelt je nach "view" */}
            <div className="w-[100%] md:w-[80%] mb-16 pb-8 border-b">
              <h2> Seitenansicht hier</h2>
            </div>
          </>
        )}
      </div>

      <BottomBar />
    </div>
  );
};

export default OrderSystemApp;
