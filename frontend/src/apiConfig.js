// src/apiConfig.js

// Detectar dinámicamente el puerto del backend basado en el puerto del frontend
const getBackendPort = () => {
  const frontendPort = window.location.port || "3000";
  
  // Mapeo de puertos frontend -> backend
  const portMapping = {
    "3001": "8000",  // Frontend 1 -> Backend 1
    "3002": "8001",  // Frontend 2 -> Backend 2
    "3000": "8000",  // Desarrollo local por defecto
  };
  
  return portMapping[frontendPort] || "8000";
};

const API_HOST = process.env.REACT_APP_API_HOST || window.location.hostname;
const API_PORT = process.env.REACT_APP_API_PORT || getBackendPort();

export const API_BASE_URL =
  API_PORT === "80"
    ? `http://${API_HOST}`
    : `http://${API_HOST}:${API_PORT}`;

// Si quieres directamente la base con /api:
export const API_BASE = `${API_BASE_URL}/api`;


// Debug: mostrar en consola qué URL se está usando
console.log("🔧 API Configuration:", {
  hostname: window.location.hostname,
  frontendPort: window.location.port,
  backendPort: API_PORT,
  baseUrl: API_BASE_URL,
  apiBase: API_BASE,
});