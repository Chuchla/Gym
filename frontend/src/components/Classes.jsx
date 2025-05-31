import React from "react";
import Section from "./Section.jsx";
import Header from "./Header.jsx";
import Heading from "./Heading.jsx";
import { classes } from "../constans/index.jsx";
import { done, undone } from "../assets/index.js";
import Arrow from "../assets/svg/Arrow.jsx";
import { Link } from "react-router-dom";

const Classes = () => {
  return (
    <Section id={"classes"}>
      <div className={"container relative z-2"}>
        <Heading
          title={
            "Don't know where to start? Explore our fitness classes and see what suits you!"
          }
        />
        <div
          className={
            "flex flex-nowrap lg:justify-center lg:flex-wrap overflow-x-auto lg:overflow-visible gap-4 py-4"
          }
        >
          {classes.map((item) => (
            <div
              key={item.id}
              className={
                "flex flex-col flex-shrink-0 w-[16rem] sm:w-[18rem] md:w-[20rem] lg:w-[20rem] " +
                "bg-gradient-to-b from-purple-700 via-purple-400 to-purple-200 rounded-xl px-4 py-4 lg:mx-0"
              }
            >
              <div
                className={
                  "aspect-w-3 aspect-h-2 lg:aspect-w-3 lg:aspect-h-2 md:aspect-w-4 md:aspect-h-3 sm:aspect-w-3 sm:aspect-h-2 w-full overflow-hidden rounded-lg  mb-4"
                }
              >
                <img
                  className={
                    "object-cover w-full h-full brightness-100 contrast-10"
                  }
                  src={item.photoUrl}
                  alt={item.title}
                />
              </div>
              <h5
                className={
                  "text-purple-900 lg:text-xl sm:text-xl font-semibold  mb-2 text-center"
                }
              >
                {item.title}
              </h5>
              <p
                className={
                  "text-black text-base lg:text-lg sm:text-base break-words text-center leading-snug mb-4"
                }
              >
                {item.description}
              </p>
              <div className={"mt-auto"}>
                <div className={"flex items-center text-sm mb-1"}>
                  <span className={"mr-2 font-medium"}>Intensywność:</span>
                  <div className={"flex flex-nowrap"}>
                    {[...Array(4)].map((_, i) => (
                      <img
                        key={i}
                        className={"w-4 h-4 mx-0.5"}
                        src={i < item.intensity ? done : undone}
                        alt={i < item.intensity ? "*" : "."}
                      />
                    ))}
                  </div>
                </div>

                <div className={"text-sm text-left font-light"}>
                  Czas trwania: {item.time} m
                </div>
                <Link
                  to={"/calendar"}
                  className={
                    "group ml-auto font-bold flex items-center gap-1 hover:underline hover:text-color-5 transition-all duration-200"
                  }
                >
                  <span
                    className={
                      "text-sm text-blue-600 hover:text-color-5 duration-200"
                    }
                  >
                    Znajdź wolne zajęcia
                  </span>
                  <Arrow className={"group-hover:translate-x-6"} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
export default Classes;
