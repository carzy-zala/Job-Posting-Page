import axiosInstance from "./axios.js";

const generateResponse = (responseFromBackend) => {
  return {
    success: responseFromBackend.success,
    message: responseFromBackend.message,
    data: responseFromBackend.data,
    statusCode: responseFromBackend.statusCode,
  };
};

const generateError = (errorFromBackend) => {
  return {
    statusCode: errorFromBackend.statusCode,
    message:
      errorFromBackend.message?.replace("ERROR :: ", "") ||
      "Something went wrong !",
    error: errorFromBackend.errors,
    success: errorFromBackend.success,
  };
};

//#region GET

export const axiosGet = async (
  url,
  params = {},
  contentType = "application/json"
) => {
  let response = {};

  try {
    const result = await axiosInstance.get(url, {
      headers: {
        "Content-Type": contentType,
      },
      params,
    });
    
    response = { ...generateResponse(result.data) };
  } catch (error) {
    response = { ...generateError(error) };
  }
   
  return response;
};

//#endregion

//#region POST

export const axiosPost = async (
  url,
  data,
  contentType = "application/json"
) => {
  let response = {};

  try {
    const result = await axiosInstance.post(url, data, {
      headers: {
        "Content-Type": contentType,
      },
    });

    response = { ...generateResponse(result.data) };
  } catch (error) {
    response = { ...generateError(error) };
  }

  
  return response;
};

//#endregion

//#region DELETE

export const axiosDelete = async (
  url,
  params = {},
  contentType = "application/json"
) => {
  let response = {};
  try {
    const result = await axiosInstance.delete(url, {
      headers: {
        "Content-Type": contentType,
      },
      params,
    });
    response = { ...generateResponse(result.data) };
  } catch (error) {
    response = { ...generateError(error) };
  }
  return response;
};

//#endregion

//#region PATCH

export const axiosPatch = async (
  url,
  data,
  params = {},
  contentType = "application/json"
) => {
  let response = {};
  try {
    const result = await axiosInstance.patch(url, data, {
      headers: {
        "Content-Type": contentType,
      },
      params,
    });
    response = { ...generateResponse(result.data) };
  } catch (e) {
    response = { ...generateError(error) };
  }
  return response;
};

//#endregion
