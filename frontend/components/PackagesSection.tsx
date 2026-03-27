'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { CMSData } from '@/lib/cms-data'

export default function PackagesSection({ data }: { data: CMSData }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="packages" style={{ background: 'var(--dark)', padding: '100px 60px' }}>
      {/* Header */}
      <motion.div ref={ref}
        initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 56, alignItems: 'start' }}
      >
        <div>
          <span className="eyebrow">CHOOSE YOUR PLAN</span>
          <div className="section-title">MEMBERSHIP <span style={{ color: 'var(--tan)' }}>PLANS</span></div>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.75, paddingTop: 48 }}>
          Flexible plans for every goal and budget. No hidden fees — just results. All plans include full access to gym equipment and group classes.
        </p>
      </motion.div>

      {/* Pricing cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.membershipPlans?.length || 1}, 1fr)`, gap: 24, marginBottom: 40, paddingTop: 40 }}>
        {data.membershipPlans?.map((plan, i) => (
          <PriceCard key={plan.id} plan={plan} data={data} index={i} inView={inView} />
        ))}
      </div>

      {/* Personal training cards */}
      <div style={{ display: 'grid', gridTemplateColumns: data.ptPackages?.length > 1 ? '1fr 1fr' : '1fr', gap: 24, marginTop: 40 }}>
        {data.ptPackages?.map((pkg, i) => (
          <PTCard key={pkg.id} title={pkg.title} subtitle={pkg.subtitle}
            price={pkg.price} index={i} inView={inView}
            features={pkg.features || []}
          />
        ))}
      </div>

    </section>
  )
}

function PriceCard({ plan, data, index, inView }: {
  plan: CMSData['membershipPlans'][0]; data: CMSData; index: number; inView: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const isFeatured = plan.id === data.pFeatured

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        transform: hovered ? 'translateY(-6px)' : 'none',
        transition: 'all 0.3s', cursor: 'pointer', zIndex: isFeatured ? 2 : 1,
        height: '100%'
      }}
    >
      <a href="#contact" style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
        <div style={{
          background: isFeatured ? 'var(--tan)' : (hovered ? '#1c1c1c' : 'var(--card)'),
          border: `1px solid ${isFeatured ? 'var(--tan)' : (hovered ? 'var(--tan-d)' : 'var(--border)')}`,
          padding: '50px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12,
          clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
          height: '100%',
          transition: 'all 0.3s'
        }}>
          <div style={{
            fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.75rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: isFeatured ? 'rgba(8,8,8,0.7)' : 'var(--muted)',
          }}>{plan.duration}</div>
          <div style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: isFeatured ? '3.8rem' : '3.2rem',
            color: isFeatured ? 'var(--black)' : 'var(--tan)', lineHeight: 1,
          }}>{plan.price}</div>
          <div style={{
            fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.7rem',
            letterSpacing: '0.1em', color: isFeatured ? 'rgba(8,8,8,0.7)' : 'var(--muted)',
          }}>{plan.label}</div>
        </div>
      </a>

      {isFeatured && (
        <div style={{
          position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--black)', color: 'var(--tan)',
          border: '1px solid var(--tan-d)',
          fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.62rem',
          letterSpacing: '0.12em', padding: '4px 14px', textTransform: 'uppercase', whiteSpace: 'nowrap',
          clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
          zIndex: 10, pointerEvents: 'none'
        }}>✦ BEST VALUE</div>
      )}
    </motion.div>
  )
}

function PTCard({ title, subtitle, price, features, index, inView }: {
  title: string; subtitle: string; price: string; features: string[]; index: number; inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
      style={{
        background: 'var(--card)', padding: '48px 42px',
        borderLeft: '4px solid var(--tan)',
        display: 'flex', flexDirection: 'column', gap: 16,
        clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)'
      }}
    >
      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.4rem', letterSpacing: '0.03em', lineHeight: 1 }}>{title}</div>
      <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.85rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>✦ {subtitle}</div>
      <ul className="feature-list" style={{ marginTop: 12, marginBottom: 20 }}>
        {features.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '5rem', color: 'var(--tan)', lineHeight: 1, marginTop: 'auto' }}>{price}</div>
    </motion.div>
  )
}
