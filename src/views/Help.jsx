import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


const Help = () => {
    
    let { appData } = useSelector((state) => state.appData.appData);

    return (
        <div className="relative p-3 pb-8 text-sm">
            <span
                dangerouslySetInnerHTML={{
                    __html: appData?.custom_message_3_help_page_1,
                }}
            ></span>
            <div className="my-3 py-2 border border-l-0 border-r-0 border-black/40">
                <span
                    dangerouslySetInnerHTML={{
                        __html: appData?.custom_message_5_terms,
                    }}
                ></span>
            </div>

            <div className="flex justify-center items-center gap-2 mt-2 pb-4 border-b border-black/40">
                {
                    appData?.whatsapp_enable ?
                        <a href={appData?.whatsapp_number} target="_blank" className="shadow-md rounded-lg w-1/2 h-[50px] flex items-center justify-center gap-2 p-2 border-[3px] border-[#fff] bg-[#2ed838] hover:shadow-xl transition-shadow duration-300">
                            <i className="fab fa-whatsapp" style={{ fontSize: "20px" }}></i>
                            <span className="text-white text-[12px] font-extrabold">WhatsApp Us</span>
                        </a>
                        : null
                }
                {
                    appData?.telegram_enable ?
                        <a href={appData?.telegram_link} target="_blank" className="shadow-md rounded-lg w-1/2 h-[50px] flex items-center justify-center gap-2 p-2 border-[3px] border-[#fff] bg-[#2eb9d8] hover:shadow-xl transition-shadow duration-300">
                            <i className="fab fa-telegram " style={{ fontSize: "20px" }}></i>
                            <span className="text-white text-[12px] font-extrabold">Join Telegram</span>
                        </a>
                        : null
                }
                {/* <Link to="/withdrawal-chat" className="shadow-md rounded-lg w-full h-[50px] flex items-center justify-center gap-2 p-2 border-[3px] border-[#fff] bg-[#d82e2e] hover:shadow-xl transition-shadow duration-300">
            <img src={widthdraw1} alt="" className="text-[#fff] w-6 h-6" />
            <span className="text-white text-[12px] font-extrabold">WITHDRAWAL CHAT</span>
          </Link> */}
            </div>
            {/* <p style={{textAlign:"center",fontSize:"16px",color:"#000", margin:"10px 0 10px"}}>Or</p>
        <div className="flex justify-center">
             <a href="tel:8570869547" className="shadow-md rounded-lg w-1/2 h-[50px] flex items-center justify-center gap-2 p-2 border-[3px] border-[#fff] bg-[#2ed838] hover:shadow-xl transition-shadow duration-300">
             <i className="fas fa-phone-alt" style={{fontSize:"20px"}}></i>
            <span className="text-white text-[12px] font-extrabold">Call Us</span>
          </a>
        </div> */}

          <div className="grid grid-cols-2 gap-4 p-3 text-center">
            <div>
              <Link
                to="/withdrawal-chat"
                className="block w-full py-2 rounded-md bg-orange text-white"
              >
                Withdrawal Chat
              </Link>
              <p className="mt-2">
                पैसे निकालने मैं अगर कोई समस्या है तो withdraw chat पे क्लिक
                करे।
              </p>
            </div>
            <div>
              <Link
                to="/deposit-chat" 
                className="block w-full py-2 rounded-md bg-orange text-white"
              >
                Deposit Chat
              </Link>
              <p className="mt-2">
                पैसे ऐड करने मैं अगर आपको समस्या है तो deposit chat पे क्लिक
                करे।
              </p>
            </div>
          </div>

        </div>
    );
};

export default Help;
