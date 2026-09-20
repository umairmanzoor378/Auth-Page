import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function App() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ firstName: '', lastName: '', countryCode: '+92', phone: '', email: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setStatus({ type: '', message: '' })
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setStatus({ type: '', message: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })
    const endpoint = mode === 'register' ? 'register' : mode === 'login' ? 'login' : 'forgot-password'
    const payload = mode === 'register' ? form : mode === 'login' ? { email: form.email, password: form.password } : { email: form.email }

    try {
      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Something went wrong.')
      if (mode === 'register') {
        switchMode('login')
        setStatus({ type: 'success', message: data.message })
      } else {
        setUser(data.user)
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to connect to the server.' })
    } finally {
      setLoading(false)
    }
  }

  const isLogin = mode === 'login'
  const isRegister = mode === 'register'

  if (user) {
    const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Member'
    return (
      <main className="dashboard-page">
        <aside className="dashboard-sidebar">
          <div className="brand"><span className="brand-mark">G</span> Git Auth</div>
          <div className="sidebar-nav">
            <button className="nav-item active" type="button"><span>◈</span> Overview</button>
            <button className="nav-item" type="button"><span>♧</span> Security</button>
            <button className="nav-item" type="button"><span>⌁</span> Activity</button>
          </div>
          <div className="sidebar-footer"><span className="pulse-dot" /> Account protected</div>
        </aside>
        <section className="dashboard-content">
          <header className="dashboard-header">
            <div><p className="eyebrow">MEMBER OVERVIEW</p><h1>Good morning, {displayName.split(' ')[0]}.</h1><p className="dashboard-subtitle">Here is what is happening with your account today.</p></div>
            <button className="profile-chip" type="button"><span className="avatar">{displayName.charAt(0).toUpperCase()}</span><span>{displayName}</span><span>⌄</span></button>
          </header>
          <div className="dashboard-grid">
            <article className="welcome-panel"><div><p className="eyebrow">ACCOUNT STATUS</p><h2>Your account is<br /><em>looking good.</em></h2><p>All your access checks are passing and your account is protected.</p></div><div className="status-ring">✓<small>SECURE</small></div></article>
            <article className="dashboard-card"><span className="card-icon">↗</span><strong>Last sign in</strong><span>Just now</span><small>From this device</small></article>
            <article className="dashboard-card"><span className="card-icon">⌁</span><strong>Profile completeness</strong><span>100%</span><small>Everything is up to date</small></article>
            <article className="activity-card"><div className="section-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h3>Account timeline</h3></div><button className="text-button" type="button">View all</button></div><div className="activity-row"><span className="activity-icon">✓</span><div><strong>Successful sign in</strong><small>Just now · Current session</small></div><span className="activity-state">Verified</span></div><div className="activity-row"><span className="activity-icon">+</span><div><strong>Profile created</strong><small>Today · Git Auth</small></div><span className="activity-state">Complete</span></div></article>
            <article className="profile-card"><div className="section-heading"><div><p className="eyebrow">YOUR DETAILS</p><h3>Personal profile</h3></div><button className="text-button" type="button">Edit</button></div><div className="profile-details"><div><small>EMAIL ADDRESS</small><strong>{user.email}</strong></div><div><small>PHONE NUMBER</small><strong>{user.countryCode} {user.phone}</strong></div></div></article>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="brand"><span className="brand-mark">G</span> Git Auth</header>
      <section className="auth-layout">
        <div className="intro">
          <p className="eyebrow">PRIVATE BY DESIGN</p>
          <h1>Welcome to your<br /><em>secure space.</em></h1>
          <p className="intro-copy">A calmer way to keep your account protected, connected, and completely yours.</p>
          <div className="trust-row"><span className="pulse-dot" /> <span>Encrypted account access</span></div>
        </div>
        <div className="auth-card">
          <div className="card-heading">
            <p className="eyebrow">{isRegister ? 'CREATE ACCOUNT' : mode === 'forgot' ? 'ACCOUNT RECOVERY' : 'MEMBER ACCESS'}</p>
            <h2>{isRegister ? 'Create your account' : mode === 'forgot' ? 'Reset your password' : 'Good to see you'}</h2>
            <p>{isRegister ? 'Start with a few details.' : mode === 'forgot' ? 'We will help you get back in.' : 'Enter your details to continue.'}</p>
          </div>
          <form onSubmit={handleSubmit}>
            {isRegister && <div className="input-row"><label>First name<input name="firstName" type="text" placeholder="Umair" value={form.firstName} onChange={updateField} required /></label><label>Last name<input name="lastName" type="text" placeholder="Manzoor" value={form.lastName} onChange={updateField} required /></label></div>}
            {isRegister && <label>Phone number<div className="phone-input"><select name="countryCode" value={form.countryCode} onChange={updateField} aria-label="Country code"><option value="+92">PK +92</option><option value="+1">US +1</option><option value="+44">GB +44</option><option value="+971">AE +971</option></select><input name="phone" type="tel" placeholder="300 1234567" value={form.phone} onChange={updateField} required /></div></label>}
            <label>Email address<input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={updateField} required /></label>
            {mode !== 'forgot' && <label>Password<input name="password" type="password" placeholder="At least 8 characters" minLength="8" value={form.password} onChange={updateField} required /></label>}
            {isLogin && <div className="form-options"><label className="check-label"><input type="checkbox" /> <span>Remember me</span></label><button type="button" className="text-button" onClick={() => switchMode('forgot')}>Forgot password?</button></div>}
            {status.message && <p className={`status ${status.type}`} role="status">{status.message}</p>}
            <button className="submit-button" type="submit" disabled={loading}>{loading ? 'Please wait...' : isRegister ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Sign in'} <span>↗</span></button>
          </form>
          <div className="switch-prompt">{isRegister ? 'Already have an account?' : 'New to Git Auth?'} <button type="button" className="text-button" onClick={() => switchMode(isRegister ? 'login' : 'register')}>{isRegister ? 'Sign in' : 'Create an account'}</button></div>
          {mode === 'forgot' && <button type="button" className="back-button" onClick={() => switchMode('login')}>← Back to sign in</button>}
        </div>
      </section>
      <footer>© 2026 Git Auth <span /> Built for peace of mind</footer>
    </main>
  )
}

export default App
