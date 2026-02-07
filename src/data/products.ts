export interface Product {
  id: string;
  name: string;
  tamilName?: string;
  price: number;
  originalPrice?: number;
  category: string;
  collection: string;
  description: string;
  fabric: string;
  borderDescription: string;
  palluDescription: string;
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

export const categories = [
  "Kanchipuram Silk",
  "Banarasi Silk",
  "Mysore Silk",
  "Tussar Silk",
  "Organza Silk",
  "Cotton Silk",
];

export const collections = [
  "Premavathi",
  "Margazhi",
  "Bridal Heritage",
  "Festival Special",
  "Contemporary Elegance",
  "Temple Collection",
];

export const products: Product[] = [
  {
    id: "sg-001",
    name: "Royal Burgundy Bridal Silk",
    tamilName: "அரச மெரூன் திருமண பட்டு",
    price: 45000,
    originalPrice: 52000,
    category: "Kanchipuram Silk",
    collection: "Bridal Heritage",
    description: "An exquisite handwoven Kanchipuram silk saree in royal burgundy, adorned with intricate gold zari work. Perfect for the discerning bride who values tradition and elegance.",
    fabric: "Pure Mulberry Silk with 24K Gold Zari",
    borderDescription: "Wide temple border with peacock motifs in pure gold zari, spanning 4 inches with intricate detailing",
    palluDescription: "Grand pallu featuring traditional kalasam and mango motifs in rich gold zari weaving",
    images: [],
    isNew: true,
    isFeatured: true,
  },
  {
    id: "sg-002",
    name: "Emerald Temple Silk",
    tamilName: "மரகத கோவில் பட்டு",
    price: 38000,
    category: "Kanchipuram Silk",
    collection: "Temple Collection",
    description: "A stunning emerald green Kanchipuram silk with traditional temple border designs. The rich color symbolizes prosperity and new beginnings.",
    fabric: "Pure Kanchipuram Silk with Silver Zari",
    borderDescription: "Classic temple tower border with gopuram motifs in silver zari",
    palluDescription: "Elaborate pallu with deity motifs and floral patterns in contrasting zari",
    images: [],
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: "sg-003",
    name: "Royal Blue Celebration",
    tamilName: "அரச நீல கொண்டாட்ட பட்டு",
    price: 32000,
    originalPrice: 36000,
    category: "Banarasi Silk",
    collection: "Festival Special",
    description: "A magnificent royal blue Banarasi silk saree with silver zari brocade work. Ideal for festivals and special celebrations.",
    fabric: "Pure Banarasi Silk with Silver Zari Brocade",
    borderDescription: "Elegant floral border with lotus motifs in silver zari",
    palluDescription: "Rich pallu with traditional paisley and floral jaal pattern",
    images: [],
    isNew: true,
  },
  {
    id: "sg-004",
    name: "Golden Premavathi Silk",
    tamilName: "தங்க பிரேமாவதி பட்டு",
    price: 55000,
    category: "Kanchipuram Silk",
    collection: "Premavathi",
    description: "From our signature Premavathi collection, this golden masterpiece features the finest handwoven silk with intricate traditional motifs passed down through generations.",
    fabric: "Premium Kanchipuram Silk with Pure Gold Zari",
    borderDescription: "Heritage border with traditional coin and peacock motifs in 24K gold zari",
    palluDescription: "Masterfully woven pallu with mythological scenes and floral scrollwork",
    images: [],
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: "sg-005",
    name: "Margazhi Moonlight",
    tamilName: "மார்கழி நிலவு பட்டு",
    price: 42000,
    category: "Mysore Silk",
    collection: "Margazhi",
    description: "Inspired by the sacred month of Margazhi, this ivory and gold silk saree captures the essence of early morning temple visits and divine serenity.",
    fabric: "Pure Mysore Silk with Gold Thread Work",
    borderDescription: "Delicate jasmine vine border with subtle gold thread accents",
    palluDescription: "Graceful pallu with kolam-inspired geometric patterns",
    images: [],
    isNew: true,
    isFeatured: true,
  },
  {
    id: "sg-006",
    name: "Contemporary Rose Silk",
    tamilName: "நவீன ரோஸ் பட்டு",
    price: 28000,
    category: "Organza Silk",
    collection: "Contemporary Elegance",
    description: "A modern interpretation of traditional silk weaving, this rose pink organza silk blend features contemporary geometric patterns with a subtle shimmer.",
    fabric: "Organza Silk Blend with Copper Zari",
    borderDescription: "Modern geometric border with abstract floral motifs",
    palluDescription: "Minimalist pallu with scattered butis and contemporary patterns",
    images: [],
  },
  {
    id: "sg-007",
    name: "Classic Magenta Bridal",
    tamilName: "பாரம்பரிய மெஜந்தா திருமண பட்டு",
    price: 48000,
    category: "Kanchipuram Silk",
    collection: "Bridal Heritage",
    description: "A timeless magenta bridal silk with elaborate gold zari work. This saree embodies the richness of South Indian bridal traditions.",
    fabric: "Pure Kanchipuram Silk with 22K Gold Zari",
    borderDescription: "Grand bridal border featuring elephants, peacocks, and temple towers",
    palluDescription: "Magnificent pallu with full mythological narrative in gold zari",
    images: [],
    isBestSeller: true,
  },
  {
    id: "sg-008",
    name: "Tussar Honey Gold",
    tamilName: "தஸ்ஸார் தேன் தங்க பட்டு",
    price: 22000,
    category: "Tussar Silk",
    collection: "Contemporary Elegance",
    description: "A sophisticated tussar silk in warm honey gold tones with natural texture. Perfect for elegant daytime occasions.",
    fabric: "Pure Tussar Silk with Natural Dye",
    borderDescription: "Tribal-inspired border with natural motifs in earthy tones",
    palluDescription: "Textured pallu with hand-painted Madhubani-inspired designs",
    images: [],
    isNew: true,
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};
