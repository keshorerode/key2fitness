'use client'
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { CMSData } from '@/lib/cms-data'

export default function GallerySection({ data }: { data: CMSData }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [slideIndex, setSlideIndex] = useState(0)

  const visibleCount = 3
  const maxIndex = Math.max(0, data.gallery.length - visibleCount)
  const offset = Math.min(slideIndex, maxIndex)

  const prev = () => setSlideIndex(i => Math.max(0, i - 1))
  const next = () => setSlideIndex(i => Math.min(maxIndex, i + 1))
  const dotCount = Math.ceil(data.gallery.length / visibleCount)

  return (
    <section id="gallery" style={{ background: 'var(--black)', padding: '80px 0 0' }}>
      <div style={{ padding: '0 60px 40px' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow">INSIDE THE GYM</span>
          <div className="section-title" style={{ marginTop: 10 }}>
            OUR <span style={{ color: 'var(--tan)' }}>FACILITY</span>
          </div>
        </motion.div>
      </div>

      {data.gallery.length === 0 ? (
        <div style={{
          padding: '60px', textAlign: 'center', margin: '0 60px',
          border: '1px dashed var(--border)', color: 'var(--muted)',
          fontFamily: 'var(--font-barlow-condensed)', letterSpacing: '0.1em',
        }}>
          NO PHOTOS ADDED YET. UPLOAD PHOTOS IN THE ADMIN DASHBOARD.
        </div>
      ) : (
        <>
          <div style={{ overflow: 'hidden', position: 'relative' }}>
            <div style={{
              display: 'flex',
              transform: `translateX(-${offset * (100 / visibleCount)}%)`,
              transition: 'transform 0.6s cubic-bezier(0.77,0,0.18,1)',
            }}>
              {data.gallery.map((url, i) => (
                <GallerySlide key={i} url={url} index={i} inView={inView} />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 60px' }}>
            <SliderBtn onClick={prev} disabled={slideIndex === 0}>←</SliderBtn>
            <SliderBtn onClick={next} disabled={slideIndex >= maxIndex}>→</SliderBtn>
            <div style={{ display: 'flex', gap: 8 }}>
              {Array.from({ length: dotCount }).map((_, i) => (
                <button key={i} onClick={() => setSlideIndex(i * visibleCount)}
                  className={`dot ${Math.floor(offset / visibleCount) === i ? 'active' : ''}`}
                  style={{ border: 'none', cursor: 'pointer', padding: 0 }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

function GallerySlide({ url, index, inView }: { url: string; index: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="slide-item"
      initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: `${100 / 3}%`, height: 340,
        position: 'relative', overflow: 'hidden', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 0.6s ease',
      }}>
        <Image
          src={url}
          alt={`Gym photo ${index + 1}`}
          fill
          style={{
            objectFit: 'cover', objectPosition: 'center',
            filter: hovered ? 'brightness(0.88) saturate(1)' : 'brightness(0.68) saturate(0.72)',
            transition: 'filter 0.3s',
          }}
          referrerPolicy="no-referrer"
        />
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 60%)',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
      }} />
    </motion.div>
  )
}

function SliderBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 44, height: 44,
        background: hovered && !disabled ? 'var(--tan)' : 'var(--card)',
        border: `1px solid ${hovered && !disabled ? 'var(--tan)' : 'var(--border)'}`,
        color: hovered && !disabled ? 'var(--black)' : 'var(--white)',
        fontSize: '1.2rem', cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s', opacity: disabled ? 0.3 : 1,
      }}
    >{children}</button>
  )
}
