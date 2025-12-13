import { useState, useEffect, useContext } from "react";
import { OrderContext } from "../context/OrderContext";

const Statistics = () => {
  const { statisticsPopUp, setStatisticsPopUp } = useContext(OrderContext);
  const [statsData, setStatsData] = useState(null);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  const APIKEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_BACKEND_URL;

  const fetchStatistics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${URL}/statistics/getStatistics?startDate=${startDate}&endDate=${endDate}&status=completed`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "api-key": APIKEY,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Statistik-Abfrage fehlgeschlagen");
      }

      const data = await response.json();
      setStatsData(data);
    } catch (error) {
      console.error("Fehler beim Laden der Statistik:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (statisticsPopUp) {
      fetchStatistics();
    }
  }, [statisticsPopUp]);

  if (!statisticsPopUp) return null;

  return (
    <div className="fixed inset-0 bg-[var(--background-main-80)] flex items-center justify-center z-60 p-4">
      <div className="bg-[var(--background-main)] text-(--text-color) border rounded-md border-(color:--shadow-color) shadow-md shadow-(color:--shadow-color) w-full max-w-[1400px] max-h-[90vh] overflow-y-auto">
        {/* Header mit Schließen-Button */}
        <div className="sticky top-0 bg-[var(--background-main)] border-b p-4 flex justify-between items-center">
          <h2 className="text-(length:--font-size-largerStandard) font-bold font-(family-name:--style-font)">
            Verkaufsstatistik
          </h2>
          <button
            onClick={() => setStatisticsPopUp(false)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Schließen
          </button>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-8">
          {/* Datum-Filter */}
          <div className="flex flex-wrap gap-4 mb-6 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Von:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Bis:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <button
              onClick={fetchStatistics}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Lädt..." : "Aktualisieren"}
            </button>
          </div>

          {statsData && (
            <>
              {/* Übersicht */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border rounded-md p-4 bg-[var(-background-rev)]">
                  <h3 className="text-sm font-medium text-gray-600">
                    Gesamtumsatz
                  </h3>
                  <p className="text-2xl font-bold">
                    {statsData.totalRevenue.toFixed(2)} €
                  </p>
                </div>
                <div className="border rounded-md p-4 bg-[var(-background-rev)]">
                  <h3 className="text-sm font-medium text-gray-600">
                    Anzahl Bestellungen
                  </h3>
                  <p className="text-2xl font-bold">{statsData.totalOrders}</p>
                </div>
                <div className="border rounded-md p-4 bg-[var(-background-rev)]">
                  <h3 className="text-sm font-medium text-gray-600">
                    Ø Bestellwert
                  </h3>
                  <p className="text-2xl font-bold">
                    {statsData.totalOrders > 0
                      ? (
                          statsData.totalRevenue / statsData.totalOrders
                        ).toFixed(2)
                      : "0.00"}{" "}
                    €
                  </p>
                </div>
              </div>

              {/* Kategorie-Übersicht */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(statsData.categoryStats).map(
                  ([category, stats]) => (
                    <div
                      key={category}
                      className="border rounded-md p-4 bg-[var(-background-rev)]"
                    >
                      <h3 className="text-lg font-bold mb-2">{category}</h3>
                      <p className="text-sm">Anzahl: {stats.quantity}</p>
                      <p className="text-sm font-semibold">
                        Umsatz: {stats.revenue.toFixed(2)} €
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Produkt-Tabelle */}
              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[var(-background-rev)]">
                      <tr>
                        <th className="px-4 py-2 text-left">Produktname</th>
                        <th className="px-4 py-2 text-left">Kategorie</th>
                        <th className="px-4 py-2 text-right">Anzahl</th>
                        <th className="px-4 py-2 text-right">Umsatz</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statsData.productStats.map((product) => (
                        <tr
                          key={product.productId}
                          className="border-t hover:bg-gray-50"
                        >
                          <td className="px-4 py-2">{product.productName}</td>
                          <td className="px-4 py-2">
                            {product.productCategory}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {product.quantity}
                          </td>
                          <td className="px-4 py-2 text-right font-semibold">
                            {product.revenue.toFixed(2)} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-lg">Statistiken werden geladen...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
