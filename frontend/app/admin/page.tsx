'use client'
import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'
import { fetchCMSData, updateCMSData, defaultData, CMSData } from '@/lib/cms-data'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import BrandLogo from '@/components/BrandLogo'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'key2fit2026'

type Tab = 'hero' | 'female' | 'training' | 'prices' | 'contact' | 'gallery'

const navItems: { id: Tab; icon: string; label: string }[] = [
  { id: 'hero',     icon: '🏠', label: 'Hero Section' },
  { id: 'female',   icon: '👩', label: 'Female Section' },
  { id: 'training', icon: '🏋️', label: 'Training' },
  { id: 'prices',   icon: '💰', label: 'Pricing Plans' },
  { id: 'contact',  icon: '📞', label: 'Contact Info' },
  { id: 'gallery',  icon: '🖼', label: 'Gallery Photos' },
]

export default function AdminPage() {
  const [authed, setAuthed]     = useState(false)
  const [pw, setPw]             = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [shake, setShake]       = useState(false)
  const [tab, setTab]           = useState<Tab>('hero')
  const [data, setData]         = useState<CMSData>(defaultData)
  const [loading, setLoading]   = useState(true)
  const [saved, setSaved]       = useState(true)
  const [saveFlash, setSaveFlash] = useState(false)
  const [newUrl, setNewUrl]     = useState('')
  const [history, setHistory]   = useState<CMSData[]>([])
  const [focusOverlay, setFocusOverlay] = useState<{ label: string; value: string; onChange: (v: string) => void; type: 'input' | 'textarea' } | null>(null)

  const isMobile = useCallback(() => typeof window !== 'undefined' && window.innerWidth <= 900, [])

  const openFocusOverlay = useCallback((label: string, value: string, onChange: (v: string) => void, type: 'input' | 'textarea' = 'input') => {
    if (isMobile()) {
      setFocusOverlay({ label, value, onChange, type })
    }
  }, [isMobile])

  const closeFocusOverlay = useCallback(() => {
    setFocusOverlay(null)
  }, [])

  useEffect(() => {
    async function load() {
      const d = await fetchCMSData()
      setData(d)
      setLoading(false)
    }
    load()
  }, [])

  // Ctrl+S / Ctrl+Z
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave() }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [data, history])

  const pushToHistory = (oldData: CMSData) => {
    setHistory(prev => [oldData, ...prev].slice(0, 50))
    setSaved(false)
  }

  const undo = () => {
    if (history.length === 0) return
    const prev = history[0]
    setHistory(prevH => prevH.slice(1))
    setData(prev)
    setSaved(false)
  }

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setError('') }
    else {
      setShake(true); setError('Incorrect password.')
      setPw(''); setTimeout(() => setShake(false), 500)
    }
  }

  const update = (key: keyof CMSData, val: string) => {
    pushToHistory(data)
    setData(prev => ({ ...prev, [key]: val }))
  }

  const updateTraining = (i: number, field: string, val: string) => {
    pushToHistory(data)
    const t = [...data.training]
    t[i] = { ...t[i], [field]: val }
    setData(prev => ({ ...prev, training: t }))
  }

  const updateQuote = (i: number, val: string) => {
    pushToHistory(data)
    const q = [...data.extraQuotes]
    q[i] = val
    setData(prev => ({ ...prev, extraQuotes: q }))
  }

  const addQuote = () => {
    pushToHistory(data)
    setData(prev => ({ ...prev, extraQuotes: [...prev.extraQuotes, 'New quote...'] }))
  }

  const deleteQuote = (i: number) => {
    pushToHistory(data)
    const q = [...data.extraQuotes]
    q.splice(i, 1)
    setData(prev => ({ ...prev, extraQuotes: q }))
  }

  const addPhoto = () => {
    if (!newUrl.trim()) return
    pushToHistory(data)
    setData(prev => ({ ...prev, gallery: [...prev.gallery, newUrl.trim()] }))
    setNewUrl('')
  }

  const deletePhoto = (i: number) => {
    pushToHistory(data)
    const g = [...data.gallery]
    g.splice(i, 1)
    setData(prev => ({ ...prev, gallery: g }))
  }

  const updateGalleryOrder = (newOrder: string[]) => {
    pushToHistory(data)
    setData(prev => ({ ...prev, gallery: newOrder }))
  }

  const updateFemaleFeature = (i: number, val: string) => {
    pushToHistory(data)
    const f = [...data.femaleFeatures]
    f[i] = val
    setData(prev => ({ ...prev, femaleFeatures: f }))
  }

  const addFemaleFeature = () => {
    pushToHistory(data)
    setData(prev => ({ ...prev, femaleFeatures: [...prev.femaleFeatures, 'New feature...'] }))
  }

  const deleteFemaleFeature = (i: number) => {
    pushToHistory(data)
    const f = [...data.femaleFeatures]
    f.splice(i, 1)
    setData(prev => ({ ...prev, femaleFeatures: f }))
  }

  const addFemaleStat = () => {
    pushToHistory(data)
    setData(prev => ({ ...prev, femaleStats: [...(prev.femaleStats || []), { num: 'Auto', label: 'New Stat' }] }))
  }

  const deleteFemaleStat = (i: number) => {
    pushToHistory(data)
    const s = [...data.femaleStats]
    s.splice(i, 1)
    setData(prev => ({ ...prev, femaleStats: s }))
  }

  const updateFemaleStat = (i: number, field: 'num' | 'label', val: string) => {
    pushToHistory(data)
    const s = [...data.femaleStats]
    s[i] = { ...s[i], [field]: val }
    setData(prev => ({ ...prev, femaleStats: s }))
  }

  const addTrainingCard = () => {
    pushToHistory(data)
    const newCard = { icon: '🔥', title: 'New Training', desc: 'Description of the new training...', tag: 'New' }
    setData(prev => ({ ...prev, training: [...prev.training, newCard] }))
  }

  const deleteTrainingCard = (i: number) => {
    pushToHistory(data)
    const t = [...data.training]
    t.splice(i, 1)
    setData(prev => ({ ...prev, training: t }))
  }

  const addMembershipPlan = () => {
    pushToHistory(data)
    const newId = `p${Date.now()}`
    const newPlan = { id: newId, duration: 'New Plan', label: 'new label', price: '₹0' }
    setData(prev => ({ ...prev, membershipPlans: [...(prev.membershipPlans || []), newPlan] }))
    setSaved(false)
  }

  const deleteMembershipPlan = (i: number) => {
    pushToHistory(data)
    const p = [...data.membershipPlans]
    p.splice(i, 1)
    setData(prev => ({ ...prev, membershipPlans: p }))
  }

  const updateMembershipPlan = (i: number, field: string, val: string) => {
    pushToHistory(data)
    const p = [...data.membershipPlans]
    p[i] = { ...p[i], [field]: val }
    setData(prev => ({ ...prev, membershipPlans: p }))
    setSaved(false)
  }

  const addOpeningHour = () => {
    pushToHistory(data)
    setData(prev => ({ ...prev, openingHours: [...(prev.openingHours || []), { day: 'New Day', time: '00:00 - 00:00' }] }))
  }

  const deleteOpeningHour = (i: number) => {
    pushToHistory(data)
    const h = [...data.openingHours]
    h.splice(i, 1)
    setData(prev => ({ ...prev, openingHours: h }))
  }

  const updateOpeningHour = (i: number, field: 'day' | 'time', val: string) => {
    pushToHistory(data)
    const h = [...data.openingHours]
    h[i] = { ...h[i], [field]: val }
    setData(prev => ({ ...prev, openingHours: h }))
  }

  const addLocation = () => {
    pushToHistory(data)
    setData(prev => ({ 
      ...prev, 
      locations: [...(prev.locations || []), { id: `loc${Date.now()}`, address: 'New Location Address', mapUrl: '' }] 
    }))
  }

  const deleteLocation = (i: number) => {
    pushToHistory(data)
    const l = [...data.locations]
    l.splice(i, 1)
    setData(prev => ({ ...prev, locations: l }))
  }

  const updateLocation = (i: number, field: 'address' | 'mapUrl', val: string) => {
    pushToHistory(data)
    const l = [...data.locations]
    l[i] = { ...l[i], [field]: val }
    setData(prev => ({ ...prev, locations: l }))
  }

  const addPTPackage = () => {
    pushToHistory(data)
    const newId = `pt${Date.now()}`
    const newPkg = { id: newId, title: 'New PT Package', subtitle: 'Label', price: '₹0', features: ['New feature...'] }
    setData(prev => ({ ...prev, ptPackages: [...(prev.ptPackages || []), newPkg] }))
  }

  const deletePTPackage = (i: number) => {
    pushToHistory(data)
    const p = [...data.ptPackages]
    p.splice(i, 1)
    setData(prev => ({ ...prev, ptPackages: p }))
  }

  const updatePTPackage = (i: number, field: string, val: string) => {
    pushToHistory(data)
    const p = [...data.ptPackages]
    p[i] = { ...p[i], [field]: val }
    setData(prev => ({ ...prev, ptPackages: p }))
  }

  const addPTFeature = (pkgIndex: number) => {
    pushToHistory(data)
    const p = [...data.ptPackages]
    p[pkgIndex] = { ...p[pkgIndex], features: [...(p[pkgIndex]?.features || []), 'New feature...'] }
    setData(prev => ({ ...prev, ptPackages: p }))
  }

  const deletePTFeature = (pkgIndex: number, featureIndex: number) => {
    pushToHistory(data)
    const p = [...data.ptPackages]
    const f = [...(p[pkgIndex]?.features || [])]
    f.splice(featureIndex, 1)
    p[pkgIndex] = { ...p[pkgIndex], features: f }
    setData(prev => ({ ...prev, ptPackages: p }))
  }

  const updatePTFeature = (pkgIndex: number, featureIndex: number, val: string) => {
    pushToHistory(data)
    const p = [...data.ptPackages]
    const f = [...(p[pkgIndex]?.features || [])]
    f[featureIndex] = val
    p[pkgIndex] = { ...p[pkgIndex], features: f }
    setData(prev => ({ ...prev, ptPackages: p }))
  }

  const handleSave = async () => {
    setSaveFlash(true)
    const success = await updateCMSData(data, pw)
    if (success) {
      setSaved(true)
      setTimeout(() => setSaveFlash(false), 2000)
    } else {
      setSaveFlash(false)
      alert('Failed to save data. Please check your connection.')
    }
  }

  // ── LOGIN SCREEN ──
  if (!authed) return (
    <>
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="admin-login-wrap" style={{ width: '100%', maxWidth: 420, padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <BrandLogo style={{ fontSize: '42px' }} />
        </div>
        <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.72rem', letterSpacing: '0.35em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 40 }}>
          Admin Dashboard · CMS Portal
        </div>

        <motion.div className="admin-login-box" animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
          style={{ 
            background: 'var(--card)', 
            border: '1px solid var(--border)', 
            padding: '40px 36px',
            clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
          }}
        >
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', color: 'var(--tan)', marginBottom: 4 }}>WELCOME BACK</div>
          <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 28 }}>
            Sign in to manage your website content
          </div>

          <label style={{ display: 'block', fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.68rem', letterSpacing: '0.18em', color: 'var(--tan)', textTransform: 'uppercase', marginBottom: 6 }}>Password</label>
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <input type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Enter admin password"
              autoFocus
              style={{ width: '100%', background: 'var(--dark)', border: '1px solid var(--border)', padding: '13px 44px 13px 14px', fontFamily: 'var(--font-barlow)', fontSize: '16px', color: 'var(--white)', outline: 'none', borderRadius: 0, transition: 'border-color 0.2s' }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'var(--tan)'
                if (typeof window !== 'undefined' && window.innerWidth <= 900) {
                  // Clean up any existing proxy first
                  document.getElementById('__kb_proxy')?.remove()
                  const proxy = document.createElement('input')
                  proxy.style.cssText = 'position:fixed;top:0;left:0;opacity:0;height:0;width:0;font-size:16px;'
                  proxy.id = '__kb_proxy'
                  document.body.appendChild(proxy)
                  e.currentTarget.blur()
                  proxy.focus()
                  try {
                    openFocusOverlay('Password', pw, (v) => setPw(v), 'input')
                  } catch {
                    proxy.remove()
                  }
                }
              }}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
            <button 
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer',
                fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 4, transition: 'color 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--tan)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>
          {error && <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.75rem', color: '#e05555', marginBottom: 10 }}>{error}</div>}

          <button onClick={login} style={{
            width: '100%', background: 'var(--tan)', color: 'var(--black)', border: 'none',
            padding: 14, fontFamily: 'var(--font-bebas)', fontSize: '1.15rem', letterSpacing: '0.12em', cursor: 'pointer',
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--tan-l)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--tan)')}
          >SIGN IN →</button>

          <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: 16, fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.72rem', letterSpacing: '0.1em', color: 'var(--muted)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >← Back to website</a>
        </motion.div>
      </div>
    </div>
    <AnimatePresence>
      {focusOverlay && <MobileFocusOverlay field={focusOverlay} onClose={closeFocusOverlay} />}
    </AnimatePresence>
    </>
  )

  // ── DASHBOARD ──
  return (
    <FocusOverlayContext.Provider value={openFocusOverlay}>
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--black)' }}>

      {/* Topbar */}
      <div className="admin-topbar" style={{
        height: 60, background: 'var(--card)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0,
        position: 'relative', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <BrandLogo style={{ fontSize: '24px' }} />
          <span style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '1rem', color: 'var(--muted)', letterSpacing: '0.2em' }}>· CMS</span>
        </div>

        <div className="admin-topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ 
            fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.68rem', letterSpacing: '0.15em', 
            color: 'var(--tan)', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.25)', 
            padding: '4px 10px', textTransform: 'uppercase',
            clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
          }}>✦ Admin</span>
          <a href="/" target="_blank" style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--muted)', textDecoration: 'none', textTransform: 'uppercase' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--tan)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >↗ View Website</a>
          <button onClick={() => setAuthed(false)} style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--muted)', background: 'none', border: '1px solid var(--border)', padding: '6px 14px', cursor: 'pointer', textTransform: 'uppercase' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
          >Sign Out</button>
        </div>
      </div>

      <div className="admin-dashboard-body" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <nav className="admin-sidebar" style={{ width: 220, background: 'var(--dark)', borderRight: '1px solid var(--border)', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '20px 0', gap: 2, overflowY: 'auto' }}>
          {['Content', 'Business', 'Media'].map((section, si) => (
            <div key={section}>
              <div className="admin-sidebar-header" style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.62rem', letterSpacing: '0.25em', color: 'var(--muted)', textTransform: 'uppercase', padding: '8px 20px 4px', marginTop: si > 0 ? 10 : 0 }}>{section}</div>
              {navItems.slice(si === 0 ? 0 : si === 1 ? 3 : 5, si === 0 ? 3 : si === 1 ? 5 : 6).map(item => (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`admin-sidebar-btn ${tab === item.id ? 'active' : ''}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', width: '100%',
                    fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: tab === item.id ? 'rgba(200,169,110,0.06)' : 'none',
                    border: 'none', borderLeft: `2px solid ${tab === item.id ? 'var(--tan)' : 'transparent'}`,
                    color: tab === item.id ? 'var(--tan)' : 'var(--muted)', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                ><span>{item.icon}</span>{item.label}</button>
              ))}
            </div>
          ))}
        </nav>

        {/* Main content */}
        <div className="admin-content" style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', background: 'var(--black)' }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

              {/* ── HERO ── */}
              {tab === 'hero' && (
                <PanelWrap title="HERO" accent="SECTION" desc="Edit the main headline, subheading, motivational quotes">
                  <GroupLabel>Main Headline — 3 Lines</GroupLabel>
                  <Grid cols={3}>
                    <FieldCard label="Line 1"><CInput value={data.hl1} onChange={v => update('hl1', v)} /></FieldCard>
                    <FieldCard label="Line 2"><CInput value={data.hl2} onChange={v => update('hl2', v)} /></FieldCard>
                    <FieldCard label="Line 3 · Gold colour" highlight><CInput value={data.hl3} onChange={v => update('hl3', v)} /></FieldCard>
                  </Grid>
                  <GroupLabel>Subheading</GroupLabel>
                  <Grid cols={1}><FieldCard label="Subheading text"><CInput value={data.hsub} onChange={v => update('hsub', v)} /></FieldCard></Grid>
                  <GroupLabel>Quote Card</GroupLabel>
                  <Grid cols={1}>
                    <FieldCard label="Quote text"><CTextarea value={data.hq} onChange={v => update('hq', v)} rows={3} /></FieldCard>
                    <FieldCard label="Quote attribution"><CInput value={data.hc} onChange={v => update('hc', v)} /></FieldCard>
                  </Grid>
                  <GroupLabel>Extra Motivational Quotes</GroupLabel>
                  {data.extraQuotes.map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ color: 'var(--muted)' }}>⠿</span>
                      <CInput value={q} onChange={v => updateQuote(i, v)} style={{ flex: 1 }} />
                      <button onClick={() => deleteQuote(i)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem', padding: '0 6px' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                      >✕</button>
                    </div>
                  ))}
                  <GroupLabel>Hero Section Background Image</GroupLabel>
                  <Grid cols={1}>
                    <FieldCard label="Hero Image URL"><CInput value={data.heroImage} onChange={v => update('heroImage', v)} /></FieldCard>
                    {data.heroImage && (
                      <div style={{ marginTop: 12, border: '1px solid var(--border)', background: 'var(--card)', padding: 8, borderRadius: 4 }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--tan)', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.05em' }}>PREVIEW</div>
                        <img src={data.heroImage} alt="Hero Preview" style={{ width: '100%', height: 'auto', maxHeight: 200, objectFit: 'contain', background: '#000' }} referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </Grid>
                </PanelWrap>
              )}

              {/* ── FEMALE ── */}
              {tab === 'female' && (
                <PanelWrap title="FEMALE" accent="SECTION" desc="Edit the She Trains section content and stats">
                  <GroupLabel>Headline — 3 Lines</GroupLabel>
                  <Grid cols={3}>
                    <FieldCard label="Line 1"><CInput value={data.fl1} onChange={v => update('fl1', v)} /></FieldCard>
                    <FieldCard label="Line 2"><CInput value={data.fl2} onChange={v => update('fl2', v)} /></FieldCard>
                    <FieldCard label="Line 3 · Gold colour" highlight><CInput value={data.fl3} onChange={v => update('fl3', v)} /></FieldCard>
                  </Grid>
                  <GroupLabel>Description</GroupLabel>
                  <Grid cols={1}><FieldCard label="Body paragraph"><CTextarea value={data.fb} onChange={v => update('fb', v)} rows={3} /></FieldCard></Grid>
                  <GroupLabel>Stats — Live Preview</GroupLabel>
                  <div className="admin-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 12 }}>
                    {data.femaleStats?.map((s, i) => (
                      <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: 18, position: 'relative' }}>
                        <button onClick={() => deleteFemaleStat(i)} 
                          style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: '#e34c4c', cursor: 'pointer', fontSize: '0.8rem' }}
                        >✕</button>
                        <input value={s.num}
                          onChange={e => updateFemaleStat(i, 'num', e.target.value)}
                          style={{ width: '100%', background: 'transparent', border: 'none', fontFamily: 'var(--font-bebas)', fontSize: '2.4rem', color: 'var(--tan)', outline: 'none', lineHeight: 1, marginBottom: 6 }}
                        />
                        <input value={s.label}
                          onChange={e => updateFemaleStat(i, 'label', e.target.value)}
                          style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.72rem', color: 'var(--muted)', outline: 'none', letterSpacing: '0.08em', paddingBottom: 4 }}
                        />
                      </div>
                    ))}
                  </div>
                  <button onClick={addFemaleStat} style={{ background: 'none', border: '1px dashed var(--border)', color: 'var(--muted)', width: '100%', padding: 10, fontSize: '0.7rem', cursor: 'pointer', marginBottom: 24, fontFamily: 'var(--font-barlow-condensed)' }}>
                    + ADD NEW STAT
                  </button>
                  <GroupLabel>Female Section Background Image</GroupLabel>
                  <Grid cols={1}>
                    <FieldCard label="Female Image URL"><CInput value={data.femaleImage} onChange={v => update('femaleImage', v)} /></FieldCard>
                    {data.femaleImage && (
                      <div style={{ marginTop: 12, border: '1px solid var(--border)', background: 'var(--card)', padding: 8, borderRadius: 4 }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--tan)', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.05em' }}>PREVIEW</div>
                        <img src={data.femaleImage} alt="Female Preview" style={{ width: '100%', height: 'auto', maxHeight: 200, objectFit: 'contain', background: '#000' }} referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </Grid>
                  <GroupLabel>Feature List</GroupLabel>
                  {data.femaleFeatures?.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ color: 'var(--muted)' }}>⠿</span>
                      <CInput value={f} onChange={v => updateFemaleFeature(i, v)} style={{ flex: 1 }} />
                      <button onClick={() => deleteFemaleFeature(i)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem', padding: '0 6px' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                      >✕</button>
                    </div>
                  ))}
                  <AddBtn onClick={addFemaleFeature}>+ ADD FEATURE</AddBtn>
                </PanelWrap>
              )}

              {/* ── TRAINING ── */}
              {tab === 'training' && (
                <PanelWrap title="TRAINING" accent="SESSIONS" desc="Manage your training programme cards">
                  {data.training?.map((card, i) => (
                    <div key={i} style={{ marginBottom: 40, border: '1px solid var(--border)', padding: 24, position: 'relative', background: 'rgba(255,255,255,0.02)' }}>
                              <button onClick={() => deleteTrainingCard(i)} 
                                style={{ 
                                  position: 'absolute', top: 12, right: 12, 
                                  background: 'rgba(224, 85, 85, 0.1)', 
                                  border: '1px solid #e34c4c', 
                                  color: '#e34c4c', 
                                  width: 28, height: 28, 
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s',
                                  zIndex: 10
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#e34c4c', e.currentTarget.style.color = '#fff')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(224, 85, 85, 0.1)', e.currentTarget.style.color = '#e34c4c')}
                                title="Delete Card"
                              >✕</button>
                      <GroupLabel>Card {String(i + 1).padStart(2, '0')} {card.icon}</GroupLabel>
                      <Grid cols={3}>
                        <FieldCard label="Icon (emoji)"><CInput value={card.icon} onChange={v => updateTraining(i, 'icon', v)} /></FieldCard>
                        <FieldCard label="Title"><CInput value={card.title} onChange={v => updateTraining(i, 'title', v)} /></FieldCard>
                        <FieldCard label="Tag / Badge" highlight><CInput value={card.tag} onChange={v => updateTraining(i, 'tag', v)} /></FieldCard>
                      </Grid>
                      <Grid cols={1} style={{ marginTop: -8 }}>
                        <FieldCard label="Description"><CTextarea value={card.desc} onChange={v => updateTraining(i, 'desc', v)} rows={2} /></FieldCard>
                      </Grid>
                    </div>
                  ))}
                  <AddBtn onClick={addTrainingCard}>+ ADD NEW TRAINING CARD</AddBtn>
                </PanelWrap>
              )}

              {/* ── PRICES ── */}
              {tab === 'prices' && (
                <PanelWrap title="PRICING" accent="PLANS" desc="Update membership prices — reflects live on website">
                  <GroupLabel>Membership Plans</GroupLabel>
                  <div className="admin-grid-1" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                    {data.membershipPlans?.map((p, i) => {
                      const isFeatured = data.pFeatured === p.id
                      return (
                        <div key={p.id} style={{
                          position: 'relative',
                          background: isFeatured ? 'rgba(200,169,110,0.08)' : 'var(--card)',
                          border: `1px solid ${isFeatured ? 'var(--tan)' : 'var(--border)'}`,
                          padding: '24px',
                          transition: 'all 0.3s',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 12 }}>
                              <button 
                                onClick={() => update('pFeatured', p.id)}
                                style={{
                                  background: isFeatured ? 'var(--tan)' : 'var(--dark)',
                                  color: isFeatured ? 'var(--black)' : 'var(--muted)',
                                  border: `1px solid ${isFeatured ? 'var(--tan)' : 'var(--border)'}`,
                                  fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.62rem',
                                  letterSpacing: '0.12em', padding: '4px 12px', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase'
                                }}
                              >
                                {isFeatured ? '★ Best Value Plan' : 'Set as Best Value'}
                              </button>
                            </div>
                            <button onClick={() => deleteMembershipPlan(i)} 
                              style={{ 
                                background: 'rgba(224, 85, 85, 0.1)', 
                                border: '1px solid #e34c4c', 
                                color: '#e34c4c', 
                                padding: '4px 12px',
                                fontSize: '0.68rem', 
                                cursor: 'pointer', 
                                fontFamily: 'var(--font-barlow-condensed)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#e34c4c', e.currentTarget.style.color = '#fff')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(224, 85, 85, 0.1)', e.currentTarget.style.color = '#e34c4c')}
                            >
                              Remove Plan
                            </button>
                          </div>
                          <Grid cols={3}>
                            <FieldCard label="Duration"><CInput value={p.duration} onChange={v => updateMembershipPlan(i, 'duration', v)} /></FieldCard>
                            <FieldCard label="Price Heading"><CInput value={p.price} onChange={v => updateMembershipPlan(i, 'price', v)} /></FieldCard>
                            <FieldCard label="Sub-label"><CInput value={p.label} onChange={v => updateMembershipPlan(i, 'label', v)} /></FieldCard>
                          </Grid>
                        </div>
                      )
                    })}
                    <AddBtn onClick={addMembershipPlan}>+ ADD NEW MEMBERSHIP PLAN</AddBtn>
                  </div>

                  <GroupLabel>Personal Training Packages</GroupLabel>
                  <Grid cols={2}>
                    {data.ptPackages?.map((pkg, i) => (
                      <div key={pkg.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderTop: '3px solid var(--tan-d)', padding: 22, position: 'relative' }}>
                        <button onClick={() => deletePTPackage(i)} 
                          style={{ 
                            position: 'absolute', top: 12, right: 12, 
                            background: 'rgba(224, 85, 85, 0.1)', 
                            border: '1px solid #e34c4c', 
                            color: '#e34c4c', 
                            width: 28, height: 28, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s',
                            zIndex: 10
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#e34c4c', e.currentTarget.style.color = '#fff')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(224, 85, 85, 0.1)', e.currentTarget.style.color = '#e34c4c')}
                          title="Delete Package"
                        >✕</button>
                        <Grid cols={1}>
                          <FieldCard label="Title"><CInput value={pkg.title} onChange={v => updatePTPackage(i, 'title', v)} /></FieldCard>
                          <FieldCard label="Subtitle"><CInput value={pkg.subtitle} onChange={v => updatePTPackage(i, 'subtitle', v)} /></FieldCard>
                          <FieldCard label="Price"><CInput value={pkg.price} onChange={v => updatePTPackage(i, 'price', v)} /></FieldCard>
                        </Grid>
                        
                        <label style={{ display: 'block', fontSize: '0.62rem', color: 'var(--tan)', textTransform: 'uppercase', marginBottom: 10, marginTop: 10 }}>Package Features</label>
                        {pkg.features?.map((f, fi) => (
                          <div key={fi} style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                            <CInput value={f} onChange={v => updatePTFeature(i, fi, v)} style={{ fontSize: '0.75rem', padding: '6px 10px' }} />
                            <button onClick={() => deletePTFeature(i, fi)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>✕</button>
                          </div>
                        ))}
                        <button onClick={() => addPTFeature(i)} style={{ background: 'none', border: '1px dashed var(--border)', color: 'var(--muted)', width: '100%', padding: 8, fontSize: '0.7rem', cursor: 'pointer', marginTop: 6, fontFamily: 'var(--font-barlow-condensed)' }}>
                          + ADD FEATURE
                        </button>
                      </div>
                    ))}
                  </Grid>
                  <AddBtn onClick={addPTPackage}>+ ADD NEW PT PACKAGE</AddBtn>
                </PanelWrap>
              )}

              {/* ── CONTACT ── */}
              {tab === 'contact' && (
                <PanelWrap title="CONTACT" accent="INFO" desc="Update gym branches, phone, opening hours and payment methods">
                  <GroupLabel>Gym Branches / Locations</GroupLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
                    {data.locations?.map((loc, i) => (
                      <div key={loc.id} style={{ position: 'relative', background: 'var(--card)', border: '1px solid var(--border)', padding: '24px', borderLeft: '4px solid var(--tan)' }}>
                        <button onClick={() => deleteLocation(i)} 
                          style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(224, 85, 85, 0.1)', border: '1px solid #e34c4c', color: '#e34c4c', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#e34c4c', e.currentTarget.style.color = '#fff')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(224, 85, 85, 0.1)', e.currentTarget.style.color = '#e34c4c')}
                        >✕</button>
                        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.2rem', marginBottom: 16, color: 'var(--tan)' }}>BRANCH 0{i + 1}</div>
                        <Grid cols={1}>
                          <FieldCard label="Full Address (with line breaks if needed)"><CTextarea value={loc.address} onChange={v => updateLocation(i, 'address', v)} rows={2} /></FieldCard>
                          <FieldCard label="Google Maps Embed URL (from Share -> Embed Map -> src URL)"><CInput value={loc.mapUrl} onChange={v => updateLocation(i, 'mapUrl', v)} /></FieldCard>
                        </Grid>
                      </div>
                    ))}
                    <button onClick={addLocation} style={{ background: 'none', border: '1px dashed var(--border)', color: 'var(--muted)', padding: 12, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.1em' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--tan)', e.currentTarget.style.color = 'var(--tan)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)', e.currentTarget.style.color = 'var(--muted)')}
                    >+ ADD NEW BRANCH</button>
                  </div>

                  <GroupLabel>General Contact Info</GroupLabel>
                  <Grid cols={2}>
                    <FieldCard label="Phone Numbers">
                      <CInput value={data.ph} onChange={v => update('ph', v)} />
                      <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.65rem', color: 'var(--muted)', marginTop: 6 }}>Separate numbers with · symbol</div>
                    </FieldCard>
                    <FieldCard label="Accepted payment methods"><CInput value={data.pay} onChange={v => update('pay', v)} /></FieldCard>
                  </Grid>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                    {data.openingHours?.map((slot, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--card)', border: '1px solid var(--border)', padding: '12px 16px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--tan)', textTransform: 'uppercase', marginBottom: 4 }}>Day (e.g. Mon–Sat)</label>
                          <CInput value={slot.day} onChange={v => updateOpeningHour(i, 'day', v)} />
                        </div>
                        <div style={{ flex: 2 }}>
                          <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--tan)', textTransform: 'uppercase', marginBottom: 4 }}>Time (e.g. 5:00 AM – 9:00 PM)</label>
                          <CInput value={slot.time} onChange={v => updateOpeningHour(i, 'time', v)} />
                        </div>
                        <button onClick={() => deleteOpeningHour(i)} 
                          style={{ background: 'rgba(224, 85, 85, 0.1)', border: '1px solid #e34c4c', color: '#e34c4c', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: 18 }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#e34c4c', e.currentTarget.style.color = '#fff')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(224, 85, 85, 0.1)', e.currentTarget.style.color = '#e34c4c')}
                        >✕</button>
                      </div>
                    ))}
                    <button onClick={addOpeningHour} style={{ background: 'none', border: '1px dashed var(--border)', color: 'var(--muted)', padding: 12, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.1em' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--tan)', e.currentTarget.style.color = 'var(--tan)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)', e.currentTarget.style.color = 'var(--muted)')}
                    >+ ADD NEW TIME SLOT</button>
                  </div>
                  <GroupLabel>Payment</GroupLabel>
                  <Grid cols={1}><FieldCard label="Accepted payment methods"><CInput value={data.pay} onChange={v => update('pay', v)} /></FieldCard></Grid>
                </PanelWrap>
              )}

              {/* ── GALLERY ── */}
              {tab === 'gallery' && (
                <PanelWrap title="GALLERY" accent="PHOTOS" desc="Add or remove photos shown in the gallery slider">
                  <GroupLabel>Add New Photo</GroupLabel>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <input value={newUrl} onChange={e => setNewUrl(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addPhoto()}
                      placeholder="Paste image URL here  (e.g. from imgbb.com, imgur.com...)"
                      style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', padding: '11px 14px', fontFamily: 'var(--font-barlow)', fontSize: '0.86rem', color: 'var(--white)', outline: 'none', borderRadius: 0 }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--tan)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                    />
                    <button onClick={addPhoto} style={{ background: 'var(--tan)', color: 'var(--black)', border: 'none', padding: '0 22px', fontFamily: 'var(--font-bebas)', fontSize: '0.95rem', letterSpacing: '0.1em', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--tan-l)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--tan)')}
                    >ADD PHOTO</button>
                  </div>
                  <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 24, letterSpacing: '0.04em', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderLeft: '2px solid var(--tan)' }}>
                    💡 Copy image URL from <strong style={{ color: 'var(--tan)' }}>Facebook, Instagram, or Google</strong> → paste above
                    <br/>
                    <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>Or upload to <strong style={{ color: 'var(--tan)' }}>imgbb.com</strong> for a direct link.</span>
                  </div>
                  <GroupLabel>Current Photos ({data.gallery.length})</GroupLabel>
                  <Reorder.Group axis="y" values={data.gallery} onReorder={updateGalleryOrder} 
                    style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}
                  >
                    {data.gallery.length === 0 && (
                      <div style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--border)', fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.8rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
                        No photos yet. Add your first gym photo above ↑
                      </div>
                    )}
                    {data.gallery.map((url, i) => (
                      <GalleryThumb key={url} url={url} index={i} onDelete={() => deletePhoto(i)} />
                    ))}
                  </Reorder.Group>
                </PanelWrap>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Save bar */}
      <div className="admin-save-bar" style={{
        background: 'var(--dark)', borderTop: '1px solid var(--border)',
        padding: '14px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: saved ? '#27ae60' : '#e67e22', transition: 'background 0.3s' }} />
          <span style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.8rem', letterSpacing: '0.1em', color: saved ? '#27ae60' : '#e67e22', transition: 'color 0.3s' }}>
            {saved ? 'All changes saved' : 'Unsaved changes'}
          </span>
        </div>
        <button onClick={handleSave} style={{
          background: saveFlash ? '#27ae60' : 'var(--tan)',
          color: saveFlash ? 'white' : 'var(--black)',
          border: 'none', padding: '12px 36px',
          fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', letterSpacing: '0.1em',
          cursor: 'pointer', transition: 'background 0.3s',
          display: 'flex', alignItems: 'center', gap: 8,
          clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
        }}>
          {saveFlash ? '✓  SAVED!' : '💾  SAVE ALL CHANGES'}
        </button>
      </div>
    </div>
    <AnimatePresence>
      {focusOverlay && <MobileFocusOverlay field={focusOverlay} onClose={closeFocusOverlay} />}
    </AnimatePresence>
    </FocusOverlayContext.Provider>
  )
}

// ── Reusable sub-components ──
function PanelWrap({ title, accent, desc, children }: { title: string; accent: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', letterSpacing: '0.04em' }}>
          {title} <span style={{ color: 'var(--tan)' }}>{accent}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.05em', marginTop: 4 }}>{desc}</div>
      </div>
      {children}
    </div>
  )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.65rem', letterSpacing: '0.28em', color: 'var(--muted)', textTransform: 'uppercase', padding: '6px 0 12px', borderBottom: '1px solid var(--border)', marginBottom: 16, marginTop: 8 }}>
      {children}
    </div>
  )
}

function Grid({ cols, children, style }: { cols: number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className={`admin-grid-${cols}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 16, marginBottom: 24, ...style }}>
      {children}
    </div>
  )
}

function FieldCard({ label, highlight, children }: { label: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ 
      background: 'var(--card)', 
      border: `1px solid ${highlight ? 'rgba(200,169,110,0.35)' : 'var(--border)'}`, 
      padding: 20,
      clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
    }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--tan)', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  )
}

function CInput({ value, onChange, style, label }: { value: string; onChange: (v: string) => void; style?: React.CSSProperties; label?: string }) {
  const ctx = useContext(FocusOverlayContext)
  return (
    <input value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', background: 'var(--dark)', border: '1px solid var(--border)', padding: '10px 12px', fontFamily: 'var(--font-barlow)', fontSize: '16px', color: 'var(--white)', outline: 'none', borderRadius: 0, ...style }}
      onFocus={e => {
        e.currentTarget.style.borderColor = 'var(--tan)'
        if (ctx && typeof window !== 'undefined' && window.innerWidth <= 900) {
          document.getElementById('__kb_proxy')?.remove()
          const proxy = document.createElement('input')
          proxy.style.cssText = 'position:fixed;top:0;left:0;opacity:0;height:0;width:0;font-size:16px;'
          proxy.id = '__kb_proxy'
          document.body.appendChild(proxy)
          e.currentTarget.blur()
          proxy.focus()
          try {
            ctx(label || 'Edit Field', value, onChange, 'input')
          } catch {
            proxy.remove()
          }
        }
      }}
      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    />
  )
}

function CTextarea({ value, onChange, rows = 3, label }: { value: string; onChange: (v: string) => void; rows?: number; label?: string }) {
  const ctx = useContext(FocusOverlayContext)
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
      style={{ width: '100%', background: 'var(--dark)', border: '1px solid var(--border)', padding: '10px 12px', fontFamily: 'var(--font-barlow)', fontSize: '16px', color: 'var(--white)', outline: 'none', resize: 'vertical', borderRadius: 0 }}
      onFocus={e => {
        e.currentTarget.style.borderColor = 'var(--tan)'
        if (ctx && typeof window !== 'undefined' && window.innerWidth <= 900) {
          document.getElementById('__kb_proxy')?.remove()
          const proxy = document.createElement('input')
          proxy.style.cssText = 'position:fixed;top:0;left:0;opacity:0;height:0;width:0;font-size:16px;'
          proxy.id = '__kb_proxy'
          document.body.appendChild(proxy)
          e.currentTarget.blur()
          proxy.focus()
          try {
            ctx(label || 'Edit Field', value, onChange, 'textarea')
          } catch {
            proxy.remove()
          }
        }
      }}
      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    />
  )
}

function AddBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ background: 'var(--tan)', color: 'var(--black)', border: 'none', padding: '10px 20px', fontFamily: 'var(--font-bebas)', fontSize: '0.85rem', letterSpacing: '0.1em', cursor: 'pointer', marginTop: 8 }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--tan-l)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--tan)')}
    >{children}</button>
  )
}

function GalleryThumb({ url, index, onDelete }: { url: string; index: number; onDelete: () => void }) {
  return (
    <Reorder.Item value={url} style={{ cursor: 'grab', background: 'var(--dark)', border: '1px solid var(--border)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ color: 'var(--muted)', fontSize: '1.2rem', userSelect: 'none' }}>⠿</div>
      <div style={{ width: 80, height: 50, background: '#1a1a1a', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
      </div>
      <div style={{ flex: 1, fontFamily: 'var(--font-barlow)', fontSize: '0.75rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {url}
      </div>
      <div style={{
        fontFamily: 'var(--font-bebas)', fontSize: '1rem', color: 'var(--tan)', letterSpacing: '0.1em', width: 30, textAlign: 'center'
      }}>{String(index + 1).padStart(2, '0')}</div>
      <button onClick={(e) => { e.stopPropagation(); onDelete() }} style={{
        background: 'none', border: 'none', color: 'var(--muted)',
        width: 28, height: 28, fontSize: '1rem', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'color 0.2s', zIndex: 10,
      }}
        onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
      >✕</button>
    </Reorder.Item>
  )
}

/* ── Focus Overlay Context ── */
const FocusOverlayContext = createContext<((label: string, value: string, onChange: (v: string) => void, type: 'input' | 'textarea') => void) | null>(null)

function MobileFocusOverlay({ field, onClose }: {
  field: { label: string; value: string; onChange: (v: string) => void; type: 'input' | 'textarea' };
  onClose: () => void;
}) {
  const [localValue, setLocalValue] = useState(field.value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setLocalValue(field.value)
    // Transfer focus from proxy input to actual overlay input (keeps iOS keyboard alive)
    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
      // Remove keyboard proxy
      const proxy = document.getElementById('__kb_proxy')
      if (proxy) proxy.remove()
    }, 50)
    return () => clearTimeout(timer)
  }, [field])

  const handleChange = (v: string) => {
    setLocalValue(v)
    field.onChange(v)
  }

  const handleDone = () => {
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={handleDone}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
        alignItems: 'center', padding: '60px 20px 20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 500,
          background: 'var(--card)', border: '1px solid var(--tan)',
          padding: '28px 24px',
          clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)'
        }}
      >
        {/* Label */}
        <div style={{
          fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.85rem',
          letterSpacing: '0.2em', color: 'var(--tan)', textTransform: 'uppercase',
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--tan)' }} />
          {field.label}
        </div>

        {/* Input / Textarea */}
        {field.type === 'textarea' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={localValue}
            onChange={e => handleChange(e.target.value)}
            rows={6}
            style={{
              width: '100%', background: 'var(--dark)', border: '1px solid var(--border)',
              padding: '16px', fontFamily: 'var(--font-barlow)', fontSize: '18px',
              color: 'var(--white)', outline: 'none', resize: 'vertical', borderRadius: 0,
              lineHeight: 1.6
            }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={localValue}
            onChange={e => handleChange(e.target.value)}
            style={{
              width: '100%', background: 'var(--dark)', border: '1px solid var(--border)',
              padding: '16px', fontFamily: 'var(--font-barlow)', fontSize: '18px',
              color: 'var(--white)', outline: 'none', borderRadius: 0,
            }}
          />
        )}

        {/* Done button */}
        <button onClick={handleDone} style={{
          marginTop: 20, width: '100%', background: 'var(--tan)', color: 'var(--black)',
          border: 'none', padding: '14px', fontFamily: 'var(--font-bebas)', fontSize: '1.1rem',
          letterSpacing: '0.12em', cursor: 'pointer',
          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
        }}>
          DONE ✓
        </button>
      </motion.div>
    </motion.div>
  )
}


