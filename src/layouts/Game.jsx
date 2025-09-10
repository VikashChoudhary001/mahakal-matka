import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Time from "../components/Time";

const Game = () => {
  let location = useLocation();
  let navigate = useNavigate();
  let params = new URLSearchParams(location.search);
  let bidType = params.get("bidType");
  let gameType = params.get("gameType");


  useEffect(() => {
    let token = localStorage.getItem("authToken");
    if (token == null) navigate("/");
  }, [navigate]);

  return (
    <div className="font-poppins bg-primary/5 overflow-hidden relative max-w-[480px] w-full mx-auto h-[100vh]">
      <div className="h-[45px] bg-primary flex items-center text-white p-3">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)}>
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5" 
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>
          <span className="mx-auto ml-2 font-bold text-lg uppercase leading-6" id="gameName">
            {gameType}
            {bidType && `, ${bidType}`}
          </span>
        </div>
        <div id="gameEndTimer" className="flex flex-col items-center ml-auto text-xs">
        </div>
      </div>
      <div className="h-[calc(100dvh-56px)] overflow-auto main-wrapper">
        <Outlet />
      </div>
    </div>
  );
};

export default Game;
