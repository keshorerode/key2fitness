'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'

const links = [
  { label: 'About',    href: '#hero' },
  { label: 'Training', href: '#training' },
  { label: 'Gallery',  href: '#gallery' },
  { label: 'Packages', href: '#packages' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 200, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 60px', height: '72px',
        transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
        background: scrolled ? 'rgba(8,8,8,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      {/* Logo */}
      <motion.a
        href="#"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ textDecoration: 'none' }}
      >
        <BrandLogo style={{ fontSize: '26px' }} />
      </motion.a>

      {/* Desktop nav */}
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
        style={{ display: 'flex', alignItems: 'center', gap: '36px', listStyle: 'none' }}
        className="nav-desktop"
      >
        {links.map(l => (
          <motion.li key={l.label} variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0 } }}>
            <a href={l.href} style={{
              fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.82rem',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(240,236,228,0.72)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--tan)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,236,228,0.72)')}
            >{l.label}</a>
          </motion.li>
        ))}
        <motion.li variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0 } }}>
          <a href="#contact" style={{
            background: 'var(--tan)', color: 'var(--black)',
            padding: '9px 24px', display: 'inline-block',
            fontFamily: 'var(--font-bebas)', fontSize: '1rem', letterSpacing: '0.1em',
            textDecoration: 'none', transition: 'all 0.2s',
            clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--tan-l)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--tan)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >JOIN NOW</a>
        </motion.li>
      </motion.ul>

      {/* Mobile hamburger */}
      <button
        className="nav-mobile-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none', background: 'none', border: 'none',
          color: 'var(--white)', fontSize: '1.5rem', cursor: 'pointer',
        }}
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: '72px', left: 0, right: 0,
            background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(14px)',
            borderBottom: '1px solid var(--border)',
            padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '16px',
            zIndex: 199,
          }}
        >
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{
              fontFamily: 'var(--font-barlow-condensed)', fontSize: '1.1rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(240,236,228,0.8)', textDecoration: 'none',
            }}>{l.label}</a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} style={{
            background: 'var(--tan)', color: 'var(--black)',
            padding: '12px 22px', textAlign: 'center',
            fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', letterSpacing: '0.1em',
            textDecoration: 'none',
          }}>JOIN NOW</a>
        </motion.div>
      )}

      {/* Global CSS handles mobile layout */}
    </motion.nav>
  )
}
