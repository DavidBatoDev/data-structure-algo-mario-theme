import React from "react";
import clsx from "clsx";

// Props: variant, children, icon, onClick, className
const CustomButton = ({ variant = "default", children, icon: Icon, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "pixel-corners flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-lg shadow-md transition-all duration-150", // Ensure full width or auto for small screens
        // Background variants
        {
          "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-[0_4px_0_#1a1a1a]": variant === "arrival",
          "bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_0_#1a1a1a]": variant === "departure",
          "bg-yellow-500 text-white hover:bg-yellow-600  shadow-[0_4px_0_#1a1a1a]": variant === "departLastCar",
          "bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 shadow-[0_4px_0_#1a1a1a]": variant === "generateTree",
          "bg-transparent text-black hover:bg-slate-400 active:bg-slate-500 shadow-[0_4px_0_#1a1a1a]": variant === "clear",
          "bg-minecraft-white text-black hover:bg-minecraft-whiteSecondary active:bg-white shadow-[0_4px_0_#1a1a1a]": variant === "white",
          // gray
          "bg-minecraft-gray text-white hover:bg-gray-600 active:bg-gray-700 shadow-[0_4px_0_#1a1a1a]": variant === "gray",
        },
        // Add rounded shadow to all buttons
        "border-2 border-black rounded-md",
        className // Allow for additional styling
      )}
      style={{
        textShadow: "1px 1px 0 #000",
      }}
    >
      {/* Render Icon if passed */}
      {Icon && <Icon className="h-6 w-6" />}
      {children}
    </button>
  );
};

export default CustomButton;
