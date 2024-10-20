import axios from "../services/axios";

const setToken = (accessToken = "", refreshToken = "") => {
  return new Promise((resolve) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      refreshToken && localStorage.setItem("refreshToken", refreshToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem("accessToken");
      localStorage.getItem("refreshToken") &&
        localStorage.removeItem("refreshToken");
      delete axios.defaults.headers.common.Authorization;
    }
    resolve();
  });
};

export default setToken;
