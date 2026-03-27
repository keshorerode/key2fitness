'use client'
import BrandLogo from '@/components/BrandLogo'

const links = [
  { label: 'About', href: '#hero' },
  { label: 'Training', href: '#training' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Packages', href: '#packages' },
  { label: 'Admin', href: '/admin' },
]

export default function Footer() {
  return (
    <footer id="footer" style={{
      background: 'var(--dark)',
      borderTop: '1px solid var(--border)',
      padding: '16px 60px',
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
      alignItems: 'center',
    }}>
      <div className="footer-logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="#" style={{ textDecoration: 'none' }}>
          <BrandLogo style={{ fontSize: '26px' }} />
        </a>
      </div>

      <div className="footer-address" style={{ justifySelf: 'center', fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.1em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div>© 2025 The Key 2 Fitness Unisex Gym · Erode, TN</div>
        <a href="https://www.linkedin.com/in/keshorevm" target="_blank" rel="noopener noreferrer"
          style={{ color: 'rgba(240,236,228,0.3)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--tan)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,236,228,0.3)')}
        >Developed by Keshore V M</a>
      </div>

      <ul className="footer-links" style={{ justifySelf: 'end', display: 'flex', gap: 28, listStyle: 'none', alignItems: 'center' }}>
        {links.map(l => (
          <li key={l.label}>
            <a href={l.href}
              style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.78rem', letterSpacing: '0.12em', color: 'var(--muted)', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--tan)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >{l.label}</a>
          </li>
        ))}
      </ul>

      {/* Global CSS handles mobile layout */}
    </footer>
  )
}
