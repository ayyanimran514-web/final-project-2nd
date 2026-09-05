export interface StoreFeedbackReview {
  id: string;
  author: string;
  avatarUrl?: string;
  rating: number; // 1 - 5
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  productName?: string;
  productId?: string;
  helpfulCount: number;
  fitFeedback?: 'true_to_size' | 'oversized' | 'runs_small';
  tags?: string[];
}

export const INITIAL_STORE_REVIEWS: StoreFeedbackReview[] = [
  {
    id: 'store-rev-1',
    author: 'Marcus Vance',
    rating: 5,
    title: 'The 460 GSM fleece hoodie is museum grade',
    comment: 'I own luxury streetwear hoodies from designer labels that cost $300+, and this 460 GSM Heavyweight Hoodie surpasses them all. The double-lined hood holds its arch perfectly without collapsing, and the mineral acid wash is sublime.',
    date: '2 days ago',
    verified: true,
    productName: 'Heavyweight Luxury Mineral Hoodie (460 GSM)',
    productId: 'prod-2',
    helpfulCount: 38,
    fitFeedback: 'oversized',
    tags: ['Heavyweight', 'Boxy Fit', 'High GSM']
  },
  {
    id: 'store-rev-2',
    author: 'Aria Takahashi',
    rating: 5,
    title: 'Custom studio printed my clan esports jerseys with zero distortion',
    comment: 'We customized 5 Pro Circuit Esports jerseys for our team finals. Uploaded high-res PNG vector logos in the studio, tested in the 3D visualizer, and when they arrived, the sublimated dyes were razor sharp. Moisture-wicking is elite.',
    date: '3 days ago',
    verified: true,
    productName: 'Pro Circuit Esports Dry-Fit Jersey',
    productId: 'prod-gaming-2',
    helpfulCount: 29,
    fitFeedback: 'true_to_size',
    tags: ['Esports', 'Custom Studio', 'Fast Shipping']
  },
  {
    id: 'store-rev-3',
    author: 'Devon K.',
    rating: 5,
    title: 'Speed-weave deskmat glide is like air hockey',
    comment: 'The 900x400 deskmat completely elevated my battlestation. Clean micro-woven Cordura texture, non-fray edge stitching, and the custom artwork came out ultra crisp with deep contrast.',
    date: '5 days ago',
    verified: true,
    productName: 'Apex-X Speed-Weave Gaming Deskmat (900×400)',
    productId: 'prod-gaming-1',
    helpfulCount: 19,
    fitFeedback: 'true_to_size',
    tags: ['Gaming', 'Deskmat', 'Zero Friction']
  },
  {
    id: 'store-rev-4',
    author: 'Elena Rostova',
    rating: 5,
    title: 'Bulk tier discount saved our boutique over $140',
    comment: 'Ordered 15 Acid Washed Crewnecks for our studio staff. The Squad Pack 15% bulk discount triggered automatically in the cart drawer. Quality is phenomenal — heavy ribbing and thick Portugal combed cotton.',
    date: '1 week ago',
    verified: true,
    productName: 'Acid-Washed 400 GSM Heavy Crewneck',
    productId: 'prod-14',
    helpfulCount: 44,
    fitFeedback: 'oversized',
    tags: ['Bulk Discount', 'Boutique Crew', '400 GSM']
  },
  {
    id: 'store-rev-5',
    author: 'Tyler Henderson',
    rating: 5,
    title: 'Magnetic cargo pants with insane water resistance',
    comment: 'Caught in a massive downpour in Seattle. Water beaded right off the Cordura stretch fabric. The Fidlock magnetic pocket closures make getting your phone and wallet out effortless. Best pants I have bought all year.',
    date: '1 week ago',
    verified: true,
    productName: 'Neo-Cargo Utility Flight Pants',
    productId: 'prod-13',
    helpfulCount: 22,
    fitFeedback: 'true_to_size',
    tags: ['Techwear', 'Cordura', 'Waterproof']
  },
  {
    id: 'store-rev-6',
    author: 'Chloe Dupont',
    rating: 4,
    title: 'Stoneware mug has great heat retention',
    comment: 'Tactile matte glaze feels amazing in your palms during cold mornings. Keeps coffee piping hot for an hour. Only docked 1 star because it sold out so fast when I wanted to buy a second color!',
    date: '2 weeks ago',
    verified: true,
    productName: 'Industrial Matte Ceramic Mug',
    productId: 'prod-4',
    helpfulCount: 15,
    fitFeedback: 'true_to_size',
    tags: ['Ceramic', 'Drinkware']
  }
];
