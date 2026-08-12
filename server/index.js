import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ── Gemini AI ──────────────────────────────────────────────────────────────
let ai;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (GEMINI_KEY) {
  ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
} else {
  console.warn('⚠️  GEMINI_API_KEY is not set. Wish generation will use fallbacks.');
}

// ── Firebase Admin SDK (loaded from serviceAccount.json — bypasses dotenvx) ──
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let db = null;
let firebaseReady = false;

const SA_PATH = path.join(__dirname, 'serviceAccount.json');

if (fs.existsSync(SA_PATH)) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(SA_PATH, 'utf8'));
    if (!getApps().length) {
      initializeApp({ credential: cert(serviceAccount) });
    }
    db = getFirestore();
    firebaseReady = true;
    console.log('✅ Firebase Admin SDK initialised from serviceAccount.json');
  } catch (err) {
    console.error('❌ Firebase Admin SDK failed to initialise:', err.message);
  }
} else {
  console.warn('⚠️  server/serviceAccount.json not found. Protected routes will return 503.');
}

// ── Helpers ────────────────────────────────────────────────────────────────
const requireFirebase = (req, res, next) => {
  if (!firebaseReady) {
    return res.status(503).json({
      error: 'Firebase Admin SDK not configured. Add FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env.',
    });
  }
  next();
};

const verifyIdToken = async (req, res, next) => {
  const authHeader = req.headers.authorization?.split(' ')[1];
  if (!authHeader) return res.status(401).json({ error: 'No auth token' });
  try {
    const decoded = await getAuth().verifyIdToken(authHeader);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid auth token' });
  }
};

const readData = async () => {
  const snapshot = await db.collection('celebrations').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const writeData = async (celebration) => {
  const docRef = await db.collection('celebrations').add(celebration);
  return { id: docRef.id, ...celebration };
};

// ── Routes ─────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', firebase: firebaseReady, ai: !!ai });
});

// Generate Wish using Gemini API
app.post('/api/wishes/generate', async (req, res) => {
  const { recipientName, senderName, category } = req.body;
  if (!ai) {
    return res.json({
      wish: `Dear ${recipientName}, wishing you an extraordinary day filled with love, laughter, and magical moments! From ${senderName || 'A Well Wisher'}`,
    });
  }
  try {
    const prompt = `Write a heartfelt and personal ${category || 'celebration'} wish for ${recipientName} from ${senderName || 'someone who cares'}. Make it warm, joyful, and max 3-4 sentences long.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    const wish = response.text.trim();
    res.json({ wish });
  } catch (error) {
    console.error('Error generating wish:', error);
    res.status(500).json({ error: 'Failed to generate wish' });
  }
});

// Save Celebration
app.post('/api/celebrations', requireFirebase, verifyIdToken, async (req, res) => {
  try {
    const newCelebration = { ...req.body, createdAt: new Date().toISOString() };
    const saved = await writeData(newCelebration);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Save celebration error:', err);
    res.status(500).json({ error: 'Failed to save celebration' });
  }
});

// Get All Celebrations
app.get('/api/celebrations', requireFirebase, async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (err) {
    console.error('Get celebrations error:', err);
    res.status(500).json({ error: 'Failed to fetch celebrations' });
  }
});

// Get Celebration by ID
app.get('/api/celebrations/:id', requireFirebase, async (req, res) => {
  try {
    const doc = await db.collection('celebrations').doc(req.params.id).get();
    if (doc.exists) {
      res.json({ id: doc.id, ...doc.data() });
    } else {
      res.status(404).json({ error: 'Celebration not found' });
    }
  } catch (err) {
    console.error('Get celebration error:', err);
    res.status(500).json({ error: 'Failed to fetch celebration' });
  }
});

// Update view count
app.patch('/api/celebrations/:id/view', requireFirebase, verifyIdToken, async (req, res) => {
  try {
    const docRef = db.collection('celebrations').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Celebration not found' });
    const newCount = (doc.data().viewsCount || 0) + 1;
    await docRef.update({ viewsCount: newCount });
    const updated = await docRef.get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (err) {
    console.error('View count error:', err);
    res.status(500).json({ error: 'Failed to update view count' });
  }
});

// Delete Celebration
app.delete('/api/celebrations/:id', requireFirebase, verifyIdToken, async (req, res) => {
  try {
    await db.collection('celebrations').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    console.error('Delete celebration error:', err);
    res.status(500).json({ error: 'Failed to delete celebration' });
  }
});

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
