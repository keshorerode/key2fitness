'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { CMSData } from '@/lib/cms-data'

const features = [
  'Expert personal trainers dedicated to female fitness goals',
  'Spin cycling, treadmills & full cardio zone',
  'Core strength, CrossFit & fat-reduction programmes',
  'Personalised diet plans updated every 10 days',
  'Safe, unisex environment — train at your own pace',
]

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
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1000&q=85&auto=format&fit=crop"
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
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { num: data.s1n, label: data.s1l },
            { num: data.s2n, label: data.s2l },
            { num: data.s3n, label: data.s3l },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              style={{ border: '1px solid var(--border)', padding: '13px 18px', minWidth: 110 }}
            >
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.9rem', color: 'var(--tan)', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.05em', marginTop: 4 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        <ul className="feature-list">
          {features.map((f, i) => <li key={i}>{f}</li>)}
        </ul>

        <a href="#packages" className="btn-fill" style={{ alignSelf: 'flex-start' }}>SEE MEMBERSHIP PLANS</a>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          #female { grid-template-columns: 1fr !important; }
          #female > div:first-child { height: 56vw; }
          #female > div:last-child { padding: 60px 28px !important; }
        }
      ` }} />
    </section>
  )
}
