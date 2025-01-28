import React from "react";
import clsx from "clsx";

const Button = ({
  children,
  variant = "primary", // 'primary', 'secondary', etc.
  size = "md", // 'sm', 'md', 'lg'
  className = "",
  onClick,
  disabled = false,
  ...props
}) => {
  const baseClass =
    "font-bold rounded transition duration-200 text-center relative border-2 border-black";

  const variantClasses = {
    primary: "bg-primary text-dark shadow-[0_5px_0_0_var(--dark-color)]", // Adjusted shadow to static value
    danger: "bg-delete text-dark shadow-[0_5px_0_0_var(--dark-color)]",
    success: "bg-green-500 text-dark shadow-[0_5px_0_0_var(--dark-color)]",
    info: "bg-blue-500 text-white shadow-[0_5px_0_0_rgba(66,153,225,1)]",
    transparent: "bg-light text-dark shadow-[0_0px_0_0_var(--dark-color)]",
  };

  const sizeClasses = {
    sm: "text-sm py-1 px-3",
    md: "text-md py-2 px-4",
    lg: "text-lg py-3 px-6",
  };

  const hoverEffect = "hover:top-[5px] hover:shadow-none"; // Hover moves button down and removes shadow

  const disabledClass = "opacity-50 cursor-not-allowed";

  return (
    <button
      className={clsx(
        baseClass,
        variantClasses[variant],
        sizeClasses[size],
        hoverEffect,
        { [disabledClass]: disabled },
        className
      )}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
