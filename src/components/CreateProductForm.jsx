import { useState } from "react";

const CreateProductForm = ({ onProductCreated }) => {
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productCategory: "Getraenke",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const APIKEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_BACKEND_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Preview erstellen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Falls ein Bild hochgeladen wurde, erst das Bild uploaden
      let imgUrl = "/images/products/default.png";

      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("image", imageFile);

        const uploadResponse = await fetch(`${URL}/product/uploadImage`, {
          method: "POST",
          headers: {
            "api-key": APIKEY,
          },
          credentials: "include",
          body: formDataImage,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imgUrl = uploadData.imgUrl || imgUrl;
        }
      }

      // Produkt erstellen
      const response = await fetch(`${URL}/product/createProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": APIKEY,
        },
        credentials: "include",
        body: JSON.stringify({
          productName: formData.productName,
          productPrice: parseFloat(formData.productPrice),
          productCategory: formData.productCategory,
          imgUrl: imgUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Produkt erstellen fehlgeschlagen");
      }

      const data = await response.json();
      console.log("Produkt erstellt:", data);

      // Callback an Parent-Komponente
      if (onProductCreated) {
        onProductCreated(data.product || data);
      }

      // Form zurücksetzen
      setFormData({
        productName: "",
        productPrice: "",
        productCategory: "Getraenke",
      });
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
    } catch (error) {
      console.error("Fehler beim Erstellen:", error);
      alert("Fehler beim Erstellen des Produkts");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full mb-6">
      {/* Toggle Button */}
      {!showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-semibold"
        >
          + Neues Produkt anlegen
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="border border-gray-300 rounded-md p-6 bg-[var(--background-main)] mt-4">
          <h3 className="text-(length:--font-size-standard) font-bold mb-4 pb-2 border-b">
            Neues Produkt anlegen
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Produktname */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Produktname *</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. Glühwein - Rot"
              />
            </div>

            {/* Preis */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Preis (€) *</label>
              <input
                type="number"
                step="0.01"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleInputChange}
                required
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. 3.80"
              />
            </div>

            {/* Kategorie */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Kategorie *</label>
              <select
                name="productCategory"
                value={formData.productCategory}
                onChange={handleInputChange}
                required
                className=" border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option
                  className="bg-[var(--background-main)]"
                  value="Getraenke"
                >
                  Getränke
                </option>
                <option
                  className="bg-[var(--background-main)]"
                  value="Herzhaftes"
                >
                  Herzhaftes
                </option>
                <option className="bg-[var(--background-main)]" value="Sueßes">
                  Süßes
                </option>
              </select>
            </div>

            {/* Bild Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Produktbild (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Vorschau"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    productName: "",
                    productPrice: "",
                    productCategory: "Getraenke",
                  });
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                disabled={isCreating}
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-semibold"
                disabled={isCreating}
              >
                {isCreating ? "Wird erstellt..." : "Produkt erstellen"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateProductForm;
