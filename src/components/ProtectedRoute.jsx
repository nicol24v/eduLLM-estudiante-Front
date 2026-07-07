import { useAuthStore } from '../stores/useAuthStore'
import { GATEWAY } from '../config'

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  if (!token) {
    window.location.href = `${GATEWAY}/login`
    return null
  }
  return children
}
