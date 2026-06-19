import { createBrowserRouter } from 'react-router-dom'
import LoginPage from './pages/login/LoginPage'
import HomePage from './pages/home/HomePage'
import JoinPage from './pages/join/JoinPage'
import GamePage from './pages/game/GamePage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout>
          <HomePage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/join',
    element: (
      <ProtectedRoute>
        <Layout>
          <JoinPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/game/:code',
    element: (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
  },
])
