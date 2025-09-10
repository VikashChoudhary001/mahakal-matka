import Repository from "./Repository";

function getMarkets(type) {
  return Repository.post(`/get-markets?type=${type}`);
}

export { getMarkets };
