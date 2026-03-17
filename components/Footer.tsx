'use client'

const links = ['About', 'Training', 'Gallery', 'Packages']

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--dark)',
      borderTop: '1px solid var(--border)',
      padding: '28px 60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.4rem', color: 'var(--tan)', letterSpacing: '0.05em' }}>
        KEY 2 FITNESS
      </div>

      <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
        © 2025 The Key 2 Fitness Unisex Gym · Erode, TN
      </div>

      <ul style={{ display: 'flex', gap: 28, listStyle: 'none', alignItems: 'center' }}>
        {links.map(l => (
          <li key={l}>
            <a href={`#${l.toLowerCase()}`}
              style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.78rem', letterSpacing: '0.12em', color: 'var(--muted)', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--tan)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >{l}</a>
          </li>
        ))}
        <li>
          <a href="/admin"
            style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.6rem', letterSpacing: '0.05em', color: 'var(--border)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--muted)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--border)')}
          >admin</a>
        </li>
      </ul>

      <style>{`
        @media (max-width: 900px) {
          footer { flex-direction: column !important; gap: 16px; text-align: center; padding: 28px 24px !important; }
          footer ul { flex-wrap: wrap; justify-content: center; gap: 16px !important; }
        }
      `}</style>
    </footer>
  )
}
