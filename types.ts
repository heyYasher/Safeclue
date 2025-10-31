
export type View = 
    'onboarding' | 
    'landing' |
    'login' | 
    'register' | 
    'forgot_password' | 
    'verify_otp' |
    'admin_login' | 
    'smart_estimator' |
    'consultation' |
    'user_home' |
    'project_list' |
    'project_detail' | 
    'my_profile' |
    'chat' |
    'bookings' |
    'shop' |
    'notifications' |
    'admin_dashboard' | 
    'super_admin_dashboard';

export enum UserRole {
  USER = 'User',
  ADMIN = 'Engineer/Admin',
  SUPER_ADMIN = 'Super Admin',
}

export enum TimelineStatus {
  COMPLETED = 'Completed',
  IN_PROGRESS = 'In Progress',
  PENDING = 'Pending',
}

export enum TransactionStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
  FAILED = 'Failed',
  AWAITING_APPROVAL = 'Awaiting Approval',
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: TransactionStatus;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: TransactionStatus;
  invoiceId: string;
  proofUrl?: string;
}

export interface TimelineStage {
  id: string;
  name: string;
  status: TimelineStatus;
  progress: number;
  notes?: string;
}

export interface ProjectUpdate {
  id: string;
  type: 'photo' | 'video' | 'note';
  url?: string;
  caption: string;
  date: string;
  author: string;
}

export interface Project {
  id:string;
  userId: string;
  name: string;
  location: string;
  builder: string;
  description: string;
  images: string[];
  timeline: TimelineStage[];
  updates: ProjectUpdate[];
  coords: { lat: number; lng: number };
  transactions: Transaction[];
}

export interface User {
  id: string;
  name: string;
  email?: string;
  mobile: string;
  role: UserRole;
  safeCoinBalance: number;
  referralCode: string;
}

export interface Booking {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  time: string;
}

export enum NotificationType {
  PROJECT_UPDATE = 'Project Update',
  PAYMENT_REMINDER = 'Payment Reminder',
  GENERAL_ANNOUNCEMENT = 'General Announcement',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  projectId?: string;
}