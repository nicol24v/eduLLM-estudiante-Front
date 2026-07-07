import { useEffect } from 'react'
import { GATEWAY } from '../../config'

export default function LoginPage() {
  useEffect(() => {
    window.location.href = `${GATEWAY}/login`
  }, [])
  return null
}
