// src/api/client.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // Sesuaikan dengan port backend kamu
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
