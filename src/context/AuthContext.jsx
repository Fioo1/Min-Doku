import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../services/supabase'
const AuthContext = createContext(null)
const formatTime = seconds => Number.isInteger(seconds) ? `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}` : '--:--'
const fallback = { name: 'Jugador', level: 1, xp: 0, coins: 100, streak: 0, solved: 0, best_time_seconds: null, bestTime: '--:--', games_played: 0, wins: 0, total_mistakes: 0, hints_used: 0 }
const normalize = data => ({ ...fallback, ...data, bestTime: formatTime(data?.best_time_seconds) })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [profile, setProfile] = useState(fallback); const [loading, setLoading] = useState(true)
  const loadProfile = async activeUser => { if (!activeUser) return setProfile(fallback); const { data, error } = await supabase.from('profiles').select('*').eq('id', activeUser.id).maybeSingle(); if (error) console.error(error); setProfile(data ? normalize(data) : normalize({ name: activeUser.user_metadata?.name || activeUser.email?.split('@')[0] || 'Jugador' })) }
  useEffect(() => { if (!supabase) { setLoading(false); return }; supabase.auth.getSession().then(async ({ data }) => { setUser(data.session?.user || null); await loadProfile(data.session?.user); setLoading(false) }); const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user || null); loadProfile(session?.user) }); return () => subscription.subscription.unsubscribe() }, [])
  const signIn = async ({ email, password }) => { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error }
  const signUp = async ({ name, email, password }) => { const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: window.location.origin } }); if (error) throw error; if (data.user) { const { error: profileError } = await supabase.from('profiles').upsert({ id: data.user.id, name: name || 'Jugador', level: 1, xp: 0, coins: 100, streak: 0 }); if (profileError) throw profileError } }
  const resetPassword = async email => { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` }); if (error) throw error }
  const signOut = async () => { const { error } = await supabase.auth.signOut(); if (error) throw error }
  const updateProfile = async patch => { const next = normalize({ ...profile, ...patch }); setProfile(next); if (!user) return next; const record = { id: user.id, name: next.name, avatar: next.avatar || null, level: next.level, xp: next.xp, coins: next.coins, streak: next.streak, solved: next.solved, best_time_seconds: next.best_time_seconds, games_played: next.games_played, wins: next.wins, total_mistakes: next.total_mistakes, hints_used: next.hints_used, updated_at: new Date().toISOString() }; const { error } = await supabase.from('profiles').upsert(record); if (error) { setProfile(profile); throw error } return next }
  const saveGame = async game => { if (!user) return; const { error } = await supabase.from('game_history').insert({ user_id: user.id, ...game }); if (error) throw error }
  const value = useMemo(() => ({ user, profile, loading, signIn, signUp, resetPassword, signOut, updateProfile, saveGame, configured: Boolean(supabase) }), [user, profile, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
