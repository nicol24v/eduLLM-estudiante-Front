import axios from 'axios'
import { useAuthStore } from '../stores/useAuthStore'
import { GATEWAY } from '../config'

const api = axios.create({
  baseURL: GATEWAY,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = `${GATEWAY}/login`
    }
    return Promise.reject(err)
  },
)

export default api
