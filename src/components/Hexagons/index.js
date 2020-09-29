import React from "react";
import randomArbitrary from "../../lib/randomArbitrary";
import Classes from "./styles.module.css";

const styles = {
  wrapperHexagon: {
    position: "absolute",
    width: "100%",
    top: 0,
    height: "100%",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },
  wrapper: {
    height: "100%",
    width: "100%",
    backgroundColor: "grey",
    display: "flex",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    margin: "0 auto",
    padding: 0,
  },
};

const renderSvg = function (options) {
  options = options || {};
  return (
    <svg
      className={Classes.hexagon}
      fill={options.fill}
      height="44"
      style={options.style}
      viewBox="0 0 38 44"
      width="38"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="18.995 .02 0 10.995 0 32.995 18.995 44 38 32.995 38 10.995 18.995 0" />
    </svg>
  );
};

function Hexagons() {
  return (
    <div style={styles.wrapperHexagon}>
      {renderSvg({
        fill: "#5fa37e",
        style: {
          margin: "0 0 0 14%",
          width: 25,
          height: "auto",
          animationDelay: randomArbitrary(0, 4) + "s",
        },
      })}
      {renderSvg({
        fill: "#e06565",
        style: {
          margin: "0px 0 0 23%",
          width: 16,
          animationDelay: randomArbitrary(0, 4) + "s",
        },
      })}
      {renderSvg({
        fill: "#50b8da",
        style: {
          margin: "75px 0 0 23%",
          width: 16,
          animationDelay: randomArbitrary(0, 4) + "s",
        },
      })}
      {renderSvg({
        fill: "#614f8c",
        style: {
          margin: "70px 0 0 28%",
          width: 16,
          animationDelay: randomArbitrary(0, 4) + "s",
        }
      })}
      {renderSvg({
        fill: "#50b8da",
        style: {
          margin: "15px 16% 0 0",
          right: 0,
          width: 20,
          animationDelay: randomArbitrary(0, 4) + "s",
        },
      })}
      {renderSvg({
        fill: "#e98e56",
        style: {
          margin: "65px 28% 0 0",
          right: 0,
          width: 14,
          animationDelay: randomArbitrary(0, 4) + "s",
        },
      })}
    </div>
  );
}

export default Hexagons;
