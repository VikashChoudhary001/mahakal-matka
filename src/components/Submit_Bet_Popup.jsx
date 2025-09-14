import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import { submitGame } from '../repository/GameRepository';
import Warning from '../assets/imgs/warning.png';
import { getAppData } from '../repository/DataRepository';
import { setAppData } from '../store/features/appData/appDataSlice';
import { getMarkets } from '../repository/MarketRepository';


const Submit_Bet_Popup = ({ show, data, onClose, onSubmitted = () => {} }) => {
	const [error, setError] = useState('');
	const dispatch = useDispatch();
    const { appData: initialAppData } = useSelector((state) => state.appData);
    const { user } = initialAppData;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const tabType = searchParams.get('tabType');
    const gameType = searchParams.get('gameType');
    const market_id = searchParams.get('market_id');
    const bidType = searchParams.get('bidType');

    const gameTypeIdMap = {
        "Single Digit": 1,
        "Jodi Digits": 2,
        "Single Pana": 3,
        "Double Pana": 4,
        "Triple Pana": 5,
        "Half Sangam open": 6,
        "Half Sangam close": 7,
        "Full Sangam": 8
    };

    const getGameTypeId = (bidType, type) => {
        if (bidType === "Half Sangam") {
            return type === "open" ? gameTypeIdMap["Half Sangam open"] : gameTypeIdMap["Half Sangam close"];
        }
        return gameTypeIdMap[bidType] || 16;
    };

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [notEnoughPoints, setNotEnoughPoints] = useState(false);

    const totalBids = data.length;
    const totalBidAmount = data.reduce((acc, { value }) => acc + parseInt(value, 10), 0);
    const walletBalanceBefore = user?.balance || 0;
    const walletBalanceAfter = walletBalanceBefore - totalBidAmount;

    const handleSubmit = async () => {
        if (totalBidAmount > walletBalanceBefore) {
            setNotEnoughPoints(true);
            return;
        }

        setLoading(true);
        onClose(); // Close the main popup
        const formattedData = {
            type: "general",
            market_id: market_id,
            games: data.map(({ number, value, pair, type }) => {
                const gameTypeId = getGameTypeId(bidType, type);
                return {
                    number: pair.toString(),
                    amount: parseInt(value, 10),
                    session: type || "null",
                    game_type_id: gameTypeId
                };
            })
        };

        try {
            const response = await submitGame(formattedData);
            if (response.data.error) {
                toast.error(response.data.message);
                console.error('Error submitting bet:', response.data.message);
                setSuccess(false);
            } else {
                const fetchAppDataPromise = getAppData();
                const fetchMarketsPromise = localStorage.getItem('authToken') ? getMarkets('desawar') : Promise.resolve();
                const [appDataResponse, marketsResponse] = await Promise.all([fetchAppDataPromise, fetchMarketsPromise]);
	  
                if (appDataResponse?.data?.error === false) {
                  dispatch(setAppData(appDataResponse.data.response));
                } else {
                  setError(appDataResponse?.data?.message);
                }
                setSuccess(true);
                onSubmitted();
            }
        } catch (error) {
            setLoading(false);
            toast.error('Error submitting bet. Please try again.');
            console.error('Error submitting bet:', error);
        }
        finally{
            setLoading(false);  
        }
    };

    const handleOkayClick = () => {
        if (success) {
            setSuccess(null);
        } else {
            setSuccess(null);
        }
    };

    const handleNotEnoughPointsOkayClick = () => {
        setNotEnoughPoints(false);
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <BeatLoader color={"#fff"} />
                </div>
            )}
            {show && !loading && !notEnoughPoints && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-[#eeeeee] w-full max-w-md mx-4 rounded-lg h-[90vh] overflow-auto">
                        <div className='w-full text-center bg-[#ac407b] p-1'>
                        <h2 className="text-lg text-[#fff] font-normal">{gameType} - {new Date().toLocaleDateString('en-GB')}</h2>
                        </div>
                        <div className='p-2'>
                            <div className="w-full flex justify-between items-center text-center text-[14px] border-none">
                                <p className="py-1 border-none font-semibold">Digit</p>
                                <p className="py-1 border-none font-semibold">Balance</p>
                                <p className="py-1 border-none font-semibold">Type</p>
                            </div>
                            <div className='h-[calc(100vh-420px)] overflow-scroll'>
                                {data.map(({ pair, value, type }, index) => (
                                    <div key={index} className="w-full flex justify-between items-center text-center text-[14px] bg-white my-1 px-1">
                                        <div className="py-2 border-none">{pair}</div>
                                        <div className="py-2 border-none">{value}</div>
                                        <div className="py-2 border-none">{type || "null"}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4 p-2">
                            <div className='flex justify-between items-center w-full bg-[#fff] p-1'>
                                <div className="flex justify-between py-1 gap-2">
                                    <span className='text-[14px] font-semibold'>Total Bids: </span>
                                    <span className='text-[14px]'>{totalBids}</span>
                                </div>
                                <div className="flex justify-between py-2 gap-2">
                                    <span className='text-[14px] font-semibold'>Total Bids Amount: </span>
                                    <span className='text-[14px]'>{totalBidAmount}</span>
                                </div>
                            </div>
                            <div className='w-full bg-[#fff] p-1 mt-1'>
                                <p className='font-semibold'>Balance</p>
                                <div className='flex justify-between items-center'>
                                    <div className="flex justify-between py-2">
                                        <span className='text-[14px] font-semibold'>Before Deduction: </span>
                                        <span className='text-[14px]'>{walletBalanceBefore}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className='text-[14px] font-semibold'>After Deduction: </span>
                                        <span className='text-[14px]'>{walletBalanceAfter}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-red-600 text-center mb-4 text-[14px]">
                            *Note: Bid Once Played cannot be cancelled
                        </div>
                        <div className="flex justify-between p-2">
                            <button className="w-full p-2 bg-red-600 text-white rounded mr-2" onClick={onClose} disabled={loading}>
                                {loading ? 'Cancelling...' : 'Cancel'}
                            </button>
                            <button className="w-full p-2 bg-green-600 text-white rounded ml-2" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Bet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {success !== null && (
                <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-2xl text-center w-[400px] m-auto">
                        {
                            success ?
                                <svg width="60px" height="60px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{margin:"0 auto"}}>
                                    <circle cx="12" cy="12" r="12" fill="green"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="#fff"/>
                                </svg>
                                :
                        <img src={Warning} alt="" className='w-24 h-16 m-auto' />


                        }

                        <h2 className="text-xl mb-4 mt-8">{success ? 'Game successfully added' : 'Error adding game'}</h2>
                        <button className="bg-[#ac407b] text-white px-12 py-2 rounded" onClick={handleOkayClick}>Okay</button>
                    </div>
                </div>
            )}
            {notEnoughPoints && (
                <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-2xl text-center w-[400px] m-auto">
                        <img src={Warning} alt="" className='w-24 h-16 m-auto' />
                        <h2 className="text-xl mb-4 mt-8">You don't have enough points for this bet.</h2>
                        <button className="bg-[#ac407b] text-white px-12 py-2 rounded" onClick={handleNotEnoughPointsOkayClick}>Okay</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Submit_Bet_Popup;
