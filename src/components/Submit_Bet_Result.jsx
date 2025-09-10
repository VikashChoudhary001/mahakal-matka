import React from 'react';

const Submit_Bet_Result = ({ success, onOkayClick }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg text-center">
                <h2 className="text-xl mb-4">{success ? 'Game successfully added' : 'Error adding game'}</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={onOkayClick}>
                    Okay
                </button>
            </div>
        </div>
    );
};

export default Submit_Bet_Result;
