import React from "react";
import { useSelector } from "react-redux";
import DesawarOnly from "./Play/DesawarOnly";
import KalyanAndDesawar from "./Play/KalyanAndDesawar";
import KalyanOnly from "./Play/KalyanOnly";

const Play = ({
  tabHeight = "h-[30px]",
  overallPadding = "p-3",
  vertialyPadding = "py-2",
  tabBorderColor = "",
  activeTabBgColor = "bg-primary",
  tabBG = "bg-blue-900/40",
}) => {
  const appData = useSelector((state) => state.appData.appData);

  const showDesawarOnly = appData?.appData?.enable_desawar_only === 1;
  const showKalyanOnly = !showDesawarOnly && appData?.appData?.enable_desawar !== 1;
  const showKalyanAndDesawar = appData?.appData?.enable_desawar === 1 && !showDesawarOnly;

  // const showDesawarOnly = false;
  // const showKalyanOnly = true;
  // const showKalyanAndDesawar = false;


  if (showDesawarOnly) {
    return <DesawarOnly tabBorderColor={tabBorderColor} />;
  } else if (showKalyanAndDesawar) {
    return (
      <KalyanAndDesawar
        tabHeight={tabHeight}
        overallPadding={overallPadding}
        vertialyPadding={vertialyPadding}
        tabBorderColor={tabBorderColor}
        activeTabBgColor={activeTabBgColor}
        tabBG={tabBG}
      />
    );
  } else if (showKalyanOnly) {
    return <KalyanOnly tabBorderColor={tabBorderColor} />;
  }

  return null;
};

export default Play;
