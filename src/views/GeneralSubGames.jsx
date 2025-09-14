import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import p_fs from '../assets/imgs/ic_choicepana.webp';
import doublePannaImg from '../assets/imgs/ic_choicepana.webp';
import p_hs from '../assets/imgs/ic_choicepana.webp';
import jodiDigitImg from '../assets/imgs/ic_jodidigits.webp';
import singleDigitImg from '../assets/imgs/signle_digit.PNG';
import singlePannaImg from '../assets/imgs/single_pana.webp';
import triplePannaImg from '../assets/imgs/ic_triplepana.webp';
import { toast } from 'react-toastify';

const gameTypes = [
    { name: 'Single Digit', path: '/general-sub-games/single-digits', card_img:singleDigitImg },
    { name: 'Jodi Digits', path: '/general-sub-games/jodi-digits', card_img:jodiDigitImg,openGame:true},
    { name: 'Single Pana', path: '/general-sub-games/single-pana', card_img:singlePannaImg },
    { name: 'Double Pana', path: '/general-sub-games/double-pana', card_img:doublePannaImg }, 
    { name: 'Triple Pana', path: '/general-sub-games/tripal-pana' , card_img:triplePannaImg},
    { name: 'Half Sangam', path: '/general-sub-games/half-sangam', card_img:p_hs,openGame:true},
    { name: 'Full Sangam', path: '/general-sub-games/full-sangam', card_img:p_fs,openGame:true},
];

const GeneralSubGames = () => {
    const [searchParams] = useSearchParams();
    const tabType = searchParams.get('tabType');
    const gameType = searchParams.get('gameType');
    const market_id = searchParams.get('market_id');
    const marketClose = searchParams.get('close');
    const marketOpen = searchParams.get('open');

    const checkGameAvailability = (e,game) => { 
        if(game?.openGame && (!(marketClose=="true") || !(marketOpen=="true"))){
            toast.error(game?.name + "Open game is not open at the moment!");
            e.preventDefault();                
        }
    };
 
    return (
        <div>
            <div className="grid grid-cols-2 p-3 px-4">
                {gameTypes.map((game, index) => (
                    <div className='p-2'>
                        <Link 
                        key={index} 
                        to={{
                            pathname: game.path,
                            search: `?gameType=${gameType}&tabType=${tabType}&market_id=${market_id}&bidType=${game.name}`
                        }}
                        onClick={(e)=>checkGameAvailability(e,game)}
                        className="flex flex-col items-center p-3 gap-3 bg-white shadow-lg rounded-lg"
                        >
                            <div className='mx-auto w-[70%] min-w-[50px] pb-5 mb-3 overflow-hidden border-b-2 border-[#ffd500]'>
                                <img src={game.card_img} alt={game.name} className='w-full block' />
                            </div>
                            <span className='textcenter font-semibold text-sm mb-2'>{game.name}</span>
                        </Link>
                    </div>
                ))}
            </div>
                <br />
                <br />
                <br />
        </div>
    );
};

export default GeneralSubGames;
