'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { CMSData } from '@/lib/cms-data'

export default function TrainingSection({ data }: { data: CMSData }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="training" style={{ background: 'var(--black)', padding: '100px 60px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }} ref={ref}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 56, alignItems: 'start' }}
      >
        <div>
          <span className="eyebrow">WHAT WE OFFER</span>
          <div className="section-title">TRAINING <span style={{ color: 'var(--tan)' }}>SESSIONS</span></div>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.75, paddingTop: 48 }}>
          Six specialised programmes designed to push your limits, burn fat, build strength and transform your physique — for both men and women.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {data.training.map((card, i) => (
          <TrainingCard key={i} card={card} index={i} inView={inView} />
        ))}
      </div>

      {/* Global CSS handles mobile layout */}
    </section>
  )
}

function TrainingCard({ card, index, inView }: { card: CMSData['training'][0]; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="service-card"
    >
      {/* Top bar animation */}
      <div className="service-card-bar" />
      
      {/* Ghost number */}
      <div style={{
        position: 'absolute', top: 18, right: 28,
        fontFamily: 'var(--font-bebas)', fontSize: '4rem', color: 'var(--tan)', opacity: 0.07, lineHeight: 1,
      }}>{String(index + 1).padStart(2, '0')}</div>

      <div style={{ fontSize: '2rem', marginBottom: 20 }}>{card.icon}</div>
      <div style={{
        fontFamily: 'var(--font-bebas)', fontSize: '1.4rem',
        fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12, lineHeight: 1.1
      }}>{card.title}</div>
      <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24, minHeight: '4.5em' }}>{card.desc}</p>
      <span className="tag-badge">{card.tag}</span>
    </motion.div>
  )
}
