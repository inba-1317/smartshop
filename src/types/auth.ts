export type UserRole = 'customer' | 'shopkeeper' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  customerId?: number; // Linked Customer ID from the 3,900 benchmark dataset
  storeName?: string; // For Shopkeeper (e.g. "The Shop - Central Boutique")
  avatar?: string;
  joinedDate: string;
  location?: string;
  membershipStatus?: 'Standard' | 'VIP' | 'Subscriber';
  preferredCategory?: string;
  permissions?: string[];
}
