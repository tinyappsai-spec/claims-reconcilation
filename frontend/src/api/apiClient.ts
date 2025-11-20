import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api", // point to backend
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default apiClient;
