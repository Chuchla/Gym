import { Routes, Route, Router } from "react-router-dom";
import "./App.css";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Benefits from "./components/Benefits.jsx";
import TrainerPanel from "./components/Trainer/TrainerPanel.jsx";
import ButtonGradient from "./assets/svg/ButtonGradient.jsx";
import Memberships from "./components/Memberships.jsx";
import { SignUp } from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import { useState } from "react";
import Classes from "./components/Classes.jsx";
import Articles from "./components/Articles.jsx";
import CertainArticle from "./components/CertainArticle.jsx";
import CalendarOfEvents from "./components/CalendarOfEvents.jsx";
import Event from "./components/Event.jsx";
import MyAccount from "./components/MyAccount.jsx";
import Shop from "./components/Shop.jsx";
import CertainProduct from "./components/CertainProduct.jsx";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const handleLogin = (newToken) => {
    console.log("New token:", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsLoggedIn(false);
  };
  return (
    <>
      <Header />
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Benefits />
                <Memberships />
                <Classes />
              </>
            }
          />
          <Route path="/trainer/trainerPanel" element={<TrainerPanel />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/account"} element={<MyAccount />} />
          <Route path={"/shop"} element={<Shop />} />
          <Route path={"/product/:id"} element={<CertainProduct />} />
        </Routes>
        <Routes>
          <Route path={"/articles"} element={<Articles />} />
          <Route path={"/articles/:id"} element={<CertainArticle />} />
        </Routes>
        <Routes>
          <Route path={"/calendar"} element={<CalendarOfEvents />} />
        </Routes>
        <Routes>
          <Route path={"/events/:id"} element={<Event />} />
        </Routes>
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
