import React, { useEffect, useState } from "react";
import AxiosInstance from "./AxiosInstance.jsx";
import { useParams } from "react-router-dom";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import Button from "./Button.jsx";

const CertainArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const resp = await AxiosInstance.get(`articles/${id}`);
        setArticle(resp.data);
      } catch (err) {
        console.error("Blad podczas ladowania artkułu: ", err);
        setError("Nie udało się wczytać artykułu.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <p>Ładowanie artykułu...</p>;
  if (error) return <p className={"text-red-500"}>{error}</p>;
  if (!article) return <p>Nie znaleziono artykułu</p>;
  return (
    <>
      <Section className={"px-4 lg:px-20 md:px-20 sm:px-10"}>
        <div className={"max-w-4xl mx-auto"}>
          <div className={"mb-8 max-w-full"}>
            <Heading
              className={"max-w-max"}
              title={article.title}
              text={`${article.created_by} - ${article.created_at} `}
            />
            <div
              className={
                "prose prose-invert mb-10 text-lg text-justify leading-relaxed break-words whitespace-pre-line"
              }
            >
              {article.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Button className={"max-w-max"} href={"/articles"} white={true}>
        ← Wróć do listy artykułów
      </Button>
    </>
  );
};
export default CertainArticle;
