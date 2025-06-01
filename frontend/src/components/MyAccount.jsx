import React, { useEffect, useState } from "react";
import Section from "./Section.jsx";
import Button from "./Button.jsx";
import { my_acc_menu } from "../constans/my_acc_const.jsx";
import { logout } from "../Utils/Auth.jsx";
import Header from "./Header.jsx";
import Heading from "./Heading.jsx";
import AxiosInstance from "./AxiosInstance.jsx";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("dane");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const resp = await AxiosInstance.get("clients/me");
        setUserData(resp.data);
      } catch (err) {
        console.error("Blad podczas pobierania danych: ", err);
        setError("Nie udalo sie pobrac danych. Sprobuj ponownie.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <Section className={"container relative"}>
        <div className={"text-center py-8"}>Ładowanie danych...</div>
      </Section>
    );
  }

  if (!userData) {
    return (
      <Section className="container relative">
        <div className="text-center py-8 text-red-500">
          Brak danych użytkownika.
        </div>
      </Section>
    );
  }

  return (
    <Section className={"container relative"}>
      <div
        className={
          "mx-auto flex h-[32rem] w-full max-w-5xl overflow-hidden rounded-2xl border-2 border-n-1 bg-n-8"
        }
      >
        {/* Ten NavBar pionowy */}
        <nav className={"flex h-full w-48 flex-col border-r-2 border-n-3 "}>
          {my_acc_menu.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.activeTab === "LogOut"
                  ? logout()
                  : setActiveTab(item.activeTab);
              }}
              className={
                item.title === "Log Out"
                  ? "border-t-2 border-red-500 mt-auto flex items-center px-4 py-3 text-left font-bold text-red-500 hover:bg-n-7 transition-colors"
                  : `flex items-center px-4 py-3 text-left font-medium transition-colors ${activeTab === item.activeTab ? "bg-purple-700 text-white" : "hover:bg-n-3 text-n-1"}`
              }
            >
              {item.title}
            </button>
          ))}
        </nav>

        {/* Prawy panel z treścią */}
        <div className={"flex-grow p-6"}>
          {activeTab === "dane" && (
            <div>
              <h4 className={"h4 font-semibold"}>Twoje Dane</h4>
              <div className={"text-left space-y-2"}>
                <p>
                  <span>Imię: </span>
                  {userData.first_name}
                </p>
                <p>
                  <span>Nazwisko: </span> {userData.last_name}
                </p>
                <p>
                  <span>Telefon: </span> {userData.phone_number || "-"}
                </p>
                <p>
                  <span>Email: </span> {userData.email}
                </p>
                <p>
                  <span>Z nami od: </span>{" "}
                  {new Date(userData.date_joined).toLocaleString("pl-PL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <button
                  className={
                    "mt-6 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                  }
                >
                  Edytuj dane
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};
export default MyAccount;
