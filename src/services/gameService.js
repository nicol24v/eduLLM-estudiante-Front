import api from './api'

export const gameService = {
  preJoin: async (codigoAcceso) => {
    const { data } = await api.get(`/api/estudiante/game/pre-join`, {
      params: { codigoAcceso },
    })
    return data.data
  },

  login: async (username, password) => {
    const { data } = await api.post('/api/auth/login', { username, password })
    return data
  },
}
