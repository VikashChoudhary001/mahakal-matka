import React from "react";
import { useSelector } from "react-redux";
import DesawarHistory from "./PlayHistory/DesawarHistory";
import GeneralHistory from "./PlayHistory/GeneralHistory";
import BothHistory from "./PlayHistory/BothHistory";

const History = () => {
  const appData = useSelector((state) => state.appData.appData);
  const { GameHistory } = useSelector((state) => state.FlowApp);


  if (!GameHistory) {
    return <DesawarHistory />;
  }

  const showDesawarOnly = appData?.appData?.enable_desawar_only === 1;
  const showKalyanOnly = !showDesawarOnly && appData?.appData?.enable_desawar !== 1;
  const showKalyanAndDesawar = appData?.appData?.enable_desawar === 1 && !showDesawarOnly;

  // const showDesawarOnly = false;
  // const showKalyanOnly = true;
  // const showKalyanAndDesawar = false;

  if (showDesawarOnly) {
    return <DesawarHistory />;
  }

  if (showKalyanAndDesawar) {
    return <BothHistory />;
  }

  if (showKalyanOnly) {
    return <GeneralHistory />;
  }

  return null;
};

export default History;
