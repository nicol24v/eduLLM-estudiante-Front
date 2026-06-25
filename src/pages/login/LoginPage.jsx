import { useEffect } from 'react'

const GATEWAY = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function LoginPage() {
  useEffect(() => {
    window.location.href = `${GATEWAY}/login`
  }, [])
  return null
}
