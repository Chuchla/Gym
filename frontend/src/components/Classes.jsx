// Classes.jsx
import React from "react";
import Section from "./Section.jsx";
// import Header from "./Header.jsx"; // Nie jest używany w tym komponencie
import Heading from "./Heading.jsx";
import { classes } from "../constans/index.jsx"; // Upewnij się, że dane są poprawne
import { done, undone } from "../assets/index.js"; // Import obrazków dla intensywności
import Arrow from "../assets/svg/Arrow.jsx";
import { Link } from "react-router-dom";

// Załóżmy, że 'classes' z constants zawiera teraz 'photoUrl', 'title', 'description', 'intensity', 'time'
// a 'done' i 'undone' to ścieżki do obrazków

const Classes = () => {
  return (
    <Section id="classes" customPaddings className="py-10 lg:py-16 xl:py-20">
      {" "}
      {/* Dodane paddingi */}
      <div className="container relative z-2">
        <Heading
          className="text-center mb-12 md:mb-16" // Wyśrodkowany nagłówek
          title="Nie wiesz od czego zacząć?" // Krótszy, bardziej chwytliwy tytuł
          text="Odkryj nasze zajęcia fitness i znajdź coś dla siebie!"
        />
        <div
          className={
            "flex flex-nowrap lg:justify-center lg:flex-wrap overflow-x-auto lg:overflow-visible " +
            "gap-6 md:gap-8 py-4 " + // Zwiększone odstępy
            "scrollbar-thin scrollbar-thumb-color-1 scrollbar-track-n-7" // Stylizacja paska przewijania
          }
        >
          {classes.map((item) => (
            <div
              key={item.id}
              className={
                "flex-shrink-0 w-[17rem] sm:w-[19rem] md:w-[21rem] lg:w-[22rem] xl:w-[24rem] " + // Lekko dostosowane szerokości
                "rounded-xl p-0.5 bg-gradient-to-br from-color-1 via-color-5 to-purple-800 " + // Gradient jako OBRAMOWANIE
                "hover:shadow-xl transition-shadow duration-300"
              }
            >
              <div className="relative z-1 flex flex-col h-full bg-n-7 rounded-[0.6rem] p-5 sm:p-6">
                {" "}
                {/* Wewnętrzna karta z ciemnym tłem */}
                <div
                  className={
                    "aspect-[16/10] w-full overflow-hidden rounded-lg mb-4 shadow-md" // Proporcje obrazka i cień
                  }
                >
                  <img
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    src={
                      item.photoUrl || "./src/assets/default-class-image.jpg"
                    } // Domyślny obrazek jeśli brak
                    alt={item.title}
                  />
                </div>
                <h5
                  className="h5 mb-2 text-n-1 text-center line-clamp-2" // Użycie .h5 z configu, line-clamp
                >
                  {item.title}
                </h5>
                <p
                  className="body-2 text-n-3 text-center leading-relaxed mb-5 line-clamp-3" // Użycie .body-2, line-clamp
                >
                  {item.description}
                </p>
                <div className="mt-auto space-y-3 pt-4 border-t border-n-6">
                  {" "}
                  {/* Sekcja z detalami na dole */}
                  <div className="flex items-center justify-between text-sm text-n-2">
                    <span className="font-medium">Intensywność:</span>
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <img
                          key={i}
                          className="w-4 h-4 mx-0.5"
                          src={i < item.intensity ? done : undone} // done/undone to Twoje SVG/PNG
                          alt={
                            i < item.intensity
                              ? "Poziom intensywności"
                              : "Brak poziomu intensywności"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-n-2 text-left font-light">
                    Czas trwania:{" "}
                    <span className="font-medium text-n-1">
                      {item.time} min
                    </span>
                  </div>
                  <Link
                    to="/calendar" // Zakładam, że link prowadzi do ogólnego kalendarza
                    className="group mt-2 inline-flex items-center justify-center w-full text-center font-code text-xs font-bold uppercase tracking-wider text-color-1 hover:text-purple-400 transition-colors"
                  >
                    <span>Znajdź wolne zajęcia</span>
                    <Arrow className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Classes;
