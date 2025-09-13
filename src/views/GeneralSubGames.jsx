import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import p_fs from '../assets/imgs/p_fs.png';
import p_dp from '../assets/imgs/p_dp.png';
import p_hs from '../assets/imgs/p_hs.png';
import p_j from '../assets/imgs/p_j.png';
import p_sa from '../assets/imgs/p_sa.png';
import p_sp from '../assets/imgs/p_sp.png';
import p_tp from '../assets/imgs/p_tp.png';
import { toast } from 'react-toastify';

const gameTypes = [
    { name: 'Single Digits', path: '/general-sub-games/single-digits', card_img:p_sa },
    { name: 'Jodi Digits', path: '/general-sub-games/jodi-digits', card_img:p_j,openGame:true},
    { name: 'Single Pana', path: '/general-sub-games/single-pana', card_img:p_sp },
    { name: 'Double Pana', path: '/general-sub-games/double-pana', card_img:p_dp }, 
    { name: 'Triple Pana', path: '/general-sub-games/tripal-pana' , card_img:p_tp},
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
         if(game?.openGame && !marketClose && !marketOpen){
            toast.error(game?.name + "Open game is not open at the moment!");
            e.preventDefault();                
         }
    };
 
    return (
        <div>
            <div className="grid grid-cols-2 p-3 px-4">
                {gameTypes.map((game, index) => (
                    <Link 
                      key={index} 
                      to={{
                        pathname: game.path,
                        search: `?gameType=${gameType}&tabType=${tabType}&market_id=${market_id}&bidType=${game.name}`
                      }}
                      onClick={(e)=>checkGameAvailability(e,game)}
                      className="flex flex-col items-center p-3 py-3 "
                    >
                        <img src={game.card_img} alt={game.name} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default GeneralSubGames;
