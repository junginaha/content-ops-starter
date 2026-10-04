export interface Bookclub {
  id: string;
  title: string;
  bookTitle: string;
  subtitle: string;
  description: string;
  recommendedFor: string[];
  leaderName: string;
  locationName: string;
  address: string;
  lat: number;
  lng: number;
  distanceLabel: string;
  date: string;
  time: string;
  capacity: number;
  currentMembers: number;
  price: string;
  tags: string[];
  category: string;
  imageUrl?: string;
  status: 'open' | 'almostFull' | 'closed' | 'ended';
  applyUrl: string;
  detailUrl: string;
  isFeatured: boolean;
  isBeginnerFriendly: boolean;
  canJoinWithoutReading: boolean;
}

export interface ArchiveItem {
  id: string;
  name: string;
  profile: string;
  season: string;
  quote: string;
  tags: string[];
  visibility: 'public' | 'anonymous' | 'private';
}

export interface KnowledgeAssetProduct {
  id: string;
  title: string;
  description: string;
  type: 'report' | 'ebook' | 'groupArchive';
  priceLabel: string;
  ctaLabel: string;
}
