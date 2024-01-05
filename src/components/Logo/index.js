import React from "react";
import Classes from "./styles.module.css";


const renderSvg = function (options) {
  options = options || {};
  return (
    <div className={Classes.logoBox}>
      <img src="img/logo.png" />
    </div>
  );
};

function Logo() {
  return (
    <div>
      {
        renderSvg({})
      }
    </div>
  );
}

export default Logo;
