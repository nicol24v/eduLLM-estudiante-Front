import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../../stores/useAuthStore'
import { act } from '@testing-library/react'

beforeEach(() => {
  act(() => useAuthStore.getState().logout())
})

describe('useAuthStore', () => {
  it('starts with null token', () => {
    expect(useAuthStore.getState().token).toBeNull()
  })

  it('login stores token and user data', () => {
    act(() => {
      useAuthStore.getState().login('jwt123', { id_usuario: 5, rol: 'estudiante' })
    })
    const state = useAuthStore.getState()
    expect(state.token).toBe('jwt123')
    expect(state.idUsuario).toBe(5)
    expect(state.rol).toBe('estudiante')
  })

  it('setPreJoinData stores enrollment id and name', () => {
    act(() => {
      useAuthStore.getState().setPreJoinData(42, 'Juan', 'Pérez')
    })
    const state = useAuthStore.getState()
    expect(state.idEstudianteMateria).toBe(42)
    expect(state.nombre).toBe('Juan')
    expect(state.apellidoPaterno).toBe('Pérez')
  })

  it('logout clears all state', () => {
    act(() => {
      useAuthStore.getState().login('jwt', { id_usuario: 1, rol: 'estudiante' })
      useAuthStore.getState().logout()
    })
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().idUsuario).toBeNull()
  })
})
