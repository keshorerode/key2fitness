export interface TrainingCard {
  icon: string
  title: string
  desc: string
  tag: string
}

export interface CMSData {
  // Hero
  hl1: string; hl2: string; hl3: string
  hsub: string; hq: string; hc: string
  extraQuotes: string[]
  // Female
  fl1: string; fl2: string; fl3: string
  fb: string
  s1n: string; s1l: string
  s2n: string; s2l: string
  s3n: string; s3l: string
  // Training
  training: TrainingCard[]
  // Prices
  p1: string; p2: string; p3: string; p4: string; p5: string
  pFeatured: string
  pt1: string; pt2: string
  // Contact
  addr: string; ph: string; h1: string; h2: string; pay: string
  // Gallery
  gallery: string[]
}

export const defaultData: CMSData = {
  hl1: 'FORGE', hl2: 'YOUR', hl3: 'BODY.',
  hsub: 'Where Strength Meets Discipline',
  hq: '"The body achieves what the mind believes. Every rep, every set, every drop of sweat is a step closer to the version of you that you\'ve always wanted to be."',
  hc: '— The Key 2 Fitness',
  extraQuotes: [
    'Pain is temporary. Pride is forever.',
    "Don't limit your challenges. Challenge your limits.",
    'Your only competition is who you were yesterday.',
  ],
  fl1: 'SHE TRAINS.', fl2: 'SHE', fl3: 'TRANSFORMS.',
  fb: 'At The Key 2 Fitness, women get a dedicated training experience — personalised programmes, expert coaches, and an environment built around your goals. Lose weight, build strength, and feel confident every single day.',
  s1n: '4kg', s1l: 'Min. Loss Per Month',
  s2n: '10', s2l: 'Day Diet Update',
  s3n: '6+', s3l: 'Training Types',
  training: [
    { icon: '🏋️', title: 'Core Workout Training', desc: 'Build a rock-solid foundation with targeted core exercises. Improve stability, posture and functional strength for every movement you make.', tag: 'Foundation' },
    { icon: '🔥', title: 'CrossFit Training', desc: 'High-intensity functional movements that build conditioning, endurance and power. Constantly varied workouts — never boring, always effective.', tag: 'High Intensity' },
    { icon: '⚡', title: 'Fat Reduction Training', desc: 'Minimum 4 kg weight loss guaranteed per month with our scientifically designed fat-burning programme combined with personalised diet plans.', tag: 'Guaranteed Results' },
    { icon: '🥊', title: 'Boxing & Combat', desc: 'Release stress, build agility and improve full-body coordination with our boxing and combat training sessions. No experience needed.', tag: 'Combat Ready' },
    { icon: '🚴', title: 'Cardio & Spin Cycling', desc: 'Treadmills, ellipticals and spin bikes. Boost cardiovascular health, burn calories fast and improve stamina with every session.', tag: 'Cardio Zone' },
    { icon: '🥗', title: 'Diet Planning', desc: 'Personalised nutrition plans updated every 10 days based on your progress. Real food, real results — no crash diets, no starvation.', tag: 'Every 10 Days' },
  ],
  p1: '₹2,000', p2: '₹4,000', p3: '₹5,000', p4: '₹8,000', p5: '₹11,000',
  pFeatured: 'p4',
  pt1: '₹7,000', pt2: '₹14,000',
  addr: 'The Key 2 Fitness Unisex Gym\nPerundurai Rd, Edayankattuvalasu, Erode',
  ph: '77984 28238 · 7708428231',
  h1: 'Mon–Sat: 5:30 AM – 10:00 PM',
  h2: 'Sun: 7:00 AM – 12:00 PM',
  pay: 'Credit & Debit Cards · UPI · Cash',
  gallery: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=80',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80',
    'https://images.unsplash.com/photo-1549476464-37392f717541?w=900&q=80',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80',
  ],
}

export const LS_KEY = 'k2f_data'

export function loadData(): CMSData {
  if (typeof window === 'undefined') return defaultData
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return defaultData
    return { ...defaultData, ...JSON.parse(raw) }
  } catch {
    return defaultData
  }
}

export function saveData(data: CMSData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}
