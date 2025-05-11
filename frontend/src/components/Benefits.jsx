import React from "react";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import { benefits } from "../constans/index.jsx";
import { background } from "../assets/index.js";

const Benefits = () => {
  return (
    <Section id={"benefits"}>
      <div className={"container relative z-2"}>
        <Heading
          className={"md:max-w-md lg:max-w-2xl"}
          title={"Stronger, smarter, faster, healthier"}
        />
        <div className={"flex flex-wrap gap-10 mb-10"}>
          {benefits.map((benefit) => (
            <div
              className={
                "block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
              }
              style={{ backgroundImage: `url(${benefit.backgroundUrl})` }}
              key={benefit.id}
            >
              <div>
                <h5>{benefit.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
export default Benefits;
