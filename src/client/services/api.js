import axios from "axios";

// One axios instance so every service uses the same base URL
const api = axios.create({ baseURL: "/api" });

export default api;
