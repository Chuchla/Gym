import React, { useEffect, useState } from "react";
import AxiosInstance from "./AxiosInstance.jsx";
import { useParams, Link as RouterLink } from "react-router-dom"; //
import Section from "./Section.jsx"; // Dodajemy Section dla spójności
import Heading from "./Heading.jsx"; // Dla tytułu sekcji lub produktu
import Button from "./Button.jsx";
import { defaultImageSource } from "../assets/index.js"; // Twój komponent Button

// Domyślny obrazek dla planów treningowych
const defaultPlanImage = defaultImageSource;

const CertainProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Stan dla animacji przycisku
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setCartMessage(""); // Resetuj wiadomość przy ładowaniu nowego produktu
      try {
        const resp = await AxiosInstance.get(`/products/${id}/`); // Dodaj slash na końcu, jeśli API tego wymaga
        setProduct(resp.data);
      } catch (err) {
        console.error("Nie udalo sie pobrac produktu: ", err);
        if (err.response && err.response.status === 404) {
          setError("Nie znaleziono takiego produktu.");
        } else {
          setError(
            "Nie udało się wczytać danych produktu. Spróbuj ponownie później.",
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    } else if (e.target.value === "") {
      // Pozwól na tymczasowe usunięcie wartości
      setQuantity("");
    }
  };

  const handleQuantityBlur = (e) => {
    // Jeśli input jest pusty po utracie focusa, ustaw 1
    if (e.target.value === "") {
      setQuantity(1);
    }
  };

  const handleAddToCart = async () => {
    if (quantity < 1 || Number.isNaN(parseInt(quantity))) {
      setCartMessage("Wybierz poprawną ilość.");
      return;
    }
    setIsAddingToCart(true);
    setCartMessage("");
    try {
      await AxiosInstance.post("/cart/items/", {
        product_id: parseInt(id),
        quantity: parseInt(quantity),
      });
      setCartMessage("Dodano do koszyka!");
      setTimeout(() => setCartMessage(""), 3000); // Ukryj wiadomość po 3 sekundach
    } catch (err) {
      console.error(
        "Nie udało się dodać do koszyka:",
        err.response?.data || err.message,
      );
      const errorDetail =
        err.response?.data?.detail ||
        err.response?.data?.product_id?.[0] ||
        "Błąd podczas dodawania.";
      setCartMessage(`Błąd: ${errorDetail}`);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <Section
        customPaddings
        className="py-10 lg:py-16 xl:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)]"
      >
        <div className="container text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-1 mx-auto mb-4"></div>
          <p className="text-n-2 text-lg">Ładowanie produktu...</p>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section
        customPaddings
        className="py-10 lg:py-16 xl:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)]"
      >
        <div className="container text-center">
          <Heading title="Błąd" className="text-red-400 mb-6" />
          <p className="text-n-2 text-lg mb-8">{error}</p>
          <Button href="/shop" white>
            Wróć do sklepu
          </Button>
        </div>
      </Section>
    );
  }

  if (!product) {
    // Jeśli produkt jest null po zakończeniu ładowania
    return (
      <Section
        customPaddings
        className="py-10 lg:py-16 xl:py-20 flex items-center justify-center min-h-[calc(100vh-10rem)]"
      >
        <div className="container text-center">
          <Heading title="Informacja" className="mb-6" />
          <p className="text-n-2 text-lg mb-8">Nie znaleziono produktu.</p>
          <Button href="/shop" white>
            Wróć do sklepu
          </Button>
        </div>
      </Section>
    );
  }

  const productImageUrl = defaultPlanImage;
  const price = parseFloat(product.price);

  return (
    <Section customPaddings className="py-10 lg:py-16 xl:py-20">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 xl:gap-16 items-start">
          {/* Lewa Kolumna: Obrazek */}
          <div className="w-full lg:w-1/2 xl:w-5/12 flex-shrink-0">
            <div className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] bg-n-7 rounded-xl border border-n-6 shadow-xl overflow-hidden">
              <img
                src={productImageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Prawa Kolumna: Informacje i Akcje */}
          <div className="w-full lg:w-1/2 xl:w-7/12 flex flex-col">
            <Heading
              title={product.name}
              className="mb-4 md:mb-6 !text-3xl sm:!text-4xl lg:!text-5xl text-left" // Nadpisanie domyślnego wyśrodkowania i rozmiaru
            />

            {product.description && (
              <p className="body-1 text-n-2 mb-6 md:mb-8 text-justify leading-relaxed">
                {" "}
                {/* Użycie .body-1 */}
                {product.description}
              </p>
            )}

            <div className="text-3xl sm:text-4xl font-semibold text-color-1 mb-6 md:mb-8">
              {Number.isNaN(price)
                ? "Cena niedostępna"
                : price.toLocaleString("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  })}
            </div>

            {/* Sekcja Ilość i Dodaj do Koszyka */}
            <div className="mt-auto space-y-4">
              {" "}
              {/* mt-auto aby wypchnąć na dół jeśli prawa kolumna jest wyższa */}
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="font-semibold text-n-2">
                  Ilość:
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur} // Dodane na wypadek gdyby użytkownik zostawił puste pole
                  className="bg-n-6 border border-n-5 text-n-1 rounded-md px-3 py-2 w-20 text-center focus:border-color-1 focus:ring-1 focus:ring-color-1 outline-none"
                />
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || quantity < 1}
                className={`w-full text-lg py-3 ${isAddingToCart || quantity < 1 ? "opacity-60 cursor-not-allowed" : ""}`}
                white // Zakładając, że 'white' daje jasny tekst na domyślnym tle przycisku
              >
                {isAddingToCart ? "Dodawanie..." : "Dodaj do koszyka"}
              </Button>
              {cartMessage && (
                <p
                  className={`mt-3 text-sm text-center ${cartMessage.startsWith("Błąd") ? "text-red-400" : "text-green-400"}`}
                >
                  {cartMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CertainProduct;
