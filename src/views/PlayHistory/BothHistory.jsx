import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import GeneralHistory from "./GeneralHistory";
import DesawarHistory from "./DesawarHistory";

const BothHistory = () => {
  const [selectedTab, setSelectedTab] = useState("general");
 
  return (
    <>
      <Tab.Group
        selectedIndex={selectedTab === "general" ? 0 : 1}
        onChange={(index) => setSelectedTab(index === 0 ? "general" : "desawar")}
      >
        <Tab.List className="flex p-1 space-x-1 bg-[#abd5e1] rounded-xl my-2">
          <Tab
            className={({ selected }) =>
              selected
                ? "bg-yellow-600 shadow text-white font-semibold py-[0.5px] px-4 rounded-lg w-[49%]"
                : "text-white font-semibold py-[0.5px] px-4 rounded-lg w-[49%]"
            }
          >
            Kalyan
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? "bg-yellow-600 shadow text-white font-semibold py-[0.5px] px-4 rounded-lg w-[49%]"
                : "text-white font-semibold py-[0.5px] px-4 rounded-lg w-[49%]"
            }
          >
            Desawar
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <GeneralHistory />
          </Tab.Panel>
          <Tab.Panel>
            <DesawarHistory />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

export default BothHistory;
