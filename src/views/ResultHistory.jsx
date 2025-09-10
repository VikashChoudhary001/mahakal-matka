import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const ResultHistory = () => {
  let { appData } = useSelector((state) => state.appData.appData);
  useEffect(() => {
    document.title = "Result History | Mahakal Matka"
  }, [])
  return (
    <div className="pb-8">
      <iframe className="w-full h-[100vh]" src={appData.result_history_webview_url} />
    </div>
  );
};

export default ResultHistory;
