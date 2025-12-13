import { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/AuthContext";
import ProductRow from "../components/ProductRow";
import CreateProductForm from "../components/CreateProductForm";

const OrderSystemOptions = () => {
  const { user, isLoggedIn } = useContext(AuthContext);

  const [formOpen, setFormOpen] = useState(false);

  //! State für Products

  const [productPage, setProductPage] = useState(1);
  const [productLimit, setProductLimit] = useState(31);
  const [productMaxPage, setProductMaxPage] = useState(1);

  const [productSort, setProductSort] = useState("productName");
  const [productSortOrder, setProductSortOrder] = useState(1);
  const [available, setAvailable] = useState(false);
  const [category, setCategory] = useState(null);
  const [productSearch, setProductSearch] = useState("");

  const [productsData, setProductsData] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  const APIKEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_BACKEND_URL;

  const [date, setDate] = useState(new Date());

  const countryDateFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);

  const toggleForm = (e) => {
    e.preventDefault();
    setFormOpen(!formOpen);
  };

  const handleDeleteProduct = (productId) => {
    setProductsData((prevData) =>
      prevData.filter((product) => product._id !== productId)
    );
    setTotalProducts((prev) => prev - 1);
  };

  const handleProductCreated = (newProduct) => {
    setProductsData((prevData) => [...prevData, newProduct]);
    setTotalProducts((prev) => prev + 1);
  };

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

  /* debugging Logs */

  useEffect(() => {
    console.log(productsData);
  }, [productsData]);

  return (
    <>
      <div className="bg-[var(--background-main)] text-(--text-color) min-h-screen relative">
        <NavBar />

        <div className="flex flex-col items-center justify-start h-[83vh] w-full p-2 mx-auto">
          {isLoggedIn && user && (
            <>
              {/* Seitenkopf Name & Datum */}
              <div className="flex items-center justify-between w-full max-w-[1920px] px-6 py-1 border-b font-(family-name:--style-font)">
                <h2 className="text-(length:--font-size-standard) font-bold w-full">
                  {user.userName}
                </h2>
                <p className="text-(length:--font-size-standard) font-(family-name:--standard-font) w-full text-end">
                  {countryDateFormat} Uhr
                </p>
              </div>

              {/* Seitenansicht */}
              <div className="w-[100%] overflow-y-auto mt-2 flex flex-col gap-4">
                {/* Produkteinstellungen */}
                <h2 className="text-(length:--font-size-largerStandard) font-bold font-(family-name:--style-font) pb-2 mb-4 border-b w-full">
                  Produkteinstellungen
                </h2>

                {/* Neues Produkt Formular */}
                <CreateProductForm onProductCreated={handleProductCreated} />

                {productsData && (
                  <>
                    {/* Getränke */}
                    <div className="flex flex-col gap-4 w-[100%] p-4 ">
                      <h3 className="text-(length:--font-size-standard) font-bold pb-2 mb-2 border-b w-full">
                        Getränke
                      </h3>
                      {productsData
                        .filter(
                          (product) => product.productCategory === "Getraenke"
                        )
                        .map((product) => (
                          <ProductRow
                            key={product._id}
                            product={product}
                            onDelete={handleDeleteProduct}
                          />
                        ))}
                    </div>

                    {/* Herzhaftes */}
                    <div className="flex flex-col gap-4 w-[100%]  p-4 ">
                      <h3 className="text-(length:--font-size-standard) font-bold pb-2 mb-2 border-b w-full">
                        Herzhaftes
                      </h3>
                      {productsData
                        .filter(
                          (product) => product.productCategory === "Herzhaftes"
                        )
                        .map((product) => (
                          <ProductRow
                            key={product._id}
                            product={product}
                            onDelete={handleDeleteProduct}
                          />
                        ))}
                    </div>

                    {/* Süßes */}
                    <div className="flex flex-col gap-4 w-[100%] p-4 ">
                      <h3 className="text-(length:--font-size-standard) font-bold pb-2 mb-2 border-b w-full">
                        Süßes
                      </h3>
                      {productsData
                        .filter(
                          (product) => product.productCategory === "Sueßes"
                        )
                        .map((product) => (
                          <ProductRow
                            key={product._id}
                            product={product}
                            onDelete={handleDeleteProduct}
                          />
                        ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default OrderSystemOptions;
