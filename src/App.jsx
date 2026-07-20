import { Navigate, Route, Routes } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import AppLayout from './layouts/AppLayout'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import PlaceholderPage from './pages/PlaceholderPage'

export default function App() {
  return <GameProvider><Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/play/:difficulty?" element={<GamePage />} />
      <Route path="/daily" element={<GamePage daily />} />
      <Route path="/ranking" element={<PlaceholderPage title="Ranking" />} />
      <Route path="/shop" element={<PlaceholderPage title="Tienda" />} />
      <Route path="/profile" element={<PlaceholderPage title="Tu perfil" />} />
      <Route path="/settings" element={<PlaceholderPage title="Configuración" />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></GameProvider>
}
