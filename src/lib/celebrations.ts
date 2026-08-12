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

/** Fetch all celebrations for the current user */
export async function fetchUserCelebrations(userId: string): Promise<CelebrationData[]> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CelebrationData));
}

/** Save a new celebration to Firestore */
export async function saveCelebration(
  celebration: Omit<CelebrationData, "id">,
  userId: string
): Promise<CelebrationData> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...celebration,
    userId,
    createdAt: new Date().toISOString().split("T")[0],
  });
  // Increment celebration count on user profile in Firestore
  try {
    await setDoc(doc(db, "users", userId), {
      celebrationsCount: increment(1)
    }, { merge: true });
  } catch (err) {
    console.error("Failed to increment user celebration count:", err);
  }
  return { id: docRef.id, ...celebration };
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
