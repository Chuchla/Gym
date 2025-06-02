import React, { useEffect, useState } from "react";
import AxiosInstance from "./AxiosInstance.jsx";
import Section from "./Section.jsx"; // Twój komponent Section
import Heading from "./Heading.jsx"; // Twój komponent Heading
import Button from "./Button.jsx";
import { Link } from "react-router-dom"; // Twój komponent Button
// Możesz dodać ikony, np. dla przycisku usuwania
// import { TrashIcon } from '@heroicons/react/24/outline'; // Przykład z Heroicons

const MyBasket = () => {
  const [basket, setBasket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mutatingItemId, setMutatingItemId] = useState(null); // Przechowuje ID itemu, który jest modyfikowany
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const fetchBasket = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await AxiosInstance.get("/cart/");
      // Dostosuj do struktury odpowiedzi API - jeśli koszyk jest w resp.data.basket
      // Jeśli API zwraca bezpośrednio obiekt koszyka (np. z listą items i grand_total), to resp.data
      setBasket(resp.data.basket || resp.data);
    } catch (err) {
      console.error(
        "Nie udało się pobrać koszyka:",
        err.response?.data || err.message,
      );
      setError(
        "Nie udało się załadować zawartości koszyka. Spróbuj odświeżyć stronę.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBasket();
  }, []);

  const handleRemoveItem = async (itemId) => {
    setMutatingItemId(itemId);
    setError(null);
    try {
      await AxiosInstance.delete(`/cart/items/${itemId}/`);
      await fetchBasket(); // Odśwież koszyk
    } catch (err) {
      console.error(
        "Błąd podczas usuwania pozycji:",
        err.response?.data || err.message,
      );
      setError("Nie udało się usunąć produktu z koszyka.");
    } finally {
      setMutatingItemId(null);
    }
  };

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty <= 0) {
      return handleRemoveItem(itemId);
    }
    setMutatingItemId(itemId);
    setError(null);
    try {
      await AxiosInstance.put(`/cart/items/${itemId}/`, { quantity: newQty });
      await fetchBasket(); // Odśwież koszyk
    } catch (err) {
      console.error(
        "Błąd podczas aktualizacji ilości:",
        err.response?.data || err.message,
      );
      setError("Nie udało się zaktualizować ilości produktu.");
    } finally {
      setMutatingItemId(null);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setError(null);
    setCheckoutMessage("");
    try {
      await AxiosInstance.post("/cart/checkout/");
      setCheckoutMessage(
        "Zakup zakończony pomyślnie! Twój koszyk został opróżniony.",
      );
      await fetchBasket(); // Koszyk powinien być teraz pusty
      // Możesz dodać przekierowanie do strony z podsumowaniem zamówienia po kilku sekundach
      // setTimeout(() => navigate('/orders/thank-you'), 3000);
    } catch (err) {
      console.error(
        "Błąd podczas finalizacji zakupu:",
        err.response?.data || err.message,
      );
      setError(
        err.response?.data?.error || // Sprawdź, czy API zwraca 'error' zamiast 'detail'
          err.response?.data?.detail ||
          "Nie udało się sfinalizować zakupu. Sprawdź dane lub spróbuj ponownie.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const isMutating = (itemId) => mutatingItemId === itemId;

  // Stany ładowania i błędu
  if (loading) {
    return (
      <Section
        customPaddings
        className="py-10 lg:py-16 xl:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)]"
      >
        <div className="container text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-1 mx-auto mb-4"></div>
          <p className="text-n-2 text-lg">Ładowanie koszyka...</p>
        </div>
      </Section>
    );
  }

  // Zmiana: Wyświetlaj błąd w kontekście strony koszyka, nie jako pełnoekranowy błąd, jeśli koszyk już był załadowany
  // Pełnoekranowy błąd tylko jeśli `basket` jest null i jest `error`
  if (!basket && error && !loading) {
    return (
      <Section
        customPaddings
        className="py-10 lg:py-16 xl:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)]"
      >
        <div className="container text-center">
          <Heading title="Błąd Koszyka" className="text-red-400 mb-6" />
          <p className="text-n-2 text-lg mb-8">{error}</p>
          <Button onClick={fetchBasket} white>
            Spróbuj ponownie
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section customPaddings className="py-10 lg:py-16 xl:py-20">
      <div className="container max-w-3xl mx-auto">
        {" "}
        {/* Zmniejszyłem max-w dla typowego koszyka */}
        <Heading title="Twój Koszyk" className="text-center mb-10 md:mb-12" />
        {error && !loading && basket && (
          <div
            className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6 text-center"
            role="alert"
          >
            <strong className="font-bold">Błąd!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
        {!basket?.items?.length ? (
          <div className="text-center py-10 px-6 rounded-xl bg-n-7 border border-n-6 shadow-md">
            <p className="text-n-2 text-lg mb-6">Twój koszyk jest pusty.</p>
            <Button href="/shop" white>
              Przejdź do sklepu
            </Button>
          </div>
        ) : (
          <div className="bg-n-7 border border-n-6 rounded-xl shadow-xl p-4 sm:p-6 md:p-8">
            <ul className="divide-y divide-n-6">
              {basket.items.map((item) => (
                <li
                  key={item.id}
                  className="py-5 flex flex-col sm:flex-row items-start gap-4" // Zmieniono na items-start dla lepszego ułożenia w pionie na sm
                >
                  {/* Obrazek produktu (opcjonalnie) - możesz odkomentować */}
                  {/* <img
                    src={item.product?.image_url || defaultProductImage}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded-md border border-n-5 flex-shrink-0"
                  /> */}

                  {/* Lewa strona: Nazwa produktu */}
                  <div className="flex-grow mb-4 sm:mb-0">
                    <Link
                      to={`/product/${item.product?.id}`}
                      className="hover:text-color-1 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-n-1 leading-tight">
                        {item.product?.name || "Produkt bez nazwy"}
                      </h3>
                    </Link>
                    {/* Można dodać np. cenę jednostkową tutaj, jeśli potrzeba */}
                    <p className="text-sm text-n-4 mt-1">
                      Cena jedn.:{" "}
                      {parseFloat(item.product?.price || 0).toLocaleString(
                        "pl-PL",
                        {
                          style: "currency",
                          currency: "PLN",
                        },
                      )}
                    </p>
                  </div>

                  {/* Środek: Kontrolki ilości */}
                  <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 order-3 sm:order-2 w-full sm:w-auto justify-center sm:justify-start">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={isMutating(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-n-6 hover:bg-n-5 text-n-1 text-xl leading-none disabled:opacity-50 transition-colors"
                      aria-label="Zmniejsz ilość"
                    >
                      –
                    </button>
                    <span className="text-md font-medium text-n-1 w-10 text-center bg-n-8 border border-n-5 rounded-md py-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={isMutating(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-n-6 hover:bg-n-5 text-n-1 text-xl leading-none disabled:opacity-50 transition-colors"
                      aria-label="Zwiększ ilość"
                    >
                      +
                    </button>
                  </div>

                  {/* Prawa strona: Cena całkowita i przycisk usuń */}
                  <div className="flex flex-col items-end space-y-1 shrink-0 order-2 sm:order-3 w-full sm:w-auto text-right">
                    <div className="font-semibold text-n-1 text-md sm:text-lg mb-1 sm:mb-2">
                      {parseFloat(item.total_price || 0).toLocaleString(
                        "pl-PL",
                        {
                          style: "currency",
                          currency: "PLN",
                        },
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isMutating(item.id)}
                      className="p-1 text-n-4 hover:text-red-400 disabled:opacity-50 transition-colors"
                      title="Usuń produkt"
                      aria-label="Usuń produkt"
                    >
                      {/* Użyj ikony SVG jeśli masz, np. Heroicons TrashIcon */}
                      {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg> */}
                      <span className="text-2xl leading-none">&times;</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Podsumowanie i przycisk Checkout */}
            <div className="mt-8 pt-6 border-t border-n-6">
              <div className="flex justify-end items-center mb-6">
                <span className="text-xl font-semibold text-n-2 mr-3">
                  Suma całkowita:
                </span>
                <span className="text-2xl font-bold text-color-1">
                  {parseFloat(basket.grand_total || 0).toLocaleString("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  })}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={checkoutLoading || basket.items.length === 0}
                className={`w-full text-lg py-3 ${checkoutLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                // Możesz dodać wariant 'primary' lub 'accent' do Buttona, jeśli chcesz inny kolor
                // np. używając koloru color-4 (zielony) dla akcji pozytywnej
              >
                {checkoutLoading
                  ? "Przetwarzanie..."
                  : "Zakończ zakup i zapłać"}
              </Button>
            </div>
          </div>
        )}
        {checkoutMessage && (
          <div className="mt-6 text-center text-lg">
            <p className="text-green-400">{checkoutMessage}</p>
            {checkoutMessage.includes("pomyślnie") && (
              <Button href="/account" className="mt-4" white>
                Zobacz swoje zamówienia
              </Button>
            )}
          </div>
        )}
      </div>
    </Section>
  );
};

export default MyBasket;
