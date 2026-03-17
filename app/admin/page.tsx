'use client'
import { useState, useEffect } from 'react'
import { loadData, saveData, defaultData, CMSData } from '@/lib/cms-data'
import { motion, AnimatePresence, Reorder } from 'framer-motion'

const getExpectedPassword = () => {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `key2fitness${dd}${mm}${yyyy}`
}

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
  const [saved, setSaved]       = useState(true)
  const [saveFlash, setSaveFlash] = useState(false)
  const [newUrl, setNewUrl]     = useState('')

  useEffect(() => {
    if (authed) setData(loadData())
  }, [authed])

  // Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const login = () => {
    if (pw === getExpectedPassword()) { setAuthed(true); setError('') }
    else {
      setShake(true); setError('Incorrect password.')
      setPw(''); setTimeout(() => setShake(false), 500)
    }
  }

  const update = (key: keyof CMSData, val: string) => {
    setData(prev => ({ ...prev, [key]: val }))
    setSaved(false)
  }

  const updateTraining = (i: number, field: string, val: string) => {
    const t = [...data.training]
    t[i] = { ...t[i], [field]: val }
    setData(prev => ({ ...prev, training: t }))
    setSaved(false)
  }

  const updateQuote = (i: number, val: string) => {
    const q = [...data.extraQuotes]
    q[i] = val
    setData(prev => ({ ...prev, extraQuotes: q }))
    setSaved(false)
  }

  const addQuote = () => {
    setData(prev => ({ ...prev, extraQuotes: [...prev.extraQuotes, 'New quote...'] }))
    setSaved(false)
  }

  const deleteQuote = (i: number) => {
    const q = [...data.extraQuotes]
    q.splice(i, 1)
    setData(prev => ({ ...prev, extraQuotes: q }))
    setSaved(false)
  }

  const addPhoto = () => {
    if (!newUrl.trim()) return
    setData(prev => ({ ...prev, gallery: [...prev.gallery, newUrl.trim()] }))
    setNewUrl('')
    setSaved(false)
  }

  const deletePhoto = (i: number) => {
    const g = [...data.gallery]
    g.splice(i, 1)
    setData(prev => ({ ...prev, gallery: g }))
    setSaved(false)
  }

  const updateGalleryOrder = (newOrder: string[]) => {
    setData(prev => ({ ...prev, gallery: newOrder }))
    setSaved(false)
  }

  const handleSave = () => {
    saveData(data)
    setSaved(true)
    setSaveFlash(true)
    setTimeout(() => setSaveFlash(false), 2000)
  }

  // ── LOGIN SCREEN ──
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 24 }}>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', letterSpacing: '0.08em', marginBottom: 4 }}>
          <span style={{ color: 'var(--tan)' }}>KEY 2</span> FITNESS
        </div>
        <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.72rem', letterSpacing: '0.35em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 40 }}>
          Admin Dashboard · CMS Portal
        </div>

        <motion.div animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
          style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '40px 36px' }}
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
              style={{ width: '100%', background: 'var(--dark)', border: '1px solid var(--border)', padding: '13px 44px 13px 14px', fontFamily: 'var(--font-barlow)', fontSize: '0.9rem', color: 'var(--white)', outline: 'none', borderRadius: 0, transition: 'border-color 0.2s' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--tan)')}
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
  )

  // ── DASHBOARD ──
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--black)' }}>

      {/* Topbar */}
      <div style={{
        height: 60, background: 'var(--card)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0,
      }}>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.4rem', letterSpacing: '0.06em' }}>
          <span style={{ color: 'var(--tan)' }}>KEY 2</span> FITNESS · CMS
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--tan)', background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.25)', padding: '4px 10px', textTransform: 'uppercase' }}>✦ Admin</span>
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

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <nav style={{ width: 220, background: 'var(--dark)', borderRight: '1px solid var(--border)', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '20px 0', gap: 2, overflowY: 'auto' }}>
          {['Content', 'Business', 'Media'].map((section, si) => (
            <div key={section}>
              <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.62rem', letterSpacing: '0.25em', color: 'var(--muted)', textTransform: 'uppercase', padding: '8px 20px 4px', marginTop: si > 0 ? 10 : 0 }}>{section}</div>
              {navItems.slice(si === 0 ? 0 : si === 1 ? 3 : 5, si === 0 ? 3 : si === 1 ? 5 : 6).map(item => (
                <button key={item.id} onClick={() => setTab(item.id)}
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', background: 'var(--black)' }}>
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
                  <AddBtn onClick={addQuote}>+ ADD QUOTE</AddBtn>
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
                    {[
                      { numKey: 's1n', lblKey: 's1l' },
                      { numKey: 's2n', lblKey: 's2l' },
                      { numKey: 's3n', lblKey: 's3l' },
                    ].map(({ numKey, lblKey }) => (
                      <div key={numKey} style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: 18 }}>
                        <input value={(data as any)[numKey]}
                          onChange={e => update(numKey as keyof CMSData, e.target.value)}
                          style={{ width: '100%', background: 'transparent', border: 'none', fontFamily: 'var(--font-bebas)', fontSize: '2.4rem', color: 'var(--tan)', outline: 'none', lineHeight: 1, marginBottom: 6 }}
                        />
                        <input value={(data as any)[lblKey]}
                          onChange={e => update(lblKey as keyof CMSData, e.target.value)}
                          style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.72rem', color: 'var(--muted)', outline: 'none', letterSpacing: '0.08em', paddingBottom: 4 }}
                        />
                      </div>
                    ))}
                  </div>
                </PanelWrap>
              )}

              {/* ── TRAINING ── */}
              {tab === 'training' && (
                <PanelWrap title="TRAINING" accent="SESSIONS" desc="Edit the 6 training programme cards">
                  {data.training.map((card, i) => (
                    <div key={i} style={{ marginBottom: 20 }}>
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
                </PanelWrap>
              )}

              {/* ── PRICES ── */}
              {tab === 'prices' && (
                <PanelWrap title="PRICING" accent="PLANS" desc="Update membership prices — reflects live on website">
                  <GroupLabel>Membership Plans</GroupLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginBottom: 24, paddingTop: 40 }}>
                    {[
                      { dur: '1 Month',   key: 'p1' },
                      { dur: '3 Months',  key: 'p2' },
                      { dur: '7 Months',  key: 'p3' },
                      { dur: '13 Months', key: 'p4' },
                      { dur: '24 Months', key: 'p5' },
                    ].map(p => {
                      const isFeatured = data.pFeatured === p.key
                      return (
                        <div key={p.key} style={{
                          position: 'relative',
                          background: isFeatured ? 'rgba(200,169,110,0.08)' : 'var(--card)',
                          border: `1px solid ${isFeatured ? 'var(--tan)' : 'var(--border)'}`,
                          padding: '18px 14px', textAlign: 'center',
                          transition: 'all 0.3s',
                        }}>
                          <button 
                            onClick={() => update('pFeatured', p.key)}
                            style={{
                              position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                              background: isFeatured ? 'var(--tan)' : 'var(--dark)',
                              color: isFeatured ? 'var(--black)' : 'var(--muted)',
                              border: `1px solid ${isFeatured ? 'var(--tan)' : 'var(--border)'}`,
                              fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.6rem',
                              letterSpacing: '0.12em', padding: '3px 10px', whiteSpace: 'nowrap',
                              cursor: 'pointer', transition: 'all 0.2s', zIndex: 5,
                              textTransform: 'uppercase'
                            }}
                          >
                            {isFeatured ? '★ Best Value' : 'Set Best Value'}
                          </button>
                          <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.65rem', letterSpacing: '0.15em', color: isFeatured ? 'var(--tan)' : 'var(--muted)', textTransform: 'uppercase', marginBottom: 10, marginTop: 8 }}>{p.dur}</div>
                          <input value={(data as any)[p.key]}
                            onChange={e => update(p.key as keyof CMSData, e.target.value)}
                            style={{ width: '100%', background: 'var(--dark)', border: '1px solid var(--border)', padding: 8, fontFamily: 'var(--font-bebas)', fontSize: '1.4rem', color: isFeatured ? 'var(--tan)' : 'var(--white)', textAlign: 'center', outline: 'none', borderRadius: 0 }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'var(--tan)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                          />
                        </div>
                      )
                    })}
                  </div>
                  <GroupLabel>Personal Training Packages</GroupLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[{ title: 'Personal Training', key: 'pt1' }, { title: 'Couple Package', key: 'pt2' }].map(p => (
                      <div key={p.key} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderTop: '3px solid var(--tan-d)', padding: 22 }}>
                        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.3rem', marginBottom: 14 }}>{p.title}</div>
                        <input value={(data as any)[p.key]}
                          onChange={e => update(p.key as keyof CMSData, e.target.value)}
                          style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-bebas)', fontSize: '3rem', color: 'var(--tan)', outline: 'none', paddingBottom: 4 }}
                          onFocus={e => (e.currentTarget.style.borderBottomColor = 'var(--tan)')}
                          onBlur={e => (e.currentTarget.style.borderBottomColor = 'var(--border)')}
                        />
                      </div>
                    ))}
                  </div>
                </PanelWrap>
              )}

              {/* ── CONTACT ── */}
              {tab === 'contact' && (
                <PanelWrap title="CONTACT" accent="INFO" desc="Update gym address, phone, opening hours and payment methods">
                  <GroupLabel>Location & Phone</GroupLabel>
                  <Grid cols={2}>
                    <FieldCard label="Gym Address"><CTextarea value={data.addr} onChange={v => update('addr', v)} rows={2} /></FieldCard>
                    <FieldCard label="Phone Numbers">
                      <CInput value={data.ph} onChange={v => update('ph', v)} />
                      <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.65rem', color: 'var(--muted)', marginTop: 6 }}>Separate numbers with · symbol</div>
                    </FieldCard>
                  </Grid>
                  <GroupLabel>Opening Hours</GroupLabel>
                  <Grid cols={2}>
                    <FieldCard label="Mon – Sat hours"><CInput value={data.h1} onChange={v => update('h1', v)} /></FieldCard>
                    <FieldCard label="Sunday hours"><CInput value={data.h2} onChange={v => update('h2', v)} /></FieldCard>
                  </Grid>
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
                  <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 24, letterSpacing: '0.05em' }}>
                    💡 Upload to <strong style={{ color: 'var(--tan)' }}>imgbb.com</strong> → copy Direct Link → paste above
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
      <div style={{
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
        }}>
          {saveFlash ? '✓  SAVED!' : '💾  SAVE ALL CHANGES'}
        </button>
      </div>
    </div>
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
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 16, marginBottom: 24, ...style }}>
      {children}
    </div>
  )
}

function FieldCard({ label, highlight, children }: { label: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: `1px solid ${highlight ? 'rgba(200,169,110,0.35)' : 'var(--border)'}`, padding: 20 }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--tan)', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  )
}

function CInput({ value, onChange, style }: { value: string; onChange: (v: string) => void; style?: React.CSSProperties }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', background: 'var(--dark)', border: '1px solid var(--border)', padding: '10px 12px', fontFamily: 'var(--font-barlow)', fontSize: '0.88rem', color: 'var(--white)', outline: 'none', borderRadius: 0, ...style }}
      onFocus={e => (e.currentTarget.style.borderColor = 'var(--tan)')}
      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    />
  )
}

function CTextarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
      style={{ width: '100%', background: 'var(--dark)', border: '1px solid var(--border)', padding: '10px 12px', fontFamily: 'var(--font-barlow)', fontSize: '0.88rem', color: 'var(--white)', outline: 'none', resize: 'vertical', borderRadius: 0 }}
      onFocus={e => (e.currentTarget.style.borderColor = 'var(--tan)')}
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
