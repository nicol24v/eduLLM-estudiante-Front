import api from './api'

export const historyService = {
  getStats: async () => {
    const { data } = await api.get('/api/estudiante/history/stats')
    return data.data
  },
  getList: async (materiaId) => {
    const params = materiaId ? { materiaId } : {}
    const { data } = await api.get('/api/estudiante/history', { params })
    return data.data
  },
  getDetail: async (id) => {
    const { data } = await api.get(`/api/estudiante/history/${id}`)
    return data.data
  },
}
