import React, { useEffect, useState } from "react";
import AxiosInstance from "./AxiosInstance.jsx";

const MyBasket = () => {
  const [basket, setBasket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mutating, setMutating] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  // helper to (re)load the basket
  const fetchBasket = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await AxiosInstance.get("/cart/");
      // If your API wraps the cart in `resp.data.basket`, use that; otherwise use `resp.data` directly:
      setBasket(resp.data.basket || resp.data);
    } catch (err) {
      console.error("Nie udało się pobrać koszyka:", err);
      setError("Nie udało się pobrać koszyka.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBasket();
  }, []);

  // DELETE a single cart item by its ID
  const handleRemoveItem = async (itemId) => {
    setMutating(true);
    setError(null);
    try {
      await AxiosInstance.delete(`/cart/items/${itemId}/`);
      await fetchBasket();
    } catch (err) {
      console.error("Błąd podczas usuwania pozycji:", err);
      setError("Nie udało się usunąć produktu z koszyka.");
    } finally {
      setMutating(false);
    }
  };

  // Update quantity; if newQty <= 0, delete instead
  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty <= 0) {
      return handleRemoveItem(itemId);
    }
    setMutating(true);
    setError(null);
    try {
      await AxiosInstance.put(`/cart/items/${itemId}/`, { quantity: newQty });
      await fetchBasket();
    } catch (err) {
      console.error("Błąd podczas aktualizacji ilości:", err);
      setError("Nie udało się zaktualizować ilości.");
    } finally {
      setMutating(false);
    }
  };

  // Checkout: POST /cart/checkout/
  const handleCheckout = async () => {
    setMutating(true);
    setError(null);
    setCheckoutMessage("");
    try {
      await AxiosInstance.post("/cart/checkout/");
      setCheckoutMessage("Zakup zakończony pomyślnie!");
      await fetchBasket(); // koszyk powinien być teraz pusty
    } catch (err) {
      console.error("Błąd podczas finalizacji zakupu:", err);
      setError(
        err.response?.data?.detail ||
          "Nie udało się sfinalizować zakupu. Spróbuj ponownie.",
      );
    } finally {
      setMutating(false);
    }
  };

  if (loading) return <div>Ładowanie koszyka…</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Twój koszyk</h2>

      {!basket?.items?.length ? (
        <p>Koszyk jest pusty.</p>
      ) : (
        <ul className="space-y-2">
          {basket.items.map((item) => (
            <li
              key={item.id}
              className="border p-2 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {item.product?.name || "Brak nazwy"}
                </p>
                <div className="flex items-center space-x-2">
                  {/* Minus button */}
                  <button
                    disabled={mutating}
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    className="px-2 py-1 bg-purple-400 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    –
                  </button>

                  {/* Current quantity */}
                  <span className="text-sm">{item.quantity}</span>

                  {/* Plus button */}
                  <button
                    disabled={mutating}
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-purple-400 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1">
                {/* Total price for this line */}
                <p className="text-right font-medium">
                  {Number(item.total_price).toLocaleString("pl-PL")} zł
                </p>

                <button
                  disabled={mutating}
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  title="Usuń produkt"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {basket && basket.items.length > 0 && (
        <>
          <div className="mt-4 text-right font-bold text-lg">
            Suma: {parseFloat(basket.grand_total).toLocaleString("pl-PL")} zł
          </div>

          <div className="mt-6 text-right">
            <button
              disabled={mutating}
              onClick={handleCheckout}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {mutating ? "W toku realizacji…" : "Zakończ zakup"}
            </button>
          </div>
        </>
      )}

      {checkoutMessage && (
        <div className="mt-4 text-center text-green-600">{checkoutMessage}</div>
      )}
    </div>
  );
};

export default MyBasket;
