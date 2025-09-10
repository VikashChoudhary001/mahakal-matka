import axios from "axios";
const BASE_URL = "https://api.mahakalmatka.com/api";

const getAuthorizationToken = () => {
	let authToken = localStorage.getItem("authToken");
	if (authToken) {
		return `Bearer ${authToken}`;
	}
	return '';
}

const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		Accept: 'application/json',
		Authorization: getAuthorizationToken(),
		request_type: 'web_app',
	},
});

export default apiClient; 