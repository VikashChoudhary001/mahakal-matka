import React, { useState } from 'react';
import GameHeader from '../components/GameHeader';
import Popup from '../components/Submit_Bet_Popup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


const filterSinglePanaByRemainder = (remainder) => {
  return Array.from({ length: 900 }, (_, index) => index + 100)
    .filter(num => {
      const digits = num.toString().split('').map(Number);
      const sumOfDigits = digits.reduce((acc, curr) => acc + curr, 0);
      const isAscending = digits[2] === 0
        ? digits[0] <= digits[1]
        : digits[0] <= digits[1] && digits[1] <= digits[2];
      const allDigitsUnique = new Set(digits).size === digits.length;
      return sumOfDigits % 10 === remainder && isAscending && allDigitsUnique;
    })
    .map(num => num.toString());
};

const SinglePana = () => {
  const [selectedOption, setSelectedOption] = useState('close');
  const [inputValues, setInputValues] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  let { appData } = useSelector(
    (state) => state.appData
  );
  // Handle input change to allow multiple digits and numeric values
  const handleInputChange = (e, key) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allows only numeric values
      setInputValues(prevValues => ({ ...prevValues, [key]: value }));
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
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

  // Prepare data to show in the popup, excluding pairs with empty values
  const dataToShow = [...Array(10).keys()]
    .flatMap(remainder =>
      filterSinglePanaByRemainder(remainder).map(pair => ({
        pair,
        value: inputValues[`${remainder}-${pair}`] || 'N/A',
        type: selectedOption
      }))
    )
    .filter(item => item.value !== 'N/A');

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-grow">
        <GameHeader dropdown={true} selectedOption={selectedOption} onSelectChange={handleSelectChange} />
        <div className='w-[100%] m-auto h-[full] mt-20 shadow-inner p-2'>
          {[...Array(10).keys()].map(remainder => (
            <div key={remainder}>
              <div className='border-t border-black/30 shadow-md py-1 text-center my-4 ml-4 text-black'>{remainder}</div>
              <div className='grid grid-cols-2 gap-4 w-[92%] m-auto'>
                {filterSinglePanaByRemainder(remainder).map(pair => (
                  <div key={pair} className='flex items-center justify-start'>
                    <div className='text-[18px] font-semibold bg-[#e4ae39] w-[50px] h-[40px] flex justify-center items-center text-[#fff]'>{pair}</div>
                    <input
                      type="number"
                      className='border p-2 text-[14px] w-full border-none bg-slate-200 h-[40px] text-center outline-none'
                      maxLength="6"
                      placeholder="Enter number"
                      onChange={(e) => handleInputChange(e, `${remainder}-${pair}`)}
                      value={inputValues[`${remainder}-${pair}`] || ''}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <br /><br /><br /><br />
        </div>
      </div>
      <div className='max-w-[400px] m-auto mt-4 fixed bottom-0 left-0 right-0 p-4'>
        <button className='w-full p-3 bg-[#e4ae39] text-white rounded' onClick={handleSubmit}>Submit</button>
      </div>
      <Popup show={showPopup} data={dataToShow} onClose={closePopup} onSubmitted={() => {
        setInputValues({});
      }} />
    </div>
  );
}

export default SinglePana;
