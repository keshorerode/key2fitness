'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { CMSData } from '@/lib/cms-data'

const plans = [
  { dur: '1 Month',   label: 'per month',  key: 'p1' },
  { dur: '3 Months',  label: 'quarterly',  key: 'p2' },
  { dur: '7 Months',  label: 'half year+', key: 'p3' },
  { dur: '13 Months', label: 'annual',     key: 'p4' },
  { dur: '24 Months', label: '2 years',    key: 'p5' },
]

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 3, marginBottom: 40, paddingTop: 40 }}>
        {plans.map((plan, i) => (
          <PriceCard key={plan.key} plan={plan} price={(data as Record<string, string>)[plan.key]} data={data} index={i} inView={inView} />
        ))}
      </div>

      {/* Personal training cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, marginTop: 40 }}>
        <PTCard title="Personal Training" subtitle="One-on-one coaching · Dedicated trainer"
          price={data.pt1} index={0} inView={inView}
          features={[
            'Fat reduction programme — 4kg/month guaranteed',
            'Personalised diet updated every 10 days',
            'Core & CrossFit sessions included',
            'Full progress tracking by your trainer',
            'Priority booking for all equipment',
          ]}
        />
        <PTCard title="Couple Package" subtitle="Train Together · Save Together"
          price={data.pt2} index={1} inView={inView}
          features={[
            'Both partners get dedicated personal training',
            'Individual diet plans for each person',
            'Shared progress tracking dashboard',
            'All Personal Training features included',
            'Save ₹7,000 vs two individual plans',
          ]}
        />
      </div>

    </section>
  )
}

function PriceCard({ plan, price, data, index, inView }: {
  plan: typeof plans[0]; price: string; data: CMSData; index: number; inView: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const isFeatured = plan.key === data.pFeatured

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: isFeatured ? 'var(--tan)' : (hovered ? '#1c1c1c' : 'var(--card)'),
        border: `1px solid ${isFeatured ? 'var(--tan)' : (hovered ? 'var(--tan-d)' : 'var(--border)')}`,
        padding: '36px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10,
        transform: isFeatured ? 'scaleY(1.04)' : (hovered ? 'translateY(-6px)' : 'none'),
        transition: 'all 0.3s', cursor: 'pointer', zIndex: isFeatured ? 2 : 1,
      }}
    >
      {isFeatured && (
        <div style={{
          position: 'absolute', top: -32,
          background: 'var(--black)', color: 'var(--tan)',
          border: '1px solid var(--tan-d)',
          fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.65rem',
          letterSpacing: '0.18em', padding: '5px 12px', textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>✦ BEST VALUE</div>
      )}
      <div style={{
        fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.75rem',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: isFeatured ? 'rgba(8,8,8,0.6)' : 'var(--muted)',
      }}>{plan.dur}</div>
      <div style={{
        fontFamily: 'var(--font-bebas)',
        fontSize: isFeatured ? '3.8rem' : '3.2rem',
        color: isFeatured ? 'var(--black)' : 'var(--tan)', lineHeight: 1,
      }}>{price}</div>
      <div style={{
        fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.7rem',
        letterSpacing: '0.1em', color: isFeatured ? 'rgba(8,8,8,0.6)' : 'var(--muted)',
      }}>{plan.label}</div>
      <a href="#contact" style={{
        fontFamily: 'var(--font-bebas)', fontSize: '0.9rem', letterSpacing: '0.1em',
        border: `1px solid ${isFeatured ? 'var(--black)' : 'var(--border)'}`,
        color: isFeatured ? 'var(--tan)' : 'var(--white)',
        background: isFeatured ? 'var(--black)' : 'transparent',
        padding: '8px 20px', cursor: 'pointer', transition: 'all 0.2s',
        width: '100%', textAlign: 'center', textDecoration: 'none', display: 'block',
      }}>JOIN NOW</a>
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
        background: 'var(--card)', padding: 38,
        borderTop: '3px solid', borderImage: 'linear-gradient(to right, var(--tan), var(--tan-d)) 1',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}
    >
      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', letterSpacing: '0.03em' }}>{title}</div>
      <div style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.8rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{subtitle}</div>
      <ul className="feature-list" style={{ marginTop: 6 }}>
        {features.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '4.5rem', color: 'var(--tan)', lineHeight: 1, marginTop: 'auto' }}>{price}</div>
    </motion.div>
  )
}
