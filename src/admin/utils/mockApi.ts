// Extended Mock API for admin panel

export interface UserLoginStat {
  totalUsers: number;
  activeUsers: number;
}

export interface TemplateUsage {
  name: string;
  usageCount: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'premium';
  status: 'active' | 'banned' | 'pending';
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
  status: 'Active' | 'Scheduled' | 'Delivered';
  category: string;
  slug: string;
}

export interface AdminTemplate {
  id: string;
  title: string;
  category: string;
  isPremium: boolean;
  useCount: number;
  rating: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  revenue: number;
}

export interface AnalyticsData {
  daily: { date: string; users: number; celebrations: number; revenue: number }[];
  categoryBreakdown: { category: string; count: number; percentage: number }[];
  conversionRate: number;
  avgSessionDuration: string;
  bounceRate: number;
  totalRevenue: number;
  revenueGrowth: number;
  userGrowth: number;
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

export async function getUserLoginStat(): Promise<UserLoginStat> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { totalUsers: 1245, activeUsers: 342 };
}

export async function getTemplateUsageStats(): Promise<TemplateUsage[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [
    { name: 'Birthday Surprise Box', usageCount: 487 },
    { name: 'Romantic Anniversary', usageCount: 312 },
    { name: 'Graduation Pride', usageCount: 256 },
    { name: 'Wedding Bliss', usageCount: 198 },
    { name: "Valentine's Love Letter", usageCount: 175 },
  ];
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: 'u1', name: 'Priya Sharma', email: 'priya@example.com', plan: 'pro', status: 'active', joinedAt: '2025-01-15', celebrationsCount: 23, lastActive: '2 hours ago', avatar: 'PS' },
    { id: 'u2', name: 'Arjun Mehta', email: 'arjun@example.com', plan: 'free', status: 'active', joinedAt: '2025-03-22', celebrationsCount: 5, lastActive: '1 day ago', avatar: 'AM' },
    { id: 'u3', name: 'Sneha Gupta', email: 'sneha@example.com', plan: 'premium', status: 'active', joinedAt: '2024-11-08', celebrationsCount: 67, lastActive: '30 min ago', avatar: 'SG' },
    { id: 'u4', name: 'Ravi Kumar', email: 'ravi@example.com', plan: 'free', status: 'banned', joinedAt: '2025-05-10', celebrationsCount: 2, lastActive: '3 weeks ago', avatar: 'RK' },
    { id: 'u5', name: 'Anita Desai', email: 'anita@example.com', plan: 'pro', status: 'active', joinedAt: '2025-02-14', celebrationsCount: 31, lastActive: '5 hours ago', avatar: 'AD' },
    { id: 'u6', name: 'Vikram Singh', email: 'vikram@example.com', plan: 'premium', status: 'active', joinedAt: '2024-10-01', celebrationsCount: 89, lastActive: '10 min ago', avatar: 'VS' },
    { id: 'u7', name: 'Deepa Nair', email: 'deepa@example.com', plan: 'free', status: 'pending', joinedAt: '2026-08-11', celebrationsCount: 0, lastActive: 'Never', avatar: 'DN' },
    { id: 'u8', name: 'Karan Patel', email: 'karan@example.com', plan: 'pro', status: 'active', joinedAt: '2025-04-30', celebrationsCount: 18, lastActive: '1 hour ago', avatar: 'KP' },
    { id: 'u9', name: 'Meera Joshi', email: 'meera@example.com', plan: 'free', status: 'active', joinedAt: '2025-06-18', celebrationsCount: 7, lastActive: '2 days ago', avatar: 'MJ' },
    { id: 'u10', name: 'Rajesh Iyer', email: 'rajesh@example.com', plan: 'premium', status: 'active', joinedAt: '2024-09-12', celebrationsCount: 112, lastActive: 'Just now', avatar: 'RI' },
  ];
}

export async function getAdminCelebrations(): Promise<AdminCelebration[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: 'c1', templateTitle: 'Birthday Surprise Box', recipientName: 'Sarah', senderName: 'Mike Johnson', senderEmail: 'mike@example.com', createdAt: '2026-08-11', viewsCount: 134, status: 'Active', category: 'Birthday', slug: 'sarah-bday-2026' },
    { id: 'c2', templateTitle: 'Romantic Anniversary', recipientName: 'Aisha', senderName: 'Rahul Verma', senderEmail: 'rahul@example.com', createdAt: '2026-08-10', viewsCount: 56, status: 'Delivered', category: 'Anniversary', slug: 'aisha-anniversary' },
    { id: 'c3', templateTitle: 'Graduation Pride', recipientName: 'Akira', senderName: 'Priya Sharma', senderEmail: 'priya@example.com', createdAt: '2026-08-09', viewsCount: 89, status: 'Active', category: 'Graduation', slug: 'akira-grad-2026' },
    { id: 'c4', templateTitle: 'Wedding Bliss', recipientName: 'Emma and Tom', senderName: 'Sneha Gupta', senderEmail: 'sneha@example.com', createdAt: '2026-08-08', viewsCount: 312, status: 'Delivered', category: 'Wedding', slug: 'emma-tom-wedding' },
    { id: 'c5', templateTitle: "Valentine's Love Letter", recipientName: 'Lena', senderName: 'Arjun Mehta', senderEmail: 'arjun@example.com', createdAt: '2026-08-07', viewsCount: 21, status: 'Scheduled', category: 'Valentine', slug: 'lena-valentine' },
    { id: 'c6', templateTitle: 'Birthday Surprise Box', recipientName: 'Dad', senderName: 'Anita Desai', senderEmail: 'anita@example.com', createdAt: '2026-08-06', viewsCount: 45, status: 'Active', category: 'Birthday', slug: 'dad-birthday-2026' },
    { id: 'c7', templateTitle: 'Farewell Wishes', recipientName: 'Mr. Sharma', senderName: 'Vikram Singh', senderEmail: 'vikram@example.com', createdAt: '2026-08-05', viewsCount: 78, status: 'Delivered', category: 'Farewell', slug: 'sharma-farewell' },
    { id: 'c8', templateTitle: 'Thank You Surprise', recipientName: 'Dr. Mehra', senderName: 'Rajesh Iyer', senderEmail: 'rajesh@example.com', createdAt: '2026-08-04', viewsCount: 33, status: 'Active', category: 'Thank You', slug: 'dr-mehra-thanks' },
  ];
}

export async function getAdminTemplates(): Promise<AdminTemplate[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: 't1', title: 'Birthday Surprise Box', category: 'Birthday', isPremium: false, useCount: 487, rating: 4.9, status: 'active', createdAt: '2024-09-01', revenue: 0 },
    { id: 't2', title: 'Romantic Anniversary', category: 'Anniversary', isPremium: true, useCount: 312, rating: 4.8, status: 'active', createdAt: '2024-09-15', revenue: 4368 },
    { id: 't3', title: 'Graduation Pride', category: 'Graduation', isPremium: false, useCount: 256, rating: 4.7, status: 'active', createdAt: '2024-10-01', revenue: 0 },
    { id: 't4', title: 'Wedding Bliss', category: 'Wedding', isPremium: true, useCount: 198, rating: 4.9, status: 'active', createdAt: '2024-10-20', revenue: 2772 },
    { id: 't5', title: "Valentine's Love Letter", category: 'Valentine', isPremium: true, useCount: 175, rating: 4.6, status: 'active', createdAt: '2024-11-01', revenue: 2450 },
    { id: 't6', title: 'Farewell Wishes', category: 'Farewell', isPremium: false, useCount: 143, rating: 4.5, status: 'active', createdAt: '2024-11-15', revenue: 0 },
    { id: 't7', title: 'Baby Shower Joy', category: 'Baby', isPremium: true, useCount: 98, rating: 4.8, status: 'active', createdAt: '2024-12-01', revenue: 1372 },
    { id: 't8', title: 'Festival Vibes', category: 'Festival', isPremium: false, useCount: 87, rating: 4.4, status: 'draft', createdAt: '2025-01-10', revenue: 0 },
    { id: 't9', title: 'Thank You Surprise', category: 'Thank You', isPremium: false, useCount: 76, rating: 4.6, status: 'active', createdAt: '2025-02-01', revenue: 0 },
    { id: 't10', title: 'Achievement Unlocked', category: 'Achievement', isPremium: true, useCount: 65, rating: 4.7, status: 'archived', createdAt: '2025-03-15', revenue: 910 },
  ];
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    daily: [
      { date: 'Aug 6', users: 45, celebrations: 78, revenue: 420 },
      { date: 'Aug 7', users: 62, celebrations: 95, revenue: 560 },
      { date: 'Aug 8', users: 58, celebrations: 112, revenue: 630 },
      { date: 'Aug 9', users: 71, celebrations: 134, revenue: 770 },
      { date: 'Aug 10', users: 84, celebrations: 156, revenue: 910 },
      { date: 'Aug 11', users: 93, celebrations: 178, revenue: 1050 },
      { date: 'Aug 12', users: 110, celebrations: 201, revenue: 1240 },
    ],
    categoryBreakdown: [
      { category: 'Birthday', count: 487, percentage: 34 },
      { category: 'Anniversary', count: 312, percentage: 22 },
      { category: 'Graduation', count: 256, percentage: 18 },
      { category: 'Wedding', count: 198, percentage: 14 },
      { category: 'Valentine', count: 175, percentage: 12 },
    ],
    conversionRate: 23.4,
    avgSessionDuration: '4m 32s',
    bounceRate: 38.2,
    totalRevenue: 11872,
    revenueGrowth: 18.4,
    userGrowth: 12.7,
  };
}

export async function getAppSettings(): Promise<AppSettings> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    siteName: 'Wishora',
    siteDescription: 'Create magical celebration experiences',
    allowSignup: true,
    requireEmailVerification: false,
    maxPhotosPerCelebration: 10,
    maxCelebrationsPerUser: 50,
    premiumPrice: 14,
    maintenanceMode: false,
    analyticsEnabled: true,
    emailNotifications: true,
  };
}
