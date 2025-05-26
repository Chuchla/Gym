import React from "react";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import { signup } from "../constans/signup_const.jsx";
import Button from "./Button.jsx";
import { useForm } from "react-hook-form";
import TextField from "./forms/TextField.jsx";

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

  const onSubmit = async (data) => {
    if (data.password !== data.repeat_password) {
      return alert("Hasła muszą być takie same");
    }
    // ... fetch itp.
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
            key={field.id} // ← unikalny key dla React
            name={field.name} // ← tu nazwa pola w RHF
            id={field.id} // ← tu id/for w labelu
            control={control}
            constant={field}
            rules={{
              required: `${field.title} jest wymagane`,
            }}
          />
        ))}

        <Button
          type="submit"
          className="w-full"
          disabled={!isFormComplete}
          white={!isFormComplete}
        >
          {isFormComplete ? "Create account!" : "Fill all of the fields"}
        </Button>
      </form>
    </Section>
  );
};

export default SignUp;
