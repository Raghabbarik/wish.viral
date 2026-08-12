import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  query,
  where,
  orderBy,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { CelebrationData, Template } from "../types";
import { TEMPLATES } from "../data/mockData";

const COLLECTION = "celebrations";

/** Fetch all celebrations for the current user (or guest) */
export async function fetchUserCelebrations(userId: string): Promise<CelebrationData[]> {
  const itemsMap = new Map<string, CelebrationData>();
  const MOCK_IDS = ["c1", "c2", "c3", "c4", "c5"];

  // 1. Read from localStorage (real celebrations created on this device/session)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("celeb_")) {
      try {
        const item = JSON.parse(localStorage.getItem(key) || "");
        if (item && item.id && !MOCK_IDS.includes(item.id)) {
          itemsMap.set(item.id, item);
        }
      } catch (e) {}
    }
  }

  // 2. Read from Firestore for this user
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    snapshot.docs.forEach((d) => {
      if (MOCK_IDS.includes(d.id)) return; // exclude seed mock items
      const data = { id: d.id, ...d.data() } as CelebrationData;
      if (userId && userId !== "guest") {
        if (data.userId === userId) {
          itemsMap.set(d.id, data);
        }
      } else {
        if (data.userId === "guest" || !data.userId) {
          itemsMap.set(d.id, data);
        }
      }
    });
  } catch (err) {
    console.warn("fetchUserCelebrations firestore query error:", err);
  }

  const result = Array.from(itemsMap.values());
  return result.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

/** Save a new celebration to Firestore & localStorage */
export async function saveCelebration(
  celebration: CelebrationData,
  userId: string
): Promise<CelebrationData> {
  const docId = celebration.id || ("wish-" + Date.now());
  const celebData: CelebrationData = {
    ...celebration,
    id: docId,
    userId,
    createdAt: celebration.createdAt || new Date().toISOString().split("T")[0],
  };

  // 1. Always save to localStorage immediately
  try {
    localStorage.setItem(`celeb_${docId}`, JSON.stringify(celebData));
  } catch (e) {}

  // 2. Save to Firestore
  try {
    await setDoc(doc(db, COLLECTION, docId), celebData, { merge: true });
  } catch (err) {
    console.warn("saveCelebration firestore setDoc error:", err);
  }

  // Increment celebration count on user profile in Firestore
  try {
    await setDoc(doc(db, "users", userId), {
      celebrationsCount: increment(1)
    }, { merge: true });
  } catch (err) {}

  return celebData;
}

/** Delete a celebration by Firestore document ID */
export async function deleteCelebration(id: string): Promise<void> {
  // Try to find the celebration first to know the userId
  try {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.userId) {
        await setDoc(doc(db, "users", data.userId), {
          celebrationsCount: increment(-1)
        }, { merge: true });
      }
    }
  } catch (err) {
    console.error("Failed to decrement user celebration count:", err);
  }
  await deleteDoc(doc(db, COLLECTION, id));
}

/** Increment the view count for a celebration */
export async function incrementViewCount(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    viewsCount: increment(1),
  });
}

/** Get a single celebration by ID */
export async function getCelebration(id: string): Promise<CelebrationData | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as CelebrationData;
}

/** Fetch all templates from Firestore (or seed if empty) */
export async function fetchTemplates(): Promise<Template[]> {
  try {
    const snap = await getDocs(collection(db, "templates"));
    if (snap.empty) {
      console.log("Seeding templates into Firestore...");
      for (const t of TEMPLATES) {
        await setDoc(doc(db, "templates", t.id), {
          ...t,
          status: "active",
          createdAt: "2024-09-01",
          revenue: t.isPremium ? (t.useCount || 10) * 14 : 0,
        });
      }
      return TEMPLATES;
    }
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Template));
  } catch (err) {
    console.error("Failed to fetch templates from Firestore, fallback to static:", err);
    return TEMPLATES;
  }
}
