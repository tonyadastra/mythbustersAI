import axios from "axios";

const backendURL = "http://127.0.0.1:8001";
const axiosClient = axios.create({
  baseURL: backendURL,
});

const api = {
  async get(URL, customHeaders) {
    const headers = { ...axiosClient.defaults.headers, ...customHeaders };
    try {
      const response = await axiosClient.get(`${URL}`, { headers });
      return response.data;
    } catch (error) {
      if (error.response.status === 404) {
        return null;
      } else {
        throw error;
      }
    }
  },
  async post(URL, payload, customHeaders = {}) {
    const headers = {
      ...axiosClient.defaults.headers,
      ...customHeaders,
      "Content-Type": "application/json",
    };
    const response = await axiosClient.post(`${URL}`, payload, { headers });
    return response.data;
  },
  async put(URL, payload, customHeaders = {}) {

    const headers = {
      ...axiosClient.defaults.headers,
      ...customHeaders,
      "Content-Type": "application/json",
    };
    const response = await axiosClient.put(`${URL}`, payload, { headers });
    return response.data;
  },
  async patch(URL, payload, customHeaders = {}) {
    const headers = {
      ...axiosClient.defaults.headers,
      ...customHeaders,
      "Content-Type": "application/json",
    };
    const response = await axiosClient.patch(`${URL}`, payload, { headers });
    return response.data;
  },
};

export default api;
