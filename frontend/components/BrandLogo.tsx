import React from 'react'

export default function BrandLogo({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none', cursor: 'pointer', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', lineHeight: 0.85 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: '0.12em' }}>
          <span style={{ fontFamily: 'var(--font-barlow-condensed)', fontSize: '0.36em', color: 'var(--white)', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '0.05em' }}>THE</span>
          <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '1em', color: 'var(--tan)' }}>KEY</span>
        </div>
        <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.9em', color: 'var(--white)', margin: '0 0.18em 0 0', position: 'relative', top: '0.07em' }}>2</span>
        <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '1em', color: 'var(--tan)' }}>FITNESS</span>
      </div>
      <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '0.45em', letterSpacing: '0.48em', color: 'var(--white)', marginTop: '0.25em', marginLeft: '0.48em' }}>
        UNISEX
      </div>
    </div>
  )
}
