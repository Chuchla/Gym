import React, { useEffect, useState } from "react";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import { signup } from "../constans/signup_const.jsx";
import Button from "./Button.jsx";
import { heroBackground } from "../assets/index.js";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "", // <-- tu klucz zgodny z signup_const
    password: "",
    repeat_password: "",
  });
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const allFilled = Object.values(formData).every((v) => v.trim() !== "");
    setIsFormComplete(allFilled);
  }, [formData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { first_name, last_name, email, phone, password, repeat_password } =
      formData;

    // client-side walidacja
    if (password !== repeat_password) {
      setError("Hasła muszą być takie same");
      return;
    }

    // budujemy payload zgodny z serializerem:
    const payload = {
      first_name,
      last_name,
      email,
      password,
      repeat_password,
      phone_number: phone, // backend oczekuje pola phone_number
    };

    try {
      console.log("Wysyłam payload:", payload);
      const res = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // wyświetlamy komunikaty zwrócone przez DRF
        setError(
          typeof data === "object"
            ? Object.values(data).flat().join(" ")
            : "Nieznany błąd",
        );
        return;
      }

      console.log("Token after registration: ", data.token);
      // TODO: przekierowanie lub wywołanie onLogin(data.token)
    } catch (err) {
      console.error(err);
      setError("Wystąpił błąd podczas rejestracji");
    }
  };

  return (
    <Section id={"#signup"}>
      <Heading
        className={"container relative z-2"}
        title={"Create new account"}
      />

      <div className="flex justify-center mt-8">
        <div className="rounded-md bg-n-7 p-4 border-color-1 border-2 w-full max-w-md space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            {signup.map((field) => (
              <div key={field.id} className="flex flex-col">
                <label htmlFor={field.id} className="text-white text-md mb-1">
                  {field.title}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={handleChange}
                  className="bg-n-1 w-full rounded-md px-2 py-1 text-black"
                />
              </div>
            ))}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              white={!isFormComplete}
              className="w-full"
              disabled={!isFormComplete}
            >
              {isFormComplete ? "Create account!" : "Fill all of the fields"}
            </Button>
          </form>
        </div>
      </div>
    </Section>
  );
};
