const OrderComponent = ({ orderToUpdate, setOrderToUpdate }) => {
  // Gruppiere Produkte nach productName
  const groupedProducts =
    orderToUpdate?.products.reduce((acc, product) => {
      if (!acc[product.productName]) {
        acc[product.productName] = [];
      }
      acc[product.productName].push(product);
      return acc;
    }, {}) || {};

  // Klick-Handler: Ändere Status des ersten pending Produkts
  const handleProductClick = (productName) => {
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
  };

  if (!orderToUpdate) return null;

  return (
    <div className="space-y-2">
      {Object.entries(groupedProducts).map(([productName, items]) => {
        const totalCount = items.length;
        const completedCount = items.filter(
          (item) => item.status === "completed"
        ).length;
        const pendingCount = totalCount - completedCount;

        return (
          <div
            key={productName}
            onClick={() => handleProductClick(productName)}
            className={`p-3  gap-4 cursor-pointer transition  text-(--text-color-dark) ${
              completedCount === totalCount
                ? "bg-green-600 border-green-300"
                : "bg-yellow-600 hover:bg-gray-50"
            }`}
          >
            <div className=" grid grid-cols-3 text-(--text-color-dark)">
              <span className="font-semibold col-span-1">{productName}</span>
              <div className="flex items-center gap-2 col-span-2 grid grid-cols-2">
                {pendingCount > 0 && (
                  <span className="col-span-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-center">
                    {pendingCount} offen
                  </span>
                )}
                {pendingCount === 0 && (
                  <span className="col-span-1 text-xs px-2 py-1 rounded text-center"></span>
                )}
                <span className="text-sm font-medium col-span-1 text-end pr-4">
                  {completedCount}/{totalCount}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderComponent;
