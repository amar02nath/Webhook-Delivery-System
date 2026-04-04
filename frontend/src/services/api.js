import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getEndpoints = () => api.get("/endpoints");
export const createEndpoint = (data) => api.post("/endpoints", data);
export const triggerEvent = (data) => api.post("/events/trigger", data);
export const getEndpointLogs = (id) => api.get(`/endpoints/${id}/logs`);
export const retryFailedDelivery = (logId) => api.post(`/events/retry/${logId}`);

export default api;