import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const Default = () => {
  let location = useLocation();
  let navigate = useNavigate();
  let titleObj = {
    "/game-posting": "Game Posting",
    "/withdrawal-chat": "Withdrawal Chat",
    "/deposit-chat": "Deposit Chat",
  };

  useEffect(() => {
    let token = localStorage.getItem("authToken"); 
    if (token == null) navigate("/");
  });
  return (
    <div className="font-poppins overflow-hidden relative max-w-[480px] w-full mx-auto h-[100vh]">
      <div className="h-[56px] bg-primary flex items-center text-white p-3">
        <div className="flex w-8">
          <Link onClick={() => navigate(-1)}>
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
          </Link>
        </div>
        <span className="mx-auto font-bold">{titleObj[location.pathname]}</span>
        <div className="w-8"></div>
      </div>
      <div className="h-[calc(100vh-45px)] overflow-auto main-wrapper">
        <Outlet />
      </div>
    </div>
  );
};

export default Default;
