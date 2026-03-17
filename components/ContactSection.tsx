'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { CMSData } from '@/lib/cms-data'

export default function ContactSection({ data }: { data: CMSData }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const contacts = [
    { icon: '📍', label: 'Location', value: data.addr },
    { icon: '📞', label: 'Phone',    value: data.ph },
    { icon: '🕐', label: 'Hours',    value: `${data.h1}\n${data.h2}` },
    { icon: '💳', label: 'Payment',  value: data.pay },
  ]

  return (
    <section id="contact" style={{ background: 'var(--black)', padding: '100px 60px' }}>
      {/* Title */}
      <motion.div ref={ref}
        initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ marginBottom: 48 }}
      >
        <span className="eyebrow">FIND US</span>
        <div style={{
          fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2.4rem,4vw,4.5rem)',
          lineHeight: 0.9, margin: '12px 0 14px',
        }}>COME <span style={{ color: 'var(--tan)' }}>VISIT</span></div>
        <div className="gold-divider" />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
        {/* Left: contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {contacts.map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
            >
              <div style={{
                width: 40, height: 40, background: 'rgba(200,169,110,0.08)',
                border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0,
              }}>{c.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--tan)', textTransform: 'uppercase', marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: '0.88rem', color: 'rgba(240,236,228,0.75)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{c.value}</div>
              </div>
            </motion.div>
          ))}
          <a href="tel:7798428238" className="btn-fill" style={{ marginTop: 12, alignSelf: 'flex-start' }}>CALL TO JOIN</a>
        </div>

        {/* Right: Map + QR + Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {/* Map */}
          <div style={{ position: 'relative', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3911.9765780318603!2d77.71004649999999!3d11.336421300000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f22dac77f93%3A0x2ce663e0a7d5a3ff!2sThe%20Key2fitness!5e0!3m2!1sen!2sin!4v1773759336469!5m2!1sen!2sin"
              width="100%" height="300"
              style={{ filter: 'grayscale(1) invert(0.9) contrast(1.1)', display: 'block', border: 0 }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '20px 16px 12px',
              background: 'linear-gradient(to top, rgba(8,8,8,0.9) 60%, transparent)',
              fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.72rem',
              letterSpacing: '0.2em', color: 'var(--tan)', textTransform: 'uppercase',
            }}>✦ THE KEY 2 FITNESS · ERODE</div>
          </div>

          {/* Enquiry form removed as requested */}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #contact { padding: 80px 24px !important; }
          #contact > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
