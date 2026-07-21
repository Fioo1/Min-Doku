import { Navigate, Route, Routes } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppLayout from './layouts/AppLayout'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import RankingPage from './pages/RankingPage'
import ShopPage from './pages/ShopPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

function ProtectedRoute({ children }) { const { user, loading } = useAuth(); if (loading) return <div className="boot-screen">Cargando MinDoku...</div>; return user ? children : <Navigate to="/auth" replace /> }
function AppRoutes() { return <GameProvider><Routes>
  <Route path="/auth" element={<AuthPage />} />
  <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
    <Route path="/" element={<HomePage />} />
    <Route path="/play/:difficulty?" element={<GamePage />} />
    <Route path="/daily" element={<GamePage daily />} />
    <Route path="/ranking" element={<RankingPage />} />
    <Route path="/shop" element={<ShopPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/settings" element={<SettingsPage />} />
  </Route>
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes></GameProvider> }
export default function App() { return <AuthProvider><AppRoutes /></AuthProvider> }
