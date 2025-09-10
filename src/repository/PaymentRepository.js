import Repository from "./Repository";

function ibrPayUPIPaymentUrl(payload) {
  return Repository.post(
    `/ibr-pay-upi-payment-url?amount=${payload.amount}`
  );
}

function upiPaymentUrl(payload) {
  return Repository.post(
    `/upi-payment-url?amount=${payload.amount}`
  );
}

export { ibrPayUPIPaymentUrl, upiPaymentUrl };
