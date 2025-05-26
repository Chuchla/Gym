import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Benefits from "./components/Benefits.jsx";
import TrainerClasses from "./components/Trainer/TrainerClasses.jsx";
import ButtonGradient from "./assets/svg/ButtonGradient.jsx";
import Memberships from "./components/Memberships.jsx";
import { SignUp } from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import { useState } from "react";
import Classes from "./components/Classes.jsx";

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
              </>
            }
          />
          <Route path="/trainer/myclasses" element={<TrainerClasses />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/classes"} element={<Classes />} />
        </Routes>
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
