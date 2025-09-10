import React from "react";
import Logo from "../assets/imgs/Logo.png";
import Safe from "../assets/imgs/Safe.png";

const Splash = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      <img src={Logo} alt="Logo" className="h-40" />
      <p className="text-center mt-2 ">Loading ...</p>
    </div>
  );
};

export default Splash;
