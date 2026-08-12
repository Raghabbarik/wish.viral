export type CategoryId =
  | "birthday"
  | "anniversary"
  | "congratulations"
  | "valentine"
  | "graduation"
  | "wedding"
  | "farewell"
  | "achievement"
  | "festival"
  | "thankyou"
  | "baby"
  | "more";
export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  emoji: string;
  description: string;
  gradient: string;
  badgeColor: string;
  count: number;
}
export interface CustomField {
  id: string;
  label: string;
  value: string;
  fieldType: 'text' | 'date' | 'header' | 'question';
}

export interface InteractiveOption {
  id: string;
  label: string;
  imageUrl?: string;
}

export type QuestionType = 'multiple' | 'truefalse' | 'imagechoice';

export interface InteractiveQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: InteractiveOption[];
  correctOptionId: string; // stored securely
  hint?: string;
  required?: boolean;
  order: number;
}

export interface FinalSurprise {
  type: 'text' | 'photo' | 'gallery' | 'video' | 'music' | 'custom';
  content: any; // defined per type
  title?: string;
}

export interface Template {
  id: string;
  title: string;
  category: CategoryId;
  categoryName?: string;
  description: string;
  previewImage: string;
  themeColor: string;
  gradient: string;
  bgPattern: string;
  musicTrack: string;
  sampleRecipient: string;
  sampleSender: string;
  sampleMessage: string;
  samplePhotos: string[];
  isPremium: boolean;
  features: string[];
  useCount?: number;
  rating?: number;
  status?: "active" | "draft" | "archived";
}

export interface InteractiveTemplate {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  isPremium: boolean;
  category: CategoryId;
  questions: InteractiveQuestion[];
  finalSurprise: FinalSurprise;
  settings: {
    attemptsMode: 'unlimited' | 'limited' | 'single';
    maxAttempts?: number;
    allowHints: boolean;
  };
  createdAt?: string;
}

export interface InteractiveInstance {
  id: string; // public slug
  templateId: string;
  creatorId: string;
  createdAt: string;
  status: 'draft' | 'published' | 'completed';
}

export interface CelebrationData {
  id: string;
  templateId: string;
  templateTitle: string;
  recipientName: string;
  senderName: string;
  date: string;
  message: string;
  photos: string[]; // URLs or base64 data URLs
  musicTrack: string;
  themeColor: string;
  animationStyle: 'confetti' | 'hearts' | 'balloons' | 'sparkles';
  createdAt: string;
  viewsCount: number;
  slug: string;
  status: 'Active' | 'Scheduled' | 'Delivered';
  isPasswordProtected?: boolean;
  password?: string;
  customFields?: CustomField[];
}
export interface PersonalizationFormState {
  templateId: string;
  recipientName: string;
  senderName: string;
  date: string;
  message: string;
  photos: string[];
  musicTrack: string;
  animationStyle: "confetti" | "hearts" | "balloons" | "sparkles";
  themeColor: string;
  customFields?: CustomField[];
}
export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "info" | "warning" | "error";
}
