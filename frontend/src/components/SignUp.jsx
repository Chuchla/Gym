import React, { useEffect, useState } from "react";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import { signup } from "../constans/signup_const.jsx";
import Button from "./Button.jsx";

export const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [isFormComplete, setIsFormComplete] = useState(false);
  useEffect(() => {
    const allFields = signup.every((field) => formData[field.id]?.trim());
    setIsFormComplete(allFields);
  }, [formData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  return (
    <Section id={"#signup"}>
      <Heading
        className={"container relative z-2"}
        title={"Create new account"}
      />
      <div className={"flex justify-center mt-8 "}>
        <div
          className={
            "rounded-md bg-n-7 p-4 border-color-1 border-2 w-full max-w-md space-y-4"
          }
        >
          {signup.map((form) => (
            <div key={form.id} className={"flex flex-col"}>
              <label className={"text-white text-md mb-1"} htmlFor={form.id}>
                {form.title}
              </label>
              <input
                id={form.id}
                className={"bg-n-1 w-full rounded-md px-2 py-1 text-black"}
                type={form.type}
                placeholder={form.placeholder}
                value={formData[form.id] || ""}
                onChange={handleChange}
              />
            </div>
          ))}
          <Button white={!isFormComplete} className={"w-full"}>
            {isFormComplete ? "Create account!" : "Fill all of the fields"}
          </Button>
        </div>
      </div>
    </Section>
  );
};
