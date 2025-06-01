import React, { useState } from "react";
import Section from "./Section.jsx";
import Button from "./Button.jsx";
import { my_acc_menu } from "../constans/my_acc_const.jsx";
import { logout } from "../Utils/Auth.jsx";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("dane");

  return (
    <Section className={"container relative"}>
      <div
        className={
          "mx-auto flex h-[32rem] w-full max-w-5xl overflow-hidden rounded-2xl border-2 border-n-1 bg-n-8"
        }
      >
        {/* Ten NavBar pionowy */}
        <nav class={"flex h-full w-48 flex-col border-r-2 border-n-3 "}>
          {my_acc_menu.map((item) => (
            <button
              onClick={() => {
                item.activeTab === "LogOut"
                  ? logout()
                  : setActiveTab(item.activeTab);
              }}
              className={
                item.title === "Log Out"
                  ? "mt-auto flex items-center px-4 py-3 text-left font-bold text-red-500 hover:bg-n-7 transition-colors"
                  : `flex items-center px-4 py-3 text-left font-medium transition-colors ${activeTab === item.activeTab ? "bg-purple-700 text-white" : "hover:bg-n-3 text-n-1"}`
              }
            >
              {item.title}
            </button>
          ))}
        </nav>
      </div>
    </Section>
  );
};
export default MyAccount;
