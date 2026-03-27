'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { CMSData } from '@/lib/cms-data'

export default function GallerySection({ data }: { data: CMSData }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return
    const el = scrollContainerRef.current
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
    
    const itemWidth = (el.children[0] as HTMLElement)?.offsetWidth || 0
    if (itemWidth > 0) {
      setActiveIndex(Math.round(el.scrollLeft / itemWidth))
    }
  }, [scrollContainerRef])

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [checkScroll, data.gallery.length])

  // Auto-slide logic
  useEffect(() => {
    if (isPaused || data.gallery.length <= 1) return
    const timer = setInterval(() => {
      if (!scrollContainerRef.current) return
      const el = scrollContainerRef.current
      const itemWidth = (el.children[0] as HTMLElement)?.offsetWidth || 0
      if (!itemWidth) return
      
      let nextLeft = el.scrollLeft + itemWidth
      if (nextLeft > el.scrollWidth - el.clientWidth + 5) {
        nextLeft = 0 // loop back to start
      }
      el.scrollTo({ left: nextLeft, behavior: 'smooth' })
    }, 3500)
    return () => clearInterval(timer)
  }, [isPaused, data.gallery.length])

  const scrollByAmount = (direction: 1 | -1) => {
    if (!scrollContainerRef.current) return
    const el = scrollContainerRef.current
    const itemWidth = (el.children[0] as HTMLElement)?.offsetWidth || 0
    el.scrollBy({ left: direction * itemWidth, behavior: 'smooth' })
  }

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
          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            style={{ 
              display: 'flex', 
              overflowX: 'auto', 
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {data.gallery.map((url, i) => (
              <GallerySlide key={url} url={url} index={i} inView={inView} />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 60px' }}>
            <SliderBtn onClick={() => scrollByAmount(-1)} disabled={!canScrollLeft}>←</SliderBtn>
            <SliderBtn onClick={() => scrollByAmount(1)} disabled={!canScrollRight}>→</SliderBtn>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {data.gallery.map((_, i) => (
                <button key={i} 
                  onClick={() => {
                    const el = scrollContainerRef.current
                    const w = (el?.children[0] as HTMLElement)?.offsetWidth || 0
                    el?.scrollTo({ left: i * w, behavior: 'smooth' })
                  }}
                  className={`dot ${activeIndex === i ? 'active' : ''}`}
                  aria-label={`Go to slide ${i + 1}`}
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
        scrollSnapAlign: 'start',
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
            pointerEvents: 'none', // Prevents image drag conflicts with scroll
          }}
          unoptimized
          referrerPolicy="no-referrer"
        />
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 60%)',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
        pointerEvents: 'none',
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
        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
      }}
    >{children}</button>
  )
}
