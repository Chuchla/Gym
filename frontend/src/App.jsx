import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Benefits from "./components/Benefits.jsx";
import TrainerClasses from "./components/Trainer/TrainerClasses.jsx";
import ButtonGradient from "./assets/svg/ButtonGradient.jsx";
import Memberships from "./components/Memberships.jsx";
import { SignUp } from "./components/SignUp.jsx";

const App = () => {
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
        </Routes>
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
