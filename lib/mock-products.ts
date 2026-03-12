export interface ProductSpec {
  label: string;
  value: string;
}

export interface DummyProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: string;
  priceRaw: number;
  description: string;
  shortDescription: string;
  images: string[];
  tag: string;
  tier: 'Elite' | 'Pro' | 'Team';
  tech: {
    kickPoint: 'low' | 'mid' | 'high';
    flex: number[];
    curves: string[];
    weight: string;
    construction: string;
  };
}

export const dummyProducts: DummyProduct[] = [
  {
    id: '1',
    name: 'SOYUZ CARBON ELITE V1',
    slug: 'soyuz-carbon-elite-v1',
    category: 'Elite Series',
    price: '349.00 $',
    priceRaw: 349,
    tag: 'NEW FLAGSHIP',
    tier: 'Elite',
    shortDescription: 'Maximum energy transfer. Minimal weight.',
    description: 'Developed for elite players seeking the fastest release in the game. The Elite V1 features our proprietary 24K Carbon Weave and an ultra-low kick point for explosive snappers.',
    images: [
      'https://images.unsplash.com/photo-1547053501-bc8497672af6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1580748141549-716500ca23ae?auto=format&fit=crop&q=80&w=800'
    ],
    tech: {
      kickPoint: 'low',
      flex: [70, 77, 87, 95],
      curves: ['P92', 'P28', 'P88'],
      weight: '365g',
      construction: 'Monocomp 24K Carbon'
    }
  },
  {
    id: '2',
    name: 'SOYUZ PHANTOM MID',
    slug: 'soyuz-phantom-mid',
    category: 'Pro Series',
    price: '289.00 $',
    priceRaw: 289,
    tag: 'VERSATILE',
    tier: 'Pro',
    shortDescription: 'Balanced power for every situation.',
    description: 'The Phantom Mid is our most versatile stick yet. Featuring a refined mid-kick point and reinforced shaft walls, it provides exceptional power on slap shots without sacrificing wrist shot feel.',
    images: [
      'https://images.unsplash.com/photo-1512719994953-eabf50895df7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1547053501-bc8497672af6?auto=format&fit=crop&q=80&w=800'
    ],
    tech: {
      kickPoint: 'mid',
      flex: [77, 87, 95, 102],
      curves: ['P92', 'P28', 'P02'],
      weight: '395g',
      construction: 'Unidirectional Carbon Hybrid'
    }
  },
  {
    id: '3',
    name: 'SOYUZ TITAN HIGH',
    slug: 'soyuz-titan-high',
    category: 'Heavy Hitter',
    price: '269.00 $',
    priceRaw: 269,
    tag: 'POWER HOUSE',
    tier: 'Team',
    shortDescription: 'Built for the hardest shots.',
    description: 'Engineered for defensive specialists and power forwards. The Titan High utilizes a traditional high-kick point to maximize loading potential for devastating blue-line bombs.',
    images: [
      'https://images.unsplash.com/photo-1580748141549-716500ca23ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512719994953-eabf50895df7?auto=format&fit=crop&q=80&w=800'
    ],
    tech: {
      kickPoint: 'high',
      flex: [87, 95, 102, 110],
      curves: ['P92', 'P88', 'P02'],
      weight: '430g',
      construction: 'Reinforced 18K Carbon Weave'
    }
  }
];
