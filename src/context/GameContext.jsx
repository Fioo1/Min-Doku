import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
const GameContext = createContext(null)
const initial = { name: 'Jugador', level: 1, xp: 0, coins: 100, streak: 0, solved: 0, bestTime: '--:--' }
export function GameProvider({ children }) {
  const { profile, updateProfile } = useAuth(); const player = { ...initial, ...profile }
  const reward = (coins, xp) => updateProfile({ coins: player.coins + coins, xp: player.xp + xp, solved: player.solved + 1, level: Math.max(player.level, Math.floor((player.xp + xp) / 500) + 1) })
  const spend = amount => { if (player.coins < amount) return false; updateProfile({ coins: player.coins - amount }); return true }
  return <GameContext.Provider value={{ player, reward, spend }}>{children}</GameContext.Provider>
}
export const useGame = () => useContext(GameContext)
