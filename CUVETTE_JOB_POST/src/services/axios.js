import axios from "axios";

const axioInstance = axios.create({
  baseURL: import.meta.env.VITE_HOST_API_KEY || "",
});

axioInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axioInstance;
