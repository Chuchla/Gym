import React from "react";
import ButtonSvg from "../assets/svg/ButtonSvg.jsx";

const Button = ({
  className,
  href,
  onClick,
  children,
  px,
  white,
  disabled,
}) => {
  const baseClasses = `button relative inline-flex items-center
  justify-center h-11 transition-colors hover:text-color-1 
  ${px || "px-7"}
  ${white ? "text-n-8" : "text-n-1"}
  ${className || ""}`;

  const classes = disabled
    ? `${baseClasses} opacity-50 cursor-not-allowed`
    : baseClasses;

  const spanClasses = "relative z-10";
  const renderButton = () => (
    <button
      className={classes}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </button>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default Button;
