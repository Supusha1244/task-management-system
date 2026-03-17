import axios from "axios";

const API = axios.create({
  baseURL: "https://task-management-system-3qhl.onrender.com"
});

export default API;
