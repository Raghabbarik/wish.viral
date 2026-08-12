import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support large photos

const DATA_FILE = path.join(__dirname, 'data.json');

let ai;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
  console.warn("GEMINI_API_KEY is not set. Wish generation will use fallbacks.");
}

// Initialize Firebase Admin SDK
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!getApps().length) {
  initializeApp({ credential: cert(firebaseConfig) });
}

const db = getFirestore();

// Middleware to verify Firebase ID token
const verifyIdToken = async (req, res, next) => {
  const authHeader = req.headers.authorization?.split(' ')[1];
  if (!authHeader) {
    return res.status(401).json({ error: 'No auth token' });
  }
  try {
    const decoded = await getAuth().verifyIdToken(authHeader);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid auth token' });
  }
};

// Helper to read celebrations from Firestore
const readData = async () => {
  const snapshot = await db.collection('celebrations').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Helper to write a new celebration to Firestore
const writeData = async (celebration) => {
  const docRef = await db.collection('celebrations').add(celebration);
  return { id: docRef.id, ...celebration };
};

// Generate Wish using Gemini API
app.post('/api/wishes/generate', async (req, res) => {
  const { recipientName, senderName, category } = req.body;
  if (!ai) {
    return res.json({
      wish: `Dear ${recipientName}, wishing you an extraordinary day filled with love, laughter, and magical moments! From ${senderName || 'A Well Wisher'}`
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
app.post('/api/celebrations', verifyIdToken, async (req, res) => {
  const newCelebration = { ...req.body, createdAt: new Date().toISOString() };
  const saved = await writeData(newCelebration);
  res.status(201).json(saved);
});

// Get All Celebrations
app.get('/api/celebrations', async (req, res) => {
  const data = await readData();
  res.json(data);
});

// Get Celebration by ID or Slug
app.get('/api/celebrations/:id', async (req, res) => {
  const doc = await db.collection('celebrations').doc(req.params.id).get();
  if (doc.exists) {
    res.json({ id: doc.id, ...doc.data() });
  } else {
    res.status(404).json({ error: 'Celebration not found' });
  }
});

// Update view count
app.patch('/api/celebrations/:id/view', verifyIdToken, async (req, res) => {
  const docRef = db.collection('celebrations').doc(req.params.id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return res.status(404).json({ error: 'Celebration not found' });
  }
  const current = doc.data();
  const newCount = (current.viewsCount || 0) + 1;
  await docRef.update({ viewsCount: newCount });
  const updated = await docRef.get();
  res.json({ id: updated.id, ...updated.data() });
});

app.delete('/api/celebrations/:id', verifyIdToken, async (req, res) => {
  await db.collection('celebrations').doc(req.params.id).delete();
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
