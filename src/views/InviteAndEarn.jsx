import { useEffect, useState } from "react"
import { getReferralDetails } from "../repository/BalanceRepository"
import { useSelector } from "react-redux";
import NoDataFoundImage from "../assets/imgs/noDataFound.png";
import copySVG from "../assets/imgs/copy-svgrepo-com.svg";
import { toast } from "react-toastify";

export default function InviteAndEarn() {
    const [referralData, setReferralData] = useState([])
    const [loading, setLoading] = useState(false)
     let { appData, user } = useSelector((state) => state.appData.appData);
    useEffect(() => {
        fetchReferralData()
    },[])

    const fetchReferralData = async () => {
        setLoading(true)
        let res = await getReferralDetails();
        if(res?.data?.error === false){
            setReferralData(res?.data?.response?.referralDetails||{})
        }
        setLoading(false)
    }
    const copyText = async(text)=>{
         if (navigator.clipboard) {
            try {
              await navigator.clipboard.writeText(text);
              toast?.success("Copied to clipboard");
            } catch (error) {
                toast?.error("Failed to copy to clipboard");
            }
          } else {
            toast?.error("Clipboard API not supported");
          }
    }
  return (
    <div className="p-2">
        <div className="text-center font-semibold py-1 text-[14px] mt-1 mb-3">
            {`${appData?.invite_percentage_bet}% Bet कमीशन पाएं Invite करके।`}
        </div>
        <div className="p-3 shadow-lg border border-black/10">
            <div className="flex">
                <div className="w-[50%] border-r border-r-black/40 py-2">
                    <div className="text-center text-[14px] px-2 mb-1 ">
                        <span className="font-bold">Today's Commission</span>
                    </div>
                    <div className="text-center text-[14px] px-2 ">
                        <span className="text-green-600 font-semibold">₹{referralData?.commission_earned_today}</span>
                    </div>
                </div>
                <div className="w-[50%] py-2">
                    <div className="text-center text-[14px] px-2 mb-1">
                        <span className="font-bold">Total Commission</span>
                    </div>
                    <div className="text-center text-[14px] px-2 ">
                        <span className="text-green-600 font-semibold">₹{referralData?.commission_earned_total}</span>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="w-[50%] border-r border-r-black/40 py-2 ">
                    <div className="text-center text-[14px] px-2 mb-1 ">
                        <span className="font-bold">My Refferal Code</span>
                    </div>
                    <div className="text-center text-[14px] px-2 flex items-center justify-center gap-2 ">
                        <span className="">{referralData?.own_code ||"N/A"}</span>
                         <img className="cursor-pointer" src={copySVG} alt="copy" width={15} onClick={()=>copyText(referralData?.own_code)} />
                    </div>
                </div>
                <div className="w-[50%] py-2">
                    <div className="text-center text-[14px] px-2 mb-1">
                        <span className="font-bold">Total Invites</span>
                    </div>
                    <div className="text-center text-[14px] px-2 ">
                        <span className="">{referralData?.total_invited_count ||"N/A"}</span>
                    </div>
                </div>
            </div>
            
        </div>

        <div className="py-3 pb-8">
            <h4 className="text-center text-lg font-bold mb-2 mt-3">Invited Users</h4>
            <table border={1} className="w-full">
                <thead>
                    <tr className="flex w-full">
                        <th className="w-1/3 border-black/50 p-1 text-[14px]">Name</th>
                        <th className="w-1/3 border-black/50 p-1 text-[14px]">Today's Commission</th>
                        <th className="w-1/3 border-black/50 p-1 text-[14px]">Total Commission</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loading ?
                        <tr>
                            <td className="w-full">
                                <div className="flex justify-center w-full p-4">
                                    <div className="grid w-full place-items-center overflow-x-scroll rounded-lg lg:overflow-visible">
                                        <svg
                                        className="text-gray-300 animate-spin"
                                        viewBox="0 0 64 64"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        >
                                        <path
                                            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                                            stroke="currentColor"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        ></path>
                                        <path
                                            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                                            stroke="currentColor"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-gray-600"
                                        ></path>
                                        </svg>
                                    </div>
                                </div>
                            </td>
                        </tr> 
                        :referralData?.invited_users?.length > 0 ?  
                        referralData?.invited_users?.map((user, index) => 
                            <tr key={index} className="w-full flex">
                                <td className="w-1/3 text-center border-black/50 p-1 text-[14px]">{user?.name || "N/A"}</td>
                                <td className="w-1/3 text-center border-black/50 p-1 text-[14px]">₹{user?.commission_earned_from_them_today||0}</td>
                                <td className="w-1/3 text-center border-black/50 p-1 text-[14px]">₹{user?.commission_earned_from_them_total||0}</td>
                            </tr>
                        ):
                        <tr>
                            <td className="w-full">
                                <div className="w-full flex py-4 flex-col items-center gap-2">
                                    <img src={NoDataFoundImage} width={100} alt="" />
                                    <p className="text-gray-400 font-bold text-sm">No Data Found</p>
                                </div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>

    </div>
  )
}
