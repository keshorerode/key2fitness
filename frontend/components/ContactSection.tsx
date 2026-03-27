'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { CMSData } from '@/lib/cms-data'

export default function ContactSection({ data }: { data: CMSData }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [activeLoc, setActiveLoc] = useState(0)
  const loc = data.locations?.[activeLoc] || data.locations?.[0]

  const contacts = [
    { icon: '📍', label: 'Location', value: loc?.address },
    { icon: '📞', label: 'Phone',    value: data.ph },
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

      {/* Branch Selector if multiple */}
      {data.locations?.length > 1 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          {data.locations.map((l, i) => (
            <button key={l.id}
              onClick={() => setActiveLoc(i)}
              style={{
                background: activeLoc === i ? 'var(--tan)' : 'transparent',
                color: activeLoc === i ? 'var(--black)' : 'var(--tan)',
                border: '1px solid var(--tan)',
                padding: '8px 16px', borderRadius: 0, fontFamily: 'var(--font-barlow-condensed)',
                fontSize: '0.8rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.3s'
              }}
            >BRANCH 0{i+1}</button>
          ))}
        </div>
      )}

      <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
        {/* Left: contact info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {contacts.map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
            >
              <div style={{
                width: 44, height: 44, background: 'rgba(200,169,110,0.08)',
                border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
              }}>{c.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--tan)', textTransform: 'uppercase', marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: '0.88rem', color: 'rgba(240,236,228,0.75)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{c.value}</div>
              </div>
            </motion.div>
          ))}
          {/* Hours list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 + contacts.length * 0.1, duration: 0.6 }}
            style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
          >
            <div style={{
              width: 44, height: 44, background: 'rgba(200,169,110,0.08)',
              border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
            }}>🕐</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.68rem', letterSpacing: '0.15em', color: 'var(--tan)', textTransform: 'uppercase', marginBottom: 4 }}>Hours</div>
              {data.openingHours?.map((slot, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.85rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                    {slot.day}
                  </div>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.6rem', color: 'var(--tan)', lineHeight: 1 }}>
                    {slot.time}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          {(() => {
            const sanitizedPhone = data.ph?.replace(/\s/g, '');
            return sanitizedPhone ? (
              <a href={`tel:${sanitizedPhone}`} className="btn-fill" style={{ marginTop: 12, alignSelf: 'flex-start' }}>
                CALL TO JOIN
              </a>
            ) : (
              <span className="btn-fill" style={{ marginTop: 12, alignSelf: 'flex-start', opacity: 0.5, cursor: 'not-allowed' }} aria-disabled="true">
                CALL TO JOIN
              </span>
            );
          })()}
        </div>

        {/* Right: Map + QR + Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {/* Map */}
          <div style={{
            position: 'relative',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            clipPath: 'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)'
          }}>
            <iframe
              src={loc?.mapUrl}
              width="100%" height="340"
              style={{ filter: 'grayscale(1) invert(0.9) contrast(1.1)', display: 'block', border: 0 }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '24px 20px 14px',
              background: 'linear-gradient(to top, rgba(8,8,8,1) 40%, transparent)',
              fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.75rem',
              letterSpacing: '0.22em', color: 'var(--tan)', textTransform: 'uppercase',
            }}>✦ THE KEY 2 FITNESS UNISEX</div>
          </div>

          {/* Enquiry form removed as requested */}
        </motion.div>
      </div>

    </section>
  )
}
