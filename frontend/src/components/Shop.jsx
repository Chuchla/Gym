import React, { useEffect, useState } from "react";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import AxiosInstance from "./AxiosInstance.jsx";
import { Link } from "react-router-dom";
import Button from "./Button.jsx";
import Arrow from "../assets/svg/Arrow.jsx";

import { defaultImageSource } from "../assets/index.js";

const defaultPlanImage = defaultImageSource; // Twój domyślny obrazek

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessages, setCartMessages] = useState({}); // Obiekt do przechowywania wiadomości dla każdego produktu
  const [addingToCart, setAddingToCart] = useState({}); // Obiekt do śledzenia stanu ładowania dla każdego przycisku

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await AxiosInstance.get(`/products/`);
        setProducts(resp.data.results || resp.data);
      } catch (err) {
        console.error("Blad podczas ladowania produktow: ", err);
        setError(
          "Nie udało się pobrać dostępnych planów treningowych. Spróbuj ponownie później.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    setAddingToCart((prev) => ({ ...prev, [productId]: true })); // Ustawienie ładowania dla konkretnego produktu
    setCartMessages((prev) => ({ ...prev, [productId]: "" })); // Resetowanie wiadomości
    try {
      // Zakładamy, że dodajemy zawsze 1 sztukę z poziomu listy produktów
      await AxiosInstance.post("/cart/items/", {
        product_id: parseInt(productId),
        quantity: 1,
      });
      setCartMessages((prev) => ({
        ...prev,
        [productId]: "Dodano do koszyka!",
      }));
      // Opcjonalnie: zresetuj wiadomość po kilku sekundach
      setTimeout(
        () => setCartMessages((prev) => ({ ...prev, [productId]: "" })),
        3000,
      );
    } catch (err) {
      console.error(
        "Nie udało się dodać do koszyka:",
        err.response?.data || err.message,
      );
      const errorDetail =
        err.response?.data?.detail ||
        err.response?.data?.product_id?.[0] ||
        "Błąd podczas dodawania.";
      setCartMessages((prev) => ({
        ...prev,
        [productId]: `Błąd: ${errorDetail}`,
      }));
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return (
      <Section customPaddings className="py-10 lg:py-16 xl:py-20">
        <div className="container text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-1 mx-auto mb-4"></div>
          <p className="text-n-2 text-lg">Ładowanie planów treningowych...</p>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section customPaddings className="py-10 lg:py-16 xl:py-20">
        <div className="container text-center">
          <Heading title="Błąd" className="text-red-400 mb-6" />
          <p className="text-n-2 text-lg mb-8">{error}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section customPaddings className="py-10 lg:py-16 xl:py-20">
      <div className="container">
        <Heading
          className="text-center mb-8 md:mb-10"
          title="Odkryj Nasze Plany Treningowe"
          text="Wybierz program idealnie dopasowany do Twoich celów i rozpocznij transformację!"
        />
        <div className="flex justify-center mb-10 md:mb-12">
          <Button href="/shop/mybasket" white>
            Przejdź do swojego koszyka
          </Button>
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-10 px-6 rounded-lg bg-n-7 border border-n-6 shadow-md">
            <p className="text-n-3 text-lg">
              Obecnie brak dostępnych planów treningowych.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => {
            const productImageUrl = product.image_url || defaultPlanImage;
            const price = parseFloat(product.price);
            const isLoadingThisProduct = addingToCart[product.id]; // Stan ładowania dla tego produktu

            return (
              <div
                key={product.id}
                className="bg-n-7 border border-n-6 rounded-xl shadow-lg overflow-hidden flex flex-col group transform transition-all duration-300 hover:scale-105 hover:shadow-color-1/30"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-[4/3] w-full">
                    <img
                      src={productImageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-color-1/80 text-n-1 text-sm font-semibold px-3 py-1 rounded-md backdrop-blur-sm">
                      {Number.isNaN(price)
                        ? "N/A"
                        : price.toLocaleString("pl-PL", {
                            style: "currency",
                            currency: "PLN",
                          })}
                    </div>
                  </div>
                </Link>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="h5 mb-2 text-n-1 line-clamp-2 group-hover:text-color-1 transition-colors">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>

                  {/* Wyświetlanie krótkiego opisu produktu */}
                  {product.description && (
                    <p className="body-2 text-n-3 mb-4 line-clamp-3">
                      {" "}
                      {/* Użycie .body-2 i line-clamp */}
                      {product.description}
                    </p>
                  )}

                  {/* Wyświetlanie wiadomości o dodaniu do koszyka lub błędzie */}
                  {cartMessages[product.id] && (
                    <p
                      className={`text-xs mt-1 mb-2 ${cartMessages[product.id].startsWith("Błąd") ? "text-red-400" : "text-green-400"}`}
                    >
                      {cartMessages[product.id]}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-n-5 space-y-3">
                    {" "}
                    {/* Dodano space-y-3 dla odstępu między elementami */}
                    <Link
                      to={`/product/${product.id}`}
                      // Zmieniamy na przycisk lub stylizujemy jako główny link
                      className="block w-full text-center font-code text-xs font-bold uppercase tracking-wider text-color-1 hover:text-purple-400 transition-colors"
                    >
                      Zobacz szczegóły
                      {/* Można dodać strzałkę, jeśli chcesz ją zachować, ale może być zbędna jeśli to przycisk */}
                      {/* <Arrow className="ml-2 w-4 h-4 inline-block" /> */}
                    </Link>
                    <Button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={isLoadingThisProduct}
                      className={`
                          w-full text-xs 
                          ${isLoadingThisProduct ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                    >
                      {isLoadingThisProduct ? "Dodawanie..." : "Do koszyka"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

export default Shop;
