import axios from "axios";

async function apiRequest(query, body, method, headers) {
  var requestData = [];

  let config = {
    method: method,
    maxBodyLength: Infinity,
    url: import.meta.env.VITE_SERVER_URL + query,
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    withCredentials: true,
  };

  if (headers) {
    config.headers = { ...config.headers, ...headers };
  }

  try {
    const response = await axios.request(config);
    requestData = response.data;
    return requestData;
  } catch (error) {
    throw error;
  }
}

export default apiRequest;
