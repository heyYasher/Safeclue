
import { Project, User, Booking, UserRole, TimelineStatus, Transaction, Invoice, TransactionStatus, Notification, NotificationType } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'John Doe', email: 'john.doe@example.com', mobile: '1234567890', role: UserRole.USER, safeCoinBalance: 25500, referralCode: 'JOHN2024' },
  { id: 'a1', name: 'Jane Smith', email: 'jane.smith@example.com', mobile: '0987654321', role: UserRole.ADMIN, safeCoinBalance: 0, referralCode: 'JANEADMIN' },
  { id: 'sa1', name: 'Super Admin', email: 'super@example.com', mobile: '1122334455', role: UserRole.SUPER_ADMIN, safeCoinBalance: 0, referralCode: 'SUPERADMIN' },
];

export const MOCK_INVOICES: Invoice[] = [
  { 
    id: 'inv1', 
    invoiceNumber: 'SC-2024-001', 
    date: '2024-06-01', 
    dueDate: '2024-06-15', 
    items: [
      { description: 'Foundation Stage Payment', amount: 50000 },
      { description: 'Material Surcharge', amount: 2500 }
    ],
    totalAmount: 52500,
    status: TransactionStatus.PAID,
  },
  { 
    id: 'inv2', 
    invoiceNumber: 'SC-2024-002', 
    date: '2024-07-10', 
    dueDate: '2024-07-25', 
    items: [
      { description: 'Structural Work Payment', amount: 75000 }
    ],
    totalAmount: 75000,
    status: TransactionStatus.PAID,
  },
  { 
    id: 'inv3', 
    invoiceNumber: 'SC-2024-003', 
    date: '2024-08-01', 
    dueDate: '2024-08-15', 
    items: [
      { description: 'Flooring & Tiling Advance', amount: 30000 }
    ],
    totalAmount: 30000,
    status: TransactionStatus.PENDING,
  },
  { 
    id: 'inv4', 
    invoiceNumber: 'SC-2024-004', 
    date: '2024-08-08', 
    dueDate: '2024-08-22', 
    items: [
      { description: 'Interior Work Advance Payment', amount: 40000 }
    ],
    totalAmount: 40000,
    status: TransactionStatus.PENDING,
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tr1', date: '2024-06-05', description: 'Payment for Foundation', amount: 52500, status: TransactionStatus.PAID, invoiceId: 'inv1' },
  { id: 'tr2', date: '2024-07-12', description: 'Payment for Structural Work', amount: 75000, status: TransactionStatus.PAID, invoiceId: 'inv2' },
  { id: 'tr3', date: '2024-08-02', description: 'Advance for Flooring', amount: 30000, status: TransactionStatus.PENDING, invoiceId: 'inv3' },
  { id: 'tr4', date: '2024-08-10', description: 'Interior work advance', amount: 40000, status: TransactionStatus.AWAITING_APPROVAL, invoiceId: 'inv4', proofUrl: 'https://picsum.photos/seed/proof1/400/300' },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    userId: 'u1',
    name: 'Skyline Towers',
    location: 'Downtown, Metropolis',
    builder: 'Constructo Corp.',
    description: 'A luxurious new residential complex offering stunning city views and state-of-the-art amenities. This project is a fresh construction from the ground up, featuring a rooftop pool, gym, and 24/7 security.',
    images: [
      'https://picsum.photos/seed/p1-1/800/600',
      'https://picsum.photos/seed/p1-2/800/600',
      'https://picsum.photos/seed/p1-3/800/600',
    ],
    timeline: [
      { id: 't1-1', name: 'Foundation', status: TimelineStatus.COMPLETED, progress: 100 },
      { id: 't1-2', name: 'Structural Work', status: TimelineStatus.COMPLETED, progress: 100 },
      { id: 't1-3', name: 'Flooring & Tiling', status: TimelineStatus.IN_PROGRESS, progress: 60 },
      { id: 't1-4', name: 'Finishing Touches', status: TimelineStatus.PENDING, progress: 0 },
      { id: 't1-5', name: 'Completion', status: TimelineStatus.PENDING, progress: 0 },
    ],
    updates: [
      { id: 'u1-1', type: 'photo', url: 'https://picsum.photos/seed/update1/400/300', caption: 'Flooring work started on the 5th floor.', date: '2024-07-20', author: 'Jane Smith' },
      { id: 'u1-2', type: 'note', caption: 'Material delivery scheduled for tomorrow morning.', date: '2024-07-19', author: 'Jane Smith' },
      { id: 'u1-3', type: 'video', url: 'https://picsum.photos/seed/video1/400/300', caption: 'Drone footage of the completed structure.', date: '2024-07-15', author: 'Jane Smith' },
    ],
    coords: { lat: 37.7749, lng: -122.4194 },
    transactions: MOCK_TRANSACTIONS,
  },
  {
    id: 'p2',
    userId: 'u1',
    name: 'Greenwood Villas',
    location: 'Suburbia, Green Valley',
    builder: 'EcoBuild Homes',
    description: 'Eco-friendly villas nestled in nature, built as a completely new development. These homes are designed for sustainable living with solar panels, rainwater harvesting, and lush green surroundings. No renovation or modification work is undertaken.',
    images: [
      'https://picsum.photos/seed/p2-1/800/600',
      'https://picsum.photos/seed/p2-2/800/600',
      'https://picsum.photos/seed/p2-3/800/600',
    ],
    timeline: [
        { id: 't2-1', name: 'Foundation', status: TimelineStatus.COMPLETED, progress: 100 },
        { id: 't2-2', name: 'Structural Work', status: TimelineStatus.IN_PROGRESS, progress: 85 },
        { id: 't2-3', name: 'Interior Works', status: TimelineStatus.PENDING, progress: 10 },
        { id: 't2-4', name: 'Landscaping', status: TimelineStatus.PENDING, progress: 0 },
    ],
    updates: [
      { id: 'u2-1', type: 'photo', url: 'https://picsum.photos/seed/update2/400/300', caption: 'Roofing is nearly complete!', date: '2024-07-21', author: 'Jane Smith' },
    ],
    coords: { lat: 34.0522, lng: -118.2437 },
    transactions: [],
  },
  {
    id: 'p3',
    userId: 'showcase-user', // Not owned by the logged-in user 'u1'
    name: 'Ocean Breeze Condos',
    location: 'Sunny Isles, Florida',
    builder: 'Coastal Homes Inc.',
    description: 'A stunning beachfront property offering unparalleled ocean views. This is a showcase project managed by our admin team, featuring modern architecture and luxurious amenities. It is a fresh construction from the ground up.',
    images: [
      'https://picsum.photos/seed/p3-1/800/600',
      'https://picsum.photos/seed/p3-2/800/600',
      'https://picsum.photos/seed/p3-3/800/600',
    ],
    timeline: [
      { id: 't3-1', name: 'Site Preparation', status: TimelineStatus.COMPLETED, progress: 100 },
      { id: 't3-2', name: 'Foundation Pouring', status: TimelineStatus.COMPLETED, progress: 100 },
      { id: 't3-3', name: 'Exterior Framing', status: TimelineStatus.IN_PROGRESS, progress: 70 },
      { id: 't3-4', name: 'Interior Finishes', status: TimelineStatus.PENDING, progress: 0 },
    ],
    updates: [
      { id: 'u3-1', type: 'photo', url: 'https://picsum.photos/seed/update3/400/300', caption: 'Exterior framing for the east wing is progressing well.', date: '2024-07-22', author: 'Jane Smith' },
    ],
    coords: { lat: 25.9415, lng: -80.1221 },
    transactions: [], // Showcase projects won't have user-facing transactions
  },
];

export const MOCK_BOOKINGS: Booking[] = [
    { id: 'b1', projectId: 'p1', projectName: 'Skyline Towers', date: '2024-08-05', time: '11:00 AM' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: NotificationType.PROJECT_UPDATE,
    title: 'Progress on Skyline Towers',
    message: 'The flooring and tiling stage is now 80% complete.',
    timestamp: '30 mins ago',
    read: false,
    projectId: 'p1',
  },
  {
    id: 'n2',
    type: NotificationType.PAYMENT_REMINDER,
    title: 'Invoice Due Soon',
    message: 'Your payment for invoice SC-2024-003 is due in 3 days.',
    timestamp: '2 hours ago',
    read: false,
    projectId: 'p1',
  },
  {
    id: 'n3',
    type: NotificationType.GENERAL_ANNOUNCEMENT,
    title: 'System Maintenance',
    message: 'We will be undergoing scheduled maintenance this Saturday from 2 AM to 4 AM.',
    timestamp: '3 days ago',
    read: true,
  },
   {
    id: 'n4',
    type: NotificationType.PROJECT_UPDATE,
    title: 'Update on Greenwood Villas',
    message: 'Structural work is now 95% complete. Interior work is set to begin next week.',
    timestamp: '4 days ago',
    read: true,
    projectId: 'p2',
  }
];