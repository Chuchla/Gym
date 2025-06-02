import React, { useEffect, useState } from "react";
import Heading from "./Heading.jsx";
import AxiosInstance from "./AxiosInstance.jsx";
import Section from "./Section.jsx";
import Arrow from "../assets/svg/Arrow.jsx"; // Używasz tego do linku
// import Button from "./Button.jsx"; // Jeśli link ma wyglądać jak przycisk
// import ButtonSvg from "../assets/svg/ButtonSvg.jsx"; // Jeśli używasz ButtonSvg
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns"; // Do formatowania daty

// Załóżmy, że masz jakieś domyślne obrazki, jeśli artykuł nie ma swojego
const defaultCardBackground = "./src/assets/benefits/card-1.svg"; // Tło ramki karty z Twojego configu
const defaultArticleImage = "./src/assets/1.jpg"; // Stwórz jakiś domyślny obrazek

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await AxiosInstance.get("articles/"); // Upewnij się, że endpoint jest poprawny
        setArticles(resp.data);
        console.log(resp.data);
      } catch (err) {
        console.error("Błąd przy pobieraniu artykułów: ", err);
        setError("Nie udało się wczytać artykułów. Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Stany ładowania i błędu - spójne z innymi komponentami
  if (loading) {
    return (
      <Section customPaddings className="py-10 lg:py-16 xl:py-20">
        <div className="container text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-1 mx-auto mb-4"></div>
          <p className="text-n-2 text-lg">Ładowanie artykułów...</p>
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
          {/* Możesz dodać przycisk odświeżania lub powrotu */}
        </div>
      </Section>
    );
  }

  return (
    <Section customPaddings className="py-10 lg:py-16 xl:py-20">
      <div className="container">
        {" "}
        {/* Użycie .container z Twojego configu */}
        <Heading
          // titleClassName="h1" // lub odpowiednia klasa z Twojego configu
          className="text-center mb-12 md:mb-16" // Wyśrodkowany nagłówek sekcji
          title="Newsy i Artykuły"
          text="Interesujące artykuły i nowości z naszej siłowni"
        />
        {articles.length === 0 && !loading && (
          <div className="text-center py-10 px-6 rounded-lg bg-n-7 border border-n-6 shadow-md">
            <p className="text-n-3 text-lg">
              Brak dostępnych artykułów w tym momencie.
            </p>
          </div>
        )}
        {/* Użycie CSS Grid dla lepszego układu kafelków */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {articles.map((art) => {
            // Załóżmy, że API zwraca pole `image_url` dla każdego artykułu
            // lub masz logikę mapowania ID na konkretne obrazki.
            // Tutaj używam domyślnego, jeśli `art.image_url` nie istnieje.
            const articleImageUrl = art.image_url || defaultArticleImage;
            // Formatowanie daty
            const formattedDate = art.created_at
              ? format(parseISO(art.created_at), "dd.MM.yyyy")
              : "Brak daty";

            return (
              <div
                key={art.id}
                className="bg-n-7 border border-n-6 rounded-xl shadow-lg overflow-hidden flex flex-col group transform transition-transform duration-300 hover:scale-105"
                // Usunięto styl backgroundImage bezpośrednio, tło będzie na obrazku
              >
                {/* Obrazek artykułu */}
                {/* Jeśli nie ma obrazka, można wyświetlić placeholder lub ukryć ten div */}
                <div className="relative h-56 sm:h-64 w-full">
                  {" "}
                  {/* Stała wysokość dla obrazka */}
                  <img
                    src={articleImageUrl} // Użyj dynamicznego URL obrazka lub domyślnego
                    width={380} // Można usunąć, jeśli aspect-ratio i object-cover działają
                    height={362} // Można usunąć
                    alt={art.title || "Obrazek artykułu"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Można dodać gradient na obrazku dla lepszej czytelności tekstu, jeśli tytuł miałby być na obrazku */}
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div> */}
                </div>

                {/* Treść karty */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  {" "}
                  {/* flex-grow aby link był na dole */}
                  <h5 className="h5 mb-3 text-n-1 line-clamp-2 group-hover:text-color-1 transition-colors">
                    {" "}
                    {/* Użycie .h5 z configu, line-clamp dla tytułu */}
                    {art.title}
                  </h5>
                  <div className="text-xs text-n-3 mb-4 space-x-3">
                    {" "}
                    {/* Informacje o autorze i dacie */}
                    <span>
                      Autor:{" "}
                      <span className="font-medium text-n-2">
                        {art.created_by}
                      </span>
                    </span>
                    <span>&bull;</span>
                    <span>{formattedDate}</span>
                  </div>
                  {/* Można dodać krótki fragment/lead artykułu, jeśli jest dostępny w API */}
                  {/* <p className="body-2 text-n-2 mb-4 line-clamp-3">{art.excerpt || ''}</p> */}
                  <div className="mt-auto pt-4 border-t border-n-5">
                    {" "}
                    {/* Link na dole karty */}
                    <Link
                      to={`/articles/${art.id}`}
                      className="inline-flex items-center font-code text-xs font-bold uppercase tracking-wider text-color-1 hover:text-purple-400 transition-colors group"
                      // Użycie klas podobnych do .button z Twojego configu
                    >
                      <span>Czytaj więcej</span>
                      <Arrow className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
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

export default Articles;
