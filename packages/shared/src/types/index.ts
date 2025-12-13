// User types
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Car types
export interface Car {
  id: string;
  brand: string;
  model: string;
  slug: string;
  categoryId: string;
  category?: Category;
  description: string;
  images: string[];
  features?: Record<string, any>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Article types
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  authorId: string;
  author?: User;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// News types
export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  authorId: string;
  author?: User;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Contact types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

