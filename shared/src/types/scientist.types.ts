export interface Scientist {
  id: string;
  name: string;
  email: string;
  title: string;
  specialization: string[];
  institution: string;
  city: string;
  country: string;
  bio: string;
  profileImage?: string;
  researchInterests: string[];
  experience: number; // years
  publications: number;
  rating: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  scientistCount: number;
}

export interface SearchFilters {
  city?: string;
  specialization?: string[];
  experience?: {
    min: number;
    max: number;
  };
  rating?: number;
  isAvailable?: boolean;
  researchInterests?: string[];
}

export interface ScientistSearchRequest {
  query?: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}
