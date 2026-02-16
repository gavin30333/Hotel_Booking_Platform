export interface Facility {
  id: number;
  icon: string;
  name: string;
}

export interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  content: string;
  images?: string[];
}

export interface RoomType {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  area: string;
  bedType: string;
  facilities: string[];
  breakfast: string;
  cancellationPolicy: string;
  stock: number;
}

export interface HotelDetail {
  id: number;
  name: string;
  englishName?: string;
  rating: number;
  reviewCount: number;
  address: string;
  description: string;
  images: string[];
  facilities: Facility[];
  reviews: Review[];
  roomTypes: RoomType[];
  tags: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}
