import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppData } from '../store/features/appData/appDataSlice';
import Gold_Coin from '../assets/imgs/coin.png';
import { FaTrash } from 'react-icons/fa';
import Popup from '../components/Submit_Bet_Popup';
import { toast } from 'react-toastify';


const FullSangam = () => {
  const { appData: initialAppData } = useSelector((state) => state.appData);
  const { user } = initialAppData;
  const [inputError, setInputError] = useState({});
  const dispatch = useDispatch();

  const numbers = [
    127, 136, 145, 190, 235, 280, 370, 389, 460, 479, 569, 578, 128, 137, 146, 236, 245, 290, 380, 470, 489, 560, 579,
    678, 129, 138, 147, 156, 237, 246, 345, 390, 480, 570, 589, 679, 120, 139, 148, 157, 238, 247, 256, 346, 490, 580,
    670, 689, 130, 149, 158, 167, 239, 248, 257, 347, 356, 590, 680, 789, 140, 159, 168, 230, 249, 258, 267, 348, 357,
    456, 690, 780, 123, 150, 169, 178, 240, 259, 268, 349, 358, 367, 457, 790, 124, 160, 179, 250, 269, 278, 340, 359,
    368, 458, 467, 890, 125, 134, 170, 189, 260, 279, 350, 369, 378, 459, 468, 567, 126, 135, 180, 234, 270, 289, 360,
    379, 450, 469, 478, 568, 118, 226, 244, 299, 334, 488, 550, 668, 677, 119, 155, 227, 335, 344, 399, 588, 669, 110,
    688, 778, 166, 229, 337, 355, 445, 599, 779, 788, 112, 220, 266, 338, 446, 455, 699, 770, 113, 122, 177, 339, 366,
    447, 799, 889, 114, 277, 330, 448, 466, 556, 880, 899, 115, 133, 188, 223, 377, 449, 557, 566, 116, 224, 233, 288,
    440, 477, 558, 990, 117, 144, 199, 225, 388, 559, 577, 667, 0, 111, 222, 333, 444, 555, 666, 777, 888, 999, 228,
    255, 336, 499, 660
  ];



  const [balance, setBalance] = useState(user?.balance);

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


  const [rows, setRows] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handlePanaInputChange = (e) => {
    const value = e.target.value;
    const id = e.target.id;

    if (value.length <= 3 && /^\d*$/.test(value)) {
      // Convert the entered value to an integer for comparison
      const panaInt = parseInt(value, 10);

      // Check if the entered Pana exists in the numbers array
      if (value.length === 3 && !numbers.includes(panaInt)) {
        setInputError(prevError => ({ ...prevError, [id]: true }));
        toast.error("Invalid Panat.");
      } else {
        setInputError(prevError => ({ ...prevError, [id]: false }));
      }

      // Set the value, ensuring the maximum length of 3 digits
      e.target.value = value;
    } else {
      e.target.value = value.slice(0, 3); // Ensure max length of 3 digits
    }
  };


  const isValidPana = (pana) => {
    if (pana.endsWith('0')) {
      return true;
    }
    for (let i = 0; i < pana.length - 1; i++) {
      if (pana[i] > pana[i + 1]) {
        return false;
      }
    }
    return true;
  };

  const handleAddRow = () => {
    const pana1 = document.getElementById('pana1').value;
    const pana2 = document.getElementById('pana2').value;
    const amount = document.getElementById('amount').value;

    // Convert the entered values to integers for comparison
    const pana1Int = parseInt(pana1, 10);
    const pana2Int = parseInt(pana2, 10);

    // check for minimum bid
    if(initialAppData?.appData?.min_bid_amount && parseInt(amount)<initialAppData?.appData?.min_bid_amount){
      toast.error(`Bid amount cannot be less than ${initialAppData.appData.min_bid_amount}!`);
      return;
    }
    // Check if pana1 and pana2 exist in the numbers array
    if (!numbers.includes(pana1Int) || !numbers.includes(pana2Int)) {
      toast.error("Invalid Pana");
      return;
    }

    if (pana1.length === 3 && pana2.length === 3 && amount && isValidPana(pana1) && isValidPana(pana2)) {
      setRows([...rows, { pana1, pana2, amount }]);
      document.getElementById('pana1').value = '';
      document.getElementById('pana2').value = '';
      document.getElementById('amount').value = '';
    } else {
      alert('Pana is Invalid');
    }
  };


  const handleDeleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

    const handleSubmit = () => {
    if (rows.length === 0) {
        alert('No records to submit.');
        return;
      }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const formattedData = rows.map(row => ({
    pair: row.pana1 +"x"+ row.pana2,
    value: row.amount,
    type: ''  // Assuming 'FullSangam' as a fixed type for this component
  }));

  return (
    <div>
      <div className='w-[92%] rounded-lg text-[22px] p-1 m-auto my-2 text-center bg-[#ac407b] font-semibold text-[#fff] flex justify-center items-center gap-0'>
        <img src={Gold_Coin} alt="Balance" className="w-[25px] h-[25px] object-cover cursor-auto" />
        <p className='text-[16px]'> Balance: {user?.balance}</p>
      </div>

      <div className="flex justify-center py-2 px-1">
        <div className="w-full flex p-1 bg-white rounded-lg shadow-sm">
          <div className="w-full rounded-sm shadow-sm flex justify-center items-center gap-2 px-1">
            <div className="flex flex-col w-full">
              <label className="text-md font-semibold">Pana</label>
              <input
                type="number"
                id="pana1"
                required
                className="w-full p-1 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
                placeholder=""
                onChange={handlePanaInputChange}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-md font-semibold">Pana</label>
              <input
                type="number"
                id="pana2"
                required
                className="w-full p-1 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
                placeholder=""
                onChange={handlePanaInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center bg-blue-gray-100 py-2 mx-auto px-1">
        <div className="w-full bg-white rounded-lg shadow-sm flex justify-center items-center gap-2 p-1 px-2">
          <div className="flex flex-col w-full">
            <label className="text-md font-semibold">Amount</label>
            <input
              type="number"
              id="amount"
              required
              className="w-full p-1 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
              placeholder=""
            />
          </div>
          <div className="w-full relative bg-white rounded-sm shadow-sm">
            <button
              type="button"
              id="submit"
              className="w-full h-[33px] bg-[#ac407b] text-white font-sans font-medium py-1 shadow-sm mt-7 rounded"
              onClick={handleAddRow}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300">
        <div className="text-center">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-[#0098c7] text-[#fff] w-full flex justify-between items-center py-1 text-[13px]">
                <th className="py-2">Open Pana</th>
                <th className="py-2">Close Pana</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Del</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="w-full flex justify-between items-center py-2 px-2 text-md">
                  <td className="py-1 bg-[#ff2d2d] border-none text-[#fff]">{row.pana1}</td>
                  <td className="py-1 bg-[#4deb4b] border-none text-[#fff]">{row.pana2}</td>
                  <td className="py-1 bg-[#a83dbf] border-none text-[#fff]">{row.amount}</td>
                  <td className="py-1 border-none bg-[#fff]">
                    <button onClick={() => handleDeleteRow(index)}>
                      <FaTrash color="#ff2d2d" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='max-w-[400px] m-auto mt-4 fixed bottom-0 left-0 right-0 p-4'>
        <button className='w-full p-3 bg-[#ac407b] text-white rounded' onClick={handleSubmit}>Submit</button>
      </div>
      <Popup show={showPopup} data={formattedData} onClose={closePopup} onSubmitted={()=>{
        setRows([])
      }}/>
    </div>
  );
};

export default FullSangam;
