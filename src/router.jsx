import { createBrowserRouter } from 'react-router-dom'
import AuthCallback from './pages/auth/AuthCallback'
import DashboardPage from './pages/dashboard/DashboardPage'
import HomePage from './pages/home/HomePage'
import JoinPage from './pages/join/JoinPage'
import GamePage from './pages/game/GamePage'
import HistoryDetailPage from './pages/history/HistoryDetailPage'
import GradesPage from './pages/grades/GradesPage'
import NotFoundPage from './pages/not-found/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

const basename = import.meta.env.VITE_BASENAME || ''

export const router = createBrowserRouter([
  { path: '/auth/callback', element: <AuthCallback /> },
  { path: '/dashboard', element: <DashboardPage /> },
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
  {
    path: '/grades',
    element: (
      <ProtectedRoute>
        <Layout>
          <GradesPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/grades/:id',
    element: (
      <ProtectedRoute>
        <Layout>
          <HistoryDetailPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
], { basename })
