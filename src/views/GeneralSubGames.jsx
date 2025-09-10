import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import p_fs from '../assets/imgs/p_fs.png';
import p_dp from '../assets/imgs/p_dp.png';
import p_hs from '../assets/imgs/p_hs.png';
import p_j from '../assets/imgs/p_j.png';
import p_sa from '../assets/imgs/p_sa.png';
import p_sp from '../assets/imgs/p_sp.png';
import p_tp from '../assets/imgs/p_tp.png';

const gameTypes = [
    { name: 'Single Digits', path: '/general-sub-games/single-digits', card_img:p_sa },
    { name: 'Jodi Digits', path: '/general-sub-games/jodi-digits', card_img:p_j},
    { name: 'Single Pana', path: '/general-sub-games/single-pana', card_img:p_sp },
    { name: 'Double Pana', path: '/general-sub-games/double-pana', card_img:p_dp }, 
    { name: 'Tripal Pana', path: '/general-sub-games/tripal-pana' , card_img:p_tp},
    { name: 'Half Sangam', path: '/general-sub-games/half-sangam', card_img:p_hs },
    { name: 'Full Sangam', path: '/general-sub-games/full-sangam', card_img:p_fs },
];

const GeneralSubGames = () => {
    const [searchParams] = useSearchParams();
    const tabType = searchParams.get('tabType');
    const gameType = searchParams.get('gameType');
    const market_id = searchParams.get('market_id');
 
    return (
        <div>
            <div className="grid grid-cols-3 p-3">
                {gameTypes.map((game, index) => (
                    <Link 
                      key={index} 
                      to={{
                        pathname: game.path,
                        search: `?gameType=${gameType}&tabType=${tabType}&market_id=${market_id}&bidType=${game.name}`
                      }}
                      className="flex flex-col items-center p-2 py-3 "
                    >
                        <img src={game.card_img} alt={game.name} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default GeneralSubGames;
