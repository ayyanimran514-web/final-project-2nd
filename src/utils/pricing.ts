export interface BulkTier {
  minQty: number;
  maxQty?: number;
  discountPercent: number;
  tierName: string;
  badge: string;
  description: string;
  isVendor?: boolean;
}

export const BULK_DISCOUNT_TIERS: BulkTier[] = [
  { 
    minQty: 1, 
    maxQty: 2, 
    discountPercent: 0, 
    tierName: 'Standard Retail', 
    badge: 'Single Piece',
    description: 'Standard retail pricing for 1-2 pieces.' 
  },
  { 
    minQty: 3, 
    maxQty: 5, 
    discountPercent: 10, 
    tierName: 'Squad Pack', 
    badge: '10% OFF (3-5 pcs)',
    description: 'Perfect for friends, couples, or multi-color personal sets.' 
  },
  { 
    minQty: 6, 
    maxQty: 11, 
    discountPercent: 18, 
    tierName: 'Boutique Crew', 
    badge: '18% OFF (6-11 pcs)',
    description: 'Designed for boutique drops, studios, and content creator merch.' 
  },
  { 
    minQty: 12, 
    maxQty: 24, 
    discountPercent: 25, 
    tierName: 'Clan & Esports Team', 
    badge: '25% OFF (12-24 pcs)',
    description: 'Ideal for gaming clans, event staff, clubs, and esports teams.' 
  },
  { 
    minQty: 25, 
    discountPercent: 35, 
    tierName: 'Vendor & Wholesale VIP', 
    badge: '35% OFF (25+ pcs)',
    description: 'Maximum wholesale discount tier for verified retail partners & vendors.',
    isVendor: true 
  }
];

export function getBulkDiscountTier(quantity: number): BulkTier {
  for (let i = BULK_DISCOUNT_TIERS.length - 1; i >= 0; i--) {
    if (quantity >= BULK_DISCOUNT_TIERS[i].minQty) {
      return BULK_DISCOUNT_TIERS[i];
    }
  }
  return BULK_DISCOUNT_TIERS[0];
}

export function getNextBulkTier(quantity: number): BulkTier | null {
  for (const tier of BULK_DISCOUNT_TIERS) {
    if (tier.minQty > quantity) {
      return tier;
    }
  }
  return null;
}

export function calculateBulkPricing(unitPrice: number, quantity: number) {
  const safeQty = Math.max(1, quantity);
  const tier = getBulkDiscountTier(safeQty);
  const discountMultiplier = 1 - (tier.discountPercent / 100);
  const discountedUnitPrice = Number((unitPrice * discountMultiplier).toFixed(2));
  const originalTotal = Number((unitPrice * safeQty).toFixed(2));
  const finalTotal = Number((discountedUnitPrice * safeQty).toFixed(2));
  const totalSavings = Number((originalTotal - finalTotal).toFixed(2));

  const nextTier = getNextBulkTier(safeQty);
  const itemsToNextTier = nextTier ? nextTier.minQty - safeQty : 0;

  return {
    currentTier: tier,
    discountPercent: tier.discountPercent,
    originalUnitPrice: unitPrice,
    discountedUnitPrice,
    originalTotal,
    finalTotal,
    totalSavings,
    nextTier,
    itemsToNextTier
  };
}
