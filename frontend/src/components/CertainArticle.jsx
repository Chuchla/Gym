import React, { useEffect, useState } from "react";
import AxiosInstance from "./AxiosInstance.jsx";
import { useParams } from "react-router-dom";
import Section from "./Section.jsx"; // Używamy Twojego komponentu Section
import Heading from "./Heading.jsx"; // Używamy Twojego komponentu Heading
import Button from "./Button.jsx"; // Używamy Twojego komponentu Button
// Możesz dodać import dla ikony strzałki, jeśli masz ją jako komponent SVG
// import ArrowLeft from "../assets/svg/ArrowLeft.jsx"; // Przykładowy import

const CertainArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true); // Ustawienie ładowania na początku
      setError(null); // Resetowanie błędu
      try {
        const resp = await AxiosInstance.get(`articles/${id}/`); // Dodanie slasha na końcu, jeśli API tego wymaga
        setArticle(resp.data);
      } catch (err) {
        console.error("Blad podczas ladowania artkułu: ", err);
        if (err.response && err.response.status === 404) {
          setError("Nie znaleziono takiego artykułu.");
        } else {
          setError("Nie udało się wczytać artykułu. Spróbuj ponownie później.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  // Stany ładowania i błędu - bardziej rozbudowane i spójne
  if (loading) {
    return (
      <Section customPaddings className="py-10 lg:py-16 xl:py-20">
        {" "}
        {/* Użyj customPaddings jeśli Section to obsługuje, lub dodaj klasy py-* */}
        <div className="container text-center">
          {" "}
          {/* Użycie klasy .container z Twojego configu */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-1 mx-auto mb-4"></div>
          <p className="text-n-2 text-lg">Ładowanie artykułu...</p>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section customPaddings className="py-10 lg:py-16 xl:py-20">
        <div className="container text-center">
          <Heading title="Błąd" className="text-red-400 mb-6" />{" "}
          {/* Użyj koloru błędu z Twojej palety jeśli masz */}
          <p className="text-n-2 text-lg mb-8">{error}</p>
          <Button href="/articles" white>
            {" "}
            {/* Założenie: Button obsługuje 'white' dla jasnego tekstu na ciemnym tle */}
            Wróć do listy artykułów
          </Button>
        </div>
      </Section>
    );
  }

  if (!article) {
    // Jeśli artykuł jest null po zakończeniu ładowania (a nie było błędu 404)
    return (
      <Section customPaddings className="py-10 lg:py-16 xl:py-20">
        <div className="container text-center">
          <Heading title="Informacja" className="mb-6" />
          <p className="text-n-2 text-lg mb-8">Nie znaleziono artykułu.</p>
          <Button href="/articles" white>
            Wróć do listy artykułów
          </Button>
        </div>
      </Section>
    );
  }

  return (
    // Użyj customPaddings z Section, lub dodaj globalne paddingi tutaj
    // np. className="py-10 lg:py-16 xl:py-20"
    <Section customPaddings>
      <div className="container">
        {" "}
        {/* Użycie klasy .container dla spójnych marginesów i szerokości */}
        <div className="max-w-3xl mx-auto">
          {" "}
          {/* Ograniczenie szerokości treści artykułu dla lepszej czytelności */}
          <header className="mb-10 md:mb-14 text-center">
            {" "}
            {/* Wyśrodkowany nagłówek */}
            <Heading
              // Użyj klasy .h1 lub .h2 z Twojego configu dla tytułu
              // np. titleClassName="h1" jeśli komponent Heading to wspiera
              // lub dodaj klasy bezpośrednio do title w komponencie Heading
              className="mb-3 md:mb-4" // Klasy dla całego komponentu Heading
              title={article.title}
            />
            <p className="text-sm text-n-3 md:text-base">
              {" "}
              {/* Lekko stonowany tekst autora i daty */}
              Autor: {article.created_by} &bull; Opublikowano:{" "}
              {article.created_at}
            </p>
          </header>
          <article
            // Używamy prose, ale możemy nadpisać niektóre style dla lepszego dopasowania
            className="
              prose prose-invert
              prose-p:text-n-2 prose-p:leading-relaxed prose-p:text-justify
              prose-headings:text-color-1
              max-w-none
              text-base md:text-lg
              break-words whitespace-pre-line
            "
            // max-w-none jest potrzebne, aby nadpisać max-width z .prose, jeśli kontener .max-w-3xl ma zarządzać szerokością
          >
            {/* Rozdzielanie na akapity na podstawie podwójnych nowych linii.
                Jeśli content jest już HTML, użyj dangerouslySetInnerHTML (ostrożnie!).
                Jeśli to czysty tekst, to mapowanie jest OK. */}
            {article.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 md:mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
          </article>
          <div className="mt-12 md:mt-16 text-center border-t border-n-6 pt-8 md:pt-10">
            {" "}
            {/* Linia oddzielająca i wyśrodkowany przycisk */}
            <Button href="/articles" white>
              {/* Jeśli masz komponent ikony strzałki: <ArrowLeft className="mr-2" /> */}
              ← Wróć do listy artykułów
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CertainArticle;
