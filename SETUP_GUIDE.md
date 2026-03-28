# AuxBeam Setup Guide

This guide will help you set up the AuxBeam e-commerce platform following the architecture blueprint.

## What's Already Implemented

### ✅ Core Infrastructure
- Axios configuration with CSRF token handling
- React Query setup for data fetching
- Authentication context (login, register, logout)
- Shopping cart context with localStorage
- Toast notifications
- Route protection with AuthGuard

### ✅ Layouts & Routes
- Root layout with all providers
- Auth layout (login, register pages)
- Public layout with Header and Footer
- Home page with hero section
- Shop page with filters and pagination

### ✅ Hooks
- `useProducts` - Fetch products with filters
- `useCategories` - Fetch categories
- `useAdminProducts` - Admin product CRUD operations
- More hooks ready to be added

### ✅ Utilities
- Image URL helpers
- Pagination helpers
- Class name utility (cn)

## Quick Start

1. **Install dependencies** (already done):
```bash
npm install
```

2. **Configure environment**:
Edit `.env.local` with your Laravel backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Start development server**:
```bash
npm run dev
```

4. **Access the application**:
- Frontend: http://localhost:3000
- Make sure your Laravel backend is running on http://localhost:8000

## Next Steps to Complete the Platform

### 1. Product Detail Page
Create `app/(public)/product/[slug]/page.tsx`:
- Display product details
- Show product images
- Add to cart functionality
- Product reviews
- Related products

### 2. Shopping Cart Page
Create `app/(public)/cart/page.tsx`:
- Display cart items
- Update quantities
- Remove items
- Calculate totals
- Proceed to checkout button

### 3. Checkout Flow
Create `app/(public)/checkout/page.tsx`:
- Shipping address form
- Payment method selection
- Order summary
- Place order

### 4. User Dashboard
Create `app/(public)/dashboard/` directory:
- `page.tsx` - Dashboard overview
- `orders/page.tsx` - Order history
- `profile/page.tsx` - Profile settings
- `addresses/page.tsx` - Manage addresses

### 5. Admin Panel
Create `app/admin/` directory with:
- `layout.tsx` - Admin layout with sidebar
- `page.tsx` - Dashboard with stats
- `products/page.tsx` - Product management
- `orders/page.tsx` - Order management
- `users/page.tsx` - User management
- `categories/page.tsx` - Category management

### 6. Additional Hooks Needed

Create these hooks in `lib/hooks/`:

**Public Hooks** (`lib/hooks/public/`):
- `useBrands.ts` - Brand listing
- `useCart.ts` - Cart operations (add, update, remove)
- `useReviews.ts` - Product reviews
- `useOrders.ts` - User orders

**Admin Hooks** (`lib/hooks/admin/`):
- `useAdminOrders.ts` - Order management
- `useAdminUsers.ts` - User management
- `useAdminCategories.ts` - Category management
- `useAdminBrands.ts` - Brand management
- `useDashboard.ts` - Dashboard stats

**User Hooks** (`lib/hooks/user/`):
- `useProfile.ts` - User profile
- `useAddresses.ts` - Address management
- `useWishlist.ts` - Wishlist operations

### 7. Additional Components

Create these components in `components/ui/`:
- `Button.tsx` - Reusable button component
- `Input.tsx` - Form input component
- `Modal.tsx` - Modal dialog
- `Card.tsx` - Card component
- `Badge.tsx` - Badge/tag component
- `Spinner.tsx` - Loading spinner

### 8. Real-time Features (Optional)

If you want real-time notifications:
1. Install Laravel Echo and Pusher:
```bash
npm install laravel-echo pusher-js
```

2. Create `lib/context/NotificationContext.tsx`
3. Set up Pusher credentials in `.env.local`
4. Implement notification bell in Header

## Architecture Overview

### Route Structure
```
app/
├── (auth)/          # Authentication pages (no header/footer)
├── (public)/        # Public pages (with header/footer)
├── admin/           # Admin panel (separate layout)
└── api/             # API routes (optional)
```

### Data Flow
1. **Component** calls a hook (e.g., `useProducts`)
2. **Hook** uses React Query to fetch data
3. **React Query** calls the API via Axios
4. **Axios** handles CSRF tokens and errors
5. **Data** is cached and returned to component

### State Management
- **Server State**: React Query (products, orders, etc.)
- **Auth State**: AuthContext
- **Cart State**: CartContext
- **UI State**: Component state (useState)

## Backend API Requirements

Your Laravel backend should implement these endpoints:

### Authentication (Sanctum)
```
GET  /sanctum/csrf-cookie
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/user
```

### Public API
```
GET  /api/catalog/products
GET  /api/catalog/products/{slug}
GET  /api/catalog/categories
GET  /api/catalog/brands
POST /api/cart/add
GET  /api/cart
```

### Admin API (Protected)
```
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}
GET    /api/admin/orders
PUT    /api/admin/orders/{id}/status
```

## Testing the Setup

1. **Test Authentication**:
   - Go to http://localhost:3000/login
   - Try logging in (backend must be running)

2. **Test Product Listing**:
   - Go to http://localhost:3000/shop
   - Should show products from your backend

3. **Test Cart**:
   - Add items to cart (stored in localStorage)
   - Cart count should update in header

## Common Issues

### CORS Errors
Make sure your Laravel backend has CORS configured:
```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

### 419 CSRF Token Mismatch
- Ensure `withCredentials: true` in Axios config
- Check `SANCTUM_STATEFUL_DOMAINS` in Laravel `.env`
- Use `localhost` not `127.0.0.1`

### Images Not Loading
- Run `php artisan storage:link` in Laravel
- Check `next.config.ts` has correct image domains
- Verify image paths in database

## Customization

### Changing Colors
Edit `tailwind.config.ts` to customize the color scheme:
```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      // ...
    },
  },
}
```

### Changing Layout
- Edit `app/(public)/_components/Header.tsx` for header
- Edit `app/(public)/_components/Footer.tsx` for footer
- Modify `app/(public)/layout.tsx` for overall structure

## Resources

- **Blueprint**: See `PROJECT_ARCHITECTURE_BLUEPRINT.md` for complete architecture
- **Next.js 16 Docs**: Check `node_modules/next/dist/docs/` for latest conventions
- **React Query**: https://tanstack.com/query/latest
- **Tailwind CSS**: https://tailwindcss.com/docs

## Support

For issues or questions:
1. Check the blueprint document
2. Review Next.js 16 documentation
3. Verify backend API is working
4. Check browser console for errors

---

**Note**: This is a foundation. The blueprint provides detailed examples for implementing all remaining features. Follow the patterns established in the existing code for consistency.
