import React from "react";
import { Controller } from "react-hook-form";

const TextField = ({ name, id, control, constant, rules }) => {
  const { title, type, placeholder } = constant;

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-white text-md mb-1">
        {title}
      </label>
      <Controller
        name={name} // ← używamy prop `name`
        control={control}
        defaultValue=""
        rules={rules}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <input
              id={id}
              type={type}
              placeholder={placeholder}
              className={`bg-n-1 w-full rounded-md px-2 py-1 text-black ${
                error ? "border-red-500 border-2" : ""
              }`}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            />
            {error && (
              <span className="text-red-400 text-sm mt-1">{error.message}</span>
            )}
          </>
        )}
      />
    </div>
  );
};

export default TextField;
