import Repository from "./Repository";

function withdrawBalance(payload) {
	let queryStringArray = [];
	if (payload.mode === 'upi') {
		queryStringArray.push(`upi_name=${payload.upiName}`);
		queryStringArray.push(`upi_id=${payload.upiId}`);
	} else if (payload.mode === 'bank') {
		queryStringArray.push(`bank_name=${payload.bankName}`);
		queryStringArray.push(
			`account_holder_name=${payload.accountHolderName}`
		);
		queryStringArray.push(`account_number=${payload.accountNumber}`);
		queryStringArray.push(`account_ifsc_code=${payload.accountIFSCCode}`);
	}
	let stringWithPayload = queryStringArray.join('&');
	return Repository.post(
		`/withdraw-balance?amount=${payload.amount}&withdraw_mode=${payload.mode}&${stringWithPayload}`
	);
}

function depositBalance(payload) {
	return Repository.post(
		`/upi-payment-url?amount=${payload.amount}`
	);
}

function depositBalancePayFromUpi(payload) {
	return Repository.post(
		`/pay-from-upi-payment-url?amount=${payload.amount}`
	);
}

function depositBalanceQRCode(payload) {
	return Repository.post(
		`/i-online-pay-upi-payment-url?amount=${payload.amount}`
	);
}

function depositBalancePaymentKaro(payload) {
	return Repository.post(
		`/payment-karo-payment-url?amount=${payload.amount}`
	);
}

function transferBalance(payload) {
	return Repository.post(
		`/transfer-balance?amount=${payload.amount}&phone=${payload.phone}`
	);
}

function getUserBalance(payload) {
	return Repository.get(`/get-user-balance`);
}
function getReferralDetails(payload) {
	return Repository.get(`/get-referral-details`);
}


export {
	withdrawBalance,
	transferBalance,
	getUserBalance,
	depositBalance,
	depositBalanceQRCode,
	depositBalancePaymentKaro,
	getReferralDetails,
	depositBalancePayFromUpi

};
