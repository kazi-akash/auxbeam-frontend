# AuxBeam E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js 16 and designed to integrate with a Laravel backend.

## Tech Stack

### Frontend
- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **State Management**: 
  - React Query (@tanstack/react-query) for server state
  - React Context for auth and cart
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Utilities**: clsx, tailwind-merge, date-fns

### Backend Integration
- **API**: Laravel 11 REST API
- **Authentication**: Laravel Sanctum (cookie-based)
- **Image Storage**: Laravel Storage

## Project Structure

```
auxbeam/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (login, register)
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (public)/                 # Public-facing pages
│   │   ├── shop/                 # Shop page
│   │   ├── _components/          # Public layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── layout.tsx
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/                   # Reusable UI components
│   └── ui/
│       └── Pagination.tsx
│
├── lib/                          # Core library code
│   ├── api/
│   │   └── axios.ts              # Axios instance with interceptors
│   ├── hooks/                    # Custom React hooks
│   │   ├── admin/                # Admin-specific hooks
│   │   │   ├── useAdminProducts.ts
│   │   │   └── index.ts
│   │   └── public/               # Public-facing hooks
│   │       ├── useProducts.ts
│   │       ├── useCategories.ts
│   │       └── index.ts
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.tsx       # Authentication state
│   │   └── CartContext.tsx       # Shopping cart state
│   ├── providers/
│   │   └── QueryProvider.tsx     # React Query setup
│   ├── services/
│   │   └── authService.ts        # Auth operations
│   ├── components/               # Shared functional components
│   │   ├── AuthGuard.tsx         # Route protection
│   │   └── ToastProvider.tsx     # Toast notifications
│   ├── utils/                    # Utility functions
│   │   ├── image.ts              # Image URL helpers
│   │   └── pagination.ts         # Pagination helpers
│   └── utils.ts                  # General utilities (cn, etc.)
│
├── public/                       # Static assets
├── .env.local                    # Environment variables (not in git)
├── .env.local.example            # Environment template
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
└── package.json                  # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Laravel backend running (see backend setup)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd auxbeam
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Core Features

### Authentication
- Cookie-based authentication with Laravel Sanctum
- Login/Register pages
- Protected routes with AuthGuard
- Automatic CSRF token handling

### Shopping Cart
- Client-side cart management
- LocalStorage persistence
- Cart context for global state

### Product Catalog
- Product listing with filters
- Category filtering
- Search functionality
- Sorting options
- Pagination

### API Integration
- Axios instance with interceptors
- Automatic CSRF token refresh
- Error handling
- React Query for data fetching and caching

## Architecture Patterns

### Route Organization
- `(auth)/` - Authentication pages (login, register)
- `(public)/` - Public-facing pages with shared layout
- Route groups organize pages without affecting URLs

### React Query Hook Pattern
All API interactions use React Query for:
- Automatic caching
- Loading states
- Error handling
- Optimistic updates

Example:
```typescript
const { data, isLoading, error } = useProducts(filters);
```

### Context Providers
- **AuthContext**: User authentication state
- **CartContext**: Shopping cart state
- **QueryProvider**: React Query configuration

### Service Layer
Services encapsulate business logic:
- `authService.ts` - Authentication operations
- Handles CSRF tokens
- API communication

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Required environment variables:

```env
# Laravel API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Pusher for real-time features
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
```

## Backend Requirements

This frontend expects a Laravel backend with the following endpoints:

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/user`

### Products
- `GET /api/catalog/products` - List products with filters
- `GET /api/catalog/products/{slug}` - Get single product
- `GET /api/catalog/categories` - List categories

### Admin (Protected)
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product

## Next Steps

To complete the e-commerce platform, you can add:

1. **Product Detail Page** - `/product/[slug]`
2. **Shopping Cart Page** - `/cart`
3. **Checkout Flow** - `/checkout`
4. **User Dashboard** - `/dashboard`
5. **Admin Panel** - `/admin`
6. **Order Management**
7. **Payment Integration**
8. **Real-time Notifications**

See `PROJECT_ARCHITECTURE_BLUEPRINT.md` for the complete architecture guide.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

[Your License Here]

