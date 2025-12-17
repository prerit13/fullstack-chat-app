import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://fullstack-chat-app-k3w6.onrender.com/api",
    withCredentials: true,
});