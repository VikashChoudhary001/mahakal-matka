import Repository from "./Repository";

function sendLoginOtp(payload) {
    return Repository.post(`/send-login-otp?phone=${payload?.phone}${payload?.promo_type ? `&promo_type=${payload?.promo_type}` : ''}${payload?.otp_asked ? `&otp_asked=${payload?.otp_asked}` : ''}`)
}
function verifyLoginOtp(payload) {
    return Repository.post(`/verify-login-otp?phone=${payload?.phone}&otp=${payload?.otp}${payload?.referralCode ? `&referral_code=${payload?.referralCode}` : ''}${payload?.mpin ? `&mpin=${payload?.mpin}` : ''}`)
}
function verifyLoginMPin(payload) {
    return Repository.post(`/verify-login-mpin?phone=${payload?.phone}&mpin=${payload?.mpin}`)
}
function updateProfile(payload) {
    return Repository.post(`/update-profile?name=${payload?.name}&general_noti=${payload?.general_noti ? 1 : 0}${payload?.mpin ? `&mpin=${payload?.mpin}` : ''}`)
}

function logout() {
    return Repository.post(`/logout`)
}

export {
    sendLoginOtp,
    verifyLoginOtp,
    verifyLoginMPin,
    updateProfile,
    logout
};
