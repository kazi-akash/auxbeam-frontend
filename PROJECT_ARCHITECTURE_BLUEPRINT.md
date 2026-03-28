# Project Architecture Blueprint

## Overview
This document provides a comprehensive blueprint for building a Next.js 16 e-commerce platform with Laravel backend integration. The architecture follows modern best practices with TypeScript, React Query, and a well-organized file structure.

## Tech Stack

### Frontend
- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4 with PostCSS
- **State Management**: 
  - React Query (@tanstack/react-query) for server state
  - React Context for auth and cart
- **HTTP Client**: Axios with interceptors
- **Animations**: GSAP (@gsap/react)
- **Rich Text Editor**: TipTap (ProseMirror-based)
- **Icons**: Lucide React
- **Notifications**: React Toastify + Sonner
- **Charts**: Recharts
- **Real-time**: Laravel Echo + Pusher.js
- **Date Handling**: date-fns
- **Utilities**: clsx, tailwind-merge

### Backend Integration
- **API**: Laravel 11 REST API
- **Authentication**: Laravel Sanctum (cookie-based)
- **Real-time**: Laravel Broadcasting with Pusher
- **Image Storage**: Laravel Storage (public disk)

## Project Structure


```
project-root/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (login, register, forgot-password)
│   ├── (public)/                 # Public-facing pages
│   │   ├── dashboard/            # User dashboard (protected)
│   │   ├── shop/                 # Shop pages
│   │   ├── product/[slug]/       # Dynamic product pages
│   │   ├── cart/                 # Shopping cart
│   │   ├── checkout/             # Checkout flow
│   │   ├── payment/              # Payment status pages
│   │   ├── track-order/          # Order tracking
│   │   ├── invoice/[orderNumber]/ # Invoice generation
│   │   ├── brands/               # Brand listing
│   │   ├── brand/[slug]/         # Dynamic brand pages
│   │   └── _components/          # Public page components
│   ├── admin/                    # Admin panel
│   │   ├── products/             # Product management
│   │   ├── orders/               # Order management
│   │   ├── users/                # User management
│   │   ├── categories/           # Category management
│   │   ├── brands/               # Brand management
│   │   ├── reviews/              # Review management
│   │   ├── coupons/              # Coupon management
│   │   ├── shipping-classes/     # Shipping management
│   │   ├── shipping-rates/       # Shipping rates
│   │   ├── flash-deals/          # Flash deals
│   │   ├── inventory/            # Inventory management
│   │   ├── reports/              # Analytics & reports
│   │   ├── notifications/        # Notification center
│   │   ├── dynamic-pages/        # Page builder
│   │   ├── visitor-popups/       # Popup management
│   │   └── _components/          # Admin components
│   ├── api/                      # Next.js API routes (optional)
│   ├── _components/              # Global shared components
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── favicon.ico               # Favicon
│
├── components/                   # Reusable UI components
│   └── ui/                       # Base UI components
│       └── Pagination.tsx
│
├── lib/                          # Core library code
│   ├── api/                      # API configuration
│   │   ├── axios.ts              # Axios instance with interceptors
│   │   └── examples.ts           # API usage examples
│   ├── hooks/                    # Custom React hooks
│   │   ├── admin/                # Admin-specific hooks
│   │   │   ├── useAdminProducts.ts
│   │   │   ├── useAdminOrders.ts
│   │   │   ├── useAdminUsers.ts
│   │   │   ├── useAdminCategories.ts
│   │   │   ├── useAdminBrands.ts
│   │   │   ├── useAdminReviews.ts
│   │   │   ├── useCoupons.ts
│   │   │   ├── useShipping.ts
│   │   │   ├── useReports.ts
│   │   │   ├── useDashboard.ts
│   │   │   └── index.ts
│   │   ├── public/               # Public-facing hooks
│   │   │   ├── useProducts.ts
│   │   │   ├── useCart.ts
│   │   │   ├── useCategories.ts
│   │   │   ├── useBrands.ts
│   │   │   ├── useShop.ts
│   │   │   ├── useReviews.ts
│   │   │   └── index.ts
│   │   ├── user/                 # User dashboard hooks
│   │   └── index.ts              # Hook exports
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.tsx       # Authentication state
│   │   ├── CartContext.tsx       # Shopping cart state
│   │   └── NotificationContext.tsx # Notifications
│   ├── providers/                # Provider wrappers
│   │   └── QueryProvider.tsx     # React Query setup
│   ├── services/                 # Business logic services
│   │   ├── authService.ts        # Auth operations
│   │   └── otpAuthService.ts     # OTP operations
│   ├── components/               # Shared functional components
│   │   ├── AuthGuard.tsx         # Route protection
│   │   ├── NotificationBell.tsx  # Notification UI
│   │   ├── OtpInput.tsx          # OTP input component
│   │   └── ToastProvider.tsx     # Toast notifications
│   ├── utils/                    # Utility functions
│   │   ├── image.ts              # Image URL helpers
│   │   ├── pagination.ts         # Pagination helpers
│   │   └── notification-helper.ts # Notification utils
│   ├── utils.ts                  # General utilities (cn, etc.)
│   └── gsap-init.ts              # GSAP initialization
│
├── public/                       # Static assets
│   ├── images/                   # Static images
│   ├── content/                  # Content files
│   └── notification-ringtone/    # Audio files
│
├── .env.local                    # Environment variables
├── .env.local.example            # Environment template
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
├── postcss.config.mjs            # PostCSS configuration
└── package.json                  # Dependencies
```


## Core Architecture Patterns

### 1. Route Organization

#### Route Groups
Next.js route groups organize pages without affecting URLs:

- `(auth)/` - Authentication pages (login, register, forgot-password)
- `(public)/` - Public-facing pages with shared layout
- `admin/` - Admin panel with separate layout

#### Dynamic Routes
- `product/[slug]/` - Product detail pages
- `brand/[slug]/` - Brand pages
- `invoice/[orderNumber]/` - Invoice pages
- `dashboard/orders/[orderNumber]/` - Order details

### 2. API Integration Architecture

#### Axios Configuration (`lib/api/axios.ts`)

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable HTTP-only cookies
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Request interceptor for CSRF token
api.interceptors.request.use((config) => {
  const token = getCookie('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 419 CSRF token mismatch
    if (error.response?.status === 419 && !originalRequest._retry) {
      // Refresh CSRF token and retry
    }
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear auth state
    }
    return Promise.reject(error);
  }
);
```


### 3. React Query Hook Pattern

All API interactions use React Query for caching, loading states, and optimistic updates.

#### Public Hook Example (`lib/hooks/public/useProducts.ts`)

```typescript
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface ProductFilters {
  search?: string;
  category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: 'price' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// List products with filters
export const useProducts = (filters?: ProductFilters, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await api.get('/api/catalog/products', { params: filters });
      return response.data;
    },
    ...options,
  });
};

// Get single product by slug
export const useProduct = (slug: string, options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await api.get(`/api/catalog/products/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    ...options,
  });
};
```

#### Admin Hook Example (`lib/hooks/admin/useAdminProducts.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';

// Fetch products (with pagination)
export const useAdminProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: async () => {
      const response = await api.get('/api/admin/products', { params: filters });
      return response.data;
    },
  });
};

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      // Handle FormData for file uploads
      const hasFiles = data.images?.some((img: any) => img.file instanceof File);
      
      if (hasFiles) {
        const formData = new FormData();
        // Append all fields to FormData
        Object.keys(data).forEach(key => {
          if (key !== 'images') {
            formData.append(key, data[key]);
          }
        });
        // Append images
        data.images.forEach((image: any, index: number) => {
          if (image.file) {
            formData.append(`images[${index}][file]`, image.file);
          }
        });
        
        return await api.post('/api/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      return await api.post('/api/admin/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/api/admin/products/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.id] });
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
};
```


### 4. Context Providers

#### Authentication Context (`lib/context/AuthContext.tsx`)

```typescript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: RegisterData) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await authService.getUser();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

#### Cart Context (`lib/context/CartContext.tsx`)

Similar pattern for managing shopping cart state with local storage persistence.

#### Notification Context (`lib/context/NotificationContext.tsx`)

Real-time notifications using Laravel Echo and Pusher.


### 5. Service Layer Pattern

Services encapsulate business logic and API calls.

#### Auth Service (`lib/services/authService.ts`)

```typescript
import api from '../api/axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

class AuthService {
  async getCsrfToken() {
    await api.get('/sanctum/csrf-cookie');
  }

  async login(email: string, password: string) {
    await this.getCsrfToken();
    return await api.post('/api/auth/login', { email, password });
  }

  async register(data: RegisterData) {
    await this.getCsrfToken();
    return await api.post('/api/auth/register', data);
  }

  async logout() {
    return await api.post('/api/auth/logout');
  }

  async getUser() {
    return await api.get('/api/auth/user');
  }

  async forgotPassword(email: string) {
    await this.getCsrfToken();
    return await api.post('/api/auth/forgot-password', { email });
  }

  async resetPassword(data: any) {
    await this.getCsrfToken();
    return await api.post('/api/auth/reset-password', data);
  }
}

export default new AuthService();
```


## Hook Organization by Feature

### Admin Hooks (`lib/hooks/admin/`)

| Hook File | Purpose | Key Functions |
|-----------|---------|---------------|
| `useAdminProducts.ts` | Product CRUD | useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct |
| `useAdminOrders.ts` | Order management | useAdminOrders, useUpdateOrderStatus, useOrderStats |
| `useAdminUsers.ts` | User management | useAdminUsers, useCreateUser, useUpdateUser, useDeleteUser |
| `useAdminCategories.ts` | Category CRUD | useAdminCategories, useCreateCategory, useUpdateCategory |
| `useAdminBrands.ts` | Brand CRUD | useAdminBrands, useCreateBrand, useUpdateBrand |
| `useAdminReviews.ts` | Review moderation | useAdminReviews, useApproveReview, useRejectReview |
| `useCoupons.ts` | Coupon management | useCoupons, useCreateCoupon, useValidateCoupon |
| `useShipping.ts` | Shipping config | useShippingClasses, useShippingRates |
| `useReports.ts` | Analytics | useSalesReport, useProductReport, useCustomerReport |
| `useDashboard.ts` | Dashboard stats | useDashboardStats, useRecentOrders |
| `useAdminNotifications.ts` | Notifications | useNotifications, useMarkAsRead |
| `useDynamicPages.ts` | Page builder | usePages, useCreatePage, useUpdatePage |
| `useVisitorPopups.ts` | Popup management | usePopups, useCreatePopup, useUpdatePopup |

### Public Hooks (`lib/hooks/public/`)

| Hook File | Purpose | Key Functions |
|-----------|---------|---------------|
| `useProducts.ts` | Product browsing | useProducts, useProduct, useFeaturedProducts, useTrendingProducts |
| `useCart.ts` | Shopping cart | useCart, useAddToCart, useUpdateCart, useRemoveFromCart |
| `useCategories.ts` | Category browsing | useCategories, useCategory |
| `useBrands.ts` | Brand browsing | useBrands, useBrand |
| `useShop.ts` | Shop filters | useShopProducts, useShopFilters |
| `useReviews.ts` | Product reviews | useProductReviews, useSubmitReview |
| `useFlashDeals.ts` | Flash sales | useFlashDeals, useActiveFlashDeals |
| `useOrderTracking.ts` | Order tracking | useTrackOrder |
| `useCMS.ts` | Dynamic content | usePageContent, useBrandPage |

### User Dashboard Hooks (`lib/hooks/user/`)

User-specific functionality for authenticated customers (orders, profile, wishlist, etc.)


## API Endpoint Structure

### Expected Laravel Backend Routes

#### Public API Routes (`/api/`)

```php
// Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/user
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

// Catalog
GET    /api/catalog/products
GET    /api/catalog/products/{slug}
GET    /api/catalog/products/featured
GET    /api/catalog/products/trending
GET    /api/catalog/categories
GET    /api/catalog/categories/{id}
GET    /api/catalog/brands
GET    /api/catalog/brands/{id}

// Cart
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update/{id}
DELETE /api/cart/remove/{id}
DELETE /api/cart/clear

// Checkout
POST   /api/checkout/validate
POST   /api/checkout/process
POST   /api/checkout/apply-coupon
POST   /api/checkout/calculate-shipping

// Orders
GET    /api/orders
GET    /api/orders/{orderNumber}
POST   /api/orders/{id}/cancel
GET    /api/orders/track/{orderNumber}

// Reviews
GET    /api/products/{id}/reviews
POST   /api/products/{id}/reviews

// User Dashboard
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/addresses
POST   /api/user/addresses
PUT    /api/user/addresses/{id}
DELETE /api/user/addresses/{id}
GET    /api/user/wishlist
POST   /api/user/wishlist/add
DELETE /api/user/wishlist/remove/{id}

// CMS
GET    /api/pages/{slug}
GET    /api/brand-pages/{slug}
GET    /api/hero-sections
```

#### Admin API Routes (`/api/admin/`)

```php
// Products
GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/{id}
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}
POST   /api/admin/products/{id}/images
PUT    /api/admin/products/{id}/images/{imageId}
DELETE /api/admin/products/{id}/images/{imageId}

// Orders
GET    /api/admin/orders
GET    /api/admin/orders/{id}
PUT    /api/admin/orders/{id}/status
POST   /api/admin/orders/{id}/refund

// Users
GET    /api/admin/users
POST   /api/admin/users
GET    /api/admin/users/{id}
PUT    /api/admin/users/{id}
DELETE /api/admin/users/{id}

// Categories
GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
DELETE /api/admin/categories/{id}

// Brands
GET    /api/admin/brands
POST   /api/admin/brands
PUT    /api/admin/brands/{id}
DELETE /api/admin/brands/{id}

// Reviews
GET    /api/admin/reviews
PUT    /api/admin/reviews/{id}/approve
PUT    /api/admin/reviews/{id}/reject
DELETE /api/admin/reviews/{id}

// Coupons
GET    /api/admin/coupons
POST   /api/admin/coupons
PUT    /api/admin/coupons/{id}
DELETE /api/admin/coupons/{id}

// Shipping
GET    /api/admin/shipping-classes
POST   /api/admin/shipping-classes
GET    /api/admin/shipping-rates
POST   /api/admin/shipping-rates

// Reports
GET    /api/admin/reports/sales
GET    /api/admin/reports/products
GET    /api/admin/reports/customers
GET    /api/admin/reports/revenue

// Dashboard
GET    /api/admin/dashboard/stats
GET    /api/admin/dashboard/recent-orders
GET    /api/admin/dashboard/low-stock

// Notifications
GET    /api/admin/notifications
POST   /api/admin/notifications/mark-read/{id}
POST   /api/admin/notifications/mark-all-read

// Dynamic Pages
GET    /api/admin/dynamic-pages
POST   /api/admin/dynamic-pages
PUT    /api/admin/dynamic-pages/{id}
DELETE /api/admin/dynamic-pages/{id}

// File Upload
POST   /api/admin/upload/image
POST   /api/admin/upload/file
```


## Configuration Files

### Environment Variables (`.env.local`)

```env
# Laravel API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Next.js Configuration (`next.config.ts`)

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS images
      },
    ],
  },
};

export default nextConfig;
```

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind Configuration (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your custom colors
      },
    },
  },
  plugins: [],
};

export default config;
```


## Root Layout Setup

### Root Layout (`app/layout.tsx`)

```typescript
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";
import { NotificationProvider } from "@/lib/context/NotificationContext";
import QueryProvider from "@/lib/providers/QueryProvider";
import { ToastProvider } from "@/lib/components/ToastProvider";

export const metadata: Metadata = {
  title: "Your E-commerce Store",
  description: "Shop the best products online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <NotificationProvider>
                <ToastProvider />
                {children}
              </NotificationProvider>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

### Query Provider (`lib/providers/QueryProvider.tsx`)

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Auth Layout (`app/(auth)/layout.tsx`)

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
```

### Public Layout (`app/(public)/layout.tsx`)

```typescript
import Header from './_components/Header';
import Footer from './_components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
```

### Admin Layout (`app/admin/layout.tsx`)

```typescript
'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from './_components/admin-sidebar';
import AdminHeader from './_components/admin-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```


## Page Implementation Examples

### Product Listing Page (`app/(public)/shop/page.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { useProducts } from '@/lib/hooks/public/useProducts';
import { useCategories } from '@/lib/hooks/public/useCategories';
import ProductCard from '../_components/ProductCard';
import Pagination from '@/components/ui/Pagination';

export default function ShopPage() {
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 12,
    category_id: undefined,
    min_price: undefined,
    max_price: undefined,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const { data: productsData, isLoading } = useProducts(filters);
  const { data: categories } = useCategories();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="w-64">
          <h3 className="font-bold mb-4">Categories</h3>
          {categories?.data.map((category: any) => (
            <button
              key={category.id}
              onClick={() => setFilters({ ...filters, category_id: category.id })}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {category.name}
            </button>
          ))}
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsData?.data.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={productsData?.current_page}
            totalPages={productsData?.last_page}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </div>
      </div>
    </div>
  );
}
```

### Product Detail Page (`app/(public)/product/[slug]/page.tsx`)

```typescript
'use client';

import { useProduct } from '@/lib/hooks/public/useProducts';
import { useAddToCart } from '@/lib/hooks/public/useCart';
import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils/image';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { data: product, isLoading } = useProduct(params.slug);
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState(null);

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    addToCart.mutate({
      product_id: product.id,
      variation_id: selectedVariation?.id,
      quantity,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <Image
            src={getImageUrl(product.primary_image)}
            alt={product.name}
            width={600}
            height={600}
            className="w-full rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-blue-600 mb-4">
            ${product.price}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Variations */}
          {product.variations?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">Options:</h3>
              <div className="flex gap-2">
                {product.variations.map((variation: any) => (
                  <button
                    key={variation.id}
                    onClick={() => setSelectedVariation(variation)}
                    className={`px-4 py-2 border rounded ${
                      selectedVariation?.id === variation.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {Object.values(variation.attributes).join(' / ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-bold mb-2">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border rounded"
            />
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
```


### Admin Product Management (`app/admin/products/page.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { useAdminProducts, useDeleteProduct } from '@/lib/hooks/admin/useAdminProducts';
import ProductModal from './_components/ProductModal';
import { toast } from 'react-toastify';

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data, isLoading } = useAdminProducts({ page, search, per_page: 20 });
  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">SKU</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((product: any) => (
              <tr key={product.id} className="border-t">
                <td className="px-6 py-4">
                  <img
                    src={getImageUrl(product.primary_image)}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.sku}</td>
                <td className="px-6 py-4">${product.price}</td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
```


## Utility Functions

### Image URL Helper (`lib/utils/image.ts`)

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Convert Laravel storage path to full URL
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) {
    return '/images/placeholder.png'; // Default placeholder
  }

  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Construct full URL
  return `${API_URL}/${cleanPath}`;
}

/**
 * Get optimized image URL with size parameters
 */
export function getOptimizedImageUrl(
  path: string | null | undefined,
  width?: number,
  height?: number
): string {
  const baseUrl = getImageUrl(path);
  
  if (!width && !height) return baseUrl;
  
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  
  return `${baseUrl}?${params.toString()}`;
}
```

### Pagination Helper (`lib/utils/pagination.ts`)

```typescript
export interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] {
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
```

### Class Name Utility (`lib/utils.ts`)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```


## Component Patterns

### Reusable Pagination Component (`components/ui/Pagination.tsx`)

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 border rounded ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
```

### Auth Guard Component (`lib/components/AuthGuard.tsx`)

```typescript
'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: string;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  requireRole,
  redirectTo = '/login',
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    if (requireRole && user?.role !== requireRole) {
      router.push('/');
      return;
    }
  }, [user, loading, requireAuth, requireRole, redirectTo, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requireRole && user?.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
}
```


## Real-time Features

### Notification System

#### Notification Context (`lib/context/NotificationContext.tsx`)

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuth } from './AuthContext';

interface Notification {
  id: string;
  type: string;
  data: any;
  read_at: string | null;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [echo, setEcho] = useState<Echo | null>(null);

  useEffect(() => {
    if (!user) return;

    // Initialize Laravel Echo
    const echoInstance = new Echo({
      broadcaster: 'pusher',
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true,
    });

    // Listen to user's private channel
    echoInstance
      .private(`App.Models.User.${user.id}`)
      .notification((notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        // Play notification sound
        const audio = new Audio('/notification-ringtone/notification.mp3');
        audio.play();
      });

    setEcho(echoInstance);

    return () => {
      echoInstance.disconnect();
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
```


## Best Practices & Patterns

### 1. Error Handling

```typescript
// In hooks
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      try {
        const response = await api.get('/api/catalog/products', { params: filters });
        return response.data;
      } catch (error: any) {
        console.error('Failed to fetch products:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// In components
const { data, isLoading, error } = useProducts(filters);

if (error) {
  return <div>Error loading products: {error.message}</div>;
}
```

### 2. Loading States

```typescript
// Skeleton loading
if (isLoading) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div className="bg-gray-200 h-4 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}
```

### 3. Optimistic Updates

```typescript
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CartItem) => {
      return await api.post('/api/cart/add', data);
    },
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      
      // Snapshot previous value
      const previousCart = queryClient.getQueryData(['cart']);
      
      // Optimistically update
      queryClient.setQueryData(['cart'], (old: any) => ({
        ...old,
        items: [...old.items, newItem],
      }));
      
      return { previousCart };
    },
    onError: (err, newItem, context) => {
      // Rollback on error
      queryClient.setQueryData(['cart'], context?.previousCart);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
```

### 4. Form Handling

```typescript
'use client';

import { useState } from 'react';
import { useCreateProduct } from '@/lib/hooks/admin/useAdminProducts';
import { toast } from 'react-toastify';

export default function ProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    quantity: 0,
    description: '',
    category_id: 0,
    brand_id: 0,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createProduct = useCreateProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await createProduct.mutateAsync(formData);
      toast.success('Product created successfully');
      onSuccess();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error('Failed to create product');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-2">Product Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* More fields... */}

      <button
        type="submit"
        disabled={createProduct.isPending}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {createProduct.isPending ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
```


### 5. Image Upload Handling

```typescript
export default function ImageUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer inline-block px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Choose Image
      </label>
      
      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
        </div>
      )}
    </div>
  );
}
```

### 6. Debounced Search

```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage in component
export default function SearchProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data } = useProducts({ search: debouncedSearch });

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search products..."
    />
  );
}
```


## Package.json Dependencies

```json
{
  "name": "ecommerce-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@gsap/react": "^2.1.2",
    "@tanstack/react-query": "^5.90.21",
    "@tiptap/extension-image": "^3.20.1",
    "@tiptap/extension-link": "^3.20.1",
    "@tiptap/extension-table": "^3.20.1",
    "@tiptap/react": "^3.20.1",
    "@tiptap/starter-kit": "^3.20.1",
    "axios": "^1.13.6",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "gsap": "^3.14.2",
    "laravel-echo": "^2.3.1",
    "lucide-react": "^0.562.0",
    "next": "16.1.4",
    "pusher-js": "^8.4.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-toastify": "^11.0.5",
    "recharts": "^3.7.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

## Installation Steps

### 1. Create Next.js Project

```bash
npx create-next-app@latest my-ecommerce --typescript --tailwind --app --no-src-dir
cd my-ecommerce
```

### 2. Install Dependencies

```bash
npm install @tanstack/react-query axios clsx tailwind-merge
npm install lucide-react react-toastify sonner
npm install date-fns
npm install laravel-echo pusher-js
npm install gsap @gsap/react
npm install recharts
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-table
```

### 3. Setup Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
```

### 4. Create Folder Structure

```bash
mkdir -p lib/{api,hooks/{admin,public,user},context,providers,services,components,utils}
mkdir -p components/ui
mkdir -p app/{admin,\(auth\),\(public\)}
```

### 5. Setup Core Files

- Create `lib/api/axios.ts` with Axios configuration
- Create `lib/providers/QueryProvider.tsx` for React Query
- Create `lib/context/AuthContext.tsx` for authentication
- Create `lib/context/CartContext.tsx` for cart management
- Update `app/layout.tsx` with providers


## Laravel Backend Requirements

### Required Laravel Packages

```bash
composer require laravel/sanctum
composer require intervention/image
composer require pusher/pusher-php-server
```

### Laravel Configuration

#### CORS Configuration (`config/cors.php`)

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

#### Sanctum Configuration (`config/sanctum.php`)

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1'
)),
```

#### Session Configuration (`.env`)

```env
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost
SESSION_SECURE_COOKIE=false
SANCTUM_STATEFUL_DOMAINS=localhost:3000
FRONTEND_URL=http://localhost:3000
```

### Database Schema Examples

#### Products Table Migration

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->foreignId('category_id')->constrained()->onDelete('cascade');
    $table->foreignId('brand_id')->constrained()->onDelete('cascade');
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('sku')->unique();
    $table->text('description')->nullable();
    $table->text('short_description')->nullable();
    $table->decimal('price', 10, 2);
    $table->decimal('compare_price', 10, 2)->nullable();
    $table->decimal('cost_price', 10, 2)->nullable();
    $table->integer('quantity')->default(0);
    $table->integer('low_stock_threshold')->default(10);
    $table->decimal('weight', 8, 2)->nullable();
    $table->string('weight_unit')->default('kg');
    $table->boolean('is_featured')->default(false);
    $table->boolean('is_trending')->default(false);
    $table->enum('status', ['active', 'inactive', 'draft'])->default('active');
    $table->string('meta_title')->nullable();
    $table->text('meta_description')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
```

#### Product Images Table

```php
Schema::create('product_images', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_id')->constrained()->onDelete('cascade');
    $table->string('path');
    $table->string('alt_text')->nullable();
    $table->boolean('is_primary')->default(false);
    $table->integer('sort_order')->default(0);
    $table->timestamps();
});
```

#### Product Variations Table

```php
Schema::create('product_variations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_id')->constrained()->onDelete('cascade');
    $table->string('sku')->unique();
    $table->decimal('price', 10, 2);
    $table->integer('quantity')->default(0);
    $table->json('attributes'); // e.g., {"size": "L", "color": "Red"}
    $table->integer('sort_order')->default(0);
    $table->timestamps();
});
```


## Key Features Implementation Guide

### 1. Authentication Flow

1. User visits login page
2. Frontend calls `/sanctum/csrf-cookie` to get CSRF token
3. Frontend submits login credentials to `/api/auth/login`
4. Backend validates and sets HTTP-only session cookie
5. Frontend stores user data in AuthContext
6. All subsequent requests include session cookie automatically

### 2. Shopping Cart Flow

1. Guest users: Cart stored in localStorage
2. Authenticated users: Cart synced with backend
3. Add to cart → Update context → Sync with API
4. Cart persists across sessions for logged-in users

### 3. Checkout Flow

1. Review cart items
2. Select/add shipping address
3. Choose shipping method
4. Apply coupon code (optional)
5. Review order summary
6. Process payment
7. Create order in backend
8. Redirect to success page
9. Send order confirmation email

### 4. Admin Product Management

1. List products with pagination and search
2. Create product with images and variations
3. Edit product details
4. Manage product images (add, remove, reorder)
5. Manage variations (add, edit, delete)
6. Update stock levels
7. Set featured/trending flags

### 5. Order Management

1. View all orders with filters
2. Update order status
3. Process refunds
4. Generate invoices
5. Send status update notifications
6. Track shipments

### 6. Real-time Notifications

1. Backend broadcasts events via Pusher
2. Frontend listens via Laravel Echo
3. Display toast notifications
4. Update notification bell counter
5. Store notifications in database
6. Mark as read functionality


## Performance Optimization

### 1. React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 3,
    },
  },
});
```

### 2. Image Optimization

- Use Next.js Image component for automatic optimization
- Implement lazy loading for images below the fold
- Use appropriate image formats (WebP with fallbacks)
- Configure remote patterns in next.config.ts

```typescript
<Image
  src={getImageUrl(product.image)}
  alt={product.name}
  width={300}
  height={300}
  loading="lazy"
  placeholder="blur"
  blurDataURL="/placeholder.png"
/>
```

### 3. Code Splitting

- Use dynamic imports for heavy components
- Lazy load admin components
- Split vendor bundles

```typescript
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

### 4. API Response Caching

- Implement Redis caching on backend
- Use ETags for conditional requests
- Cache static content (categories, brands)

### 5. Database Optimization

- Add indexes on frequently queried columns
- Use eager loading to prevent N+1 queries
- Implement pagination for large datasets
- Use database query caching


## Security Best Practices

### 1. Authentication Security

- Use HTTP-only cookies for session management
- Implement CSRF protection via Laravel Sanctum
- Set secure cookie flags in production
- Implement rate limiting on auth endpoints
- Use strong password requirements
- Implement account lockout after failed attempts

### 2. API Security

- Validate all input data
- Sanitize user-generated content
- Use Laravel's built-in validation
- Implement proper authorization checks
- Use middleware for route protection
- Prevent SQL injection with Eloquent ORM

### 3. File Upload Security

- Validate file types and sizes
- Scan uploaded files for malware
- Store files outside public directory
- Use signed URLs for private files
- Implement upload rate limiting

### 4. Frontend Security

- Sanitize HTML content (use DOMPurify)
- Prevent XSS attacks
- Validate user input on client side
- Use Content Security Policy headers
- Implement HTTPS in production

### 5. Environment Variables

- Never commit `.env` files
- Use different credentials for each environment
- Rotate API keys regularly
- Use secrets management in production


## Testing Strategy

### 1. Frontend Testing

```typescript
// Component test example with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const queryClient = new QueryClient();
  
  it('renders product information', () => {
    const product = {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      image: '/test.jpg',
    };

    render(
      <QueryClientProvider client={queryClient}>
        <ProductCard product={product} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });
});
```

### 2. API Integration Testing

```typescript
// Hook test example
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from './useProducts';

describe('useProducts', () => {
  it('fetches products successfully', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

### 3. E2E Testing with Playwright

```typescript
import { test, expect } from '@playwright/test';

test('user can add product to cart', async ({ page }) => {
  await page.goto('http://localhost:3000/shop');
  
  // Click on first product
  await page.click('[data-testid="product-card"]:first-child');
  
  // Add to cart
  await page.click('button:has-text("Add to Cart")');
  
  // Verify cart count updated
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
});
```


## Deployment Guide

### Frontend Deployment (Vercel)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_PUSHER_KEY`
   - `NEXT_PUBLIC_PUSHER_CLUSTER`
4. Deploy automatically on push to main branch

### Backend Deployment (Laravel)

1. Choose hosting provider (AWS, DigitalOcean, etc.)
2. Configure server with PHP 8.2+, MySQL, Redis
3. Set up SSL certificate
4. Configure environment variables
5. Run migrations: `php artisan migrate --force`
6. Optimize for production:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan optimize
   ```
7. Set up queue workers for background jobs
8. Configure Laravel Scheduler for cron jobs

### Production Checklist

- [ ] Enable HTTPS on both frontend and backend
- [ ] Update CORS configuration for production domain
- [ ] Set `SESSION_SECURE_COOKIE=true`
- [ ] Configure proper session domain
- [ ] Enable Redis caching
- [ ] Set up CDN for static assets
- [ ] Configure backup strategy
- [ ] Set up monitoring and logging
- [ ] Enable error tracking (Sentry, Bugsnag)
- [ ] Configure rate limiting
- [ ] Set up CI/CD pipeline
- [ ] Enable database query logging
- [ ] Configure email service (SendGrid, Mailgun)
- [ ] Set up payment gateway (Stripe, PayPal)


## Common Patterns & Solutions

### 1. Handling File Uploads with FormData

```typescript
const handleSubmit = async (data: any) => {
  const formData = new FormData();
  
  // Add regular fields
  Object.keys(data).forEach(key => {
    if (key !== 'images' && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  
  // Add files
  data.images.forEach((image: File, index: number) => {
    formData.append(`images[${index}]`, image);
  });
  
  await api.post('/api/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
```

### 2. Infinite Scroll Implementation

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteProducts = (filters?: ProductFilters) => {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/api/catalog/products', {
        params: { ...filters, page: pageParam }
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined;
    },
  });
};

// Usage in component
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts();

useEffect(() => {
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [fetchNextPage, hasNextPage, isFetchingNextPage]);
```

### 3. Modal Management

```typescript
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isOpen: boolean;
  content: ReactNode | null;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);

  const openModal = (content: ReactNode) => {
    setContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 300);
  };

  return (
    <ModalContext.Provider value={{ isOpen, content, openModal, closeModal }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            {content}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};
```

### 4. Toast Notifications Setup

```typescript
// lib/components/ToastProvider.tsx
'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}

// Usage in components
import { toast } from 'react-toastify';

toast.success('Product added to cart!');
toast.error('Failed to add product');
toast.info('Please login to continue');
toast.warning('Low stock available');
```


## Troubleshooting Common Issues

### 1. CSRF Token Mismatch (419 Error)

**Problem**: Getting 419 errors on POST requests

**Solution**:
- Ensure `withCredentials: true` in Axios config
- Call `/sanctum/csrf-cookie` before authenticated requests
- Check CORS configuration allows credentials
- Verify `SANCTUM_STATEFUL_DOMAINS` includes frontend domain
- Use `localhost` not `127.0.0.1` for local development

### 2. Session Not Persisting

**Problem**: User gets logged out on page refresh

**Solution**:
- Check session cookie is being set (inspect browser cookies)
- Verify `SESSION_DOMAIN` matches your domain
- Ensure `SESSION_SECURE_COOKIE=false` for local development
- Check `withCredentials: true` in all API requests
- Verify CORS allows credentials

### 3. Images Not Loading

**Problem**: Product images return 404

**Solution**:
- Run `php artisan storage:link` on backend
- Check image paths in database
- Verify `NEXT_PUBLIC_API_URL` is correct
- Add remote patterns to `next.config.ts`
- Check file permissions on storage directory

### 4. Real-time Notifications Not Working

**Problem**: Notifications not appearing in real-time

**Solution**:
- Verify Pusher credentials are correct
- Check Laravel broadcasting configuration
- Ensure queue worker is running
- Verify user is authenticated
- Check browser console for WebSocket errors

### 5. Hydration Errors

**Problem**: React hydration mismatch errors

**Solution**:
- Don't use `localStorage` during SSR
- Use `useEffect` for client-only code
- Ensure server and client render same HTML
- Use `'use client'` directive when needed
- Check for date/time formatting differences

### 6. Slow API Responses

**Problem**: API requests taking too long

**Solution**:
- Implement database query optimization
- Add indexes to frequently queried columns
- Use eager loading to prevent N+1 queries
- Enable Redis caching
- Implement API response caching
- Use pagination for large datasets


## Advanced Features

### 1. Multi-language Support (i18n)

```typescript
// lib/i18n/config.ts
export const locales = ['en', 'es', 'fr'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

// app/[lang]/layout.tsx
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
```

### 2. SEO Optimization

```typescript
// app/(public)/product/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await fetchProduct(params.slug);
  
  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [product.primary_image],
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.short_description,
      images: [product.primary_image],
    },
  };
}
```

### 3. Analytics Integration

```typescript
// lib/analytics/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: any) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track add to cart
event({
  action: 'add_to_cart',
  category: 'ecommerce',
  label: product.name,
  value: product.price,
});
```

### 4. Progressive Web App (PWA)

```typescript
// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // your next config
});

// public/manifest.json
{
  "name": "Your E-commerce Store",
  "short_name": "Store",
  "description": "Shop the best products online",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 5. Wishlist Feature

```typescript
// lib/hooks/user/useWishlist.ts
export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const response = await api.get('/api/user/wishlist');
      return response.data;
    },
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: number) => {
      return await api.post('/api/user/wishlist/add', { product_id: productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/api/user/wishlist/remove/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
  });
};
```


## Conclusion

This blueprint provides a complete architecture for building a modern, scalable e-commerce platform using Next.js 16 and Laravel. The structure emphasizes:

- **Separation of Concerns**: Clear separation between public, admin, and auth sections
- **Type Safety**: Full TypeScript implementation
- **Performance**: React Query for efficient data fetching and caching
- **Scalability**: Modular hook-based architecture
- **Security**: Laravel Sanctum with HTTP-only cookies
- **Real-time**: Laravel Echo and Pusher integration
- **Developer Experience**: Well-organized file structure and reusable patterns

### Key Takeaways

1. **Hook-based Architecture**: All API interactions are encapsulated in custom hooks using React Query
2. **Context for Global State**: Auth, Cart, and Notifications use React Context
3. **Route Groups**: Organize pages without affecting URLs
4. **Axios Interceptors**: Handle CSRF tokens and authentication automatically
5. **Image Optimization**: Use Next.js Image component with proper configuration
6. **Error Handling**: Consistent error handling across all API calls
7. **Loading States**: Proper loading and error states for better UX

### Next Steps

1. Set up the basic project structure
2. Implement authentication flow
3. Create product catalog pages
4. Build shopping cart functionality
5. Implement checkout process
6. Create admin panel
7. Add real-time notifications
8. Optimize for production
9. Deploy to production servers

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Version**: 1.0  
**Last Updated**: 2024  
**Author**: Generated from project analysis

