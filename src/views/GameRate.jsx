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
      <div className="w-full flex py-4 flex-col items-center gap-2">
          <img src={NoDataFoundImage} width={100} alt="" />
          <p className="text-gray-400 font-bold text-sm">No Data Found</p>

        </div>
    );

    return filteredGameData.flatMap(selectedGame =>
      selectedGame.list.map((game) => (
        <div key={game.id} className="flex justify-between items-center bg-gray-200 rounded-lg overflow-hidden my-1">
          <div className="w-[50%] text-[#fff] p-3 text-lg text-center bg-[#640138]">{game?.name}</div>
          <div className="w-[50%] text-[#fff] p-3 text-lg text-center bg-[#d87a00]">10/{game?.multiply_by * 10}.0</div>
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
      <div className="p-3 pb-8">
        {loading ? (
          <div className="flex justify-center items-center w-full h-[80vh]">
            <BeatLoader color="#0098c7" />
          </div>
        ) : (
          renderGameRates("Desawar")
        )}
      </div>
    );
  } else if (showKalyanAndDesawar) {
    // Show both Kalyan and Desawar tabs
    return (
      <div className="p-3 pb-8">
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
          <Tab.List className="flex p-1 space-x-1 bg-blue-900/40 rounded-xl">
            <Tab
              className={({ selected }) =>
                selected
                  ? "bg-primary shadow text-white font-semibold py-2 px-4 rounded-lg w-[49%]"
                  : "text-white font-semibold py-2 px-4 rounded-lg w-[49%]"
              }>
              Kalyan
            </Tab>
            <Tab
              className={({ selected }) =>
                selected
                  ? "bg-primary shadow text-white font-semibold py-2 px-4 rounded-lg w-[49%]"
                  : "text-white font-semibold py-2 px-4 rounded-lg w-[49%]"
              }>
              Desawar
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel className="flex flex-col gap-2">
              {loading ? (
                <div className="flex justify-center items-center w-full h-[80vh]">
                  <BeatLoader color="#0098c7" />
                </div>
              ) : (
                renderGameRates("Kalyan")
              )}
            </Tab.Panel>
            <Tab.Panel className="flex flex-col gap-2">
              {loading ? (
                <div className="flex justify-center items-center w-full h-[80vh]">
                  <BeatLoader color="#0098c7" />
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
      <div className="p-3 pb-8">
        {loading ? (
          <div className="flex justify-center items-center w-full h-[80vh]">
            <BeatLoader color="#0098c7" />
          </div>
        ) : (
          renderGameRates("Kalyan")
        )}
      </div>
    );
  }

  return null; // Default return if no condition matches
};

export default GameRate;
