import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Auth() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setInfo('Check your inbox to confirm your email, then sign in.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <span className="eyebrow">Vestigare</span>
        <h1>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        {error && <p className="save-error">{error}</p>}
        {info && <p className="info-msg">{info}</p>}
        <button className="link-btn" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          {mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
