import axios from 'axios'
import { useAuthStore } from '../stores/useAuthStore'

const GATEWAY = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: GATEWAY,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  console.log('[API →]', config.method?.toUpperCase(), config.baseURL + config.url, {
    hasToken: !!token,
    tokenSnippet: token ? token.slice(0, 30) + '...' : 'ninguno',
    params: config.params,
  })
  return config
})

api.interceptors.response.use(
  (res) => {
    console.log('[API ←]', res.status, res.config.url, res.data)
    return res
  },
  (err) => {
    console.error('[API ✗]', err.response?.status, err.config?.url, {
      responseData: err.response?.data,
      message: err.message,
    })
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = `${GATEWAY}/login`
    }
    return Promise.reject(err)
  },
)

export default api
