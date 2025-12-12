import { set } from "date-fns";

const OrderComponent = ({ orderToUpdate, setOrderToUpdate, which }) => {
  // Gruppiere Produkte nach productName
  const groupedProducts =
    orderToUpdate?.products.reduce((acc, product) => {
      if (!acc[product.productName]) {
        acc[product.productName] = [];
      }
      acc[product.productName].push(product);
      return acc;
    }, {}) || {};

  // Klick-Handler: Ändere Status des ersten pending Produkts fertiger Bestellungen
  const handleProductClick = (productName) => {
    if (setOrderToUpdate) {
      setOrderToUpdate((prevOrder) => {
        const updatedProducts = [...prevOrder.products];
        let changed = false;

        const newProducts = updatedProducts.map((product) => {
          if (
            !changed &&
            product.productName === productName &&
            product.status === "pending"
          ) {
            changed = true;
            return { ...product, status: "completed" };
          }
          return product;
        });

        return {
          ...prevOrder,
          products: newProducts,
        };
      });
    }
  };

  // Klick-Handler: Entfernt das erste Produkt mit dem angegebenen productName aus der neuen Bestellung und berichtigt den Preis
  const handleNewOrderProductClick = (productName) => {
    if (setOrderToUpdate) {
      setOrderToUpdate((prevOrder) => {
        const updatedProducts = [...prevOrder.products];
        let updatedPrice = Number(prevOrder.price);
        let removed = false;
        const newProducts = updatedProducts.filter((product) => {
          if (!removed && product.productName === productName) {
            removed = true;
            updatedPrice -= Number(product.productPrice); // Preis anpassen

            return false; // Produkt entfernen
          }
          return true; // Produkt behalten
        });

        return {
          ...prevOrder,
          products: newProducts,
          price: updatedPrice.toFixed(2), // Preis auf 2 Dezimalstellen runden
        };
      });
    }
  };

  if (!orderToUpdate) return null;

  return (
    <div className="space-y-2  w-[100%] p-1 rounded-md ">
      {Object.entries(groupedProducts).map(([productName, items]) => {
        const totalCount = items.length;
        const completedCount = items.filter(
          (item) => item.status === "completed"
        ).length;
        const pendingCount = totalCount - completedCount;

        return (
          <div
            key={productName}
            onClick={(e) => {
              e.preventDefault();
              if (which === "updateOrder") {
                handleProductClick(productName);
              } else handleNewOrderProductClick(productName);
            }}
            className={`p-3 gap-4 cursor-pointer transition  text-(--text-color-dark) ${
              which === "updateOrder"
                ? completedCount === totalCount
                  ? "bg-green-600 border-green-300"
                  : completedCount > 0 && completedCount < totalCount
                  ? "bg-yellow-500 hover:bg-gray-50"
                  : !setOrderToUpdate
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-400 hover:bg-gray-50"
                : "bg-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className=" grid grid-cols-3 text-(--text-color-dark)">
              {which === "updateOrder" && (
                <>
                  <span className="font-semibold col-span-1">
                    {productName}
                  </span>
                  <div className="flex items-center gap-2 col-span-2 grid grid-cols-2">
                    {pendingCount > 0 && (
                      <span className="col-span-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-center">
                        {pendingCount} offen
                      </span>
                    )}
                    {pendingCount === 0 && <span className="col-span-1"></span>}

                    <span className="text-sm font-medium col-span-1 text-end pr-4">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                </>
              )}
              {which === "newOrder" && (
                <>
                  <span className="font-semibold col-span-2">
                    {productName}
                  </span>
                  <span className="text-sm font-medium col-span-1 text-end pr-4">
                    {completedCount}/{totalCount}
                  </span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderComponent;
