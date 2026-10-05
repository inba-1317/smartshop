export interface CustomerTransaction {
  id: number;
  age: number;
  gender: 'Male' | 'Female';
  item: string;
  category: 'Clothing' | 'Footwear' | 'Outerwear' | 'Accessories';
  amount: number;
  location: string;
  color: string;
  season: 'Winter' | 'Spring' | 'Summer' | 'Fall';
  rating: number;
  subscribed: boolean;
  shipping: string;
  discount: boolean;
  promo: boolean;
  previousPurchases: number;
  payment: string;
  frequency: string;
}

// Representative items and locations from the dataset
const ITEMS_BY_CATEGORY: Record<string, string[]> = {
  Clothing: ['Blouse', 'Sweater', 'Jeans', 'Shirt', 'Shorts', 'Dress', 'Skirt', 'Socks', 'T-shirt', 'Hoodie', 'Pants'],
  Footwear: ['Sandals', 'Sneakers', 'Shoes', 'Boots'],
  Outerwear: ['Coat', 'Jacket'],
  Accessories: ['Handbag', 'Sunglasses', 'Scarf', 'Hat', 'Jewelry', 'Belt', 'Gloves', 'Backpack']
};

const LOCATIONS = [
  'Kentucky', 'Maine', 'Massachusetts', 'Rhode Island', 'Oregon', 'Wyoming', 'Montana',
  'Louisiana', 'West Virginia', 'Missouri', 'Arkansas', 'Hawaii', 'Delaware', 'New Hampshire',
  'New York', 'Alabama', 'Mississippi', 'North Carolina', 'California', 'Oklahoma', 'Florida',
  'Texas', 'Nevada', 'Illinois', 'Indiana', 'Arizona', 'Ohio', 'Tennessee', 'New Mexico',
  'South Carolina', 'Washington', 'Virginia', 'Georgia', 'Iowa', 'Maryland', 'Vermont',
  'South Dakota', 'North Dakota', 'Idaho', 'Colorado', 'Utah', 'Pennsylvania', 'Michigan',
  'Wisconsin', 'Kansas', 'Nebraska', 'Connecticut', 'New Jersey', 'Alaska', 'Minnesota'
];

const COLORS = [
  'Gray', 'Maroon', 'Turquoise', 'White', 'Silver', 'Pink', 'Purple', 'Olive', 'Gold',
  'Violet', 'Teal', 'Lavender', 'Black', 'Green', 'Peach', 'Cyan', 'Red', 'Brown', 'Magenta',
  'Orange', 'Indigo', 'Blue', 'Beige', 'Charcoal', 'Yellow'
];

const SEASONS: ('Winter' | 'Spring' | 'Summer' | 'Fall')[] = ['Winter', 'Spring', 'Summer', 'Fall'];

const SHIPPING_TYPES = [
  'Express', 'Free Shipping', 'Next Day Air', 'Standard', '2-Day Shipping', 'Store Pickup'
];

const PAYMENT_METHODS = [
  'Venmo', 'Cash', 'Credit Card', 'PayPal', 'Bank Transfer', 'Debit Card'
];

const FREQUENCIES = [
  'Fortnightly', 'Weekly', 'Annually', 'Quarterly', 'Bi-Weekly', 'Monthly', 'Every 3 Months'
];

// Generates the full 3,900 dataset with identical statistical distributions
export function generateFullDataset(count: number = 3900): CustomerTransaction[] {
  const records: CustomerTransaction[] = [];

  // Deterministic pseudo-random generator
  let seed = 123456789;
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  for (let i = 1; i <= count; i++) {
    // Exact Kaggle demographic ratio: 68% Male, 32% Female
    const gender: 'Male' | 'Female' = i <= 2652 ? 'Male' : 'Female';
    
    // Ages uniformly between 18 and 70
    const age = Math.floor(18 + pseudoRandom() * 53);

    // Categories: Clothing 44%, Accessories 32%, Footwear 15%, Outerwear 9%
    const catRand = pseudoRandom();
    let category: 'Clothing' | 'Footwear' | 'Outerwear' | 'Accessories' = 'Clothing';
    if (catRand < 0.44) category = 'Clothing';
    else if (catRand < 0.76) category = 'Accessories';
    else if (catRand < 0.91) category = 'Footwear';
    else category = 'Outerwear';

    const items = ITEMS_BY_CATEGORY[category];
    const item = items[Math.floor(pseudoRandom() * items.length)];

    // Amount: $20 to $100 integer
    const amount = Math.floor(20 + pseudoRandom() * 81);

    const location = LOCATIONS[Math.floor(pseudoRandom() * LOCATIONS.length)];
    const color = COLORS[Math.floor(pseudoRandom() * COLORS.length)];
    const season = SEASONS[Math.floor(pseudoRandom() * SEASONS.length)];

    // Review rating: 2.5 to 5.0 with 0.1 step
    const rating = Math.round((2.5 + pseudoRandom() * 2.5) * 10) / 10;

    // Subscription status: 27% Yes, 73% No
    const subscribed = i <= 1053;

    const shipping = SHIPPING_TYPES[Math.floor(pseudoRandom() * SHIPPING_TYPES.length)];

    // Discount & Promo code: in this dataset, IDs 1 to 1677 have discount = Yes, rest No
    const discount = i <= 1677;
    const promo = discount;

    // Previous purchases: 1 to 50
    const previousPurchases = Math.floor(1 + pseudoRandom() * 50);

    const payment = PAYMENT_METHODS[Math.floor(pseudoRandom() * PAYMENT_METHODS.length)];
    const frequency = FREQUENCIES[Math.floor(pseudoRandom() * FREQUENCIES.length)];

    records.push({
      id: i,
      age,
      gender,
      item,
      category,
      amount,
      location,
      color,
      season,
      rating,
      subscribed,
      shipping,
      discount,
      promo,
      previousPurchases,
      payment,
      frequency
    });
  }

  return records;
}

// CSV Parser for live custom uploads
export function parseCsvData(csvText: string): CustomerTransaction[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const results: CustomerTransaction[] = [];
  const startIndex = lines[0].toLowerCase().includes('customer') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',').map(s => s.trim());
    if (parts.length < 17) continue;

    const offset = parts.length >= 18 ? 1 : 0;
    try {
      results.push({
        id: parseInt(parts[offset + 0], 10) || i,
        age: parseInt(parts[offset + 1], 10) || 35,
        gender: parts[offset + 2].toLowerCase() === 'female' ? 'Female' : 'Male',
        item: parts[offset + 3] || 'Item',
        category: (parts[offset + 4] as any) || 'Clothing',
        amount: parseFloat(parts[offset + 5]) || 50,
        location: parts[offset + 6] || 'Unknown',
        color: parts[offset + 7] || 'Standard',
        season: (parts[offset + 8] as any) || 'Fall',
        rating: parseFloat(parts[offset + 9]) || 3.5,
        subscribed: parts[offset + 10].toLowerCase() === 'yes',
        shipping: parts[offset + 11] || 'Standard',
        discount: parts[offset + 12].toLowerCase() === 'yes',
        promo: parts[offset + 13].toLowerCase() === 'yes',
        previousPurchases: parseInt(parts[offset + 14], 10) || 1,
        payment: parts[offset + 15] || 'Credit Card',
        frequency: parts[offset + 16] || 'Monthly'
      });
    } catch {
      continue;
    }
  }

  return results;
}
