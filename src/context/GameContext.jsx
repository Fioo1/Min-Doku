import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
import { checkStreak } from "../utils/streak";
const GameContext = createContext(null)
const initial = { name: 'Jugador', level: 1, xp: 0, coins: 100, streak: 0, solved: 0, bestTime: '--:--', best_time_seconds: null, games_played: 0, wins: 0, total_mistakes: 0, hints_used: 0 }
export function GameProvider({ children }) {
  const { profile, updateProfile, saveGame } = useAuth(); const player = { ...initial, ...profile }
  const spend = amount => { if (player.coins < amount) return false; updateProfile({ coins: player.coins - amount }).catch(console.error); return true }
  const recordWin = ({
    coins,
    xp,
    seconds,
    difficulty,
    mistakes,
    hintsUsed,
    daily,
  }) => {

    const best =
      player.best_time_seconds === null ||
      seconds < player.best_time_seconds
        ? seconds
        : player.best_time_seconds;

    const today = new Date().toISOString().slice(0, 10);

    const streakState = checkStreak(player);

    let streak = player.streak;
    let bestStreak = player.best_streak;

    switch (streakState.status) {

      case "first_time":
        streak = 1;
        break;

      case "continue":
        streak += 1;
        break;

      case "already_played":
        break;

      case "missed":
        // Por ahora no hacemos nada.
        // Más adelante aquí aparecerá el modal.
        break;

    }

    bestStreak = Math.max(bestStreak, streak);

    updateProfile({

      coins: player.coins + coins,

      xp: player.xp + xp,

      solved: player.solved + 1,

      games_played: player.games_played + 1,

      wins: player.wins + 1,

      total_mistakes: player.total_mistakes + mistakes,

      hints_used: player.hints_used + hintsUsed,

      best_time_seconds: best,

      level: Math.max(
        player.level,
        Math.floor((player.xp + xp) / 500) + 1
      ),

      streak,

      best_streak: bestStreak,

      last_played: today,

    }).catch(console.error);

    saveGame({

      difficulty,

      seconds,

      mistakes,

      hints_used: hintsUsed,

      daily,

      challenge_date: daily
        ? today
        : null,

      completed: true,

    }).catch(console.error);

  };

  
  return <GameContext.Provider value={{ player, spend, recordWin }}>{children}</GameContext.Provider>
}
export const useGame = () => useContext(GameContext)
