import React from "react";
import Section from "./Section.jsx";
import { curve, heroBackground, robot } from "../assets/index.js";
import Button from "./Button.jsx";
import { BottomLine } from "./design/Hero.jsx";
import Generating from "./Generating.jsx";

const Hero = () => {
  return (
    <Section
      className={"pt-[12rem] -mt-[5.25]"}
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id={"hero"}
    >
      <div className={"container relative"}>
        <div
          className={
            "relative z-1 max-w-[62rem] mx-auto text-center mb-[4rem] md:mb-20 lg:mb:[6rem]"
          }
        >
          <h1 className={"h1 mb-6"}>
            Start your gym adventure with{" "}
            <span className={"inline-block relative lg:pt-6"}>
              GymUs!
              <img
                src={curve}
                className={"absolute top-full left-0 w-full xl:-mt-2"}
                width={624}
                height={28}
                alt={"Curve"}
              />
            </span>
          </h1>
          <p className={"body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8"}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur
            adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae
            pellentesque sem placerat in id. Placerat in id cursus mi pretium
            tellus duis. Pretium tellus duis convallis tempus leo eu aenean.
          </p>
          <Button href={"/pricing"} white>
            Start now!
          </Button>
        </div>
        <div className={"relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24"}>
          <div className={"relative z-1 p-0.5 rounded-2xl  bg-conic-gradient"}>
            <div className={"relative bg-n-8 rounded-[1rem]"}>
              <div className={"h-[0.9rem] bg-n-10 rounded-t-[0.9rem]"} />
              <div
                className={
                  "aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]"
                }
              >
                <img
                  src={robot}
                  className={
                    "w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                  }
                  width={1024}
                  height={490}
                  alt={"AI"}
                />
              </div>
            </div>
          </div>
          <div
            className={
              "absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]"
            }
          >
            <img
              src={heroBackground}
              className={"w-full"}
              width={1440}
              height={1800}
              alt={"hero"}
            />
          </div>
        </div>
      </div>
      <BottomLine></BottomLine>
    </Section>
  );
};
export default Hero;
