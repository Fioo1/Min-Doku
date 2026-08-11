import { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
import { checkStreak } from '../utils/streak'

const GameContext = createContext(null)

const initial = {
  name: 'Jugador',
  level: 1,
  xp: 0,
  coins: 100,
  streak: 0,
  best_streak: 0,
  streak_shields: 2,
  last_played: null,
  solved: 0,
  bestTime: '--:--',
  best_time_seconds: null,
  games_played: 0,
  wins: 0,
  total_mistakes: 0,
  hints_used: 0,
}

export function GameProvider({ children }) {

  const {
    profile,
    updateProfile,
    saveGame,
  } = useAuth()

  const player = {
    ...initial,
    ...profile,
  }

  // --------------------------------
  // GASTAR MONEDAS
  // --------------------------------

  const spend = (amount) => {

    if (player.coins < amount) {
      return false
    }

    updateProfile({
      coins: player.coins - amount,
    }).catch(console.error)

    return true
  }

  // --------------------------------
  // REGISTRAR VICTORIA
  // --------------------------------

  const recordWin = ({
    coins,
    xp,
    seconds,
    difficulty,
    mistakes,
    hintsUsed,
    daily,
  }) => {

    // Mejor tiempo
    const best =
      player.best_time_seconds === null ||
      seconds < player.best_time_seconds
        ? seconds
        : player.best_time_seconds

    // Fecha LOCAL del usuario
    const now = new Date()

    const today =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')}`

    // Revisar estado actual de la racha
    const streakState = checkStreak(player)

    let streak = player.streak
    let bestStreak = player.best_streak || 0

    // --------------------------------
    // CALCULAR RACHA
    // --------------------------------

    if (streakState.status === 'first_time') {

      // Nunca había jugado
      streak = 1

    } else if (streakState.status === 'continue') {

      // Jugó ayer
      streak = player.streak + 1

    } else if (streakState.status === 'already_played') {

      // Ya jugó hoy.
      // NO aumentamos la racha.
      streak = player.streak

    } else if (streakState.status === 'missed') {

      // Si faltó uno o más días,
      // por ahora mantenemos la racha.
      //
      // La decisión de usar escudo o perder
      // la racha se maneja desde el sistema
      // de StreakModal.
      streak = player.streak
    }

    // Actualizar mejor racha solamente
    // si la nueva racha es superior.
    bestStreak = Math.max(
      bestStreak,
      streak
    )

    // --------------------------------
    // ACTUALIZAR PERFIL
    // --------------------------------

    updateProfile({

      coins:
        player.coins + coins,

      xp:
        player.xp + xp,

      solved:
        player.solved + 1,

      games_played:
        player.games_played + 1,

      wins:
        player.wins + 1,

      total_mistakes:
        player.total_mistakes + mistakes,

      hints_used:
        player.hints_used + hintsUsed,

      best_time_seconds:
        best,

      level:
        Math.max(
          player.level,
          Math.floor(
            (player.xp + xp) / 500
          ) + 1
        ),

      streak,

      best_streak:
        bestStreak,

      last_played:
        today,

    }).catch(console.error)

    // --------------------------------
    // GUARDAR HISTORIAL DE PARTIDA
    // --------------------------------

    saveGame({

      difficulty,

      seconds,

      mistakes,

      hints_used:
        hintsUsed,

      daily,

      challenge_date:
        daily
          ? today
          : null,

      completed:
        true,

    }).catch(console.error)
  }

  return (
    <GameContext.Provider
      value={{
        player,
        spend,
        recordWin,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () =>
  useContext(GameContext)
