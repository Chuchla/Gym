import React, { useEffect, useState } from "react";
import Heading from "./Heading.jsx";
import AxiosInstance from "./AxiosInstance.jsx";
import Section from "./Section.jsx";
import Arrow from "../assets/svg/Arrow.jsx";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const resp = await AxiosInstance.get("articles/");
        setArticles(resp.data);
      } catch (err) {
        console.error("Błąd przy pobieraniu artykółów: ", err);
        setError("Nie udało się wczytać artykułów.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <Section>
      <div>
        <Heading
          className={"max-w-max"}
          title={"News and articles"}
          text={"Interesting articles and news from our gym"}
        />
        {loading && <p>Ładowanie artykułów...</p>}
        {error && <p className={"text-red-500"}>{error}</p>}
        <div className={"flex flex-wrap justify-center mb-10 gap-10"}>
          {!loading && articles.length === 0 && (
            <p>Brak dostępnych artykułów</p>
          )}
          {articles.map((art) => (
            <div
              key={art.id}
              className={"p-0.5 bg-[length:100%_100%] max-w-[33rem]"}
              style={{
                backgroundImage: `url(./src/assets/benefits/card-1.svg)`,
              }}
            >
              <div
                className={
                  "relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none"
                }
              >
                <h5 className={"h5 mv-5"}>{art.title}</h5>
                <img
                  src={"./src/assets/1.jpg"}
                  className={
                    "opacity-60 backdrop-brightness-50 border-2 border-color-5 mt-5"
                  }
                />
                <div className={"mt-5 flex flex-row justify-end"}>
                  <p>{art.created_by}</p>
                </div>
                <div
                  className={"flex items-center mt-auto justify-between mt-5"}
                >
                  <p>{art.created_at}</p>
                  <p className={"ml-auto font-bold"}>Przejdź do artykułu</p>
                  <Arrow />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
export default Articles;
