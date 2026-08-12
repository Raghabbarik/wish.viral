import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  setDoc,
  getDocs,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { TEMPLATES } from "../../data/mockData";
import type { InteractiveTemplate, InteractiveInstance } from "../../types";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "premium";
  status: "active" | "banned" | "pending";
  joinedAt: string;
  celebrationsCount: number;
  lastActive: string;
  avatar: string;
}

export interface AdminCelebration {
  id: string;
  templateTitle: string;
  recipientName: string;
  senderName: string;
  senderEmail: string;
  createdAt: string;
  viewsCount: number;
  status: "Active" | "Scheduled" | "Delivered";
  category: string;
  slug: string;
  userId?: string;
}

export interface AdminTemplate {
  id: string;
  title: string;
  category: string;
  categoryName?: string;
  description?: string;
  isPremium: boolean;
  useCount: number;
  rating: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
  revenue: number;
  previewImage?: string;
  themeColor?: string;
  gradient?: string;
  bgPattern?: string;
  musicTrack?: string;
  sampleRecipient?: string;
  sampleSender?: string;
  sampleMessage?: string;
  samplePhotos?: string[];
  features?: string[];
}

export interface AppSettings {
  siteName: string;
  siteDescription: string;
  allowSignup: boolean;
  requireEmailVerification: boolean;
  maxPhotosPerCelebration: number;
  maxCelebrationsPerUser: number;
  premiumPrice: number;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  emailNotifications: boolean;
}

// ── Seeding ──────────────────────────────────────────────────────────────────

export async function seedFirestoreIfEmpty() {
  try {
    const usersSnap = await getDocs(collection(db, "users"));
    if (usersSnap.empty) {
      const mockUsers: AdminUser[] = [
        { id: "u1", name: "Priya Sharma", email: "priya@example.com", plan: "pro", status: "active", joinedAt: "2025-01-15", celebrationsCount: 2, lastActive: "2 hours ago", avatar: "PS" },
        { id: "u2", name: "Arjun Mehta", email: "arjun@example.com", plan: "free", status: "active", joinedAt: "2025-03-22", celebrationsCount: 1, lastActive: "1 day ago", avatar: "AM" },
        { id: "u3", name: "Sneha Gupta", email: "sneha@example.com", plan: "premium", status: "active", joinedAt: "2024-11-08", celebrationsCount: 2, lastActive: "30 min ago", avatar: "SG" },
        { id: "u4", name: "Ravi Kumar", email: "ravi@example.com", plan: "free", status: "banned", joinedAt: "2025-05-10", celebrationsCount: 0, lastActive: "3 weeks ago", avatar: "RK" },
        { id: "u5", name: "Anita Desai", email: "anita@example.com", plan: "pro", status: "active", joinedAt: "2025-02-14", celebrationsCount: 1, lastActive: "5 hours ago", avatar: "AD" },
      ];
      for (const u of mockUsers) await setDoc(doc(db, "users", u.id), u);
    }

    const celebrationsSnap = await getDocs(collection(db, "celebrations"));
    if (celebrationsSnap.empty) {
      const mockCelebrations = [
        { id: "c1", templateId: "tpl-bday-surprise", templateTitle: "Birthday Surprise Box", recipientName: "Sarah", senderName: "Mike Johnson", senderEmail: "mike@example.com", createdAt: "2026-08-11", viewsCount: 134, status: "Active", category: "Birthday", slug: "sarah-bday-2026", userId: "u1" },
        { id: "c2", templateId: "tpl-romantic-anniversary", templateTitle: "Romantic Love Story", recipientName: "Aisha", senderName: "Rahul Verma", senderEmail: "rahul@example.com", createdAt: "2026-08-10", viewsCount: 56, status: "Delivered", category: "Anniversary", slug: "aisha-anniversary", userId: "u3" },
        { id: "c3", templateId: "tpl-grad-pride", templateTitle: "Graduation Pride", recipientName: "Akira", senderName: "Priya Sharma", senderEmail: "priya@example.com", createdAt: "2026-08-09", viewsCount: 89, status: "Active", category: "Graduation", slug: "akira-grad-2026", userId: "u1" },
        { id: "c4", templateId: "tpl-wedding-bliss", templateTitle: "Wedding Bliss", recipientName: "Emma & Tom", senderName: "Sneha Gupta", senderEmail: "sneha@example.com", createdAt: "2026-08-08", viewsCount: 312, status: "Delivered", category: "Wedding", slug: "emma-tom-wedding", userId: "u3" },
        { id: "c5", templateId: "tpl-valentine-love", templateTitle: "Valentine's Love Letter", recipientName: "Lena", senderName: "Arjun Mehta", senderEmail: "arjun@example.com", createdAt: "2026-08-07", viewsCount: 21, status: "Scheduled", category: "Valentine", slug: "lena-valentine", userId: "u2" },
      ];
      for (const c of mockCelebrations) await setDoc(doc(db, "celebrations", c.id), c);
    }

    const templatesSnap = await getDocs(collection(db, "templates"));
    if (templatesSnap.empty) {
      for (const t of TEMPLATES) {
        await setDoc(doc(db, "templates", t.id), {
          ...t,
          status: "active",
          createdAt: "2024-09-01",
          revenue: t.isPremium ? (t.useCount || 10) * 14 : 0,
        });
      }
    }

    const settingsSnap = await getDocs(collection(db, "settings"));
    if (settingsSnap.empty) {
      const defaultSettings: AppSettings = {
        siteName: "Wishora",
        siteDescription: "Create magical celebration experiences",
        allowSignup: true,
        requireEmailVerification: false,
        maxPhotosPerCelebration: 10,
        maxCelebrationsPerUser: 50,
        premiumPrice: 14,
        maintenanceMode: false,
        analyticsEnabled: true,
        emailNotifications: true,
      };
      await setDoc(doc(db, "settings", "app"), defaultSettings);
    }
  } catch (err) {
    console.error("Error seeding Firestore data:", err);
  }
}

export async function forceSeedDatabase() {
  const mockUsers: AdminUser[] = [
    { id: "u1", name: "Priya Sharma", email: "priya@example.com", plan: "pro", status: "active", joinedAt: "2025-01-15", celebrationsCount: 2, lastActive: "2 hours ago", avatar: "PS" },
    { id: "u2", name: "Arjun Mehta", email: "arjun@example.com", plan: "free", status: "active", joinedAt: "2025-03-22", celebrationsCount: 1, lastActive: "1 day ago", avatar: "AM" },
    { id: "u3", name: "Sneha Gupta", email: "sneha@example.com", plan: "premium", status: "active", joinedAt: "2024-11-08", celebrationsCount: 2, lastActive: "30 min ago", avatar: "SG" },
    { id: "u4", name: "Ravi Kumar", email: "ravi@example.com", plan: "free", status: "banned", joinedAt: "2025-05-10", celebrationsCount: 0, lastActive: "3 weeks ago", avatar: "RK" },
    { id: "u5", name: "Anita Desai", email: "anita@example.com", plan: "pro", status: "active", joinedAt: "2025-02-14", celebrationsCount: 1, lastActive: "5 hours ago", avatar: "AD" },
  ];
  for (const u of mockUsers) await setDoc(doc(db, "users", u.id), u);

  const mockCelebrations = [
    { id: "c1", templateId: "tpl-bday-surprise", templateTitle: "Birthday Surprise Box", recipientName: "Sarah", senderName: "Mike Johnson", senderEmail: "mike@example.com", createdAt: "2026-08-11", viewsCount: 134, status: "Active", category: "Birthday", slug: "sarah-bday-2026", userId: "u1" },
    { id: "c2", templateId: "tpl-romantic-anniversary", templateTitle: "Romantic Love Story", recipientName: "Aisha", senderName: "Rahul Verma", senderEmail: "rahul@example.com", createdAt: "2026-08-10", viewsCount: 56, status: "Delivered", category: "Anniversary", slug: "aisha-anniversary", userId: "u3" },
    { id: "c3", templateId: "tpl-grad-pride", templateTitle: "Graduation Pride", recipientName: "Akira", senderName: "Priya Sharma", senderEmail: "priya@example.com", createdAt: "2026-08-09", viewsCount: 89, status: "Active", category: "Graduation", slug: "akira-grad-2026", userId: "u1" },
    { id: "c4", templateId: "tpl-wedding-bliss", templateTitle: "Wedding Bliss", recipientName: "Emma & Tom", senderName: "Sneha Gupta", senderEmail: "sneha@example.com", createdAt: "2026-08-08", viewsCount: 312, status: "Delivered", category: "Wedding", slug: "emma-tom-wedding", userId: "u3" },
    { id: "c5", templateId: "tpl-valentine-love", templateTitle: "Valentine's Love Letter", recipientName: "Lena", senderName: "Arjun Mehta", senderEmail: "arjun@example.com", createdAt: "2026-08-07", viewsCount: 21, status: "Scheduled", category: "Valentine", slug: "lena-valentine", userId: "u2" },
  ];
  for (const c of mockCelebrations) await setDoc(doc(db, "celebrations", c.id), c);

  for (const t of TEMPLATES) {
    await setDoc(doc(db, "templates", t.id), {
      ...t,
      status: "active",
      createdAt: "2024-09-01",
      revenue: t.isPremium ? (t.useCount || 10) * 14 : 0,
    });
  }

  const defaultSettings: AppSettings = {
    siteName: "Wishora",
    siteDescription: "Create magical celebration experiences",
    allowSignup: true,
    requireEmailVerification: false,
    maxPhotosPerCelebration: 10,
    maxCelebrationsPerUser: 50,
    premiumPrice: 14,
    maintenanceMode: false,
    analyticsEnabled: true,
    emailNotifications: true,
  };
  await setDoc(doc(db, "settings", "app"), defaultSettings);
}

// ── Users ─────────────────────────────────────────────────────────────────────

export function listenToUsers(callback: (users: AdminUser[]) => void) {
  return onSnapshot(
    collection(db, "users"),
    (snapshot) => {
      const users: AdminUser[] = [];
      snapshot.forEach((d) => users.push({ id: d.id, ...d.data() } as AdminUser));
      callback(users);
    },
    (error) => console.error("listenToUsers error:", error)
  );
}

export async function updateUserStatus(userId: string, status: "active" | "banned" | "pending") {
  await updateDoc(doc(db, "users", userId), { status });
}

export async function deleteUser(userId: string) {
  await deleteDoc(doc(db, "users", userId));
}

// ── Celebrations ──────────────────────────────────────────────────────────────

export function listenToCelebrations(callback: (celebrations: AdminCelebration[]) => void) {
  return onSnapshot(
    collection(db, "celebrations"),
    (snapshot) => {
      const celebrations: AdminCelebration[] = [];
      snapshot.forEach((d) => celebrations.push({ id: d.id, ...d.data() } as AdminCelebration));
      callback(celebrations);
    },
    (error) => console.error("listenToCelebrations error:", error)
  );
}

export async function updateCelebrationStatus(celebrationId: string, status: AdminCelebration["status"]) {
  await updateDoc(doc(db, "celebrations", celebrationId), { status });
}

export async function deleteCelebration(celebrationId: string) {
  await deleteDoc(doc(db, "celebrations", celebrationId));
}

// ── Templates ─────────────────────────────────────────────────────────────────

export function listenToTemplates(callback: (templates: AdminTemplate[]) => void) {
  return onSnapshot(
    collection(db, "templates"),
    (snapshot) => {
      const templates: AdminTemplate[] = [];
      snapshot.forEach((d) => templates.push({ id: d.id, ...d.data() } as AdminTemplate));
      callback(templates);
    },
    (error) => console.error("listenToTemplates error:", error)
  );
}

export async function updateTemplatePremium(templateId: string, isPremium: boolean) {
  await updateDoc(doc(db, "templates", templateId), { isPremium });
}

export async function updateTemplateStatus(templateId: string, status: AdminTemplate["status"]) {
  await updateDoc(doc(db, "templates", templateId), { status });
}

export async function saveTemplate(
  template: Partial<AdminTemplate> & { title: string; category: string }
) {
  const id = template.id || `tpl-custom-${Date.now()}`;
  const now = new Date().toISOString().split("T")[0];

  const fullTemplateData: AdminTemplate = {
    id,
    title: template.title,
    category: template.category,
    categoryName:
      template.categoryName ||
      template.category.charAt(0).toUpperCase() + template.category.slice(1),
    description: template.description || "A beautiful celebration template.",
    isPremium: template.isPremium ?? false,
    useCount: template.useCount ?? 0,
    rating: template.rating ?? 4.8,
    status: template.status || "active",
    createdAt: template.createdAt || now,
    revenue: template.revenue ?? 0,
    previewImage:
      template.previewImage ||
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
    themeColor: template.themeColor || "purple",
    gradient: template.gradient || "from-purple-600 to-pink-500",
    bgPattern: template.bgPattern || "confetti",
    musicTrack: template.musicTrack || "birthday",
    sampleRecipient: template.sampleRecipient || "Friend",
    sampleSender: template.sampleSender || "Well Wisher",
    sampleMessage: template.sampleMessage || "Wishing you all the joy and happiness!",
    samplePhotos: template.samplePhotos || [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    ],
    features: template.features || ["Confetti Animation", "Custom Audio", "Photo Gallery"],
  };

  await setDoc(doc(db, "templates", id), fullTemplateData, { merge: true });
  return fullTemplateData;
}

export async function deleteTemplate(templateId: string) {
  await deleteDoc(doc(db, "templates", templateId));
}

// ── Settings ──────────────────────────────────────────────────────────────────

export function listenToSettings(callback: (settings: AppSettings) => void) {
  return onSnapshot(
    doc(db, "settings", "app"),
    (docSnap) => {
      if (docSnap.exists()) callback(docSnap.data() as AppSettings);
    },
    (error) => console.error("listenToSettings error:", error)
  );
}

export async function updateSettings(settings: Partial<AppSettings>) {
  await updateDoc(doc(db, "settings", "app"), settings);
}

// ── Interactive Templates ─────────────────────────────────────────────────────

export async function saveInteractiveTemplate(template: InteractiveTemplate) {
  const id = template.id || `tpl-interactive-${Date.now()}`;
  const now = new Date().toISOString().split("T")[0];
  const fullTemplate = {
    ...template,
    id,
    createdAt: template.createdAt || now,
    isPremium: template.isPremium ?? false,
    settings: {
      attemptsMode: template.settings?.attemptsMode ?? "unlimited",
      maxAttempts: template.settings?.maxAttempts,
      allowHints: template.settings?.allowHints ?? false,
    },
    questions: (template.questions || []).map((q, idx) => ({
      ...q,
      order: q.order ?? idx + 1,
    })),
  };
  await setDoc(doc(db, "interactiveTemplates", id), fullTemplate, { merge: true });
  return fullTemplate;
}

export async function deleteInteractiveTemplate(templateId: string) {
  await deleteDoc(doc(db, "interactiveTemplates", templateId));
}

export async function getInteractiveTemplateById(
  templateId: string
): Promise<InteractiveTemplate | null> {
  const snap = await getDoc(doc(db, "interactiveTemplates", templateId));
  return snap.exists() ? (snap.data() as InteractiveTemplate) : null;
}

export async function createInteractiveInstance(templateId: string, creatorId: string) {
  const slug = `unlock-${templateId}-${Date.now()}`;
  const instance: InteractiveInstance = {
    id: slug,
    templateId,
    creatorId,
    createdAt: new Date().toISOString().split("T")[0],
    status: "published",
  };
  await setDoc(doc(db, "interactiveInstances", slug), instance);
  return instance;
}

export async function getInteractiveInstanceBySlug(
  slug: string
): Promise<InteractiveInstance | null> {
  const snap = await getDoc(doc(db, "interactiveInstances", slug));
  return snap.exists() ? (snap.data() as InteractiveInstance) : null;
}

export async function saveInteractiveResponse(
  instanceId: string,
  response: { questionId: string; selectedOptionId: string; correct: boolean }
) {
  await addDoc(collection(db, `interactiveInstances/${instanceId}/responses`), {
    ...response,
    timestamp: new Date().toISOString(),
  });
}
