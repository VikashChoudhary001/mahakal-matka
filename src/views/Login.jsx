import React, { useEffect, useRef, useState } from "react";
import Logo from "../assets/imgs/Logo.png";
import { sendLoginOtp, verifyLoginOtp } from "../repository/AuthRepository";
import Repository from "../repository/Repository";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import BannerLogo from "../assets/imgs/banner_login_page.jpg";

// Function to call Android app callback on login success
function loginSuccess(userNumber) {
    if (window.AndroidApp && window.AndroidApp.onLoginSuccess) {
        window.AndroidApp.onLoginSuccess(userNumber);
    }
}

const Login = () => {
    const navigate = useNavigate();
    let [loading, setLoading] = useState();
    let [isOTPScreen, setOTPScreen] = useState(false);
    let [phone, setPhone] = useState("");
    let [otp, setOTP] = useState("");
    
    const phoneInputRef = useRef(null);
    const otpInputRef = useRef(null);

    useEffect(() => {
        phoneInputRef.current?.focus();
    }, []);

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let payload = {
                phone,
            };
            let { data } = await sendLoginOtp(payload);
            if (data.error === false) {
                setOTPScreen(true);
                 setTimeout(() => {
                    otpInputRef.current?.focus();
                }, 100);
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let payload = {
                phone,
                otp,
            };
            let { data } = await verifyLoginOtp(payload);
            if (data.error === false) {
                // Call login success callback for Android app
                loginSuccess(phone);

                let { token, user } = data.response;
                Repository.defaults.headers.Authorization = "Bearer " + token;
                localStorage.setItem("authToken", token);
                localStorage.setItem("authUser", JSON.stringify(user));
                localStorage.setItem("welcomeStatus", true);

                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                background:
                    "linear-gradient(153deg, rgba(2,0,36,1) 0%, rgba(0,191,254,1) 35%, rgba(0,212,255,1) 100%)",
            }}
            className="h-[100vh] p-3 overflow-auto"
        >


                <p style={{ textAlign: "center", fontSize: "22px", color: "#fff", margin: "20px 0 0" }}>Login</p>
            <div className="relative flex flex-col p-5 mt-8 rounded-md" style={{ border: "1px solid #fff" }}>
            <div className="flex justify-center mb-3 h-auto">
                {/* <img
                    src={Logo}
                    alt="Logo"
                    width={80}
                    style={{ display: "block" }}
                /> */}
                <img src={BannerLogo} alt="banner" style={{ display: "block",width:"100%" }} />

            </div>
                
                <form onSubmit={handlePhoneSubmit}>
                    <div className="flex flex-col w-full">
                        <label style={{ color: "#fff", fontSize: "18px" }}>Mobile Number</label>
                        <input
                            ref={phoneInputRef}
                            className="block w-full h-10 px-2 py-1 mt-1 text-black border rounded border-black/40"
                            type="number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            maxLength={10}
                            max={9999999999}
                            placeholder="Enter Mobile Number"
                        />
                    </div>
                    {
                        !isOTPScreen ?
                            <button
                                type="submit"
                                disabled={loading}
                                className="block w-full p-3 mt-2 font-semibold text-white rounded-md bg-[#006b9fd6]"
                            >
                                {loading ? <Spinner /> : "Send OTP"}
                            </button>
                        :null
                    }
                </form>
                {
                    isOTPScreen ?
                        <form onSubmit={handleOTPSubmit} style={{marginTop:10}}>
                            <div className="flex flex-col w-full">
                                <label style={{ color: "#fff", fontSize: "18px" }}>OTP</label>
                                <input
                                    ref={otpInputRef}
                                    className="block w-full h-10 px-2 py-1 mt-1 text-black border rounded border-black/40"
                                    type="number"
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value)}
                                    placeholder="Enter OTP"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="block w-full p-3 mt-2 font-semibold text-white rounded-md bg-[#006b9fd6]"
                            >
                                {loading ? <Spinner /> : "Login"}
                            </button>
                        </form>
                    :null
                }

            </div>

            {/* <p style={{textAlign:"center",fontSize:"16px",color:"#fff", margin:"30px 0 15px"}}>Download App</p>
                <div style={{display:"flex",justifyContent:"space-around",alignItems:"top"}}>
                    <a href={appData?.app_update_link} className="android-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={20} style={{marginRight:"10px"}}>
                            <g>
                                <path fill="#00F076" d="M17,14.5l4.2-4.5L4.9,1.2C4.8,1.1,4.6,1.1,4.3,1L17,14.5z"/>
                                <path fill="#FFC900" d="M23,21l5.9-3.2c0.7-0.4,1.1-1,1.1-1.8s-0.4-1.5-1.1-1.8L23,11l-4.7,5L23,21z"/>
                                <path fill="#00D6FF" d="M2.4,1.9C2.1,2.2,2,2.6,2,3V29c0,0.4,0.1,0.8,0.4,1.2L15.6,16L2.4,1.9z"/>
                                <path fill="#FF3A44" d="M17,17.5L4.3,31c0.2,0,0.4-0.1,0.6-0.2L21.2,22L17,17.5z"/>
                            </g>
                        </svg> 
                        Play Store
                    </a>
                    <a className="android-button">
                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width={22} style={{marginRight:"10px"}}>
                            <circle cx="16" cy="16" r="14" fill="url(#grad)"/>
                            <path d="M18.4468 8.65403C18.7494 8.12586 18.5685 7.45126 18.0428 7.14727C17.5171 6.84328 16.8456 7.02502 16.543 7.55318L16.0153 8.47442L15.4875 7.55318C15.1849 7.02502 14.5134 6.84328 13.9877 7.14727C13.462 7.45126 13.2811 8.12586 13.5837 8.65403L14.748 10.6864L11.0652 17.1149H8.09831C7.49173 17.1149 7 17.6089 7 18.2183C7 18.8277 7.49173 19.3217 8.09831 19.3217H18.4324C18.523 19.0825 18.6184 18.6721 18.5169 18.2949C18.3644 17.7279 17.8 17.1149 16.8542 17.1149H13.5997L18.4468 8.65403Z" fill="white"/>
                            <path d="M11.6364 20.5419C11.449 20.3328 11.0292 19.9987 10.661 19.8888C10.0997 19.7211 9.67413 19.8263 9.45942 19.9179L8.64132 21.346C8.33874 21.8741 8.51963 22.5487 9.04535 22.8527C9.57107 23.1567 10.2425 22.975 10.5451 22.4468L11.6364 20.5419Z" fill="white"/>
                            <path d="M22.2295 19.3217H23.9017C24.5083 19.3217 25 18.8277 25 18.2183C25 17.6089 24.5083 17.1149 23.9017 17.1149H20.9653L17.6575 11.3411C17.4118 11.5757 16.9407 12.175 16.8695 12.8545C16.778 13.728 16.9152 14.4636 17.3271 15.1839C18.7118 17.6056 20.0987 20.0262 21.4854 22.4468C21.788 22.975 22.4594 23.1567 22.9852 22.8527C23.5109 22.5487 23.6918 21.8741 23.3892 21.346L22.2295 19.3217Z" fill="white"/>
                            <defs>
                                <linearGradient id="grad" x1="16" y1="2" x2="16" y2="30">
                                <stop stopColor="#2AC9FA"/>
                                <stop offset="1" stopColor="#1F65EB"/>
                                </linearGradient>
                            </defs>
                        </svg>

                    App Store
                    </a>

                </div>
                <p style={{textAlign:"center",fontSize:"16px",color:"#fff", margin:"10px 0 0"}}>Or</p>
                <InstallButton />


                <p style={{textAlign:"center",fontSize:"16px",color:"#fff", margin:"50px 0 20px"}}>How to download?</p>
            <div style={{display:"flex",justifyContent:"space-around",alignItems:"top"}}>

                <a href={appData.video_link_android} style={{fontSize:"14px",color:"#fff",textDecoration:"underline"}}>
                    For Android click here
                </a>
                <a href={appData.video_link_iphone} style={{fontSize:"14px",color:"#fff",textDecoration:"underline"}}>
                    For Iphone click here
                </a> 
            </div>*/}
        </div>
    );
};

export default Login;
