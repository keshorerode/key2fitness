import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';
import * as admin from 'firebase-admin';

dotenv.config();

// Dynamic Admin Password - key2fitnessDDMMYYYY in IST
const getDynamicPassword = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const parts = formatter.formatToParts(now);
  const d = parts.find(p => p.type === 'day')?.value;
  const m = parts.find(p => p.type === 'month')?.value;
  const y = parts.find(p => p.type === 'year')?.value;
  return `key2fitness${d}${m}${y}`;
};

console.log(`Backend initialized. Admin access secured via dynamic daily password.`);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, '../cms-data.json');

// Initialize Firebase Admin
// Requires GOOGLE_APPLICATION_CREDENTIALS env var or service account JSON
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
    console.log('Firebase Admin initialized successfully');
  } catch (err) {
    console.error('Firebase Admin init error:', err);
  }
} else {
  console.warn('GOOGLE_APPLICATION_CREDENTIALS not set. Firebase Admin not initialized.');
}

const db = admin.apps.length ? admin.firestore() : null;
const CMS_COLLECTION = 'site_data';
const CMS_DOC = 'cms';

app.use(cors());
app.use(bodyParser.json());

// Default Data (from frontend/lib/cms-data.ts)
const defaultData = {
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
  femaleStats: [
    { num: '4kg', label: 'Min. Loss Per Month' },
    { num: '10', label: 'Day Diet Update' },
    { num: '6+', label: 'Training Types' },
  ],
  training: [
    { icon: '🏋️', title: 'Core Workout Training', desc: 'Build a rock-solid foundation with targeted core exercises. Improve stability, posture and functional strength for every movement you make.', tag: 'Foundation' },
    { icon: '🔥', title: 'CrossFit Training', desc: 'High-intensity functional movements that build conditioning, endurance and power. Constantly varied workouts — never boring, always effective.', tag: 'High Intensity' },
    { icon: '⚡', title: 'Fat Reduction Training', desc: 'Minimum 4 kg weight loss guaranteed per month with our scientifically designed fat-burning programme combined with personalised diet plans.', tag: 'Guaranteed Results' },
    { icon: '🥊', title: 'Boxing & Combat', desc: 'Release stress, build agility and improve full-body coordination with our boxing and combat training sessions. No experience needed.', tag: 'Combat Ready' },
    { icon: '🚴', title: 'Cardio & Spin Cycling', desc: 'Treadmills, ellipticals and spin bikes. Boost cardiovascular health, burn calories fast and improve stamina with every session.', tag: 'Cardio Zone' },
    { icon: '🥗', title: 'Diet Planning', desc: 'Personalised nutrition plans updated every 10 days based on your progress. Real food, real results — no crash diets, no starvation.', tag: 'Every 10 Days' },
  ],
  membershipPlans: [
    { id: 'p1', duration: '1 Month',   label: 'per month',  price: '₹2,000' },
    { id: 'p2', duration: '3 Months',  label: 'quarterly',  price: '₹4,000' },
    { id: 'p3', duration: '7 Months',  label: 'half year+', price: '₹5,000' },
    { id: 'p4', duration: '13 Months', label: 'annual',     price: '₹8,000' },
    { id: 'p5', duration: '24 Months', label: '2 years',    price: '₹11,000' },
  ],
  pFeatured: 'p4',
  ptPackages: [
    {
      id: 'pt1', title: 'Personal Training', subtitle: 'One-on-one coaching · Dedicated trainer', price: '₹7,000',
      features: ['Fat reduction programme — 4kg/month guaranteed', 'Personalised diet updated every 10 days', 'Core & CrossFit sessions included', 'Full progress tracking by your trainer', 'Priority booking for all equipment']
    },
    {
      id: 'pt2', title: 'Couple Package', subtitle: 'Train Together · Save Together', price: '₹14,000',
      features: ['Both partners get dedicated personal training', 'Individual diet plans for each person', 'Shared progress tracking dashboard', 'All Personal Training features included', 'Save ₹7,000 vs two individual plans']
    }
  ],
  locations: [
    { id: 'loc1', address: 'The Key 2 Fitness Unisex Gym\nPerundurai Rd, Edayankattuvalasu, Erode', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3911.9765780318603!2d77.71004649999999!3d11.336421300000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f22dac77f93%3A0x2ce663e0a7d5a3ff!2sThe%20Key2fitness!5e0!3m2!1sen!2sin!4v1773759336469!5m2!1sen!2sin' }
  ],
  ph: '77984 28238 · 7708428231',
  openingHours: [
    { day: 'Mon–Sat', time: '5:30 AM – 10:00 PM' },
    { day: 'Sun', time: '7:00 AM – 12:00 PM' },
  ],
  pay: 'Credit & Debit Cards · UPI · Cash',
  gallery: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=80',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80',
    'https://images.unsplash.com/photo-1549476464-37392f717541?w=900&q=80',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80',
  ],
  femaleFeatures: [
    'Expert personal trainers dedicated to female fitness goals',
    'Spin cycling, treadmills & full cardio zone',
    'Core strength, CrossFit & fat-reduction programmes',
    'Personalised diet plans updated every 10 days',
    'Safe, unisex environment — train at your own pace',
  ],
  heroImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1000&q=85&auto=format&fit=crop',
  femaleImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1000&q=85&auto=format&fit=crop',
};

// --- ZOD SCHEMA ---
const trainingCardSchema = z.object({
  icon: z.string(),
  title: z.string(),
  desc: z.string(),
  tag: z.string(),
});

const cmsSchema = z.object({
  hl1: z.string().optional(),
  hl2: z.string().optional(),
  hl3: z.string().optional(),
  hsub: z.string().optional(),
  hq: z.string().optional(),
  hc: z.string().optional(),
  extraQuotes: z.array(z.string()).optional(),
  fl1: z.string().optional(),
  fl2: z.string().optional(),
  fl3: z.string().optional(),
  fb: z.string().optional(),
  femaleStats: z.array(z.object({ num: z.string(), label: z.string() })).optional(),
  training: z.array(trainingCardSchema).optional(),
  membershipPlans: z.array(z.object({ duration: z.string(), label: z.string(), price: z.string(), id: z.string() })).optional(),
  pFeatured: z.string().optional(),
  ptPackages: z.array(z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string(),
    price: z.string(),
    features: z.array(z.string()),
  })).optional(),
  locations: z.array(z.object({ id: z.string(), address: z.string(), mapUrl: z.string() })).optional(),
  ph: z.string().optional(),
  pay: z.string().optional(),
  openingHours: z.array(z.object({ day: z.string(), time: z.string() })).optional(),
  gallery: z.array(z.string()).optional(),
  femaleFeatures: z.array(z.string()).optional(),
  heroImage: z.string().optional(),
  femaleImage: z.string().optional(),
});

// --- AUTH MIDDLEWARE ---
const adminAuth = (req: any, res: any, next: any) => {
  const pw = req.headers['x-admin-password'];
  const expectedPw = getDynamicPassword();
  
  if (pw !== expectedPw) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
};

function ensureFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
}

app.get('/api/cms', async (req, res) => {
  if (!db) {
    // Fallback to local file if Firebase is not configured
    try {
      ensureFile();
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return res.json(JSON.parse(raw));
    } catch (err: any) {
      console.error('Failed to read or parse cms-data.json:', err);
      return res.status(500).json({ success: false, error: 'Failed to read or parse cms-data.json' });
    }
  }

  try {
    const doc = await db.collection(CMS_COLLECTION).doc(CMS_DOC).get();
    if (!doc.exists) {
      // If no data in Firestore, seeds it with defaultData
      await db.collection(CMS_COLLECTION).doc(CMS_DOC).set(defaultData);
      return res.json(defaultData);
    }
    res.json(doc.data());
  } catch (err) {
    console.error('Error fetching from Firestore:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch CMS data' });
  }
});

app.post('/api/cms', adminAuth, async (req, res) => {
  // 1. Explicitly reject arrays and null
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ success: false, error: 'Invalid data format (must be an object)' });
  }

  // 2. Validate with Zod
  const validated = cmsSchema.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: validated.error.format() });
  }

  if (!db) {
    // Fallback to local file if Firebase is not configured
    try {
      ensureFile();
      let existing = {};
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        existing = JSON.parse(raw);
      } catch (parseErr) {
        const corruptPath = DATA_FILE + '.corrupt.' + Date.now();
        fs.copyFileSync(DATA_FILE, corruptPath);
        console.error(`CRITICAL: Existing CMS data is corrupt. Backup created at: ${corruptPath}. Parse error:`, parseErr);
        return res.status(500).json({ success: false, error: 'Local data file is corrupt and could not be parsed safely' });
      }
      
      const updated = { ...existing, ...validated.data };
      const tempPath = DATA_FILE + '.tmp';
      
      // Atomic write: Write to temp file then rename
      fs.writeFileSync(tempPath, JSON.stringify(updated, null, 2));
      fs.renameSync(tempPath, DATA_FILE);
      
      return res.json({ success: true });
    } catch (err: any) {
      console.error('Atomic write to local storage failed:', err);
      return res.status(500).json({ success: false, error: 'Failed to save to local storage', details: err.message });
    }
  }

  try {
    // 3. Merge with existing data in Firestore
    await db.collection(CMS_COLLECTION).doc(CMS_DOC).set(validated.data, { merge: true });
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving to Firestore:', err);
    res.status(500).json({ success: false, error: 'Failed to save CMS data' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
