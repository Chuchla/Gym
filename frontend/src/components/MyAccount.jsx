import React, { useEffect, useState } from "react";
import Section from "./Section.jsx";
import { my_acc_menu } from "../constans/my_acc_const.jsx";
import { logout } from "../Utils/Auth.jsx";
import Heading from "./Heading.jsx";
import AxiosInstance from "./AxiosInstance.jsx";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("dane");

  // ——— 1) UŻYTKOWNIK ———
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);

  // ——— 2) KAR (Membership) ———
  const [memberships, setMemberships] = useState([]);
  const [loadingMemberships, setLoadingMemberships] = useState(false);
  const [errorMemberships, setErrorMemberships] = useState(null);

  // ——— 3) ZAMÓWIENIA ———
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState(null);

  // ——— Pobierz dane użytkownika ———
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
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

  // ——— Pobierz karnety, gdy zakładka “Moje membershipy” ———
  useEffect(() => {
    if (activeTab !== "my_membership") return;

    const fetchMemberships = async () => {
      setLoadingMemberships(true);
      try {
        const resp = await AxiosInstance.get("my-memberships/?status=active");
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

  // ——— Pobierz zamówienia, gdy zakładka “Moje zamówienia” ———
  useEffect(() => {
    if (activeTab !== "my_orders") return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const resp = await AxiosInstance.get("orders/");
        setOrders(resp.data);
      } catch (err) {
        console.error("Błąd podczas pobierania zamówień:", err);
        setErrorOrders("Nie udało się pobrać zamówień. Spróbuj później.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  // ——— Obsługa ładowania / błędów ———
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

  // ——— Główny UI ———
  return (
    <Section className="container relative">
      <Heading className="mb-6 text-3xl text-center" title="Moje konto" />
      <div
        className="
          mx-auto flex h-[32rem] w-full max-w-5xl
          overflow-hidden rounded-2xl border-2 border-n-1 bg-n-8
        "
      >
        {/* ====== LEWY PANEL: Menu ====== */}
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

        {/* ====== PRAWY PANEL: Treść ====== */}
        <div className="flex-grow p-6 overflow-y-auto">
          {/* — Zakładka “Twoje dane” — */}
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

          {/* — Zakładka “Membership” — */}
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
              {/* Brak karnetów */}
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
                        className="mb-6 rounded-lg border border-n-6 bg-n-9 p-4"
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

          {/* — Zakładka „Activity” — */}
          {activeTab === "activity" && (
            <div>
              <h4 className="h4 font-semibold mb-4">Activity</h4>
              <p>
                Brak danych do wyświetlenia (jeszcze w trakcie implementacji).
              </p>
            </div>
          )}

          {/* — Zakładka “Moje zamówienia” — */}
          {activeTab === "my_orders" && (
            <div>
              <h4 className="h4 font-semibold mb-4">Moje zamówienia</h4>

              {/* Loader */}
              {loadingOrders && <div className="py-4">Ładowanie zamówień…</div>}

              {/* Błąd */}
              {errorOrders && (
                <div className="text-red-500 py-4">{errorOrders}</div>
              )}

              {/* Lista zamówień (pomijamy te ze status === "cart") */}
              {!loadingOrders &&
                !errorOrders &&
                orders.filter((o) => o.status !== "cart").length === 0 && (
                  <div className="text-center py-4 text-n-3">
                    Nie masz jeszcze żadnych zamówień.
                  </div>
                )}

              {!loadingOrders &&
                !errorOrders &&
                orders
                  .filter((o) => o.status !== "cart")
                  .map((order) => {
                    // W zamówieniu interesuje nas obiekt `order.basket`
                    const basket = order.basket || {
                      items: [],
                      grand_total: 0,
                    };
                    const grandTotal = parseFloat(basket.grand_total || 0);

                    return (
                      <div
                        key={order.id}
                        className="mb-6 rounded-lg border border-n-6 bg-n-9 p-4"
                      >
                        <p>
                          <span className="font-medium">ID zamówienia:</span>{" "}
                          {order.id}
                        </p>
                        <p>
                          <span className="font-medium">Data:</span>{" "}
                          {order.date}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span>{" "}
                          {order.status}
                        </p>

                        {/* Lista pozycji w koszyku */}
                        {basket.items && basket.items.length > 0 && (
                          <ul className="mt-2 space-y-2">
                            {basket.items.map((item) => {
                              const lineTotal = parseFloat(
                                item.total_price || 0,
                              );
                              const unitPrice = parseFloat(
                                item.product.price || 0,
                              );
                              return (
                                <li
                                  key={item.id}
                                  className="flex justify-between items-center border-b pb-2"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {item.product.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Cena jedn.:{" "}
                                      {Number.isNaN(unitPrice)
                                        ? "0"
                                        : unitPrice.toLocaleString(
                                            "pl-PL",
                                          )}{" "}
                                      zł × Ilość: {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right font-medium">
                                    {Number.isNaN(lineTotal)
                                      ? "0"
                                      : lineTotal.toLocaleString("pl-PL")}{" "}
                                    zł
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        )}

                        {/* Łączna kwota zamówienia */}
                        <div className="mt-4 text-right font-bold text-lg">
                          Łączna kwota:
                          {Number.isNaN(grandTotal)
                            ? "0"
                            : grandTotal.toLocaleString("pl-PL")}{" "}
                          zł
                        </div>
                      </div>
                    );
                  })}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default MyAccount;
