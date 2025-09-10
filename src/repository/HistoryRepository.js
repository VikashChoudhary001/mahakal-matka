import Repository from "./Repository";

function getDepositHistory(payload) {
	return Repository.post(`/get-deposit-history?page=${payload.page}`);
}

function getWithdrawalHistory(payload) {
	return Repository.post(`/get-withdrawl-history?page=${payload.page}`);
}

function getGameHistory(payload) {
	return Repository.post(
		`/get-game-history?type=desawar&page=${payload.page}&date=${payload.date}&market_id=${payload.marketId}`
	);
}

function getKalyanGameHistory({ page, date, marketId, type, session, status, gameTypeId }) {
	let query = `/get-game-history?page=${page}`;
  
	if (type && type !== "all") query += `&type=${type}`;
	if (date) query += `&date=${date}`;
	if (marketId && marketId !== "all") query += `&market_id=${marketId}`;
	if (session && session !== "all") query += `&session=${session}`;
	if (status && status !== "0") query += `&status=${status}`;
	if (gameTypeId && gameTypeId !== "all") query += `&game_type_id=${gameTypeId}`;
  
	return Repository.post(query);
  }
  

export { getDepositHistory, getWithdrawalHistory, getGameHistory, getKalyanGameHistory };
