export type CategoryType = 'all' | 'apparel' | 'headwear' | 'accessories' | 'gaming' | 'tech' | 'customizable';

export interface ProductColor {
  name: string;
  hex: string;
  twClass?: string;
}

export type ProductBaseType = 
  | 'tshirt' 
  | 'hoodie' 
  | 'mug' 
  | 'cap' 
  | 'phonecase' 
  | 'totebag' 
  | 'bottle' 
  | 'jacket' 
  | 'shorts' 
  | 'bucket_hat' 
  | 'duffle' 
  | 'sleeve'
  | 'pants'
  | 'crewneck'
  | 'slingbag'
  | 'windbreaker'
  | 'deskmat'
  | 'jersey'
  | 'controller'
  | 'headset';

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  title?: string;
  helpfulCount?: number;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  category: 'apparel' | 'headwear' | 'accessories' | 'gaming' | 'tech';
  rating: number;
  reviewsCount: number;
  isCustomizable: boolean;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  description: string;
  features: string[];
  sizes: string[];
  colors: ProductColor[];
  baseType: ProductBaseType;
  tags: string[];
  reviews?: ProductReview[];
  imageUrl?: string;
  galleryUrls?: string[];
  fabricGsm?: number;
  materialOrigin?: string;
}

export interface CustomTextElement {
  id: string;
  text: string;
  font: string;
  color: string;
  size: number;
  x: number;
  y: number;
  rotation: number;
  hasOutline?: boolean;
  isCurved?: boolean;
}

export interface CustomGraphicElement {
  id: string;
  url: string;
  name: string;
  size: number;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  texture?: 'matte' | 'embroidery' | 'neon' | 'vintage' | 'puff';
  inverted?: boolean;
  filterTint?: 'none' | 'cyan' | 'magenta' | 'gold' | 'toxic' | 'monochrome';
}

export interface CustomDesignDetails {
  baseProduct: ProductBaseType;
  productName: string;
  baseColor: ProductColor;
  view: 'front' | 'back';
  textElements: CustomTextElement[];
  graphicElements: CustomGraphicElement[];
  totalCustomPrice: number;
  previewThumbnail?: string;
  createdAt?: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
  customDesign?: CustomDesignDetails;
}

export type ThemeId = 'dark' | 'light';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  iconName: string;
  bgClass: string;
  cardBgClass: string;
  accentClass: string;
  accentHex: string;
  textClass: string;
  borderClass: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  avatar: string;
  memberSince: string;
  ordersCount: number;
  savedDesigns?: CustomDesignDetails[];
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}
