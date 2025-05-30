import React, { useEffect, useState } from "react";
import Heading from "./Heading.jsx";
import AxiosInstance from "./AxiosInstance.jsx";
import Section from "./Section.jsx";
import Arrow from "../assets/svg/Arrow.jsx";
import Button from "./Button.jsx";
import ButtonSvg from "../assets/svg/ButtonSvg.jsx";
import { Link } from "react-router-dom";

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
                  "relative z-2 flex flex-col min-h-[22rem] p-[2.4rem]"
                }
              >
                <div className={"absolute inset-0.5 bg-n-8"}>
                  <div className={"absolute inset-0 opacity-10"}>
                    {
                      <img
                        src={"./src/assets/2.jpeg"}
                        width={380}
                        height={362}
                        alt={"zdjecie"}
                        className={"w-full h-full object-cover"}
                      />
                    }
                  </div>
                </div>
                <div className={"relative z-10 flex flex-col"}>
                  <h5 className={"h5 mv-5"}>{art.title}</h5>
                  <img
                    src={"./src/assets/1.jpg"}
                    className={
                      "opacity-80 backdrop-brightness-50 border-2 border-color-5 mt-5"
                    }
                  />
                  <div className={"mt-5 flex flex-row justify-end"}>
                    <p className={"text font-code text-color-1"}>
                      Autor : {art.created_by}
                    </p>
                  </div>
                  <div
                    className={"flex items-center mt-auto justify-between mt-5"}
                  >
                    <p>{art.created_at}</p>
                    <Link
                      to={`/articles/${art.id}`}
                      className={
                        "group ml-auto font-bold flex items-center gap-1 hover:underline hover:text-color-5 transition-all duration-200"
                      }
                    >
                      <span>Przejdź do artykułu</span>
                      <Arrow className={"group-hover:translate-x-2 "} />
                    </Link>
                  </div>
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
