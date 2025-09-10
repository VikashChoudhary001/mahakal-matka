import Repository from "./Repository";

function getGameRate(type){
    return Repository.get(`/get-game-rates`)
}

export {
    getGameRate
};
