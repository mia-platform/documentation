import React from "react";
import Classes from "./styles.module.css";


const renderSvg = function (options) {
  options = options || {};
  return (
    <div className={Classes.logoBox}>
      <svg id="Raggruppa_38" data-name="Raggruppa 38" xmlns="http://www.w3.org/2000/svg" width="292.436" height="64.002" viewBox="0 0 292.436 64.002">
        <path id="Tracciato_84" data-name="Tracciato 84" d="M531.469,501.01a10.665,10.665,0,0,0,14.57,3.9l-14.567-25.238h0a10.665,10.665,0,0,0-9.236-5.334h0A10.665,10.665,0,0,0,513,479.676l-3.08,5.335,6.157,10.668,5.235-9.068a1.067,1.067,0,0,1,1.848,0l8.311,14.4Z" transform="translate(-461.479 -474.343)" fill="#00f096" />
        <path id="Tracciato_85" data-name="Tracciato 85" d="M784.478,501.01a10.665,10.665,0,0,0,14.57,3.9l-14.567-25.238h0a10.665,10.665,0,0,0-9.236-5.334h0a10.665,10.665,0,0,0-9.237,5.333l-3.08,5.335,6.157,10.668,5.235-9.068a1.067,1.067,0,0,1,1.848,0l8.31,14.4Z" transform="translate(-652.83 -474.343)" fill="#00f0f0" />
        <path id="Tracciato_86" data-name="Tracciato 86" d="M654.2,501.021a10.665,10.665,0,0,0,14.57,3.9L654.2,479.688l0,0a10.665,10.665,0,0,0-14.57-3.9l14.567,25.238Z" transform="translate(-559.579 -474.354)" />
        <path id="Tracciato_87" data-name="Tracciato 87" d="M325.726,501.01a10.665,10.665,0,0,1-14.57,3.9l14.567-25.238h0a10.665,10.665,0,0,1,9.237-5.333h0a10.665,10.665,0,0,1,9.236,5.334l14.567,25.238a10.665,10.665,0,0,1-14.57-3.9l-8.311-14.4a1.067,1.067,0,0,0-1.847,0Z" transform="translate(-311.156 -474.343)" fill="#00f096" />
      </svg>

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
