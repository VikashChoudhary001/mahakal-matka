import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { getGameRate } from "../repository/GameRateRepository";
import { useSelector } from "react-redux";
import { Tab } from "@headlessui/react";
import NoDataFoundImage from "../assets/imgs/noDataFound.png";

const GameRate = () => {
  const [selectedTab, setSelectedTab] = useState(() => {
    return localStorage.getItem('selectedTab') || "general";
  });
  const [gameRates, setGameRates] = useState([]);
  const [loading, setLoading] = useState(true);

  const appData = useSelector((state) => state.appData.appData);

  useEffect(() => {
    localStorage.setItem('selectedTab', selectedTab);

    const fetchGameRate = async () => {
      setLoading(true);
      try {
        const response = await getGameRate();

        setGameRates(response?.data?.response?.data);
      } catch (error) {
        console.error("Error fetching game rate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameRate();
  }, [selectedTab]);

  const renderGameRates = (filter) => {
    // Filter the game rates based on the filter provided
    // const filteredGameData = gameRates?.filter(game =>
    //   game?.title?.includes(filter)
    // );
    const filteredGameData = gameRates

    if (!filteredGameData?.length) return (
      <div className="w-full flex py-8 flex-col items-center gap-3">
        <img src={NoDataFoundImage} width={120} alt="" />
        <p className="text-gray-400 font-bold text-sm">No Data Found</p>
      </div>
    );

    return filteredGameData.flatMap(selectedGame =>
      selectedGame.list.map((game, index) => (
        <div
          key={game.id}
          className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden mb-2"
        >
          <div className="flex items-stretch">
            {/* Game Name Section */}
            <div className="w-[50%] bg-gradient-to-br from-[#640138] to-[#7a0145] py-3 px-4">
              <p className="text-white font-bold text-base text-center leading-tight">
                {game?.name}
              </p>
            </div>

            {/* Rate Section */}
            <div className="w-[50%] bg-gradient-to-br from-[#d87a00] to-[#ff9500] py-3 px-4">
              <p className="text-white font-bold text-base text-center leading-tight">
                ₹10 = ₹{game?.multiply_by * 10}
              </p>
            </div>
          </div>
        </div>
      ))
    );
  };

  // Determine the flags based on appData
  const showDesawarOnly = appData?.appData?.enable_desawar_only === 1;
  const showKalyanOnly = !showDesawarOnly && appData?.appData?.enable_desawar !== 1;
  const showKalyanAndDesawar = appData?.appData?.enable_desawar === 1 && !showDesawarOnly;


  // const showDesawarOnly = false;
  // const showKalyanOnly = true;
  // const showKalyanAndDesawar = false;

  if (showDesawarOnly) {
    // Show only Desawar content without tabs
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 pb-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-0.5">Game Rates</h1>
          <p className="text-xs text-gray-500">Desawar betting rates and multipliers</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center w-full h-[60vh]">
            <BeatLoader color="#640138" size={10} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {renderGameRates("Desawar")}
          </div>
        )}
      </div>
    );
  } else if (showKalyanAndDesawar) {
    // Show both Kalyan and Desawar tabs
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 pb-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-0.5">Game Rates</h1>
          <p className="text-xs text-gray-500">View betting rates and multipliers</p>
        </div>

        <Tab.Group
          selectedIndex={selectedTab === "general" ? 0 : 1}
          onChange={(index) => {
            if (index === 0) {
              setSelectedTab("general");
            } else {
              setSelectedTab("desawar");
            }
          }}
        >
          <Tab.List className="flex p-1 space-x-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-md max-w-md mx-auto mb-4">
            <Tab
              className={({ selected }) =>
                selected
                  ? "bg-gradient-to-r from-[#640138] to-[#7a0145] shadow text-white font-bold py-2.5 px-4 rounded-lg w-[49%] transition-all duration-200"
                  : "text-gray-600 font-semibold py-2.5 px-4 rounded-lg w-[49%] hover:bg-gray-100 transition-all duration-200"
              }>
              <span className="flex items-center justify-center gap-1.5 text-sm">
                <span>🎯</span> Kalyan
              </span>
            </Tab>
            <Tab
              className={({ selected }) =>
                selected
                  ? "bg-gradient-to-r from-[#d87a00] to-[#ff9500] shadow text-white font-bold py-2.5 px-4 rounded-lg w-[49%] transition-all duration-200"
                  : "text-gray-600 font-semibold py-2.5 px-4 rounded-lg w-[49%] hover:bg-gray-100 transition-all duration-200"
              }>
              <span className="flex items-center justify-center gap-1.5 text-sm">
                <span>🎲</span> Desawar
              </span>
            </Tab>
          </Tab.List>
          <Tab.Panels className="max-w-2xl mx-auto">
            <Tab.Panel className="flex flex-col">
              {loading ? (
                <div className="flex justify-center items-center w-full h-[60vh]">
                  <BeatLoader color="#640138" size={10} />
                </div>
              ) : (
                renderGameRates("Kalyan")
              )}
            </Tab.Panel>
            <Tab.Panel className="flex flex-col">
              {loading ? (
                <div className="flex justify-center items-center w-full h-[60vh]">
                  <BeatLoader color="#d87a00" size={10} />
                </div>
              ) : (
                renderGameRates("Desawar")
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    );
  } else if (showKalyanOnly) {
    // Show only Kalyan content without tabs
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 pb-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-0.5">Game Rates</h1>
          <p className="text-xs text-gray-500">Kalyan betting rates and multipliers</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center w-full h-[60vh]">
            <BeatLoader color="#640138" size={10} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {renderGameRates("Kalyan")}
          </div>
        )}
      </div>
    );
  }

  return null; // Default return if no condition matches
};

export default GameRate;
