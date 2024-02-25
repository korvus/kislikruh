import React, { useState } from "react";
import "../../style/infobulle.css";

const Infobulle = ({ children, text }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className="infobulle-container"
    >
      {children}
      {show && <div className="infobulle-text">{text}</div>}
    </div>
  );
};

export default Infobulle;
