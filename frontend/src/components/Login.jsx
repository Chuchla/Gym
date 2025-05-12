import React, { useEffect, useState } from "react";
import Section from "./Section.jsx";
import Header from "./Header.jsx";
import Heading from "./Heading.jsx";
import { signup } from "../constans/signup_const.jsx";
import Button from "./Button.jsx";
import { login } from "../constans/login_const.jsx";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({});
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const allFields = login.every((field) => formData[field.id]?.trim());
    setIsFormComplete(allFields);
  }, [formData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = formData.email?.trim() || "";
    const password = formData.password?.trim() || "";
    if (!email || !password) {
      setError("No credentials!");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("Login response: ", data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("Token zapisany: ", localStorage.getItem("token"));
        onLogin(data.token);
      } else {
        setError("Incorrect credentials");
      }
    } catch (err) {
      setError("Wystąpił błąd podczas logowania");
    }
  };

  return (
    <Section id={"/login"}>
      <Heading className={"container relative z-2"} title={"Login"} />
      <div
        className={"flex flex-col  items-center  mt-8 space-y-6 justify-center"}
      >
        <div
          className={
            "rounded-md bg-n-7 p-4 border-color-1 border-2 w-full max-w-md space-y-4"
          }
        >
          {login.map((form) => (
            <div key={form.id} className={"flex flex-col"}>
              <label className={"text-white text-md mb-1"} htmlFor={form.id}>
                {form.title}
              </label>
              <input
                id={form.id}
                type={form.type}
                placeholder={form.placeholder}
                value={formData[form.id] || ""}
                onChange={handleChange}
                className="bg-n-1 w-full rounded-md px-2 py-1 text-black"
              />
            </div>
          ))}
          <Button
            white={!isFormComplete}
            className={"w-full"}
            onClick={handleLogin}
          >
            {isFormComplete ? "Login!" : "Fill your credentials"}
          </Button>
        </div>
      </div>
    </Section>
  );
};
export default Login;
