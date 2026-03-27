'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { CMSData } from '@/lib/cms-data'

export default function FemaleSection({ data }: { data: CMSData }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="female" style={{
      minHeight: '90vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
      background: 'var(--dark)', overflow: 'hidden',
    }}>
      {/* ── LEFT: Female Photo ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{ position: 'relative', overflow: 'hidden' }}
        ref={ref}
      >
        <div className="female-photo-mask" style={{
          position: 'absolute', inset: 0,
          transition: 'transform 7s ease',
        }}>
          <Image
            src={data.femaleImage}
            alt="Female athlete training"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top', filter: 'brightness(0.5) saturate(0.6) contrast(1.1)' }}
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Right-edge gradient blend */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to left, var(--dark) 0%, rgba(15,15,15,0.7) 12%, rgba(15,15,15,0.2) 30%, transparent 55%), linear-gradient(to bottom, rgba(15,15,15,0.3) 0%, transparent 20%, transparent 75%, rgba(15,15,15,0.85) 100%)',
        }} />
      </motion.div>

      {/* ── RIGHT: Stats + Features ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        style={{
          padding: '100px 70px 80px 60px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26,
        }}
      >
        <span className="eyebrow">For Her</span>

        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2.8rem,4.5vw,5rem)', lineHeight: 0.92, letterSpacing: '0.02em' }}>
          <div>{data.fl1}</div>
          <div>{data.fl2}</div>
          <div style={{ color: 'var(--tan)' }}>{data.fl3}</div>
        </div>

        <div className="gold-divider" />

        <p style={{ fontSize: '0.97rem', color: 'rgba(240,236,228,0.62)', lineHeight: 1.82, maxWidth: 460 }}>
          {data.fb}
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
          {data.femaleStats?.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '20px 10px', textAlign: 'center' }}
            >
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', color: 'var(--tan)', lineHeight: 1, marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        <ul className="feature-list">
          {data.femaleFeatures?.map((f: string, i: number) => <li key={i}>{f}</li>) ?? null}
        </ul>

        <a href="#packages" className="btn-fill" style={{ alignSelf: 'flex-start' }}>SEE MEMBERSHIP PLANS</a>
      </motion.div>

      {/* Global CSS handles mobile layout */}
    </section>
  )
}
