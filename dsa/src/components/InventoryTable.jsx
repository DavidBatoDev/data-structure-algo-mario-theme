import React from "react";
import clsx from "clsx";

// InventoryTable component
const InventoryTable = ({ data = [], className, cellClassName }) => {
  return (
    <div
      className={clsx(
        "flex justify-center items-center bg-[#BBB] border border- rounded shadow-craftingInset p-2",
        className // Custom styles for the entire table
      )}
    >
      {/* Dynamically render cells based on the data array */}
      {data.map((value, index) => (
        <div
          key={index}
          className={clsx(
            "flex justify-center items-center flex-shrink-0 bg-[#6E6E6E] border border-[#BBB]",
            cellClassName // Custom styles for each rectangle
          )}
        >
          {/* Render text, image, or any JSX element */}
          {typeof value === "string" ? (
            <span className="text-center text-white font-pressStart text-[12px]">
              {value}
            </span>
          ) : (
            value
          )}
        </div>
      ))}
    </div>
  );
};

export default InventoryTable;
