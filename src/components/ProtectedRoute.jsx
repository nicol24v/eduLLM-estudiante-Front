import { useAuthStore } from '../stores/useAuthStore'

const GATEWAY = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  if (!token) {
    window.location.href = `${GATEWAY}/login`
    return null
  }
  return children
}
