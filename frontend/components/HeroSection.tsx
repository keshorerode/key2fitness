'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CMSData } from '@/lib/cms-data'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7, ease: 'easeOut' } }),
}

export default function HeroSection({ data }: { data: CMSData }) {
  return (
    <section id="hero" style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Centre divider */}
      <div className="hero-center-divider" style={{
        position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
        background: 'linear-gradient(to bottom, transparent, rgba(200,169,110,0.3), transparent)',
        zIndex: 3, pointerEvents: 'none',
      }} />

      {/* ── LEFT: Quotes ── */}
      <div className="hero-quotes-wrap" style={{
        padding: 'clamp(120px,12vw,160px) 50px 80px 70px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        gap: '28px', position: 'relative', zIndex: 2,
      }}>
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <span className="eyebrow">THE KEY 2 FITNESS · UNISEX · ERODE</span>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
          style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(4.5rem,7.5vw,8rem)', lineHeight: 0.88, letterSpacing: '0.02em' }}
        >
          <div>{data.hl1}</div>
          <div>{data.hl2}</div>
          <div style={{ color: 'var(--tan)' }}>{data.hl3}</div>
        </motion.div>

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
          style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '1.3rem', color: 'rgba(240,236,228,0.5)', letterSpacing: '0.06em' }}
        >{data.hsub}</motion.div>

        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
          style={{ 
            background: 'rgba(200,169,110,0.06)', 
            padding: '32px 36px', 
            maxWidth: 480,
            clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
            border: '1px solid rgba(200,169,110,0.15)'
          }}
        >
          <p style={{ fontStyle: 'italic', fontSize: '1rem', color: 'rgba(240,236,228,0.82)', lineHeight: 1.7, marginBottom: 12 }}>
            {data.hq}
          </p>
          <cite style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--tan)', fontStyle: 'normal', textTransform: 'uppercase' }}>
            {data.hc}
          </cite>
        </motion.div>

        <motion.ul custom={4} variants={fadeUp} initial="hidden" animate="visible"
          style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {data.extraQuotes.map((q, i) => (
            <li key={i} style={{
              fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(240,236,228,0.72)',
              paddingLeft: 16, borderLeft: '2px solid rgba(200,169,110,0.3)', lineHeight: 1.5,
            }}>{q}</li>
          ))}
        </motion.ul>

        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
        >
          <a href="#packages" className="btn-fill">VIEW PLANS</a>
          <a href="#training" className="btn-ghost">EXPLORE TRAINING</a>
        </motion.div>
      </div>

      {/* ── RIGHT: Male Photo ── */}
      <motion.div className="hero-photo-wrap"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.3 }}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Photo with mask */}
        <div className="hero-photo-mask" style={{ position: 'absolute', inset: 0, transition: 'transform 8s ease' }}>
          <Image
            src={data.heroImage}
            alt="Male athlete"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top', filter: 'brightness(0.48) saturate(0.55) contrast(1.15)' }}
            priority
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(to right, var(--black) 0%, rgba(8,8,8,0.7) 12%, rgba(8,8,8,0.2) 30%, transparent 55%), linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, transparent 20%, transparent 75%, rgba(8,8,8,0.85) 100%)',
        }} />
        {/* Watermark */}
        <div style={{
          position: 'absolute', bottom: 30, left: 30, zIndex: 2,
          fontFamily: 'var(--font-bebas)', fontSize: '6rem', opacity: 0.05, lineHeight: 1, pointerEvents: 'none',
        }}>GYM</div>
        <div style={{
          position: 'absolute', bottom: 30, right: 30, zIndex: 2,
          fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.68rem',
          letterSpacing: '0.3em', color: 'rgba(200,169,110,0.4)', textTransform: 'uppercase',
        }}>FOR HIM &amp; HER</div>
      </motion.div>

      {/* Scroll cue */}
      <div className="hero-scroll-cue" style={{
        position: 'absolute', right: 30, bottom: 40, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <span style={{
          fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.65rem',
          letterSpacing: '0.35em', color: 'rgba(200,169,110,0.6)', writingMode: 'vertical-rl',
        }}>SCROLL</span>
        <div className="scroll-line" />
      </div>

      {/* Global CSS handles mobile layout */}
    </section>
  )
}
