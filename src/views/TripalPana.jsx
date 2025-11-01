import React, { useState } from 'react';
import GameHeader from '../components/GameHeader';
import Popup from '../components/Submit_Bet_Popup';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

// Function to check if all three digits of a number are the same
const isTriplePana = (num) => {
  const firstDigit = Math.floor(num / 100);
  const secondDigit = Math.floor((num / 10) % 10);
  const thirdDigit = num % 10;

  return firstDigit === secondDigit && secondDigit === thirdDigit;
};

const TriplePana = () => {
  const [selectedOption, setSelectedOption] = useState('close');
  const [inputValues, setInputValues] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  let { appData } = useSelector(
    (state) => state.appData
  );
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Handle input change to allow multiple digits and numeric values
  const handleInputChange = (e, key) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allows only numeric values
      setInputValues(prevValues => ({ ...prevValues, [key]: value }));
    }
  };

  const _checkMinBid = (minBid, allbids) => {
    let check = allbids?.find((bid) => parseInt(bid?.value) < minBid)
    return check !== undefined;
  }

  const handleSubmit = () => {

    if (dataToShow.length === 0) {
      toast.error('No records to submit.');
      return;
    }
    else if (appData?.appData?.min_bid_amount && dataToShow?.length > 0 && _checkMinBid(appData.appData.min_bid_amount, dataToShow)) {
      toast.error(`Bid amount cannot be less than ${appData.appData.min_bid_amount}!`);
      return;
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Filter for triple pana numbers
  const triplePanaPairs = Array.from({ length: 1000 }, (_, index) => index)
    .filter(isTriplePana)
    .map(pair => pair.toString().padStart(3, '0'));

  // Prepare data to show in the popup, excluding pairs with empty values
  const dataToShow = triplePanaPairs
    .map(pair => ({
      pair,
      value: inputValues[pair] || 'N/A',
      type: selectedOption
    }))
    .filter(item => item.value !== 'N/A');

  const totalBids = dataToShow.length;
  const totalPoints = dataToShow.reduce((sum, item) => sum + parseInt(item.value || 0), 0);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-grow">
        <GameHeader dropdown={true} selectedOption={selectedOption} onSelectChange={handleSelectChange} />
        <div className='grid grid-cols-2 gap-4 w-[92%] m-auto mt-24 '>
          {triplePanaPairs.map((pair) => (
            <div key={pair} className='flex items-center justify-start'>
              <div className='text-[20px] font-semibold bg-[#e4ae39] w-[50px] h-[40px] flex justify-center items-center text-[#fff] shadow-lg'>{pair}</div>
              <input
                type="number"
                className='border p-2 text-[14px] w-full border-none bg-slate-200 h-[40px] text-center outline-none'
                maxLength="3"
                placeholder="Enter Amount"
                onChange={(e) => handleInputChange(e, pair)}
                value={inputValues[pair] || ''}
              />
            </div>
          ))}
          <br /><br /><br />
        </div>
      </div>

      {/* Bottom Summary and Continue Button */}
      <div className='w-[480px] max-w-full mx-auto fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-10'>
        <div className='px-4 py-3'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm text-gray-600'>
              <span className='font-bold text-gray-800'>{totalBids}</span> Bids
            </span>
            <span className='text-sm text-gray-600'>
              <span className='font-bold text-gray-800'>{totalPoints}</span> Points
            </span>
          </div>
          <button
            className='w-full p-2.5 bg-[#e4ae39] text-white rounded font-semibold shadow hover:bg-[#d49d2d] transition-colors'
            onClick={handleSubmit}
          >
            Continue
          </button>
        </div>
      </div>

      <Popup show={showPopup} data={dataToShow} onClose={closePopup} onSubmitted={() => {
        setInputValues({})
      }} />
    </div>
  );
}

export default TriplePana;
