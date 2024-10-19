import React from "react";

function Container({ children, classname = "", ...props }) {
  return (
    <div className={classname} {...props}>
      {children}
    </div>
  );
}

export default Container;
