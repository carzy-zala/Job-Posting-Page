import React from "react";

function Input({ type = "text", id = "", className = "", ...props }, ref) {
  return (
    <input
      type={type}
      id={id}
      className={className}
      ref={ref && ref}
      {...props}
    />
  );
}

export default React.forwardRef(Input);
