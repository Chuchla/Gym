import React from "react";
import Section from "./Section.jsx";
import { smallSphere, stars } from "../assets/index.js";
import Heading from "./Heading.jsx";
import MembershipsList from "./MembershipsList.jsx";
import { LeftLine, RightLine } from "./design/Pricing.jsx";

const Memberships = () => {
  return (
    <Section className={"overflow-hidden"} id={"memberships"}>
      <div className={"container relative z-2"}>
        <div className={"hidden relative justify-center mb-[6.5rem] lg:flex"}>
          <img
            src={smallSphere}
            className={"relative z-1"}
            width={255}
            height={255}
            alt={"sphere"}
          />
          <div
            className={
              "absolute top-1/2 left-1/2 w-[60rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            }
          >
            <img
              src={stars}
              className={"w-full"}
              width={950}
              height={400}
              alt={"stars"}
            />
          </div>
        </div>
        <Heading
          tag={"Get started with GymUs!"}
          title={"Hooked? Get your membership right now!"}
        />
        <div className={"relative"}>
          <MembershipsList></MembershipsList>
          <LeftLine />
          <RightLine />
        </div>
      </div>
    </Section>
  );
};
export default Memberships;
