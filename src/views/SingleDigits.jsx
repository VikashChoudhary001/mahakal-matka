import React, { useState } from 'react';
import GameHeader from '../components/GameHeader';
import Popup from '../components/Submit_Bet_Popup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const SingleDigits = () => {
  const [selectedOption, setSelectedOption] = useState('close');
  const [inputValues, setInputValues] = useState(Array(10).fill(''));
  const [showPopup, setShowPopup] = useState(false);

  let { appData } = useSelector(
    (state) => state.appData
  );

  const digitPairs = Array.from({ length: 10 }, (_, index) => index);

  // Handle input change to allow multiple digits and numeric values
  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allows only numeric values
      const newValues = [...inputValues];
      newValues[index] = value;
      setInputValues(newValues);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

    const _checkMinBid=(minBid,allbids)=>{
      let check = allbids?.find((bid)=>parseInt(bid?.value)<minBid)
      return check !==undefined;
    }
  
    const handleSubmit = () => {
      
      if (dataToShow.length === 0) {
          alert('No records to submit.');
          return;
        }
      else if(appData?.appData?.min_bid_amount && dataToShow?.length>0 && _checkMinBid(appData.appData.min_bid_amount,dataToShow)){
          toast.error(`Bid amount cannot be less than ${appData.appData.min_bid_amount}!`);
          return;
      }
      setShowPopup(true);
    };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Filter out pairs with empty values
  const dataToShow = digitPairs
    .map((pair, index) => ({
      pair,
      value: inputValues[index] || 'N/A',
      type: selectedOption
    }))
    .filter(item => item.value !== 'N/A');

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-grow">
        <GameHeader dropdown={true} selectedOption={selectedOption} onSelectChange={handleSelectChange} />
        <div className='grid grid-cols-2 gap-4 w-[92%] mx-auto mt-24'>
          {digitPairs.map((pair, index) => (
            <div key={pair} className='flex items-center justify-start'>
              <div className='text-[20px] font-semibold bg-[#ac407b] w-[50px] h-[40px] flex justify-center items-center text-[#fff]'>{pair}</div>
              <input
                type="number"
                className='border p-2 text-[14px] w-full border-none bg-slate-200 h-[40px] text-center outline-none'
                maxLength="10"
                placeholder="Enter number"
                onChange={(e) => handleInputChange(e, index)}
                value={inputValues[index]}
              />
            </div>
          ))}
          <br /><br /><br /><br />
        </div>
      </div>
      <div className='max-w-[400px] m-auto mt-4 fixed bottom-0 left-0 right-0 p-4'>
        <button className='w-full p-3 bg-[#ac407b] text-white rounded' onClick={handleSubmit}>Submit</button>
      </div>
      <Popup show={showPopup} data={dataToShow} onClose={closePopup} onSubmitted={()=>setInputValues(new Array(10).fill(''))}/>
    </div>
  );
}

export default SingleDigits;
