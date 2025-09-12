import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppData } from '../store/features/appData/appDataSlice';
import Gold_Coin from '../assets/imgs/coin.png';
import Calendar from '../assets/imgs/calendar.png';
import { useSearchParams } from 'react-router-dom';


const GameHeader = ({ dropdown, selectedOption, onSelectChange }) => {
  const { appData: initialAppData } = useSelector((state) => state.appData);
  const { markets } = useSelector(state => state.markets);
  const { user } = initialAppData;
  const [currentMarket, setCurrentMarket] = useState(null);
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const [balance, setBalance] = useState(user?.balance);


  useEffect(() => {
    const isMarketLoaded = Object.keys(markets).includes('general');
    if (isMarketLoaded) {
      setCurrentMarket(markets['general'].markets.find(market => market.id == searchParams.get('market_id')))
    }
  }, [markets]);

  useEffect(() => {
    const isOpenExist = currentMarket?.open_game_status;
    const isCloseExist = currentMarket?.close_game_status;
    onSelectChange({
      target: { value: isOpenExist ? 'open' : isCloseExist ? 'close' : null }
    })
  }, [currentMarket])

  useEffect(() => {
    if (!balance) {
      dispatch(fetchAppData())
        .then((response) => {
          const { appData } = response.payload;
          setBalance(appData?.user?.balance);
        })
        .catch((error) => {
          console.error("Error fetching app data: ", error);
        });
    }
  }, [dispatch, balance]);


  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('default', { month: 'short' });
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  return (
    <div className='pt-2 bg-[#f2fafc] fixed top-[45px] left-0 right-0 w-[480px] max-w-full mx-auto'>
    
      <div className='w-[92%] rounded-lg text-[22px] p-1 m-auto my-0 text-center bg-[#ac407b] font-semibold text-[#fff] flex justify-center items-center gap-0'>
        <img src={Gold_Coin} alt="Balance" className="w-[25px] h-[25px] object-cover cursor-auto " />
        <p className='text-[16px]'> Balance: {user?.balance}</p>
      </div>

      <div className='w-[92%] rounded-lg text-[22px] px-2 m-auto mb-2 text-center font-semibold text-[#ac407b] flex justify-center items-center gap-0'>
        <img src={Calendar} alt="Date" className="w-[25px] h-[25px] object-cover cursor-pointer" />
        <p className='text-[18px]'>{formattedDate}</p>

        {dropdown && (
          <div className="w-[100px] p-1 m-auto">
            <select className="w-[100px] border text-[14px] font-medium rounded py-1" value={selectedOption} onChange={onSelectChange}>
              {currentMarket?.open_game_status && <option value="open" className='text-[12px] font-thin'>Open</option>}
              {currentMarket?.close_game_status && <option value="close" className='text-[12px] font-thin'>Close</option>}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameHeader;
