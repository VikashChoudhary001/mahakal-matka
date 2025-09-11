import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Auth from "../layouts/Auth";
import "./styles.css";
import { FaCross, FaDownload } from "react-icons/fa";
import { useSelector } from "react-redux";
import { DeferredPromptContext } from "../context/DeferredPromptContext";

const FloatingMenu = () => {
    let location = useLocation();
    const token = localStorage.getItem("authToken"); // Check if the user is authenticated
    const [authModalOpen, setAuthModalOpen] = useState(false); // State to control modal
    const { appData } = useSelector((state) => state.appData.appData);
    const [openDownloadBar, setOpenDownloadBar] = useState(false);

    let { deferredPrompt, setDeferredPrompt } = useContext(DeferredPromptContext);

    useEffect(() => {
        setOpenDownloadBar(localStorage.getItem("isModelOpenedAlready") === "true"?false :true);
    }, []);

    const handleInstallClick = async () => {
        handleCloseDownloadBar();
        if(appData?.app_update_link?.length>0){
            window.location.href = appData?.app_update_link;
        }else if (deferredPrompt) {
            deferredPrompt?.prompt();
            const { outcome } = await deferredPrompt?.userChoice;
            if (outcome === "accepted") {
                console.log("User accepted the install prompt");
            } else {
                console.log("User dismissed the install prompt");
            }
            setDeferredPrompt(null);
        }
    };

    let items = [
        {
            text: "Home",
            link: "/",
            icon: (
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
                        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                </svg>
            ),
        },
        {
            text: "History",
            link: "/history",
            icon: (
                <img
                    src={require("../assets/imgs/game.png")}
                    alt="History"
                    className="w-6 h-6"
                />
            ),
        },
        {
            text: "Wallet",
            link: "/wallet",
            icon: (
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
                        d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                    />
                </svg>
            ),
        },
        {
            text: "Help",
            link: "/help",
            icon: (
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
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                    />
                </svg>
            ),
        },
    ];
    const handleLinkClick = (e, link) => {
        // If user is not authenticated and link is not Home, prevent navigation and open modal
        if (!token && link !== "/") {
            e.preventDefault();
            localStorage.setItem("authMenu", 1); // Set authMenu to 1 when the modal opens
            setAuthModalOpen(true);
        }
    };

    const toggleAuthModal = () => {
    if (authModalOpen) {
      localStorage.setItem("authMenu", 0); // Set authMenu to 0 when the modal closes
    } else {
      localStorage.setItem("authMenu", 1); // Set authMenu to 1 when the modal opens
    }
    setAuthModalOpen(!authModalOpen); // Toggle modal state
  };

    const handleCloseDownloadBar =()=>{
        setOpenDownloadBar(false)
        localStorage.setItem(
				'isModelOpenedAlready',
				JSON.stringify(true)
			);
    }

    return (
        <>
            {openDownloadBar ? (
                <div className="floating-webAppNotification floating-menu">
                    <div className="fwnLeft">
                        <button
                            onClick={handleInstallClick}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "3px 8px",
                                borderRadius: "4px",
                                background: "transparent",
                                border: "1px solid #0098c7",
                                fontWeight: "600",
                                color: "#0098c7",
                            }}
                        >
                            <FaDownload />
                            Download
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="textalign-center">Download the app now!</p>
                        <button
                            onClick={handleCloseDownloadBar}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "20px",
                                background: "red",
                                fontWeight: "600",
                                padding: "3px",
                                width: "25px",
                                height: "25px",
                            }}
                        >
                            {" "}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="#fff"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : null}
            <div className="floating-menu">
                {items.map((item, idx) => (
                    <Link
                        to={item.link} // All links remain clickable
                        key={`FloatingMenuItem${idx}`}
                        className={`flex w-11 h-11 flex-col items-center rounded-md py-0.5 px-1 ${location.pathname === item.link && (token || item.link === "/")
                                ? "bg-primary/50"
                                : ""
                            }`}
                        onClick={(e) => handleLinkClick(e, item.link)}
                    >
                        {item.icon}
                        <span className="mt-auto text-xs font-bold">{item.text}</span>
                    </Link>
                ))}
            </div>
            
      {/* Render the Main component for the modal */}
      {authModalOpen && (
      <Auth
        isOpen={authModalOpen}
        toggle={toggleAuthModal} // Toggle modal using the new function
      />
    )}

        </>
    );
};

export default FloatingMenu;
