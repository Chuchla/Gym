import React, { useEffect, useState } from "react";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import Button from "./Button.jsx";
import { login as loginFields } from "../constans/login_const.jsx";
import AxiosInstance from "./AxiosInstance.jsx";
import { href, useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const allFilled = loginFields.every(
      ({ id }) => formData[id]?.trim() !== "",
    );
    setIsFormComplete(allFilled);
  }, [formData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    console.log("PRÓBUJE LOGOWAC!!!!");
    e.preventDefault();
    setError("");
    if (!isFormComplete) return;

    const email = formData.email?.trim() || "";
    const password = formData.password?.trim() || "";

    // **DEBUG**: wypisz payload przed wysłaniem
    console.log("📤 WYSYŁAM LOGIN PAYLOAD:", { email, password });

    setLoading(true);
    try {
      const res = await AxiosInstance.post("token/", {
        email,
        password,
      });
      const { access, refresh } = res.data;

      // zapisujemy tokeny
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // **LOG**: informacja o sukcesie i token
      console.log("✅ ZALOGOWANO POMYŚLNIE! Access token:", access);
      setSuccess("Zalogowano pomyślnie! Przenoszenie do strony głównej...");
      if (onLogin) onLogin(access);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Login error:", err.response || err);
      if (err.response?.status === 401) {
        setError("Nieprawidłowy email lub hasło");
        setSuccess(null);
      } else {
        setError("Błąd serwera. Spróbuj ponownie później.");
        setSuccess(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="/login">
      <Heading title="Login" />
      <form className="mx-auto max-w-md space-y-4 p-4 bg-n-7 rounded-md">
        {loginFields.map(({ id, title, type, placeholder }) => (
          <div key={id} className="flex flex-col">
            <label htmlFor={id} className="text-white mb-1">
              {title}
            </label>
            <input
              id={id}
              type={type}
              placeholder={placeholder}
              value={formData[id] || ""}
              onChange={handleChange}
              className="bg-n-1 w-full rounded-md px-2 py-1 text-black"
            />
          </div>
        ))}

        {error && <div className="text-red-400 text-sm">{error}</div>}
        {success && <div className={"text-green-400 text-sm"}>{success}</div>}
        <Button
          type="submit"
          className="w-full"
          onClick={handleLogin}
          disabled={!isFormComplete || loading}
          white={!isFormComplete || loading}
        >
          {loading
            ? "Ładowanie..."
            : isFormComplete
              ? "Login!"
              : "Wypełnij wszystkie pola"}
        </Button>
      </form>
    </Section>
  );
};

export default Login;
