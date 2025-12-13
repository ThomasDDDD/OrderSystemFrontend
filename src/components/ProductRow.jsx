import { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/AuthContext";

// ProductRow Komponente
const ProductRow = ({ product, onDelete }) => {
  const [productName, setProductName] = useState(product.productName);
  const [productPrice, setProductPrice] = useState(
    product.productPrice.toFixed(2)
  );
  const [available, setAvailable] = useState(product.available);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const APIKEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_BACKEND_URL;

  const updateProduct = async (updates) => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${URL}/product/updateProduct/${product._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "api-key": APIKEY,
          },
          credentials: "include",
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error("Update fehlgeschlagen");
      }

      const data = await response.json();
      console.log("Produkt aktualisiert:", data);
    } catch (error) {
      console.error("Fehler beim Update:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProduct = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${URL}/product/deleteProduct/${product._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "api-key": APIKEY,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Löschen fehlgeschlagen");
      }

      const data = await response.json();
      console.log("Produkt gelöscht:", data);

      // Callback an Parent-Komponente, um productsData zu aktualisieren
      if (onDelete) {
        onDelete(product._id);
      }

      setShowDeletePopup(false);
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleNameBlur = () => {
    if (productName !== product.productName) {
      updateProduct({ productName });
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(",", ".");
    setProductPrice(value);
  };

  const handlePriceBlur = () => {
    const numPrice = parseFloat(productPrice);
    if (!isNaN(numPrice) && numPrice !== product.productPrice) {
      updateProduct({ productPrice: numPrice });
      setProductPrice(numPrice.toFixed(2));
    } else {
      setProductPrice(product.productPrice.toFixed(2));
    }
  };

  const handleAvailableChange = (e) => {
    const newValue = e.target.checked;
    setAvailable(newValue);
    updateProduct({ available: newValue });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 hover:bg-gray-50 p-2 rounded transition-colors">
        <input
          type="text"
          value={productName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          className="pl-4 font-semibold w-[40%] border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isUpdating}
        />

        <div className="flex items-center gap-2 w-[30%]">
          <label className="text-sm font-medium whitespace-nowrap">
            Preis:
          </label>
          <input
            type="number"
            step="0.01"
            value={productPrice}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            className="border border-gray-300 rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isUpdating}
          />
          <span className="text-sm">€</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Verfügbar:</label>
          <input
            type="checkbox"
            className="w-6 h-6 cursor-pointer accent-green-500"
            checked={available}
            onChange={handleAvailableChange}
            disabled={isUpdating}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowDeletePopup(true)}
          className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          disabled={isUpdating}
        >
          Löschen
        </button>

        {isUpdating && (
          <div className="text-xs text-gray-500">Speichert...</div>
        )}
      </div>

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-[var(--background-main-80)] flex items-center justify-center z-60">
          <div className="flex flex-col p-4 lg:p-8 m-4 gap-4 items-center justify-between bg-[var(--background-main)] text-(--text-color) border rounded-md border-(color:--shadow-color) shadow-md shadow-(color:--shadow-color)">
            <h2 className="text-(length:--font-size-largerStandard) text-center font-bold pb-2 mb-4 border-b w-full">
              Produkt löschen?
            </h2>
            <p>Das Produkt "{productName}" wird unwiderruflich gelöscht.</p>
            <p>Sind Sie sicher?</p>
            <div className="flex gap-4 w-[100%]">
              <button
                type="button"
                className="cursor-pointer px-6 py-2 rounded-md bg-[var(--primary-color-100)] text-(--text-color-rev) w-[60%] max-w-[300px]"
                onClick={() => setShowDeletePopup(false)}
                disabled={isUpdating}
              >
                Abbrechen
              </button>
              <button
                type="button"
                className="cursor-pointer px-6 py-2 rounded-md bg-[var(--accent-color-100)] text-(--text-color-rev) w-[60%] max-w-[300px]"
                onClick={deleteProduct}
                disabled={isUpdating}
              >
                {isUpdating ? "Wird gelöscht..." : "Löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductRow;
