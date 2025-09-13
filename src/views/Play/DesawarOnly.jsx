import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { getMarkets } from "../../repository/MarketRepository";
import Chart_b from "../../assets/imgs/chart_b.png";
import Close_b from "../../assets/imgs/close_b.png";
import Chat1 from "../../assets/imgs/play_now.png";
import Auth from '../../layouts/Auth.jsx';
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal.jsx";
import { useSelector } from "react-redux";

const DesawarOnly = ({ tabBorderColor }) => {
  const [marketsData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false); // State for authentication modal
  const [openLoginModal, setOpenLoginModal] = useState(false);
  let { appData } = useSelector((state) => state.appData.appData);
  const showResultsOnly = appData?.show_results_only || 0; 

  const token = localStorage.getItem("authToken");


  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      try {
        const response = await getMarkets("desawar");
        setMarketData(response?.data?.response?.markets);
      } catch (error) {
        console.error("Error fetching markets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  const handleChartClick = (marketId,marketName) => {
    if(showResultsOnly) return;
    const url = `https://api.mahakalmatka.com/desawar/chart/${marketId}/hello`;
    navigate("/game-chart/?gameName="+marketName+"&gameUrl=" + url);
  };


  const handleChatClick = (market) => {
    if(showResultsOnly) return
    if (!token) {
      localStorage.setItem("authMenu", 1)
      setAuthModalOpen(true);
    } else {
      // Use navigate to redirect in the same tab
      navigate(`/general-sub-games?gameType=desawar&market_id=${market?.id}&tabType=desawar`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <BeatLoader color="#0098c7" loading={loading} />
      </div>
    );
  }

  return (
    <div className="p-3 pb-8">
      {marketsData
        ?.filter((market) => market !== null)
        .map((market) => (
          <div
            key={market?.id}
            className={`flex flex-col text-white rounded-md border-2 ${tabBorderColor}`}
          >
            <div className="w-full flex justify-between items-center p-1 px-3 bg-primary">
              <p className="text-[12px]">Open: {market?.open_time}</p>
              <p className="text-[12px]">Close: {market?.close_time}</p>
            </div>

            <div className="p-2 w-full flex justify-between items-center">
              <img
                src={Chart_b}
                alt="Chart"
                className="w-[50px] h-[50px] object-cover cursor-pointer"
                onClick={() => token ? handleChartClick(market?.id,market?.name) : setOpenLoginModal(true)}
              />

              <div className="flex flex-col justify-center items-center">
                <span className="text-[13px] font-semibold uppercase text-[#4f4f4f]">
                  {market?.name}
                </span>
                <span className="text-[12px] font-semibold uppercase text-primary">
                  {market?.last_result
                    ? market?.last_result.result
                    : "***-**-***"}
                </span>
                <span
                  className={`text-xs ${!market?.game_on ? "text-orange" : "text-greenLight"
                    }`}
                >
                  {market?.game_on
                    ? "Market is Running"
                    : "Market is Close"}
                </span>
              </div>
              {/* <Link
                className={`w-[50px] h-[50px] text-center font-semibold rounded-full`}
                to={
                  !market?.game_on
                    ? "#"
                    : `/general-sub-games?gameType=${market?.name}&market_id=${market?.id}&tabType=desawar`
                }
              >
                {!market?.game_on ? (
                  <>
                    <img
                      src={Close_b}
                      alt="Close"
                      className="w-full h-full object-cover cursor-auto"
                    />
                  </>
                ) : (
                  <>
                    <img
                      src={Chat1}
                      alt="Play Now"
                      className="w-full h-full object-cover"
                    />
                  </>
                )}
              </Link> */}


              <div
                className={`w-[50px] h-[50px] text-center font-semibold rounded-full`}
              >
                {!market?.game_on ? (
                  <div style={{ pointerEvents: "none" }}>
                    <img
                      src={Close_b}
                      alt="Close"
                      className="w-full h-full object-cover cursor-not-allowed"
                    />
                  </div>
                ) : (
                  <img
                    src={Chat1}
                    alt="Play Now"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() =>token? handleChatClick(market) : setOpenLoginModal(true)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      {/* Render the authentication modal */}
      <Auth isOpen={authModalOpen} toggle={() => setAuthModalOpen(false)} />
        {
          !showResultsOnly ? 
            <Modal
                isOpen={openLoginModal}
                toggle={()=>setOpenLoginModal(false)}
                className="custom-modal"
                centered
                >
                <div className="font-semibold text-white bg-primary " style={{width:"400px",maxWidth:"90vw"}}>
                    <div className="flex justify-between p-3 border-b border-white">
                    <h4>Need Login</h4>
                    <button onClick={()=>setOpenLoginModal(false)}>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                    </div>
                    <div className="flex flex-col items-center gap-4 pt-4 pb-8">
                        <div className="text-md">
                            To use this feature, you need to login
                        </div>
                        <button className="p-2 px-8 text-md text-white rounded-md bg-green-600 " onClick={(()=>navigate("/auth/login"))}>
                            Login 
                        </button>
                    </div>
                </div>
            </Modal>
          :null
        }
    </div>
  );
};

export default DesawarOnly;
