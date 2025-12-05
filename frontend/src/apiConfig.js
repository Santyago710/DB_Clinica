// src/apiConfig.js
const API_HOST = process.env.REACT_APP_API_HOST || window.location.hostname;
const API_PORT = process.env.REACT_APP_API_PORT || "8000";

export const API_BASE_URL =
  API_PORT === "80"
    ? `http://${API_HOST}`
    : `http://${API_HOST}:${API_PORT}`;

// Si quieres directamente la base con /api:
export const API_BASE = `${API_BASE_URL}/api`;
