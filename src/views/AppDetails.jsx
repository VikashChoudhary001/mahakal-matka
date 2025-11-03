import React, { useEffect } from "react";
import Logo from "../assets/imgs/Logo.png";
import { useSelector } from "react-redux";

const AppDetails = () => {
  let { appData } = useSelector(state => state.appData.appData);

  useEffect(() => {
    document.title = "App Details | Mahakal Matka"
  }, [])

  const detailCards = [
    {
      title: "TM Application",
      value: appData?.tm_no,
      icon: "📱",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "ARN Number",
      value: appData?.arn_no,
      icon: "🔢",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Provisional ID",
      value: appData?.provisoinal_id,
      icon: "🆔",
      gradient: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 pb-8">
      {/* Header Section with Logo */}
      <div className="flex flex-col items-center mb-5 pt-2">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <img
            src={Logo}
            alt="Logo"
            className="relative w-[100px] h-[100px] mx-auto drop-shadow-xl rounded-full border-3 border-white shadow-lg"
          />
        </div>
        <h1 className="mt-4 text-xl font-bold text-gray-800 tracking-tight">Application Details</h1>
        <p className="text-xs text-gray-500 mt-0.5">Official Registration Information</p>
      </div>

      {/* Details Cards */}
      <div className="max-w-md mx-auto space-y-3">
        {detailCards.map((card, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

            {/* Card Content */}
            <div className="relative p-3.5 flex items-center gap-3">
              {/* Icon */}
              <div className={`flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                {card.icon}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                  {card.title}
                </p>
                <p className="text-base font-bold text-gray-800 truncate">
                  {card.value || "N/A"}
                </p>
              </div>

              {/* Decorative Element */}
              <div className={`w-0.5 h-9 rounded-full bg-gradient-to-b ${card.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>

            {/* Bottom Border Accent */}
            <div className={`h-0.5 w-full bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="max-w-md mx-auto mt-5">
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-3">
          <div className="flex items-start gap-2.5">
            <span className="text-blue-500 text-base">ℹ️</span>
            <div>
              <p className="text-xs font-medium text-blue-900">Official Information</p>
              <p className="text-[10px] text-blue-700 mt-0.5">
                These details are officially registered and verified for this application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetails;
