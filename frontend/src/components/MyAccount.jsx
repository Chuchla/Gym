import React, { useEffect, useState } from "react";
import Section from "./Section.jsx";
import { my_acc_menu } from "../constans/my_acc_const.jsx";
import { logout } from "../Utils/Auth.jsx";
import Heading from "./Heading.jsx";
import AxiosInstance from "./AxiosInstance.jsx";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("dane");

  // DANE UŻYTKOWNIKA
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);

  // KAR
  const [memberships, setMemberships] = useState([]);
  const [loadingMemberships, setLoadingMemberships] = useState(false);
  const [errorMemberships, setErrorMemberships] = useState(null);

  // --- 1) fetch user ---
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        // UWAGA: kończący slash jest wymagany
        const resp = await AxiosInstance.get("clients/me/");
        setUserData(resp.data);
      } catch (err) {
        console.error("Błąd podczas pobierania danych:", err);
        setErrorUser("Nie udało się pobrać danych. Spróbuj ponownie.");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    console.log("activeTab zmienilo sie:", activeTab);
    if (activeTab !== "my_membership") {
      console.log("nie pobieram karnetow bo nie jestesmy w tej zakladce");
    }
  });

  // --- 2) fetch memberships (tylko gdy activeTab === "membership") ---
  useEffect(() => {
    if (activeTab !== "my_membership") return;

    const fetchMemberships = async () => {
      setLoadingMemberships(true);
      try {
        // Znów: upewniamy się, że slash jest na końcu
        const resp = await AxiosInstance.get("my-memberships/");
        setMemberships(resp.data);
      } catch (err) {
        console.error("Błąd podczas pobierania karnetów:", err);
        setErrorMemberships("Nie udało się pobrać karnetów. Spróbuj później.");
      } finally {
        setLoadingMemberships(false);
      }
    };

    fetchMemberships();
  }, [activeTab]);

  // --- 3) Obsługa loadera / błędów / braku danych użytkownika ---
  if (loadingUser) {
    return (
      <Section className="container relative">
        <div className="text-center py-8">Ładowanie danych...</div>
      </Section>
    );
  }

  if (errorUser) {
    return (
      <Section className="container relative">
        <div className="text-center py-8 text-red-500">{errorUser}</div>
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

  // --- 4) Główny UI ---
  return (
    <Section className="container relative">
      <Heading className="mb-6 text-3xl text-center" title="Moje konto" />
      <div
        className="
          mx-auto flex h-[32rem] w-full max-w-5xl
          overflow-hidden rounded-2xl border-2 border-n-1 bg-n-8
        "
      >
        {/* LEWY PANEL: Menu */}
        <nav className="flex h-full w-48 flex-col border-r-2 border-n-3 bg-n-9">
          {my_acc_menu.map((item) => (
            <button
              key={item.activeTab}
              onClick={() => {
                if (item.activeTab === "LogOut") {
                  logout();
                } else {
                  setActiveTab(item.activeTab);
                }
              }}
              className={
                item.title === "Log Out"
                  ? "mt-auto flex items-center px-4 py-3 text-left font-bold text-red-500 hover:bg-n-7 transition-colors"
                  : `flex items-center px-4 py-3 text-left font-medium transition-colors ${
                      activeTab === item.activeTab
                        ? "bg-purple-700 text-white"
                        : "hover:bg-n-3 text-n-1"
                    }`
              }
            >
              {item.title}
            </button>
          ))}
        </nav>

        {/* PRAWY PANEL: Treść */}
        <div className="flex-grow p-6 overflow-y-auto">
          {/* —————— Zakładka “Twoje dane” —————— */}
          {activeTab === "dane" && (
            <div>
              <h4 className="h4 font-semibold mb-4">Twoje dane</h4>
              <div className="text-left space-y-2">
                <p>
                  <span className="font-medium">Imię:</span>{" "}
                  {userData.first_name}
                </p>
                <p>
                  <span className="font-medium">Nazwisko:</span>{" "}
                  {userData.last_name}
                </p>
                <p>
                  <span className="font-medium">Telefon:</span>{" "}
                  {userData.phone_number || "-"}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {userData.email}
                </p>
                <p>
                  <span className="font-medium">Z nami od:</span>{" "}
                  {new Date(userData.date_joined).toLocaleString("pl-PL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button className="mt-6 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                Edytuj dane
              </button>
            </div>
          )}

          {/* —————— Zakładka “Membership” —————— */}
          {activeTab === "my_membership" && (
            <div>
              <h4 className="h4 font-semibold mb-4">Membership</h4>

              {/* Loader */}
              {loadingMemberships && (
                <div className="py-4">Ładowanie karnetów...</div>
              )}

              {/* Błąd */}
              {errorMemberships && (
                <div className="text-red-500 py-4">{errorMemberships}</div>
              )}

              {/* Gdy nie ma karnetów */}
              {!loadingMemberships &&
                !errorMemberships &&
                memberships.length === 0 && (
                  <div className="text-center py-4 text-n-3">
                    Nie masz żadnych aktywnych karnetów.
                  </div>
                )}

              {/* Lista karnetów */}
              {!loadingMemberships &&
                !errorMemberships &&
                memberships.length > 0 && (
                  <div>
                    {memberships.map((m) => (
                      <div
                        key={m.id}
                        className="mb-6 rounded-lg border border-n-6 bg-n-9 p-4 "
                      >
                        <p>
                          <span className="font-medium">Typ karnetu:</span>{" "}
                          {m.membership_type_details.name}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span>{" "}
                          {m.status}
                        </p>
                        <p>
                          <span className="font-medium">Aktywny od:</span>{" "}
                          {m.active_from}
                        </p>
                        <p>
                          <span className="font-medium">Aktywny do:</span>{" "}
                          {m.active_to}
                        </p>

                        {/* Jeśli są cechy, wyświetlamy listę */}
                        {m.membership_type_details.features.length > 0 && (
                          <ul className="mt-2 list-disc pl-5 text-sm">
                            {m.membership_type_details.features.map((f) => (
                              <li key={f.id}>{f.name}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* —————— Zakładka “Activity” —————— */}
          {activeTab === "activity" && (
            <div>
              <h4 className="h4 font-semibold mb-4">Activity</h4>
              <p>
                Brak danych do wyświetlenia (jeszcze w trakcie implementacji).
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default MyAccount;
