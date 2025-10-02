import Repository from "./Repository";

function sendLoginOtp(payload) {
    return Repository.post(`/send-login-otp?phone=${payload?.phone}`)
}
function verifyLoginOtp(payload) {
    return Repository.post(`/verify-login-otp?phone=${payload?.phone}&otp=${payload?.otp}${payload?.referralCode ? `&referral_code=${payload?.referralCode}` : ''}`)
}
function updateProfile(payload) {
    return Repository.post(`/update-profile?name=${payload?.name}&general_noti=${payload?.general_noti ? 1 : 0}`)
}

function logout() {
    return Repository.post(`/logout`)
}

export {
    sendLoginOtp,
    verifyLoginOtp,
    updateProfile,
    logout
};
