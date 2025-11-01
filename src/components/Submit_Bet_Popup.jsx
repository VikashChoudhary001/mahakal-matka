import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import { submitGame } from '../repository/GameRepository';
import Warning from '../assets/imgs/warning.png';
import { setAuthDataUsersSingleValue } from '../store/features/appData/appDataSlice';


const Submit_Bet_Popup = ({ show, data, onClose, onSubmitted = () => { } }) => {
    const dispatch = useDispatch();
    const { appData: initialAppData } = useSelector((state) => state.appData);
    const { user } = initialAppData;
    const [searchParams] = useSearchParams();

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
    const [showTelegram, setShowTelegram] = useState(false);
    const [apiMessage, setApiMessage] = useState('');

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
            games: data.map(({ number, value, pair, type, gameTypeId }) => {
                const finalGameTypeId = gameTypeId || getGameTypeId(bidType, type);
                return {
                    number: pair.toString().replace('x', ''),
                    amount: parseInt(value, 10),
                    session: type || "null",
                    game_type_id: finalGameTypeId
                };
            })
        };

        try {
            const response = await submitGame(formattedData);
            if (response.data.error) {
                toast.error(response.data.message);
                console.error('Error submitting bet:', response.data.message);
                setApiMessage(response.data.message || 'Error adding game');
                setSuccess(false);
            } else {
                // Store API message
                setApiMessage(response.data.message || 'Game successfully added');

                // Update balance from API response
                const newBalance = response.data.response.balance_left;
                if (newBalance !== undefined) {
                    dispatch(setAuthDataUsersSingleValue({ key: 'balance', value: newBalance }));
                }

                // Check if we should show Telegram join button
                const hasJoinedTelegram = localStorage.getItem('hasJoinedTelegram') === 'true';
                const telegramLink = initialAppData?.appData?.telegram_link;
                const shouldShowTelegram = response.data.response.showTelegram === 1 || response.data.response.showTelegram === true;

                if (shouldShowTelegram && !hasJoinedTelegram && telegramLink) {
                    setShowTelegram(true);
                } else {
                    setShowTelegram(false);
                }

                setSuccess(true);
                onSubmitted();
            }
        } catch (error) {
            setLoading(false);
            setApiMessage('Error submitting bet. Please try again.');
            setSuccess(false);
            toast.error('Error submitting bet. Please try again.');
            console.error('Error submitting bet:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleOkayClick = () => {
        setSuccess(null);
        setApiMessage('');
    };

    const handleNotEnoughPointsOkayClick = () => {
        setNotEnoughPoints(false);
    };

    const handleJoinTelegram = () => {
        const telegramLink = initialAppData?.appData?.telegram_link;
        if (telegramLink) {
            // Open Telegram link in new window
            window.open(telegramLink, '_blank');
            // Mark as joined so we never show this again
            localStorage.setItem('hasJoinedTelegram', 'true');
            setShowTelegram(false);
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <BeatLoader color={"#fff"} />
                </div>
            )}
            {show && !loading && !notEnoughPoints && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-[#eeeeee] w-full max-w-md mx-4 rounded-lg h-[90vh] overflow-auto">
                        <div className='w-full text-center bg-primary p-1'>
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
                <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
                    <div className="bg-white p-6 rounded-2xl text-center w-full max-w-[400px]">
                        {
                            success ?
                                <svg width="60px" height="60px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ margin: "0 auto" }}>
                                    <circle cx="12" cy="12" r="12" fill="green" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="#fff" />
                                </svg>
                                :
                                <img src={Warning} alt="" className='w-24 h-16 m-auto' />


                        }

                        <h2 className="text-xl mb-4 mt-8">{apiMessage || 'Message not received'}</h2>

                        {success && showTelegram && initialAppData?.appData?.telegram_link && (
                            <div className="my-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-gray-700 mb-3">
                                    Join our Telegram channel for exclusive updates, tips, and winning strategies!
                                </p>
                                <button
                                    className="bg-[#0088cc] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#006ba3] transition-colors flex items-center justify-center gap-2 w-full"
                                    onClick={handleJoinTelegram}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.52-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.65-2.89 7.98-3.46 3.8-1.65 4.59-1.94 5.11-1.95.11 0 .37.03.54.17.14.12.18.28.2.41-.01.06.01.24 0 .38z" />
                                    </svg>
                                    Join Telegram Channel
                                </button>
                            </div>
                        )}

                        <button className="bg-[#e4ae39] text-white px-12 py-2 rounded" onClick={handleOkayClick}>Okay</button>
                    </div>
                </div>
            )}
            {notEnoughPoints && (
                <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
                    <div className="bg-white p-6 rounded-2xl text-center w-full max-w-[400px]">
                        <img src={Warning} alt="" className='w-24 h-16 m-auto' />
                        <h2 className="text-xl mb-4 mt-8">You don't have enough points for this bet.</h2>
                        <button className="bg-[#e4ae39] text-white px-12 py-2 rounded" onClick={handleNotEnoughPointsOkayClick}>Okay</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Submit_Bet_Popup;
