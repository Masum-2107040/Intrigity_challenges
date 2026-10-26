export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Coupon {
  code: string;
  percent: number;
  appliedAt: number; // step index
}

export interface CartState {
  items: CartItem[];
  coupons: Coupon[];
  credit: number;
}

export interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
}

export const PRODUCT = {
  id: 'midnight-vault',
  name: 'The Midnight Collection',
  subtitle: 'One box. Made only once.',
  description: 'Our numbered Halloween archive: rare fruit jellies, black cocoa truffles and hand-wrapped midnight caramels in a keepsake chest.',
  price: 66600, // cents
  weight: '2.4 kg',
  category: 'Gift boxes',
  badge: 'Only one available',
};

export const CREDIT = 6600; // cents

export const COUPONS: Record<string, number> = {
  NIGHT20: 20,
  NEWS30: 30,
};

export const OFFICIAL_FLAG = 'INTIGRITI{094638e6-ba2f-4c50-8bb4-41ced0d5debd}';

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

export function calculateTotal(subtotal: number, coupons: Coupon[]): { discount: number; total: number } {
  let discount = 0;
  for (const coupon of coupons) {
    discount += Math.round(subtotal * (coupon.percent / 100));
  }
  const total = Math.max(0, subtotal - discount);
  return { discount, total };
}

export const STEPS: StepConfig[] = [
  { id: 1, title: 'Understand the Challenge', subtitle: 'Reconnaissance', icon: '🔍' },
  { id: 2, title: 'Test Price Manipulation', subtitle: 'Parameter Tampering', icon: '💰' },
  { id: 3, title: 'Test Quantity Manipulation', subtitle: 'Input Validation', icon: '🔢' },
  { id: 4, title: 'Discover the First Coupon', subtitle: 'Feature Discovery', icon: '🎟️' },
  { id: 5, title: 'Test Coupon Reuse', subtitle: 'Duplicate Testing', icon: '🔁' },
  { id: 6, title: 'Discover Newsletter Coupon', subtitle: 'Expanded Scope', icon: '📧' },
  { id: 7, title: 'The Key Discovery', subtitle: 'Alternating Coupons', icon: '🔀' },
  { id: 8, title: 'Understand the Flaw', subtitle: 'State & Logic Analysis', icon: '🧠' },
  { id: 9, title: 'Complete the Challenge', subtitle: 'Coupon Swap Exploit', icon: '🏴' },
  { id: 10, title: 'Lessons for Developers', subtitle: 'Defensive Engineering', icon: '🛡️' },
];
