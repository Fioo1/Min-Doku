import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext(null)
const fallback = { name: 'Jugador', level: 1, xp: 0, coins: 100, streak: 0, solved: 0, bestTime: '--:--' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const loadProfile = async activeUser => {
    if (!activeUser) return setProfile(fallback)
    const { data } = await supabase.from('profiles').select('*').eq('id', activeUser.id).maybeSingle()
    setProfile(data ? { ...fallback, ...data } : { ...fallback, name: activeUser.user_metadata?.name || activeUser.email?.split('@')[0] || 'Jugador' })
  }
  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(async ({ data }) => { setUser(data.session?.user || null); await loadProfile(data.session?.user); setLoading(false) })
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user || null); loadProfile(session?.user) })
    return () => subscription.subscription.unsubscribe()
  }, [])
  const signIn = async ({ email, password }) => { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error }
  const signUp = async ({ name, email, password }) => { const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: window.location.origin } }); if (error) throw error; if (data.user) await supabase.from('profiles').upsert({ id: data.user.id, name: name || 'Jugador', level: 1, xp: 0, coins: 100, streak: 0 }) }
  const resetPassword = async email => { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` }); if (error) throw error }
  const signOut = async () => { const { error } = await supabase.auth.signOut(); if (error) throw error }
  const updateProfile = async patch => { const next = { ...profile, ...patch }; setProfile(next); if (user) await supabase.from('profiles').upsert({ id: user.id, name: next.name, avatar: next.avatar || null, level: next.level, xp: next.xp, coins: next.coins, streak: next.streak }) }
  const value = useMemo(() => ({ user, profile, loading, signIn, signUp, resetPassword, signOut, updateProfile, configured: Boolean(supabase) }), [user, profile, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
