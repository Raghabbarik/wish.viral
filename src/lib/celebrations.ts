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

const MOCK_IDS = ["c1", "c2", "c3", "c4", "c5"];

const COLLECTION = "celebrations";

/** Fetch all celebrations for the current user (or guest) */
export async function fetchUserCelebrations(userId: string): Promise<CelebrationData[]> {
  const itemsMap = new Map<string, CelebrationData>();

  // Primary source: Firestore filtered by userId (works on all devices/deployments)
  try {
    const firestoreUserId = userId === "guest" ? "guest" : userId;
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", firestoreUserId)
    );
    const snapshot = await getDocs(q);
    snapshot.docs.forEach((d) => {
      if (MOCK_IDS.includes(d.id)) return;
      itemsMap.set(d.id, { id: d.id, ...d.data() } as CelebrationData);
    });
  } catch (err) {
    console.warn("fetchUserCelebrations firestore query error:", err);
  }

  // Fallback: also merge any locally-stored celebrations (e.g. created while offline)
  if (typeof window !== "undefined") {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("celeb_")) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || "");
          if (
            item &&
            item.id &&
            !MOCK_IDS.includes(item.id) &&
            item.userId === (userId === "guest" ? "guest" : userId) &&
            !itemsMap.has(item.id)
          ) {
            itemsMap.set(item.id, item);
          }
        } catch (e) {}
      }
    }
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

/** Get a single celebration by Firestore document ID */
export async function getCelebration(id: string): Promise<CelebrationData | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as CelebrationData;
}

/** Get a single celebration by its public slug field (used for /w/:slug routes) */
export async function getCelebrationBySlug(slug: string): Promise<CelebrationData | null> {
  // First try: slug is often the same as the doc ID
  try {
    const directSnap = await getDoc(doc(db, COLLECTION, slug));
    if (directSnap.exists()) {
      return { id: directSnap.id, ...directSnap.data() } as CelebrationData;
    }
  } catch (_) {}

  // Second try: query by slug field
  try {
    const q = query(collection(db, COLLECTION), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...d.data() } as CelebrationData;
    }
  } catch (err) {
    console.warn("getCelebrationBySlug query error:", err);
  }

  // Final fallback: check localStorage
  if (typeof window !== "undefined") {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("celeb_")) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || "");
          if (item && item.slug === slug) return item as CelebrationData;
        } catch (_) {}
      }
    }
  }

  return null;
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
