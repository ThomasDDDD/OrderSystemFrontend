import { useContext, useEffect, useState } from "react";
import { FaGear } from "react-icons/fa6";
import LogInReg from "../components/LogInReg";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/AuthContext";
import BottomBar from "../components/BottomBar";

import CustomDateTimePicker from "../components/DatePicker";
import { OrderContext } from "../context/OrderContext";
import { se } from "date-fns/locale";
import OrderComponent from "../components/OrderComponent";

const OrderSystemApp = () => {
  const { user, isLoggedIn, mode } = useContext(AuthContext);
  const { newOrderPopUp, setNewOrderPopUp, status, setStatus } =
    useContext(OrderContext);

  //! State für Products

  const [productPage, setProductPage] = useState(1);
  const [productLimit, setProductLimit] = useState(31);
  const [productMaxPage, setProductMaxPage] = useState(1);

  const [productSort, setProductSort] = useState("productName");
  const [productSortOrder, setProductSortOrder] = useState(1);
  const [available, setAvailable] = useState(true);
  const [category, setCategory] = useState(null);
  const [productSearch, setProductSearch] = useState("");

  const [productsData, setProductsData] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  //! State für Orders

  const [reload, setReload] = useState(false);

  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit, setOrderLimit] = useState(50);
  const [orderMaxPage, setOrderMaxPage] = useState(1);

  const [orderSort, setOrderSort] = useState("createdAt");
  const [orderSortOrder, setOrderSortOrder] = useState(-1);

  const [orderSearch, setOrderSearch] = useState("");

  const [ordersData, setOrdersData] = useState(null);
  const [totalOrders, setTotalOrders] = useState(1);

  //! One Order Details
  const [orderToUpdate, setOrderToUpdate] = useState(null);

  //! New Order

  const [newOrder, setNewOrder] = useState({
    products: [],
    price: 0,
  });
  const [inputMoney, setInputMoney] = useState(0);

  const APIKEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_BACKEND_URL;

  const [date, setDate] = useState(new Date());

  const countryDateFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return price.toFixed(2).replace(".", ",") + " €";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 60 * 1000);
    const updateInterval = setInterval(() => {
      setReload((prev) => !prev);
    }, 2000);
    return () => {
      clearInterval(interval);
      clearInterval(updateInterval);
    };
  }, []);

  const sendNewOrder = async () => {
    try {
      console.log(newOrder);
      const response = await fetch(`${URL}/order/createOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
          "api-key": APIKEY,
        },
        credentials: "include",
        body: JSON.stringify({ products: newOrder.products }),
      });
      const data = await response.json();
      if (response.status !== 201) {
        console.log("Create Order failed!");
      } else {
        setNewOrder({
          products: [],
          price: 0,
        });
        setInputMoney(0);
        console.log("Add Order successfully!");
        setReload(!reload);
      }
    } catch (error) {
      console.log(error);
    }
    setNewOrderPopUp(false);
  };

  useEffect(() => {
    if (user && isLoggedIn) {
      let url = `&sort=${orderSort}&sortOrder=${orderSortOrder}`;
      if (status) {
        url += `&status=${status}`;
      }
      if (orderSearch) {
        url += `&search=${orderSearch}`;
      }

      const getOrders = async () => {
        try {
          const response = await fetch(
            `${URL}/order/getOrders?page=${orderPage}&limit=${orderLimit}&${url}`,
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
            console.log("load orders failed!");
          } else {
            setOrdersData(data.orders);
            setOrderMaxPage(data.totalPages);
            setTotalOrders(data.totalOrders);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getOrders();
    }
  }, [status, reload]);

  useEffect(() => {
    if (user && isLoggedIn) {
      let url = `&sort=${productSort}&sortOrder=${productSortOrder}`;
      if (category) {
        url += `&category=${category}`;
      }
      if (available) {
        url += `&available=${available}`;
      }
      if (productSearch) {
        url += `&search=${productSearch}`;
      }
      const getProducts = async () => {
        try {
          const response = await fetch(
            `${URL}/product/getProducts?page=${productPage}&limit=${productLimit}&${url}`,
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
            setProductMaxPage(data.totalPages);
            setTotalProducts(data.totalProducts);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getProducts();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (user && isLoggedIn && orderToUpdate) {
      const updateOrder = async () => {
        try {
          const respone = await fetch(
            `${URL}/order/updateOrder/${orderToUpdate._id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "Application/json",
                "api-key": APIKEY,
              },
              credentials: "include",
              body: JSON.stringify({ products: orderToUpdate.products }),
            }
          );
          const data = await respone.json();

          if (respone.status !== 200) {
            console.log("Update Order failed!");
          } else {
            console.log("Update Order successfully!");
            // setReload(!reload);
          }
        } catch (error) {
          console.log(error);
        }
      };
      updateOrder();
    }
  }, [orderToUpdate]);

  useEffect(() => {
    if (orderToUpdate) {
      const reloadedOrder = ordersData.find(
        (order) => order._id === orderToUpdate._id
      );
      if (reloadedOrder) {
        const mixedUpdatedProducts = orderToUpdate.products.map((prod) => {
          if (prod.status === "completed") {
            console.log("intern completed", prod);
            return prod;
          } else if (prod.status === "pending") {
            console.log("internpending", prod);
            const completedUpdatedProduct = reloadedOrder.products.find(
              (p) => p._id === prod._id && p.status === "completed"
            );
            if (completedUpdatedProduct) {
              console.log("extern completed", completedUpdatedProduct);
              return completedUpdatedProduct;
            } else {
              return prod;
            }
          }
        });
        setOrderToUpdate({
          ...orderToUpdate,
          products: mixedUpdatedProducts,
        });
      } else {
        setOrderToUpdate(null);
      }
    }
  }, [ordersData]);

  return (
    <div className="bg-[var(--background-main)] text-(--text-color) min-h-screen relative pb-16 ">
      <NavBar />
      {/* popUp for new Order */}
      {isLoggedIn && user && newOrderPopUp && (
        <div className="fixed inset-0 bg-[var(--background-main-90)] flex items-center justify-center z-60 px-2">
          <div className=" w-full max-h-[97vh] overflow-auto grid grid-cols-3 p-1 gap-4 items-center justify-between bg-[var(--background-main)] text-(--text-color) border-4 rounded-md  border-(color:--text-color) shadow-md shadow-(color:--shadow-color)">
            <div className="col-span-3 grid grid-cols-12 gap-4 px-4">
              <h2 className="text-(length:--font-size-largerStandard) col-span-11  text-center font-bold  border-b w-full">
                Neue Bestellung
              </h2>
              <button
                type="button"
                className="mt-2 cursor-pointer w-[100%]  rounded-md bg-red-800 text-(--text-color) "
                onClick={(e) => {
                  e.preventDefault();
                  setNewOrderPopUp(false);
                  setNewOrder({
                    products: [],
                    price: 0,
                  });
                }}
              >
                X
              </button>
            </div>

            {/* input form to create a new order */}
            {productsData && productsData.length > 0 && (
              <div className="w-full col-span-2 ">
                <h3 className="font-bold  text-start pl-4 ">Getränke</h3>
                <div className="grid grid-cols-4 gap-4 py-3 ">
                  {productsData.map(
                    (product) =>
                      product.productCategory === "Getraenke" && (
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            setNewOrder({
                              ...newOrder,
                              products: [
                                ...newOrder.products,
                                {
                                  productName: product.productName,
                                  product: product._id,
                                  productPrice: product.productPrice,
                                },
                              ],
                              price:
                                Number(newOrder.price) +
                                Number(product.productPrice),
                            });
                          }}
                          key={product._id}
                          className={`border cursor-pointer relative p-2 rounded-md h-24 flex flex-col items-center justify-center ${
                            product.imgUrl
                              ? "bg-contain bg-center bg-no-repeat"
                              : ""
                          }`}
                          style={
                            product.imgUrl
                              ? { backgroundImage: `url(${product.imgUrl})` }
                              : undefined
                          }
                        >
                          <div
                            className={`absolute inset-0  transition`}
                            style={
                              product.productName.startsWith("Glühwein", 0)
                                ? { backgroundColor: "var(--product-1-color)" }
                                : product.productName.endsWith("punsch")
                                ? { backgroundColor: "var(--product-2-color)" }
                                : { backgroundColor: "var(--product-3-color)" }
                            }
                          ></div>
                          <h3 className="font-bold z-2 mb-2 text-center bg-(color:--background-main-80) px-1 rounded">
                            {product.productName}
                          </h3>
                          <p className="mb-2 font-semibold z-3 text-center bg-(color:--background-main-80) px-1 rounded">
                            Preis: {formatPrice(Number(product.productPrice))}
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
                          onClick={(e) => {
                            e.preventDefault();
                            setNewOrder({
                              ...newOrder,
                              products: [
                                ...newOrder.products,
                                {
                                  productName: product.productName,
                                  product: product._id,
                                  productPrice: product.productPrice,
                                },
                              ],
                              price:
                                Number(newOrder.price) +
                                Number(product.productPrice),
                            });
                          }}
                          key={product._id}
                          className={`border cursor-pointer relative p-2 rounded-md h-24 flex flex-col items-center justify-center ${
                            product.imgUrl
                              ? "bg-contain bg-center bg-no-repeat"
                              : ""
                          }`}
                          style={
                            product.imgUrl
                              ? { backgroundImage: `url(${product.imgUrl})` }
                              : undefined
                          }
                        >
                          <div
                            className={`absolute inset-0  transition`}
                            style={
                              product.productName.startsWith("Waffel", 0)
                                ? { backgroundColor: "var(--product-1-color)" }
                                : product.productName.startsWith("Crepe", 0)
                                ? { backgroundColor: "var(--product-2-color)" }
                                : { backgroundColor: "var(--product-3-color)" }
                            }
                          ></div>
                          <h3 className="font-bold z-2 mb-2 text-center bg-(color:--background-main-80) px-1 rounded">
                            {product.productName}
                          </h3>
                          <p className="mb-2 font-semibold z-3 text-center bg-(color:--background-main-80) px-1 rounded">
                            Preis: {formatPrice(Number(product.productPrice))}
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
                          onClick={(e) => {
                            e.preventDefault();
                            setNewOrder({
                              ...newOrder,
                              products: [
                                ...newOrder.products,
                                {
                                  productName: product.productName,
                                  product: product._id,
                                  productPrice: product.productPrice,
                                },
                              ],
                              price:
                                Number(newOrder.price) +
                                Number(product.productPrice),
                            });
                          }}
                          key={product._id}
                          className={`border cursor-pointer relative p-2 rounded-md h-24 flex flex-col items-center justify-center ${
                            product.imgUrl
                              ? "bg-contain bg-center bg-no-repeat"
                              : ""
                          }`}
                          style={
                            product.imgUrl
                              ? { backgroundImage: `url(${product.imgUrl})` }
                              : undefined
                          }
                        >
                          <div
                            className={`absolute inset-0  transition`}
                            style={
                              product.productName.startsWith("Waffel", 0)
                                ? { backgroundColor: "var(--product-1-color)" }
                                : product.productName.startsWith("Crepe", 0)
                                ? { backgroundColor: "var(--product-2-color)" }
                                : { backgroundColor: "var(--product-3-color)" }
                            }
                          ></div>
                          <h3 className="font-bold z-2 mb-2 text-center bg-(color:--background-main-80) px-1 rounded">
                            {product.productName}
                          </h3>
                          <p className="mb-2 font-semibold z-3 text-center bg-(color:--background-main-80) px-1 rounded">
                            Preis: {formatPrice(Number(product.productPrice))}
                          </p>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}

            {/* New Order viewer */}
            <div className="flex flex-col items-start justify-between p-4 border-l col-span-1 h-full ">
              <div className="overflow-auto w-full">
                {newOrder && newOrder.products.length > 0 ? (
                  <div className="flex flex-col md:max-h-[60vh] overflow-auto w-full  ">
                    <OrderComponent
                      orderToUpdate={newOrder}
                      setOrderToUpdate={setNewOrder}
                      which="newOrder"
                    />
                  </div>
                ) : (
                  <div className="py-2">Keine Produkte ausgewählt</div>
                )}
              </div>
              <div className="w-full  ">
                <div className="w-full grid grid-cols-3  w-[100%] h-min ">
                  <p className=" col-span-1 flex item-center justify-center ">
                    Gesamt:
                  </p>
                  <p className="col-span-1 flex item-center justify-center ">
                    IST
                  </p>
                  <p className="text-end col-span-1 flex item-center justify-center ">
                    Rückgeld:
                  </p>
                </div>

                <div className="w-full grid grid-cols-3  w-[100%] ">
                  <p className=" col-span-1 flex item-center justify-center  py-2">
                    {formatPrice(Number(newOrder.price))}
                  </p>
                  <input
                    type="number"
                    placeholder="Eingabe"
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    value={inputMoney}
                    className="col-span-1 px-2 py-1 rounded-md border flex items-center justify-center text-center"
                    onChange={(e) => {
                      e.preventDefault();
                      setInputMoney(Number(e.target.value));
                    }}
                  />
                  <p className="text-end col-span-1 flex item-center justify-center  py-2">
                    {(() => {
                      const diff = Number(inputMoney) - Number(newOrder.price);
                      return diff >= 0 ? formatPrice(diff) : "0 €";
                    })()}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    sendNewOrder();
                  }}
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

      <div className="flex flex-col items-center justify-start h-[83vh]  w-full p-2 mx-auto ">
        {!isLoggedIn && <LogInReg />}
        {isLoggedIn && user && (
          <>
            {/* Seitenkopf Name & Datum */}
            <div className="flex items-center justify-between w-full max-w-[1920px] px-6 py-1 border-b font-(family-name:--style-font) ">
              <h2 className="text-(length:--font-size-standard) font-bold  w-full ">
                {user.userName}
              </h2>
              <p className="text-(length:--font-size-standard) font-(family-name:--standard-font) w-full text-end">
                {countryDateFormat} Uhr
              </p>
            </div>
            {/* Seitenansicht */}
            <div className="w-[100%]  overflow-y-auto mt-2 sm:mb-12 sm:pb-8  grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-4 ">
              {/* linke Seite Bestellungsliste */}
              <div className="col-span-1 col-start-1 row-span-1 grid grid-cols-1 gap-4 max-h-[50vh] sm:max-h-[70vh] md:max-h-[80vh] overflow-y-auto  border-b pb-5 sm:border-b-0 ">
                {ordersData &&
                  ordersData.length > 0 &&
                  ordersData.map((order) => (
                    <div
                      key={order._id}
                      className={` grid grid-cols-2 max-h-[150px]  p-4 cursor-pointer text-(--text-color-dark) ${
                        order.status === "pending"
                          ? "bg-yellow-600"
                          : "bg-green-600"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();

                        setOrderToUpdate(order);
                      }}
                    >
                      <h3 className="font-semibold col-span-1">
                        {order.orderNumber}
                      </h3>
                      <p className="font-semibold col-span-1 text-end">
                        Preis: {formatPrice(Number(order.price))}
                      </p>
                      <div className="col-span-2 mt-2 flex flex-row flex-wrap gap-2 p-2 bg-zinc-800">
                        {order.products.map((product, index) => (
                          <div
                            key={index}
                            className={`w-[15px] h-[15px] border ${
                              product.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* rechte Seite Bestellung Einzeln im Detail */}
              <div className="col-span-1 col-start-1 row-span-1 row-start-2 sm:col-start-2 sm:row-start-1  flex flex-col sm:border-l p-1 sm:p-2 sm:mt-5 pb-12 max-h-[50vh] sm:max-h-[70vh] md:max-h-[80vh]  overflow-y-auto ">
                {orderToUpdate && (
                  <>
                    <div className="grid grid-cols-2">
                      <h3 className="font-bold mb-1 sm:mb-4 text-(length:--font-size-standard)">
                        Bestellung: {orderToUpdate.orderNumber}
                      </h3>
                      <p className="col-span-1 text-end">
                        {" "}
                        Bestellt: {formatTime(orderToUpdate.createdAt)} Uhr
                      </p>
                    </div>
                    <div className="grid grid-cols-1">
                      <OrderComponent
                        orderToUpdate={orderToUpdate}
                        setOrderToUpdate={setOrderToUpdate}
                        which="updateOrder"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <BottomBar />
    </div>
  );
};

export default OrderSystemApp;
