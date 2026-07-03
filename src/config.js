const url = import.meta.env.VITE_API_URL
export const GATEWAY = url !== undefined ? url : 'http://localhost:8080'
