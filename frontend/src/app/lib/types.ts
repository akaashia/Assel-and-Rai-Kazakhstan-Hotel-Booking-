export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'client' | 'admin';
  createdAt: Date;
}

export interface Room {
  id: string;
  name: string;
  nameKz: string;
  category: string;
  categoryKz: string;
  description: string;
  descriptionKz: string;
  price: number;
  images: string[];
  floor: number;
  maxGuests: number;
  size: number;
  amenities: string[];
  amenitiesKz: string[];
  features: string[];
  featuresKz: string[];
  available: boolean;
  bookedDates: Date[];
  rating: number;
  reviews: number;
}

export interface Service {
  id: string;
  name: string;
  nameKz: string;
  description: string;
  descriptionKz: string;
  price: number;
  icon: string;
  image?: string;
  available: boolean;
}

export interface PaidExtra {
  id: string;
  name: string;
  nameKz: string;
  price: number;
  image?: string;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  services: string[];
  extras: string[];
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
}

export interface News {
  id: string;
  title: string;
  titleKz: string;
  content: string;
  contentKz: string;
  image: string;
  date: Date;
  category: string;
}

export interface HotelInfo {
  name: string;
  nameKz: string;
  description: string;
  descriptionKz: string;
  yearsInOperation: number;
  achievements: string[];
  achievementsKz: string[];
  rating: number;
  totalReviews: number;
  videoUrl?: string;
  address: string;
  addressKz: string;
  phone: string;
  email: string;
}
