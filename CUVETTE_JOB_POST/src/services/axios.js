import axios from "axios";

const baseURL = import.meta.env.VITE_CUVETTE_JOB_POST_API_URL || "";
const token = localStorage.getItem("accessToken"); 

const axioInstance = axios.create({
  baseURL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "", // Add the token if available
  },
});


axioInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axioInstance;
