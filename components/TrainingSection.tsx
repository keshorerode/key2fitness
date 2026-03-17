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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
        {data.training.map((card, i) => (
          <TrainingCard key={i} card={card} index={i} inView={inView} />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          #training { padding: 80px 24px !important; }
          #training > div:first-child { grid-template-columns: 1fr !important; }
          #training > div:last-child { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </section>
  )
}

function TrainingCard({ card, index, inView }: { card: CMSData['training'][0]; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="service-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        padding: '38px 28px', position: 'relative', overflow: 'hidden', cursor: 'pointer',
        transition: 'transform 0.3s, border-color 0.3s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        borderColor: hovered ? 'var(--tan-d)' : 'var(--border)',
      }}
    >
      {/* Top bar animation */}
      <div className="service-card-bar" style={{ transform: hovered ? 'scaleX(1)' : 'scaleX(0)' }} />
      {/* Ghost number */}
      <div style={{
        position: 'absolute', top: 16, right: 20,
        fontFamily: 'var(--font-bebas)', fontSize: '3.5rem', opacity: 0.09, lineHeight: 1,
      }}>{String(index + 1).padStart(2, '0')}</div>

      <div style={{ fontSize: '2rem', marginBottom: 16 }}>{card.icon}</div>
      <div style={{
        fontFamily: 'var(--font-barlow-condensed)', fontSize: '1.15rem',
        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10,
      }}>{card.title}</div>
      <p style={{ fontSize: '0.86rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: 18 }}>{card.desc}</p>
      <span style={{
        fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.66rem',
        letterSpacing: '0.12em', color: 'var(--tan)', border: '1px solid var(--tan-d)',
        padding: '4px 10px', textTransform: 'uppercase', display: 'inline-block',
      }}>{card.tag}</span>
    </motion.div>
  )
}
