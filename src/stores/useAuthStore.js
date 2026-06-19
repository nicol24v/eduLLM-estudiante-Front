import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      idUsuario: null,
      nombre: null,
      apellidoPaterno: null,
      rol: null,
      idEstudianteMateria: null,

      login: (token, userData) => set({
        token,
        idUsuario: userData.id_usuario,
        rol: userData.rol,
      }),

      setPreJoinData: (idEstudianteMateria, nombre, apellidoPaterno) =>
        set({ idEstudianteMateria, nombre, apellidoPaterno }),

      logout: () => set({
        token: null,
        idUsuario: null,
        nombre: null,
        apellidoPaterno: null,
        rol: null,
        idEstudianteMateria: null,
      }),
    }),
    {
      name: 'estudiante-auth',
      partialize: (state) => ({
        token: state.token,
        idUsuario: state.idUsuario,
        nombre: state.nombre,
        apellidoPaterno: state.apellidoPaterno,
        rol: state.rol,
      }),
    },
  ),
)
