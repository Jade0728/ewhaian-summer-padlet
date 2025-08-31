import axios from "axios";

const api = axios.create({
    baseURL: "/api/login",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
    //브라우저에서 쿠키나 인증 정보를 자동으로 포함시킬지 여부
    //true로 하면 쿠키를 자동으로 함께 전송
});

export const logoutAPI = async () => {
    try {
        const { data } = await api.post("/logout");
        return data;
    } catch (err) {
        throw err.response?.data || err;
    }
}