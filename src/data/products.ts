import { Product, Order, User } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Cyber Heavyweight Boxy Tee',
    tagline: '280 GSM ultra-combed cotton with dropped shoulders and reinforced ribbed collar.',
    price: 44,
    originalPrice: 55,
    category: 'apparel',
    rating: 4.9,
    reviewsCount: 128,
    isCustomizable: true,
    inStock: true,
    stockCount: 45,
    isBestseller: true,
    isNew: true,
    baseType: 'tshirt',
    description: 'Constructed from heavy-duty 280 GSM ring-spun cotton. Cut with an oversized streetwear silhouette, pre-shrunk fabric, and double-stitched hems designed to hold custom graphics or sleek minimal blanks.',
    features: [
      '100% 280 GSM Combed Cotton',
      'Oversized boxy drop-shoulder cut',
      'Twin-needle sleeve and bottom hem',
      'Enzyme-washed for ultra-soft handfeel',
      'Optimized for DTG & Screen Print Customization'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Onyx Black', hex: '#121214' },
      { name: 'Optic White', hex: '#F8FAFC' },
      { name: 'Acid Washed Grey', hex: '#475569' },
      { name: 'Electric Cobalt', hex: '#2563EB' },
      { name: 'Crimson Scarlet', hex: '#DC2626' },
      { name: 'Forest Moss', hex: '#15803D' }
    ],
    tags: ['Streetwear', 'Customizable', 'Heavyweight', 'Bestseller'],
    fabricGsm: 280,
    materialOrigin: 'Los Angeles, USA',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Marcus K.',
        rating: 5,
        date: '2 days ago',
        comment: 'The collar does not bacon at all. Heavy, boxy fit looks insane with baggy cargo pants. 10/10.',
        verified: true,
        title: 'Heaviest and cleanest boxy tee'
      },
      {
        id: 'rev-2',
        author: 'Elena R.',
        rating: 5,
        date: '1 week ago',
        comment: 'Used the custom studio to print my band logo on the back. The live preview was 100% accurate to the real product!',
        verified: true,
        title: 'Custom print came out crisp'
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Sub-Zero Thermal Zip Hoodie',
    tagline: '460 GSM brushed french terry with structured double-lined hood and matte gunmetal zipper.',
    price: 88,
    originalPrice: 110,
    category: 'apparel',
    rating: 4.95,
    reviewsCount: 214,
    isCustomizable: true,
    inStock: true,
    stockCount: 28,
    isBestseller: true,
    baseType: 'hoodie',
    fabricGsm: 460,
    materialOrigin: 'Porto, Portugal',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Our flagship cold-weather piece. Weighing in at a substantial 460 GSM, this heavyweight fleece hoodie provides architectural drape, wind resistance, and extreme comfort.',
    features: [
      '460 GSM Heavy French Terry Cotton',
      'Dual-direction custom gunmetal zipper',
      'Seamless kangaroo pouch with hidden tech pocket',
      'Preshrunk with reactive dye bath',
      'Ribbed cuffs and structured hem'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Pitch Black', hex: '#0A0A0A' },
      { name: 'Bone Cream', hex: '#E2DCD5' },
      { name: 'Charcoal Slag', hex: '#2D3748' },
      { name: 'Deep Sage Green', hex: '#2E4C38' },
      { name: 'Sunset Terracotta', hex: '#B84A39' }
    ],
    tags: ['Heavyweight', 'Streetwear', 'Zip-Up', 'Customizable'],
    reviews: [
      {
        id: 'rev-3',
        author: 'Jordan T.',
        rating: 5,
        date: '3 days ago',
        comment: 'Literally the heaviest hoodie I own. Incredible quality and warm as a sleeping bag.',
        verified: true,
        title: 'Architectural weight and drape'
      },
      {
        id: 'rev-3b',
        author: 'Kai W.',
        rating: 5,
        date: '10 days ago',
        comment: 'The double-lined hood actually stands up without collapsing. Gunmetal dual zipper is buttery smooth.',
        verified: true,
        title: 'Quality unmatched by $200 designer hoodies'
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Tactical Matte Snapback Cap',
    tagline: 'Structured 6-panel crown with moisture-wicking sweatband and custom matte buckle.',
    price: 34,
    originalPrice: 42,
    category: 'headwear',
    rating: 4.8,
    reviewsCount: 89,
    isCustomizable: true,
    inStock: true,
    stockCount: 62,
    baseType: 'cap',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Engineered for everyday wear. Featuring a reinforced buckram front structure that never caves, breathable eyelets, and an interior moisture-wicking headband.',
    features: [
      'Structured 6-panel A-frame profile',
      'Flat visor with 8 rows of stitch detailing',
      'Laser-cut breathable air vents',
      'Adjustable snapback closure (fits 54-62cm)',
      'Front embroidery area ready for custom studio logos'
    ],
    sizes: ['One Size Fits All'],
    colors: [
      { name: 'Midnight Black', hex: '#111827' },
      { name: 'Stone Grey', hex: '#64748B' },
      { name: 'Dark Navy', hex: '#1E3A8A' },
      { name: 'Olive Drab', hex: '#3F4E34' },
      { name: 'Solar Orange', hex: '#EA580C' }
    ],
    tags: ['Headwear', 'Accessories', 'Cap', 'Snapback'],
    reviews: [
      {
        id: 'rev-cap-1',
        author: 'Tariq A.',
        rating: 5,
        date: '5 days ago',
        comment: 'The crown maintains its shape permanently. Sweatband keeps head cool in the summer heat.',
        verified: true,
        title: 'Perfect A-frame structure'
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Industrial Matte Ceramic Mug',
    tagline: '14oz double-fired matte ceramic mug with ergonomic geometric handle and heat retention.',
    price: 22,
    category: 'accessories',
    rating: 4.75,
    reviewsCount: 64,
    isCustomizable: true,
    inStock: true,
    stockCount: 120,
    baseType: 'mug',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Sip your brew in style. Double-fired stoneware ceramic with a tactile matte exterior and a glossy easy-clean interior. Perfect for custom typography or artwork.',
    features: [
      '14 oz (415ml) capacity',
      'Dishwasher and microwave safe',
      'Lead-free, food-grade double-fired ceramic',
      'Full 360 wrap custom print capable',
      'Thick walls maintain beverage temperature longer'
    ],
    sizes: ['14 oz Standard'],
    colors: [
      { name: 'Matte Charcoal', hex: '#1E293B' },
      { name: 'Alabaster Chalk', hex: '#F1F5F9' },
      { name: 'Desert Ochre', hex: '#D97706' },
      { name: 'Nordic Teal', hex: '#0D9488' },
      { name: 'Burgundy Plum', hex: '#831843' }
    ],
    tags: ['Home', 'Merch', 'Drinkware', 'Customizable'],
    reviews: [
      {
        id: 'rev-mug-1',
        author: 'Chloe G.',
        rating: 5,
        date: '1 week ago',
        comment: 'The tactile matte finish feels amazing in your hand, and coffee stays warm for almost an hour.',
        verified: true,
        title: 'Gorgeous ceramic glaze'
      }
    ]
  },
  {
    id: 'prod-5',
    name: 'Impact Armor MagSafe Phone Case',
    tagline: 'Military-grade 10ft drop protection with tactile aluminum buttons and MagSafe array.',
    price: 36,
    originalPrice: 45,
    category: 'tech',
    rating: 4.88,
    reviewsCount: 142,
    isCustomizable: true,
    inStock: true,
    stockCount: 84,
    isBestseller: true,
    baseType: 'phonecase',
    description: 'Constructed with shock-absorbing TPU perimeter bumpers and an anti-scratch polycarbonate backplate. Embedded with powerful N52 neodymium magnets for flawless MagSafe accessories.',
    features: [
      'Built-in N52 MagSafe magnet array',
      '10ft drop tested military grade standard',
      'Raised 1.5mm camera ring & screen bezel protection',
      'Scratch-resistant matte coating',
      'Compatible with iPhone 16 / 15 / 14 & Samsung Galaxy'
    ],
    sizes: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 15 Pro Max', 'Samsung S24 Ultra'],
    colors: [
      { name: 'Stealth Black', hex: '#0F172A' },
      { name: 'Titanium Grey', hex: '#4B5563' },
      { name: 'Ultramarine Blue', hex: '#1D4ED8' },
      { name: 'Neon Acid Lime', hex: '#84CC16' },
      { name: 'Blush Rose', hex: '#F43F5E' },
      { name: 'Frosted Crystal', hex: '#CBD5E1' }
    ],
    tags: ['Tech', 'MagSafe', 'Phone Case', 'Accessories'],
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'rev-case-1',
        author: 'Tyler H.',
        rating: 5,
        date: '3 days ago',
        comment: 'Magnets are crazy strong. Sticks rock-solid to my car mount even over speed bumps.',
        verified: true,
        title: 'Super strong MagSafe magnets'
      }
    ]
  },
  {
    id: 'prod-6',
    name: 'Heavy Duty 16oz Canvas Tote Bag',
    tagline: 'Reinforced 16oz organic cotton canvas with inner zipper pocket and key ring loop.',
    price: 28,
    category: 'accessories',
    rating: 4.85,
    reviewsCount: 97,
    isCustomizable: true,
    inStock: true,
    stockCount: 75,
    isNew: true,
    baseType: 'totebag',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Ditch flimsy bags. Made of rigid 16oz organic canvas that stands upright on its own. Reinforced cross-stitched handles support up to 35 lbs of cargo effortlessly.',
    features: [
      '16oz heavy organic duck canvas',
      'Interior zippered pocket for keys & wallet',
      'Heavy-duty bartack cross-stitching on shoulder straps',
      'Flat boxed bottom for maximum capacity',
      'Double-sided printing canvas'
    ],
    sizes: ['Standard 40x38x12cm'],
    colors: [
      { name: 'Raw Natural Canvas', hex: '#EBE5D8' },
      { name: 'Obsidian Black', hex: '#18181B' },
      { name: 'Military Army Green', hex: '#374151' },
      { name: 'Indigo Washed Denim', hex: '#1E40AF' },
      { name: 'Burnt Ochre', hex: '#C2410C' }
    ],
    tags: ['Eco', 'Tote', 'Bag', 'Customizable'],
    reviews: [
      {
        id: 'rev-tote-1',
        author: 'Maya S.',
        rating: 5,
        date: '5 days ago',
        comment: 'Canvas is thick enough that it actually stands up on its own. The inside zip pocket is a lifesaver for keys.',
        verified: true,
        title: 'Durable heavyweight canvas'
      }
    ]
  },
  {
    id: 'prod-7',
    name: 'Vacuum Insulated Steel Thermo Flask',
    tagline: '32oz double-wall 18/8 stainless steel bottle keeping drinks icy for 24h or hot for 12h.',
    price: 32,
    originalPrice: 40,
    category: 'accessories',
    rating: 4.92,
    reviewsCount: 110,
    isCustomizable: true,
    inStock: true,
    stockCount: 50,
    baseType: 'bottle',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Constructed from food-grade 18/8 pro-grade stainless steel with a powder-coated sweat-free exterior. Includes a leakproof straw lid and wide-mouth ice opening.',
    features: [
      '32 oz (950ml) high-capacity design',
      'Double-wall TempShield vacuum insulation',
      'Sweat-free textured powder coat finish',
      '100% BPA-Free & Phthalate-Free',
      'Laser engraved or UV printed custom designs'
    ],
    sizes: ['32 oz (950ml)', '24 oz (710ml)'],
    colors: [
      { name: 'Matte Jet Black', hex: '#171717' },
      { name: 'Polar Glacier White', hex: '#F3F4F6' },
      { name: 'Cyberpunk Cyan', hex: '#06B6D4' },
      { name: 'Electric Violet', hex: '#7C3AED' }
    ],
    tags: ['Drinkware', 'Water Bottle', 'Gym', 'Streetwear']
  },
  {
    id: 'prod-8',
    name: 'Acrobat Technical Flight Bomber Jacket',
    tagline: 'Water-repellent ripstop shell with orange quilted emergency lining and utility arm pocket.',
    price: 129,
    originalPrice: 165,
    category: 'apparel',
    rating: 4.97,
    reviewsCount: 78,
    isCustomizable: true,
    inStock: true,
    stockCount: 19,
    isNew: true,
    baseType: 'jacket',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Reimagining the iconic MA-1 silhouette for modern city streets. Weather-proof nylon exterior with bonded insulation, storm flap front closure, and detachable streetwear patch.',
    features: [
      'Water-repellent high-density nylon shell',
      'Signature emergency signal orange quilted lining',
      'Utility flight tag zip pocket on left sleeve',
      'Heavy ribbed knit collar, cuffs, and waistband',
      'Custom back print & embroidery zone'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Tactical Black', hex: '#0F172A' },
      { name: 'Flight Sage Green', hex: '#334135' },
      { name: 'Urban Gunmetal', hex: '#475569' },
      { name: 'Deep Crimson', hex: '#991B1B' }
    ],
    tags: ['Bomber', 'Jacket', 'Outerwear', 'Streetwear']
  },
  {
    id: 'prod-9',
    name: 'Acid Washed French Terry Shorts',
    tagline: 'Relaxed above-the-knee raw hem shorts with thick braided drawstrings and deep pockets.',
    price: 45,
    category: 'apparel',
    rating: 4.7,
    reviewsCount: 43,
    isCustomizable: false,
    inStock: true,
    stockCount: 38,
    baseType: 'shorts',
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Designed for summer chill or gym sessions. Made of breathable loopback terry cotton with an elastic waistband, metal-tipped drawcords, and deep zip coin pockets.',
    features: [
      '360 GSM loopback french terry',
      'Relaxed above-the-knee drop',
      'Custom dyed acid wash aesthetic',
      'Hidden right zippered security pocket'
    ],
    sizes: ['S (30)', 'M (32)', 'L (34)', 'XL (36)'],
    colors: [
      { name: 'Washed Charcoal', hex: '#334155' },
      { name: 'Vintage Stone', hex: '#94A3B8' },
      { name: 'Moss Green', hex: '#166534' },
      { name: 'Midnight Navy', hex: '#1E3A8A' }
    ],
    tags: ['Shorts', 'Summer', 'Apparel']
  },
  {
    id: 'prod-10',
    name: 'Washed Corduroy Bucket Hat',
    tagline: 'Vintage 8-wale textured corduroy with relaxed brim and embroidered BUYLY insignia.',
    price: 38,
    category: 'headwear',
    rating: 4.82,
    reviewsCount: 52,
    isCustomizable: false,
    inStock: true,
    stockCount: 44,
    baseType: 'bucket_hat',
    imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Classic 90s aesthetic revisited. Made with plush 8-wale pure cotton corduroy, soft unstructured crown, and custom interior sweat tape.',
    features: [
      '100% Cotton 8-wale wide corduroy',
      'Unstructured relaxed floppy crown',
      'Soft interior moisture-absorbing sweatband'
    ],
    sizes: ['S/M (56cm)', 'L/XL (59cm)'],
    colors: [
      { name: 'Vintage Sand', hex: '#D6C7A1' },
      { name: 'Pitch Black', hex: '#18181B' },
      { name: 'Rust Brick', hex: '#9A3412' },
      { name: 'Forest Spruce', hex: '#14532D' }
    ],
    tags: ['Bucket Hat', 'Headwear', 'Vintage']
  },
  {
    id: 'prod-11',
    name: 'Nomad Tech Waterproof Laptop Sleeve',
    tagline: 'Shock-resistant memory foam interior with magnetic flap and weather-sealed ballistic nylon.',
    price: 39,
    category: 'tech',
    rating: 4.86,
    reviewsCount: 67,
    isCustomizable: true,
    inStock: true,
    stockCount: 30,
    baseType: 'sleeve',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Keep your workstation protected everywhere. Engineered with high-density EVA shock bumpers, plush microfiber lining, and a seamless magnetic fold closure.',
    features: [
      'Fits up to 16-inch MacBook Pro & ultrabooks',
      'Ballistic weatherproof 900D exterior',
      'Plush faux-fur scratch guard lining',
      'Exterior pocket for charger and cables'
    ],
    sizes: ['14-inch Laptop', '16-inch Laptop'],
    colors: [
      { name: 'Stealth Grey', hex: '#374151' },
      { name: 'Deep Obsidian', hex: '#111827' },
      { name: 'Alpine Moss', hex: '#1F3A2E' },
      { name: 'Electric Royal', hex: '#1D4ED8' }
    ],
    tags: ['Tech', 'Laptop', 'Sleeve', 'Travel']
  },
  {
    id: 'prod-12',
    name: 'Vessel Modular Weekend Duffle',
    tagline: '42L weather-resistant travel bag with ventilated sneaker compartment and tech sleeve.',
    price: 98,
    originalPrice: 125,
    category: 'accessories',
    rating: 4.94,
    reviewsCount: 88,
    isCustomizable: false,
    inStock: true,
    stockCount: 16,
    isBestseller: true,
    baseType: 'duffle',
    description: 'Engineered for gym-to-flight transitions. Features a dedicated moisture-resistant shoe compartment, luggage trolley sleeve, and padded magnetic handles.',
    features: [
      '42 Liter carry-on compliant capacity',
      'Dedicated ventilated sneaker compartment',
      'Waterproof coated zippers throughout',
      'Detachable ergonomic air-cushioned shoulder strap'
    ],
    sizes: ['42L Weekend Carry-On'],
    colors: [
      { name: 'Midnight Onyx', hex: '#18181B' },
      { name: 'Battleship Grey', hex: '#4B5563' },
      { name: 'Desert Sand Tan', hex: '#A89F91' }
    ],
    tags: ['Travel', 'Duffle', 'Bags', 'Luggage'],
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'rev-duffle-1',
        author: 'Julian M.',
        rating: 5,
        date: '4 days ago',
        comment: 'The shoe compartment actually fits high-top size 13 sneakers without squeezing the main clothes section. Build quality is aerospace grade.',
        verified: true,
        title: 'Perfect weekender bag'
      }
    ]
  },
  {
    id: 'prod-13',
    name: 'Neo-Cargo Utility Flight Pants',
    tagline: 'Waterproof stretch-ripstop cargo pants with articulated knee darts and Fidlock magnetic flaps.',
    price: 78,
    originalPrice: 95,
    category: 'apparel',
    rating: 4.91,
    reviewsCount: 116,
    isCustomizable: false,
    inStock: true,
    stockCount: 34,
    isNew: true,
    isBestseller: true,
    baseType: 'pants',
    fabricGsm: 320,
    materialOrigin: 'Osaka, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Constructed from Japanese Cordura stretch ripstop. Engineered with ergonomic articulated knee articulation, 6 multi-access cargo utility pockets with magnetic quick-release fasteners, and an adjustable cinch hem.',
    features: [
      'High-tenacity stretch Cordura ripstop weave (DWR water-repellent coating)',
      '6 engineered cargo compartments with magnetic quick-snap closures',
      'Articulated 3D knee pattern for unrestricted mobility',
      'Ankle toggle cinch cords for converting from straight to tapered streetwear fit',
      'Reinforced gusseted crotch and heavy-duty YKK zippers'
    ],
    sizes: ['S (28-30)', 'M (31-33)', 'L (34-36)', 'XL (37-39)'],
    colors: [
      { name: 'Tactical Matte Black', hex: '#0F172A' },
      { name: 'Charcoal Slag', hex: '#334155' },
      { name: 'Military Olive Camo', hex: '#2E4C38' },
      { name: 'Cyber Khaki Sand', hex: '#C2B69D' }
    ],
    tags: ['Cargo', 'Pants', 'Techwear', 'Streetwear', 'Bestseller'],
    reviews: [
      {
        id: 'rev-pants-1',
        author: 'Kenji S.',
        rating: 5,
        date: 'Yesterday',
        comment: 'The magnetic cargo closures are so satisfying. Pants drape perfectly over chunky sneakers. The fabric repelled pouring rain during my commute.',
        verified: true,
        title: 'Best techwear cargo pants on the market'
      },
      {
        id: 'rev-pants-2',
        author: 'Dmitri V.',
        rating: 5,
        date: '5 days ago',
        comment: 'Material has just the right amount of stretch. 3D knee cuts prevent any pulling when sitting or skating.',
        verified: true,
        title: 'Insane mobility and cut'
      }
    ]
  },
  {
    id: 'prod-14',
    name: 'Acid-Washed 400 GSM Heavy Crewneck',
    tagline: 'Heavyweight vintage loopback fleece with ribbed V-neck insert and dropped drop-stitch shoulders.',
    price: 64,
    originalPrice: 80,
    category: 'apparel',
    rating: 4.88,
    reviewsCount: 94,
    isCustomizable: true,
    inStock: true,
    stockCount: 42,
    isNew: true,
    baseType: 'crewneck',
    fabricGsm: 400,
    materialOrigin: 'Porto, Portugal',
    imageUrl: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A heavyweight luxury essential. Milled from 400 GSM French Terry and washed with mineral acid stones for an authentic sun-faded patina that looks better with every wash.',
    features: [
      '400 GSM 100% Ring-Spun Combed Cotton French Terry',
      'Vintage mineral acid stone wash for subtle weathered fade',
      'Classic heritage triangle V-insert ribbing on neckline',
      '2x1 rib knit collar, cuffs, and hem with Lycra memory recovery',
      'Ideal canvas for studio typography or bold center chest graphic prints'
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Acid Washed Black', hex: '#1E1E24' },
      { name: 'Vintage Mineral Sage', hex: '#3B5249' },
      { name: 'Sun-Bleached Sand', hex: '#D5C7B3' },
      { name: 'Faded Indigo Blue', hex: '#2A4365' },
      { name: 'Charcoal Wash', hex: '#4A5568' }
    ],
    tags: ['Crewneck', 'Acid Wash', 'Heavyweight', 'Customizable'],
    reviews: [
      {
        id: 'rev-crew-1',
        author: 'Samantha W.',
        rating: 5,
        date: '3 days ago',
        comment: 'The weight of this crewneck is substantial. No flimsy fleece here. The acid wash gives it such a high-end streetwear look.',
        verified: true,
        title: 'Luxury heavy feel'
      }
    ]
  },
  {
    id: 'prod-15',
    name: 'Modular Cyber Sling Crossbody Bag',
    tagline: 'Waterproof Cordura ballistic crossbody with quick-release Cobra magnetic buckle and stealth organization.',
    price: 48,
    category: 'accessories',
    rating: 4.87,
    reviewsCount: 72,
    isCustomizable: true,
    inStock: true,
    stockCount: 55,
    isBestseller: true,
    baseType: 'slingbag',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'The definitive hands-free daily carry. Sized precisely for your phone, keys, passport, sunglasses, power bank, and airpods, with AquaGuard weather-sealed zippers throughout.',
    features: [
      'Cordura 1000D ballistic nylon exterior (abrasion & waterproof proof)',
      'German Fidlock magnetic quick-release shoulder strap buckle',
      'Hidden RFID-shielded passport security pocket against your body',
      'Internal elastic organizing loops and key leash clip',
      'Ergonomic padded breathable 3D air-mesh back panel'
    ],
    sizes: ['4.5L Daily Compact'],
    colors: [
      { name: 'Stealth Matte Black', hex: '#0B0F19' },
      { name: 'Urban Battleship Grey', hex: '#475569' },
      { name: 'Desert Coyote Tan', hex: '#A2967F' },
      { name: 'Cyber Neon Accent', hex: '#0D9488' }
    ],
    tags: ['Sling', 'Bag', 'Accessories', 'Techwear', 'Travel'],
    reviews: [
      {
        id: 'rev-sling-1',
        author: 'Leo C.',
        rating: 5,
        date: '1 week ago',
        comment: 'Fidlock buckle is crazy fast to take on and off. Fits my kindle, powerbank, and keys with room to spare. Clean aesthetics.',
        verified: true,
        title: 'My everyday bag now'
      }
    ]
  },
  {
    id: 'prod-16',
    name: 'Japanese Raw Selvedge Denim Overshirt',
    tagline: '13.5oz Kurashiki raw selvedge denim with custom oxidized copper buttons and selvedge ID placket.',
    price: 118,
    originalPrice: 145,
    category: 'apparel',
    rating: 4.95,
    reviewsCount: 63,
    isCustomizable: false,
    inStock: true,
    stockCount: 22,
    isNew: true,
    baseType: 'jacket',
    fabricGsm: 450,
    materialOrigin: 'Kurashiki, Okayama, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Woven on vintage shuttle looms in Okayama, Japan. 13.5oz unwashed raw denim that molds uniquely to your body over time, developing one-of-a-kind fades, honeycombs, and whiskers.',
    features: [
      '13.5oz Authentic Okayama Red-Line Selvedge Denim',
      'Custom embossed copper shank buttons with BUYLY seal',
      'Twin chest utility flap pockets with reinforced rivets',
      'Internal red selvedge ticker tape visible on front button placket',
      'Designed to fade and patina uniquely with your lifestyle'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Deep Indigo Selvedge', hex: '#1B2A4A' },
      { name: 'Overdyed Kuro Black', hex: '#111318' }
    ],
    tags: ['Denim', 'Selvedge', 'Japan', 'Heritage', 'Apparel'],
    reviews: [
      {
        id: 'rev-denim-1',
        author: 'Arthur B.',
        rating: 5,
        date: '2 weeks ago',
        comment: 'As a denim nerd, this shuttle-loomed fabric is legitimate Okayama perfection. The red selvedge line inside the placket is pure craftsmanship.',
        verified: true,
        title: 'Authentic Okayama selvedge denim'
      }
    ]
  },
  {
    id: 'prod-17',
    name: 'Solaris Cyber Reflective Windbreaker',
    tagline: 'Hyper-reflective 3M micro-prism technical shell with taped seams and oversized stowable storm hood.',
    price: 94,
    originalPrice: 120,
    category: 'apparel',
    rating: 4.89,
    reviewsCount: 58,
    isCustomizable: true,
    inStock: true,
    stockCount: 26,
    baseType: 'windbreaker',
    fabricGsm: 180,
    materialOrigin: 'Seoul, South Korea',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Engineered for night runners, cyclists, and streetwear enthusiasts. Looks sleek charcoal grey in daylight, but illuminates like a neon supernova when hit by flash or headlights.',
    features: [
      'Full 3M Scotchlite micro-prismatic reflective shell fabric',
      'Windproof, water-resistant taped seam construction',
      'Packable into its own rear zippered pocket for travel',
      'Dual underarm zip vents for thermal breathability',
      'Adjustable bungee cords at hem and hood'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Reflective Flash Silver', hex: '#94A3B8' },
      { name: 'Stealth Carbon Matrix', hex: '#1E293B' },
      { name: 'Electric Acid Neon', hex: '#84CC16' }
    ],
    tags: ['Reflective', 'Windbreaker', 'Outerwear', 'Techwear'],
    reviews: [
      {
        id: 'rev-wind-1',
        author: 'Nadia P.',
        rating: 5,
        date: '6 days ago',
        comment: 'Photos do not do this justice. When a car light or camera flash hits it, it glows bright white neon. Fits loose and comfortable.',
        verified: true,
        title: 'Crazy visual effect in photos'
      }
    ]
  },
  {
    id: 'prod-18',
    name: 'Tactical Magnetic Carabiner Keyclip',
    tagline: 'CNC-machined matte PVD titanium alloy clip with heavy woven seatbelt webbing and quick-release latch.',
    price: 24,
    category: 'accessories',
    rating: 4.93,
    reviewsCount: 145,
    isCustomizable: false,
    inStock: true,
    stockCount: 88,
    isBestseller: true,
    baseType: 'mug',
    imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80',
    description: 'Precision milled from aircraft-grade Grade 5 titanium. Snaps securely onto belt loops or bags, featuring a bottle opener cutout and heavy-gauge split O-rings.',
    features: [
      'Grade 5 CNC-machined titanium alloy with matte PVD scratch-resistant finish',
      'Integrated pry tool and bottle opener notch',
      'Includes 3 heavy-duty titanium keyrings',
      'Tested to hold up to 100 lbs tensile load'
    ],
    sizes: ['Standard EDC 8.5cm'],
    colors: [
      { name: 'Matte Gunmetal Titanium', hex: '#4B5563' },
      { name: 'Anodized Cyber Blue', hex: '#1D4ED8' },
      { name: 'Stealth Matte Black', hex: '#111827' }
    ],
    tags: ['EDC', 'Titanium', 'Accessories', 'Keyclip'],
    reviews: [
      {
        id: 'rev-key-1',
        author: 'Chris L.',
        rating: 5,
        date: '3 days ago',
        comment: 'Indestructible feel. Lightweight titanium and clips smoothly onto my belt loop. Solid EDC accessory.',
        verified: true,
        title: 'Top notch titanium craftsmanship'
      }
    ]
  },
  {
    id: 'prod-gaming-1',
    name: 'Apex-X Speed-Weave Gaming Deskmat (900×400)',
    tagline: 'Micro-woven Cordura surface with customizable RGB halo edge stitching and non-slip rubber base.',
    price: 39,
    originalPrice: 49,
    category: 'gaming',
    rating: 4.95,
    reviewsCount: 84,
    isCustomizable: true,
    inStock: true,
    stockCount: 65,
    isBestseller: true,
    isNew: true,
    baseType: 'deskmat',
    description: 'Engineered for tournament esports precision. 4mm high-density natural foam rubber base with waterproof micro-texture cloth weave. Fully customizable with full-bleed prints, team logos, and gamer tags.',
    features: [
      'Extended 900mm × 400mm × 4mm Pro Dimensions',
      'Ultra-low dynamic & static glide resistance',
      'Spill-resistant nano hydrophobic coating',
      '360° Anti-fray reinforced edge stitching',
      'Optimized for high-DPI optical laser sensors'
    ],
    sizes: ['Extended 900×400mm', 'XL 1200×600mm'],
    colors: [
      { name: 'Pitch Black Speed', hex: '#0B0F19' },
      { name: 'Neon Cyber Blue', hex: '#0284C7' },
      { name: 'Acid Green Rush', hex: '#16A34A' },
      { name: 'Hyper Magenta', hex: '#BE185D' },
      { name: 'Glacier Pure White', hex: '#F1F5F9' }
    ],
    tags: ['Gaming', 'Deskmat', 'Customizable', 'Esports', 'RGB'],
    imageUrl: 'https://images.unsplash.com/photo-1616588589596-39a7a9226cb0?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1616588589596-39a7a9226cb0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'rev-gm-1',
        author: 'Valkyrie_FPS',
        rating: 5,
        date: 'Yesterday',
        comment: 'Printed my Twitch stream mascot in the studio and it turned out insanely crisp. The mouse glides like ice.',
        verified: true,
        title: 'Best gaming surface I have tested'
      }
    ]
  },
  {
    id: 'prod-gaming-2',
    name: 'Pro Circuit Esports Dry-Fit Jersey',
    tagline: 'Aero-mesh athletic dry-fit jersey with customizable gamer tag, sponsor slots, and team colors.',
    price: 59,
    originalPrice: 75,
    category: 'gaming',
    rating: 4.88,
    reviewsCount: 52,
    isCustomizable: true,
    inStock: true,
    stockCount: 40,
    isBestseller: true,
    isNew: true,
    baseType: 'jersey',
    description: 'The official competitive esports tournament jersey. Engineered with CoolMax moisture-wicking synthetic fiber and breathable honeycomb lateral side panels. Add your gamertag on back, clan logo on chest, and sponsor crests.',
    features: [
      '100% CoolMax Breathable Polyester Interlock',
      'Honeycomb lateral side ventilation panels',
      'Anti-odor antimicrobial silver-ion weave',
      'Sublimated zero-fade high-saturation dyes',
      'Athletic ergonomic raglan cut'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    colors: [
      { name: 'Cyber Stealth', hex: '#18181B' },
      { name: 'Titan Electric Cyan', hex: '#0891B2' },
      { name: 'Inferno Crimson', hex: '#B91C1C' },
      { name: 'Apex Gold Yellow', hex: '#D97706' },
      { name: 'Optic Clean White', hex: '#F8FAFC' }
    ],
    tags: ['Gaming', 'Jersey', 'Customizable', 'Esports', 'Tournament'],
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'rev-gm-2',
        author: 'AceCommander',
        rating: 5,
        date: '4 days ago',
        comment: 'Ordered 5 custom jerseys for our collegiate Valorant roster with individual gamertags. Delivery was fast and quality is pro-tier.',
        verified: true,
        title: 'Perfect team jerseys'
      }
    ]
  },
  {
    id: 'prod-gaming-3',
    name: 'Titan Pro Gaming Controller Mod Shell',
    tagline: 'Custom tactile ergonomic faceplate shell with diamond-texture rubberized palm grips.',
    price: 45,
    originalPrice: 58,
    category: 'gaming',
    rating: 4.92,
    reviewsCount: 39,
    isCustomizable: true,
    inStock: true,
    stockCount: 30,
    isBestseller: false,
    isNew: true,
    baseType: 'controller',
    description: 'Precision molded replacement faceplate and grip armor compatible with standard pro controllers. Includes anti-sweat textured grip inlays and customizable front shell plate with UV gloss or matte finish.',
    features: [
      'Direct snap-on precision tooling — zero play or creaks',
      'Anti-sweat textured micro-diamond palm grip',
      'UV-cured scratch resistant coating',
      'Tool-free magnetic interchangeable faceplates',
      'Ultra-lightweight ABS polymer construction'
    ],
    sizes: ['Standard Pro Wireless'],
    colors: [
      { name: 'Midnight Onyx', hex: '#18181B' },
      { name: 'Arctic Frost', hex: '#E2E8F0' },
      { name: 'Atomic Purple Translucent', hex: '#7C3AED' },
      { name: 'Signal Orange', hex: '#EA580C' },
      { name: 'Military Olive Camo', hex: '#3F6212' }
    ],
    tags: ['Gaming', 'Controller', 'Customizable', 'Mods', 'Hardware'],
    imageUrl: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'rev-gm-3',
        author: 'KronoX',
        rating: 5,
        date: '1 week ago',
        comment: 'Fit is 100% factory spec. The custom lettering and matte texture feel way better than the stock plastic.',
        verified: true,
        title: 'Looks factory OEM but custom'
      }
    ]
  },
  {
    id: 'prod-gaming-4',
    name: 'CyberPulse Wireless Gaming Headset',
    tagline: 'Spatial audio headset with magnetic customizable ear-cup tags, 2.4GHz low-latency & boom mic.',
    price: 119,
    originalPrice: 149,
    category: 'gaming',
    rating: 4.85,
    reviewsCount: 67,
    isCustomizable: true,
    inStock: true,
    stockCount: 22,
    isBestseller: true,
    isNew: true,
    baseType: 'headset',
    description: '50mm neodymium acoustic drivers tuned for hyper-precise directional footstep imaging. Features swappable magnetic outer ear-cup plates that you can customize with clan tags, graphics, or custom solid finishes.',
    features: [
      '50mm Custom-Tuned Neodymium Drivers',
      'Magnetic interchangeable custom ear-cup shields',
      'Detachable broadcast-grade noise-cancelling boom mic',
      'Ultra-low latency 2.4GHz wireless + Bluetooth 5.3',
      'Up to 45 hours battery life with fast USB-C charge'
    ],
    sizes: ['One Size (Adjustable Steel Headband)'],
    colors: [
      { name: 'Carbon Black', hex: '#18181B' },
      { name: 'Glacier White', hex: '#F1F5F9' },
      { name: 'Cyberpunk Neon Pink', hex: '#DB2777' },
      { name: 'Deep Space Navy', hex: '#1E3A8A' }
    ],
    tags: ['Gaming', 'Headset', 'Wireless', 'Customizable', 'Audio'],
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    reviews: [
      {
        id: 'rev-gm-4',
        author: 'EchoStrike',
        rating: 5,
        date: '5 days ago',
        comment: 'The swappable ear plates are a game changer. Soundstage is wide and footsteps in CS2 are pinpoint accurate.',
        verified: true,
        title: 'Insane audio clarity & style'
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'BUYLY-8921',
    customerName: 'Kavita Sharma',
    customerEmail: 'kavita.sharma@example.com',
    date: 'Today at 10:45 AM',
    total: 132,
    status: 'Processing',
    items: [
      {
        cartItemId: 'c-1',
        productId: 'prod-1',
        product: INITIAL_PRODUCTS[0],
        selectedColor: INITIAL_PRODUCTS[0].colors[0],
        selectedSize: 'L',
        quantity: 2
      },
      {
        cartItemId: 'c-2',
        productId: 'prod-4',
        product: INITIAL_PRODUCTS[3],
        selectedColor: INITIAL_PRODUCTS[3].colors[1],
        selectedSize: '14 oz Standard',
        quantity: 2
      }
    ],
    shippingAddress: {
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
      country: 'United States'
    }
  },
  {
    id: 'ord-1002',
    orderNumber: 'BUYLY-8920',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.v@creativestudio.io',
    date: 'Yesterday at 3:12 PM',
    total: 176,
    status: 'Shipped',
    items: [
      {
        cartItemId: 'c-3',
        productId: 'prod-2',
        product: INITIAL_PRODUCTS[1],
        selectedColor: INITIAL_PRODUCTS[1].colors[1],
        selectedSize: 'XL',
        quantity: 1,
        customDesign: {
          baseProduct: 'hoodie',
          productName: 'Sub-Zero Thermal Zip Hoodie',
          baseColor: INITIAL_PRODUCTS[1].colors[1],
          view: 'back',
          textElements: [
            {
              id: 't-1',
              text: 'TOKYO OVERDRIVE',
              font: 'Syne',
              color: '#000000',
              size: 26,
              x: 50,
              y: 40,
              rotation: 0
            }
          ],
          graphicElements: [],
          totalCustomPrice: 98
        }
      },
      {
        cartItemId: 'c-4',
        productId: 'prod-3',
        product: INITIAL_PRODUCTS[2],
        selectedColor: INITIAL_PRODUCTS[2].colors[0],
        selectedSize: 'One Size Fits All',
        quantity: 2
      }
    ],
    shippingAddress: {
      street: '1204 Shibuya Crossing Ave',
      city: 'Tokyo',
      postalCode: '150-0002',
      country: 'Japan'
    }
  },
  {
    id: 'ord-1003',
    orderNumber: 'BUYLY-8919',
    customerName: 'Sophie Dubois',
    customerEmail: 'sophie.d@designlabs.fr',
    date: '2 days ago',
    total: 129,
    status: 'Delivered',
    items: [
      {
        cartItemId: 'c-5',
        productId: 'prod-8',
        product: INITIAL_PRODUCTS[7],
        selectedColor: INITIAL_PRODUCTS[7].colors[0],
        selectedSize: 'M',
        quantity: 1
      }
    ],
    shippingAddress: {
      street: '18 Rue de la Paix',
      city: 'Paris',
      postalCode: '75002',
      country: 'France'
    }
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Alex Rivera (Admin)',
    email: 'admin@buyly.store',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    memberSince: 'Jan 2024',
    ordersCount: 14
  },
  {
    id: 'usr-customer',
    name: 'Elena Rostova',
    email: 'elena@streetwear.io',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    memberSince: 'Mar 2024',
    ordersCount: 4
  }
];

export const STICKER_LIBRARY = [
  { id: 'stk-1', name: 'Cyber Skull', icon: '💀', category: 'Cyber' },
  { id: 'stk-2', name: 'Inferno Flame', icon: '🔥', category: 'Energy' },
  { id: 'stk-3', name: 'Tokyo Kanji 夢', icon: '夢', category: 'Street' },
  { id: 'stk-4', name: 'Lightning Strike', icon: '⚡', category: 'Energy' },
  { id: 'stk-5', name: 'Acid Smiley', icon: '👾', category: 'Cyber' },
  { id: 'stk-6', name: 'Solar Star', icon: '⭐', category: 'Retro' },
  { id: 'stk-7', name: 'Biohazard Eye', icon: '👁️', category: 'Cyber' },
  { id: 'stk-8', name: 'Barcode 88', icon: '║▌║█', category: 'Tech' },
  { id: 'stk-9', name: 'Alien Head', icon: '👽', category: 'Cyber' },
  { id: 'stk-10', name: 'Crown King', icon: '👑', category: 'Royal' },
  { id: 'stk-11', name: 'Black Heart', icon: '🖤', category: 'Minimal' },
  { id: 'stk-12', name: 'Atomic Ring', icon: '⚛️', category: 'Tech' }
];

export const SLOGAN_SUGGESTIONS = [
  'OFF-GRID VELOCITY',
  'TOKYO OVERDRIVE 2099',
  'ZERO LATENCY DREAMS',
  'HUMAN BY DESIGN',
  'NEO-SHIBUYA DISTRICT',
  'CHAOS & CRAFTSMANSHIP',
  'ACID MEMORIES // 004',
  'SYSTEM OVERLOAD',
  'PARALLEL DIMENSIONS',
  'HEAVY FABRIC CLUB',
  'LIMITED RUN OF ONE',
  'DIGITAL GHOSTS ONLY'
];
