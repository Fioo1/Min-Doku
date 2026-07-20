import { createContext, useContext, useEffect, useState } from 'react'
const GameContext = createContext(null)
const initial = { name: 'Valentina', level: 8, xp: 640, coins: 380, streak: 6, solved: 27, bestTime: '04:32' }
export function GameProvider({ children }) {
  const [player, setPlayer] = useState(() => JSON.parse(localStorage.getItem('mindoku-player') || 'null') || initial)
  useEffect(() => localStorage.setItem('mindoku-player', JSON.stringify(player)), [player])
  const reward = (coins, xp) => setPlayer(p => ({ ...p, coins: p.coins + coins, xp: p.xp + xp, solved: p.solved + 1 }))
  const spend = amount => { if (player.coins < amount) return false; setPlayer(p => ({ ...p, coins: p.coins - amount })); return true }
  return <GameContext.Provider value={{ player, reward, spend }}>{children}</GameContext.Provider>
}
export const useGame = () => useContext(GameContext)
