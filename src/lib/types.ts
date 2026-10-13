export type TagType = 'GTB' | 'GTK' | 'GTT' | 'GTU';

export type TagStatus = 'unregistered' | 'active' | 'disabled' | 'printed' | 'activated' | 'unassigned' | 'lost' | 'stolen' | 'trial';

export interface QrTag {
  id: string;
  qrId: string;
  tagType: TagType;
  status: TagStatus;
  pinHash?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TagOwner {
  id: string;
  tagId?: string;
  qrId: string;
  tagType?: TagType;
  ownerName: string;
  ownerPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  pin?: string;
  vehicleNo?: string;
  bloodGroup?: string;
  medicalNotes?: string;
  activatedAt?: string;
  status?: TagStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthAttempt {
  qrId: string;
  timestamp: number;
  success: boolean;
  ip?: string;
}

export interface Product {
  id: string;
  title: string;
  tagType: TagType;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  features: string[];
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CredentialsConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
}

export interface EmergencyCallLog {
  id: string;
  qrId: string;
  type: 'call' | 'sms';
  timestamp: string;
  status: 'initiated' | 'completed' | 'failed' | 'mocked';
}
