// / components / SignUp.jsx;
import React, { useState } from "react";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import { signup } from "../constans/signup_const.jsx";
import Button from "./Button.jsx";
import { useForm } from "react-hook-form";
import TextField from "./forms/TextField.jsx";
import AxiosInstance from "./AxiosInstance.jsx"; // <- Twój AxiosInstance

export const SignUp = () => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const allValues = watch();
  const isFormComplete = Object.values(allValues).every(
    (v) => v?.trim() !== "",
  );

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const onSubmit = async (data) => {
    // walidacja powtórzenia hasła
    if (data.password !== data.repeat_password) {
      return alert("Hasła muszą być takie same");
    }

    setLoading(true);
    setApiError(null);

    try {
      // POST /api/register/ (u Ciebie może być inna ścieżka)
      const response = await AxiosInstance.post("register/", {
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
      });

      // zakładamy, że API zwraca utworzonego usera
      console.log("Rejestracja udana:", response.data);
      alert("Konto utworzone pomyślnie!");
      // tutaj możesz:
      // - przekierować użytkownika: np. history.push("/login")
      // - zapisać token w localStorage, jeśli go zwracasz
      // localStorage.setItem("accessToken", response.data.token);
    } catch (err) {
      console.error("Błąd rejestracji:", err.response || err);
      // jeśli DRF zwraca błędy walidacji, będą w err.response.data
      if (err.response && err.response.data) {
        setApiError(JSON.stringify(err.response.data));
      } else {
        setApiError("Coś poszło nie tak. Spróbuj ponownie.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onError = (formErrors) => {
    console.log("Błędy walidacji:", formErrors);
  };

  return (
    <Section id="#signup">
      <Heading title="Create new account" />

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="mx-auto max-w-md space-y-4 p-4 bg-n-7 rounded-md"
      >
        {signup.map((field) => (
          <TextField
            key={field.id}
            name={field.name}
            id={field.id}
            control={control}
            constant={field}
            rules={{ required: `${field.title} jest wymagane` }}
          />
        ))}

        {apiError && <div className="text-red-400 text-sm">{apiError}</div>}

        <Button
          type="submit"
          className="w-full"
          disabled={!isFormComplete || loading}
          white={!isFormComplete || loading}
        >
          {loading
            ? "Rejestracja..."
            : isFormComplete
              ? "Create account!"
              : "Fill all of the fields"}
        </Button>
      </form>
    </Section>
  );
};

export default SignUp;
