# API Documentation — Auxbeam E-Commerce

## Base URL

```
http://localhost:8000/api
```

All API routes are prefixed with `/api`.

---

## Authentication

The backend uses **Laravel Sanctum** with **cookie-based session authentication** (SPA mode). This means:

- No Bearer tokens are used for the frontend SPA
- Authentication is maintained via HTTP-only session cookies
- CSRF protection is required for all mutating requests (POST, PUT, DELETE)

### Authentication Flow

1. **Initialize CSRF**: `GET /sanctum/csrf-cookie` — sets the `XSRF-TOKEN` cookie
2. **Login**: `POST /api/auth/login` — creates a session, sets `laravel_session` cookie
3. **Subsequent requests**: Include `X-XSRF-TOKEN` header (decoded from `XSRF-TOKEN` cookie) and `withCredentials: true`
4. **Logout**: `POST /api/auth/logout` — destroys the session

---

## Required Headers

```http
Accept: application/json
Content-Type: application/json
X-Requested-With: XMLHttpRequest
X-XSRF-TOKEN: {decoded_xsrf_token_from_cookie}
```

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error Response (422)
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

---

## Pagination Format

Paginated responses follow Laravel's standard pagination:

```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [ ... ],
    "first_page_url": "http://localhost:8000/api/...",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://localhost:8000/api/...",
    "next_page_url": "http://localhost:8000/api/...",
    "path": "http://localhost:8000/api/...",
    "per_page": 15,
    "prev_page_url": null,
    "to": 15,
    "total": 75
  }
}
```

Some endpoints return a custom pagination wrapper:
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 75,
    "per_page": 15,
    "current_page": 1,
    "last_page": 5,
    "from": 1,
    "to": 15
  }
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 419 | CSRF Token Mismatch (retry after refreshing CSRF) |
| 422 | Validation Error |
| 500 | Server Error |

---

## User Roles

| Role | Description |
|------|-------------|
| `customer` | Regular registered user |
| `admin` | Full admin access |
| `guest` | Unauthenticated user (limited access) |

Admin routes require `auth:sanctum` + `admin` middleware.

---

# Endpoint Categories

---

## 1. Authentication

### 1.1 Get CSRF Token
- **Method**: `GET`
- **URL**: `/api/auth/csrf-token`
- **Auth Required**: No
- **Description**: Returns CSRF token for SPA. Also call `GET /sanctum/csrf-cookie` to initialize the cookie.

**Success Response:**
```json
{
  "success": true,
  "csrf_token": "abc123..."
}
```

---

### 1.2 Register
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Auth Required**: No
- **Related Pages**: `/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+8801700000000",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Validation Rules:**
- `name`: required, string, max:255
- `email`: required, email, unique in users table
- `phone`: nullable, string, max:20
- `password`: required, confirmed, min:8

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+8801700000000",
      "user_type": "customer",
      "status": true,
      "name": "John Doe",
      "full_name": "John Doe",
      "created_at": "2026-05-15T10:00:00.000000Z"
    }
  }
}
```

---

### 1.3 Login
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Auth Required**: No
- **Related Pages**: `/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: required, email
- `password`: required, string

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "user_type": "customer",
      "status": true,
      "name": "John Doe",
      "full_name": "John Doe"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials."
}
```

---

### 1.4 Logout
- **Method**: `POST`
- **URL**: `/api/auth/logout`
- **Auth Required**: Yes (any authenticated user)

**Success Response:**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

### 1.5 Get Authenticated User
- **Method**: `GET`
- **URL**: `/api/auth/user`
- **Auth Required**: Yes

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+8801700000000",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "user_type": "customer",
    "status": true,
    "avatar": null,
    "name": "John Doe",
    "full_name": "John Doe"
  }
}
```

---

### 1.6 Update Profile
- **Method**: `PUT`
- **URL**: `/api/auth/profile`
- **Auth Required**: Yes
- **Related Pages**: `/account/profile`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john.smith@example.com",
  "phone": "+8801700000001",
  "date_of_birth": "1990-01-15",
  "gender": "male"
}
```

**Validation Rules:**
- `first_name`: sometimes, string, max:255
- `last_name`: sometimes, string, max:255
- `email`: sometimes, email, unique (excluding current user)
- `phone`: nullable, string, max:20
- `date_of_birth`: nullable, date, before:today
- `gender`: nullable, in:male,female,other

**Success Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "data": { ... user object ... }
}
```

---

### 1.7 Change Password
- **Method**: `PUT`
- **URL**: `/api/auth/password`
- **Auth Required**: Yes

**Request Body:**
```json
{
  "current_password": "oldpassword123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Validation Rules:**
- `current_password`: required, string
- `password`: required, confirmed, min:8

**Success Response:**
```json
{
  "success": true,
  "message": "Password changed successfully."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Current password is incorrect."
}
```

---

### 1.8 Forgot Password
- **Method**: `POST`
- **URL**: `/api/auth/forgot-password`
- **Auth Required**: No

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Validation Rules:**
- `email`: required, email, exists in users table

**Success Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email."
}
```

---

### 1.9 Reset Password (Token-based)
- **Method**: `POST`
- **URL**: `/api/auth/reset-password`
- **Auth Required**: No

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "email": "john@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

---

### 1.10 Send OTP (Password Reset)
- **Method**: `POST`
- **URL**: `/api/auth/send-otp`
- **Auth Required**: No

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Validation Rules:**
- `email`: required, email, exists in users table

---

### 1.11 Send Registration OTP
- **Method**: `POST`
- **URL**: `/api/auth/send-registration-otp`
- **Auth Required**: No

**Request Body:**
```json
{
  "email": "newuser@example.com"
}
```

**Validation Rules:**
- `email`: required, email, unique in users table

---

### 1.12 Verify OTP
- **Method**: `POST`
- **URL**: `/api/auth/verify-otp`
- **Auth Required**: No

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Validation Rules:**
- `email`: required, email
- `otp`: required, string, size:6

---

### 1.13 Reset Password with OTP
- **Method**: `POST`
- **URL**: `/api/auth/reset-password-otp`
- **Auth Required**: No

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

---

### 1.14 Google OAuth Callback
- **Method**: `POST`
- **URL**: `/api/auth/google/callback`
- **Auth Required**: No

**Request Body:**
```json
{
  "token": "google_id_token_from_frontend"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": { ... user object ... }
  }
}
```

---

## 2. Catalog (Public)

### 2.1 Get All Categories
- **Method**: `GET`
- **URL**: `/api/catalog/categories`
- **Auth Required**: No
- **Related Pages**: `/shop`, `/` (navigation)

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sports Equipment",
      "slug": "sports-equipment",
      "description": "...",
      "image": "categories/sports.jpg",
      "parent_id": null,
      "sort_order": 1,
      "is_active": true,
      "children": [
        {
          "id": 2,
          "name": "Cricket",
          "slug": "cricket",
          "parent_id": 1,
          "children": [ ... ]
        }
      ]
    }
  ]
}
```

---

### 2.2 Get Single Category
- **Method**: `GET`
- **URL**: `/api/catalog/categories/{slug}`
- **Auth Required**: No
- **Related Pages**: `/shop?category={slug}`

**URL Parameters:**
- `slug`: Category slug (e.g., `sports-equipment`)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sports Equipment",
    "slug": "sports-equipment",
    "children": [ ... ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Category not found."
}
```

---

### 2.3 Get Products by Category
- **Method**: `GET`
- **URL**: `/api/catalog/categories/{slug}/products`
- **Auth Required**: No
- **Related Pages**: `/shop?category={slug}`

**Query Parameters:**
- `brand_id` (optional): Filter by brand ID
- `min_price` (optional): Minimum price
- `max_price` (optional): Maximum price
- `in_stock` (optional): boolean
- `sort_by` (optional): `price`, `name`, `created_at`
- `sort_order` (optional): `asc`, `desc`
- `per_page` (optional): default 15

**Success Response:**
```json
{
  "success": true,
  "data": {
    "category": { ... category object ... },
    "products": { ... paginated products ... }
  }
}
```

---

### 2.4 Get All Brands
- **Method**: `GET`
- **URL**: `/api/catalog/brands`
- **Auth Required**: No
- **Related Pages**: `/shop` (filter sidebar), `/` (brands section)

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nike",
      "slug": "nike",
      "logo": "brands/nike.png",
      "description": "...",
      "is_active": true,
      "sort_order": 1
    }
  ]
}
```

---

### 2.5 Get Products by Brand
- **Method**: `GET`
- **URL**: `/api/catalog/brands/{slug}/products`
- **Auth Required**: No

**Query Parameters:** Same as 2.3 (minus `brand_id`)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "brand": { ... brand object ... },
    "products": { ... paginated products ... }
  }
}
```

---

### 2.6 Search / List Products
- **Method**: `GET`
- **URL**: `/api/catalog/products`
- **Auth Required**: No
- **Related Pages**: `/shop`

**Query Parameters:**
- `search` (optional): Full-text search string
- `category_id` (optional): Filter by category ID
- `brand_id` (optional): Filter by brand ID
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `in_stock` (optional): `true`/`false`
- `is_featured` (optional): `true`/`false`
- `is_trending` (optional): `true`/`false`
- `is_preorder` (optional): `true`/`false`
- `has_flash_deal` (optional): `true`/`false`
- `has_promotion` (optional): `true`/`false`
- `has_discount` (optional): `true`/`false`
- `sort_by` (optional): `price`, `name`, `created_at`, `rating`
- `sort_order` (optional): `asc`, `desc`
- `per_page` (optional): default 15, max 100

**Success Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "Cricket Bat",
        "slug": "cricket-bat",
        "sku": "CB-001",
        "short_description": "...",
        "description": "...",
        "price": "1500.00",
        "compare_price": "2000.00",
        "quantity": 50,
        "stock_status": "in_stock",
        "is_featured": true,
        "is_trending": false,
        "is_preorder": false,
        "status": "active",
        "average_rating": 4.5,
        "review_count": 12,
        "category": { "id": 1, "name": "Cricket", "slug": "cricket" },
        "brand": { "id": 1, "name": "Nike", "slug": "nike" },
        "images": [
          {
            "id": 1,
            "image_path": "products/bat.jpg",
            "full_url": "http://localhost:8000/storage/products/bat.jpg",
            "is_primary": true,
            "sort_order": 0
          }
        ],
        "primary_image_url": "http://localhost:8000/storage/products/bat.jpg"
      }
    ],
    "per_page": 15,
    "total": 100,
    "last_page": 7
  }
}
```

---

### 2.7 Get Featured Products
- **Method**: `GET`
- **URL**: `/api/catalog/products/featured`
- **Auth Required**: No
- **Related Pages**: `/` (homepage featured section)

**Notes:** Returns up to 12 featured products.

---

### 2.8 Get Trending Products
- **Method**: `GET`
- **URL**: `/api/catalog/products/trending`
- **Auth Required**: No
- **Related Pages**: `/` (homepage trending section)

**Notes:** Returns up to 12 trending products.

---

### 2.9 Get Single Product
- **Method**: `GET`
- **URL**: `/api/catalog/products/{slug}`
- **Auth Required**: No
- **Related Pages**: `/products/{slug}`

**URL Parameters:**
- `slug`: Product slug

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Cricket Bat",
    "slug": "cricket-bat",
    "sku": "CB-001",
    "short_description": "High quality cricket bat",
    "description": "<p>Full HTML description...</p>",
    "price": "1500.00",
    "compare_price": "2000.00",
    "cost_price": "800.00",
    "quantity": 50,
    "low_stock_threshold": 5,
    "weight": "1.20",
    "weight_unit": "kg",
    "length": "85.00",
    "width": "10.00",
    "height": "5.00",
    "shipping_type": "default",
    "requires_shipping": true,
    "is_featured": true,
    "is_trending": false,
    "is_preorder": false,
    "preorder_release_date": null,
    "preorder_limit": null,
    "preorder_deposit_amount": null,
    "preorder_deposit_type": null,
    "status": "active",
    "stock_status": "in_stock",
    "average_rating": 4.5,
    "review_count": 12,
    "meta_title": "Cricket Bat - Best Quality",
    "meta_description": "...",
    "category": { ... },
    "brand": { ... },
    "images": [ ... ],
    "primary_image_url": "http://localhost:8000/storage/products/bat.jpg",
    "variations": [
      {
        "id": 1,
        "sku": "CB-001-S",
        "price": "1500.00",
        "quantity": 20,
        "is_default": true,
        "variation_values": [
          {
            "id": 1,
            "variation_option": {
              "id": 1,
              "value": "Small",
              "variation": { "id": 1, "name": "Size" }
            }
          }
        ]
      }
    ]
  }
}
```

---

## 3. Flash Deals (Public)

### 3.1 Get Active Flash Deals
- **Method**: `GET`
- **URL**: `/api/flash-deals`
- **Auth Required**: No
- **Related Pages**: `/` (flash deals section), `/shop`

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Summer Sale",
      "description": "...",
      "starts_at": "2026-05-15T00:00:00.000000Z",
      "ends_at": "2026-05-20T23:59:59.000000Z",
      "is_active": true,
      "priority": 1,
      "products": [
        {
          "id": 1,
          "name": "Cricket Bat",
          "slug": "cricket-bat",
          "price": "1500.00",
          "pivot": {
            "flash_price": "999.00",
            "quantity_limit": 50,
            "quantity_sold": 10
          }
        }
      ]
    }
  ]
}
```

---

### 3.2 Get Upcoming Flash Deals
- **Method**: `GET`
- **URL**: `/api/flash-deals/upcoming`
- **Auth Required**: No

---

### 3.3 Get Single Flash Deal
- **Method**: `GET`
- **URL**: `/api/flash-deals/{id}`
- **Auth Required**: No

---

## 4. Galleries (Public)

### 4.1 Get All Galleries
- **Method**: `GET`
- **URL**: `/api/galleries`
- **Auth Required**: No
- **Related Pages**: `/about-us`, `/`

---

### 4.2 Get Single Gallery
- **Method**: `GET`
- **URL**: `/api/galleries/{slug}`
- **Auth Required**: No

---

## 5. Cart (Public)

### 5.1 Get Cart Summary
- **Method**: `POST`
- **URL**: `/api/cart/summary`
- **Auth Required**: No (works for guests too)
- **Related Pages**: `/cart`

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "variation_id": 2,
      "quantity": 2
    }
  ],
  "coupon_code": "SAVE10"
}
```

**Validation Rules:**
- `items`: required, array, min:1
- `items.*.product_id`: required, exists in products
- `items.*.variation_id`: nullable, exists in product_variations
- `items.*.quantity`: required, integer, min:1
- `coupon_code`: nullable, string

**Success Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "product_id": 1,
        "variation_id": 2,
        "name": "Cricket Bat",
        "sku": "CB-001-S",
        "image": "products/bat.jpg",
        "price": 1500.00,
        "quantity": 2,
        "total": 3000.00,
        "discounted_price": 1350.00,
        "promotion_discount": 150.00
      }
    ],
    "subtotal": 2700.00,
    "promotion_discount": 300.00,
    "coupon_discount": 270.00,
    "coupon_error": null,
    "total": 2430.00,
    "errors": []
  }
}
```

---

### 5.2 Validate Coupon
- **Method**: `POST`
- **URL**: `/api/cart/validate-coupon`
- **Auth Required**: No
- **Related Pages**: `/cart`, `/checkout`

**Request Body:**
```json
{
  "code": "SAVE10",
  "items": [
    { "product_id": 1, "variation_id": null, "quantity": 2 }
  ],
  "subtotal": 3000.00
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "discount": 300.00,
    "coupon": {
      "id": 1,
      "code": "SAVE10",
      "name": "10% Off",
      "discount_type": "percentage",
      "discount_value": 10
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Coupon has expired."
}
```

---

### 5.3 Check Product Availability
- **Method**: `POST`
- **URL**: `/api/cart/check-availability`
- **Auth Required**: No

**Request Body:**
```json
{
  "product_id": 1,
  "variation_id": 2,
  "quantity": 5
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "available": true
  }
}
```

---

### 5.4 Get Available Coupons
- **Method**: `GET`
- **URL**: `/api/cart/available-coupons`
- **Auth Required**: No
- **Related Pages**: `/cart`, `/checkout`

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "SAVE10",
      "name": "10% Off",
      "description": "Get 10% off on all orders",
      "discount_type": "percentage",
      "discount_value": 10,
      "min_order_amount": 500.00,
      "max_discount_amount": 500.00,
      "applies_to": "all",
      "expires_at": "2026-12-31 23:59:59",
      "is_free_shipping": false
    }
  ]
}
```

---

## 6. Reviews (Public Read)

### 6.1 Get Product Reviews
- **Method**: `GET`
- **URL**: `/api/products/{productId}/reviews`
- **Alt URL**: `/api/reviews/product/{productId}`
- **Auth Required**: No
- **Related Pages**: `/products/{slug}` (reviews tab)

**URL Parameters:**
- `productId`: Product ID (integer)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "reviews": {
      "current_page": 1,
      "data": [
        {
          "id": 1,
          "rating": 5,
          "title": "Excellent product",
          "comment": "Very happy with this purchase...",
          "status": "approved",
          "helpful_count": 3,
          "created_at": "2026-05-01T10:00:00.000000Z",
          "user": {
            "id": 1,
            "first_name": "John",
            "last_name": "D.",
            "avatar": null
          }
        }
      ],
      "per_page": 10,
      "total": 25
    },
    "stats": {
      "average_rating": 4.5,
      "total_reviews": 25,
      "rating_distribution": {
        "5": 15,
        "4": 7,
        "3": 2,
        "2": 1,
        "1": 0
      }
    }
  }
}
```

---

## 7. Pages & Content (Public)

### 7.1 Get All Store Policies
- **Method**: `GET`
- **URL**: `/api/policies`
- **Auth Required**: No
- **Related Pages**: Footer links

---

### 7.2 Get Policy by Type
- **Method**: `GET`
- **URL**: `/api/policies/{type}`
- **Auth Required**: No
- **Related Pages**: `/privacy-policy`, `/terms-of-service`, `/return-policy`

**URL Parameters:**
- `type`: Policy type (e.g., `privacy_policy`, `terms_of_service`, `return_policy`, `shipping_policy`)

---

### 7.3 Get Page by Slug
- **Method**: `GET`
- **URL**: `/api/pages/{slug}`
- **Auth Required**: No
- **Related Pages**: `/about-us`, `/contact`

---

### 7.4 Get Pages by Type
- **Method**: `GET`
- **URL**: `/api/pages/type/{type}`
- **Auth Required**: No

---

### 7.5 Get Banners
- **Method**: `GET`
- **URL**: `/api/banners/{position?}`
- **Auth Required**: No
- **Related Pages**: `/` (homepage banners)

**URL Parameters:**
- `position` (optional): Banner position (e.g., `hero`, `sidebar`, `footer`)

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Summer Sale",
      "subtitle": "Up to 50% off",
      "image": "banners/summer-sale.jpg",
      "link": "/shop?sale=true",
      "position": "hero",
      "is_active": true,
      "sort_order": 1
    }
  ]
}
```

---

### 7.6 Get Page Content by Key
- **Method**: `GET`
- **URL**: `/api/page-content/{pageKey}`
- **Auth Required**: No
- **Related Pages**: `/`, `/about-us`

**URL Parameters:**
- `pageKey`: Page identifier (e.g., `homepage`, `about_us`)

---

### 7.7 Get Page Content by Brand Slug
- **Method**: `GET`
- **URL**: `/api/page-content/brand/{brandSlug}`
- **Auth Required**: No

---

## 8. Order Tracking (Public)

### 8.1 Track Order
- **Method**: `GET`
- **URL**: `/api/orders/{orderNumber}/track`
- **Auth Required**: No
- **Related Pages**: `/track-order`

**URL Parameters:**
- `orderNumber`: Order number (e.g., `SS20260515ABCD`)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "order_number": "SS20260515ABCD",
    "status": "shipped",
    "shipping_method": "pathao_courier",
    "tracking_number": "PTH123456789",
    "created_at": "2026-05-15T10:00:00.000000Z",
    "updated_at": "2026-05-16T14:00:00.000000Z"
  }
}
```

---

### 8.2 Get Order Details (Public)
- **Method**: `GET`
- **URL**: `/api/orders/{orderNumber}`
- **Auth Required**: No (but if authenticated, verifies ownership)
- **Related Pages**: `/orders/{orderNumber}`

---

## 9. Checkout (Public — Supports Guest & Auth)

### 9.1 Get Shipping Methods
- **Method**: `POST`
- **URL**: `/api/checkout/shipping-methods`
- **Auth Required**: No
- **Related Pages**: `/checkout`

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "variation_id": 2,
      "quantity": 2
    }
  ],
  "address_id": 10,
  "subtotal": 3000.00
}
```

**Validation Rules:**
- `items`: required, array, min:1
- `items.*.product_id`: required, exists in products
- `items.*.variation_id`: nullable, exists in product_variations
- `items.*.quantity`: required, integer, min:1
- `address_id`: nullable, exists in addresses
- `subtotal`: required, numeric, min:0

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "code": "pathao_courier",
      "name": "Pathao Courier",
      "description": "Fast and reliable courier service",
      "cost": 120.00,
      "delivery_time": "2-3 business days",
      "free_shipping_min_order": 3000.00,
      "is_free": false,
      "recommended": true
    },
    {
      "code": "auxbeam_team",
      "name": "Auxbeam Team Delivery",
      "description": "Our own delivery team for heavy items",
      "cost": 250.00,
      "delivery_time": "3-5 business days",
      "free_shipping_min_order": 5000.00,
      "is_free": false,
      "recommended": false
    }
  ]
}
```

**Shipping Methods:**
| Code | Description |
|------|-------------|
| `pathao_courier` | Standard courier (recommended for ≤20kg) |
| `auxbeam_team` | Heavy item delivery (recommended for >20kg) |
| `standard` | Standard shipping |

---

### 9.2 Checkout Preview
- **Method**: `POST`
- **URL**: `/api/checkout/preview`
- **Auth Required**: No
- **Related Pages**: `/checkout`

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "variation_id": null,
      "quantity": 2,
      "price": 1500.00,
      "is_preorder": false
    }
  ],
  "shipping_address_id": 10,
  "shipping_method": "pathao_courier",
  "coupon_code": "SAVE10",
  "is_preorder": false,
  "pay_deposit_only": false
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "subtotal": 3000.00,
    "shipping_cost": 120.00,
    "coupon_discount": 300.00,
    "total": 2820.00,
    "is_preorder": false,
    "deposit_amount": null,
    "remaining_amount": null,
    "payable_now": 2820.00
  }
}
```

---

### 9.3 Process Checkout
- **Method**: `POST`
- **URL**: `/api/checkout/process`
- **Auth Required**: No (supports both guest and authenticated)
- **Related Pages**: `/checkout`

**Request Body (Authenticated User):**
```json
{
  "items": [
    {
      "product_id": 1,
      "variation_id": 2,
      "quantity": 2,
      "price": 1500.00,
      "is_preorder": false
    }
  ],
  "shipping_address_id": 10,
  "billing_address_id": 10,
  "shipping_method": "pathao_courier",
  "payment_method": "ssl_commerz",
  "coupon_code": "SAVE10",
  "notes": "Please call before delivery",
  "is_preorder": false,
  "pay_deposit_only": false
}
```

**Request Body (Guest User):**
```json
{
  "items": [ ... ],
  "guest_email": "guest@example.com",
  "guest_name": "Guest User",
  "guest_phone": "+8801700000000",
  "shipping_address": {
    "address_line_1": "123 Main Street",
    "city": "Dhaka",
    "state": "Dhaka",
    "postal_code": "1200",
    "country": "Bangladesh",
    "phone": "+8801700000000"
  },
  "shipping_method": "pathao_courier",
  "payment_method": "cod",
  "create_account": false
}
```

**Validation Rules:**
- `items`: required, array, min:1
- `items.*.product_id`: required, exists in products
- `items.*.variation_id`: nullable, exists in product_variations
- `items.*.quantity`: required, integer, min:1
- `items.*.price`: required, numeric, min:0
- `shipping_address_id`: nullable, exists in addresses (for auth users)
- `shipping_address`: required_without:shipping_address_id (for guests)
- `shipping_method`: required, in:auxbeam_team,pathao_courier,standard
- `payment_method`: required, in:ssl_commerz,bkash,nagad,cod,cash_on_delivery
- `guest_email`: required for guests
- `guest_name`: required for guests
- `guest_phone`: required for guests

**Payment Methods:**
| Code | Description |
|------|-------------|
| `ssl_commerz` | SSLCommerz payment gateway |
| `bkash` | bKash mobile payment |
| `nagad` | Nagad mobile payment |
| `cod` | Cash on Delivery |
| `cash_on_delivery` | Cash on Delivery (alias) |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully.",
  "data": {
    "order": {
      "id": 123,
      "order_number": "SS20260515ABCD",
      "status": "pending",
      "payment_status": "pending",
      "subtotal": "3000.00",
      "shipping_cost": "120.00",
      "discount_amount": "300.00",
      "total_amount": "2820.00",
      "shipping_method": "pathao_courier",
      "created_at": "2026-05-15T10:00:00.000000Z"
    },
    "payment": {
      "gateway_url": "https://sandbox.sslcommerz.com/...",
      "session_key": "...",
      "status": "initiated"
    },
    "account_created": false
  }
}
```

---

## 10. Payments (Public Callbacks)

### 10.1 SSLCommerz IPN
- **Method**: `POST`
- **URL**: `/api/payments/ssl-commerz/ipn`
- **Auth Required**: No
- **Notes**: Called by SSLCommerz payment gateway, not by frontend

---

### 10.2 Payment Success Redirect
- **Method**: `GET` or `POST`
- **URL**: `/api/payments/ssl-commerz/success`
- **Auth Required**: No
- **Notes**: Redirect URL after successful payment

---

### 10.3 Payment Fail Redirect
- **Method**: `GET` or `POST`
- **URL**: `/api/payments/ssl-commerz/fail`
- **Auth Required**: No

---

### 10.4 Payment Cancel Redirect
- **Method**: `GET` or `POST`
- **URL**: `/api/payments/ssl-commerz/cancel`
- **Auth Required**: No

---

### 10.5 Get Payment Status
- **Method**: `GET`
- **URL**: `/api/payments/{orderNumber}/status`
- **Auth Required**: No
- **Related Pages**: `/checkout/success`, `/orders/{orderNumber}`

**Success Response:**
```json
{
  "success": true,
  "data": {
    "order_number": "SS20260515ABCD",
    "payment_status": "paid",
    "amount": "2820.00",
    "payment_method": "ssl_commerz",
    "paid_at": "2026-05-15T10:05:00.000000Z"
  }
}
```

---

### 10.6 Retry Payment (Auth)
- **Method**: `POST`
- **URL**: `/api/payments/{orderNumber}/retry`
- **Auth Required**: Yes

---

### 10.7 Pay Preorder Balance (Auth)
- **Method**: `POST`
- **URL**: `/api/payments/{orderNumber}/pay-preorder-balance`
- **Auth Required**: Yes

---

## 11. Analytics Tracking (Public)

### 11.1 Track Page View
- **Method**: `POST`
- **URL**: `/api/analytics/track/page-view`
- **Auth Required**: No

**Request Body:**
```json
{
  "page_url": "/products/cricket-bat",
  "page_title": "Cricket Bat",
  "referrer": "https://google.com",
  "session_id": "abc123"
}
```

---

### 11.2 Track Product View
- **Method**: `POST`
- **URL**: `/api/analytics/track/product-view`
- **Auth Required**: No

**Request Body:**
```json
{
  "product_id": 1,
  "session_id": "abc123"
}
```

---

### 11.3 Track Cart Event
- **Method**: `POST`
- **URL**: `/api/analytics/track/cart-event`
- **Auth Required**: No

**Request Body:**
```json
{
  "event_type": "add_to_cart",
  "product_id": 1,
  "quantity": 2,
  "session_id": "abc123"
}
```

---

### 11.4 Track Checkout
- **Method**: `POST`
- **URL**: `/api/analytics/track/checkout`
- **Auth Required**: No

---

### 11.5 Track Search
- **Method**: `POST`
- **URL**: `/api/analytics/track/search`
- **Auth Required**: No

**Request Body:**
```json
{
  "query": "cricket bat",
  "results_count": 15,
  "session_id": "abc123"
}
```

---

## 12. Visitor Popup (Public)

### 12.1 Submit Visitor Popup
- **Method**: `POST`
- **URL**: `/api/visitor-popup`
- **Auth Required**: No
- **Related Pages**: `/` (popup modal)

**Request Body:**
```json
{
  "email": "visitor@example.com",
  "name": "Visitor Name",
  "phone": "+8801700000000"
}
```

---

## 13. Authenticated Customer — Orders

### 13.1 Get My Orders
- **Method**: `GET`
- **URL**: `/api/orders`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/account/orders`

**Query Parameters:**
- `per_page` (optional): default 15

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "order_number": "SS20260515ABCD",
      "status": "delivered",
      "payment_status": "paid",
      "subtotal": "3000.00",
      "shipping_cost": "120.00",
      "discount_amount": "300.00",
      "total_amount": "2820.00",
      "shipping_method": "pathao_courier",
      "tracking_number": "PTH123456789",
      "created_at": "2026-05-15T10:00:00.000000Z",
      "items": [ ... ]
    }
  ],
  "pagination": {
    "total": 25,
    "per_page": 15,
    "current_page": 1,
    "last_page": 2,
    "from": 1,
    "to": 15
  }
}
```

---

### 13.2 Get Single Order
- **Method**: `GET`
- **URL**: `/api/orders/{orderNumber}`
- **Auth Required**: No (but if authenticated, verifies ownership)
- **Related Pages**: `/account/orders/{orderNumber}`

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "order_number": "SS20260515ABCD",
    "status": "delivered",
    "payment_status": "paid",
    "subtotal": "3000.00",
    "shipping_cost": "120.00",
    "discount_amount": "300.00",
    "total_amount": "2820.00",
    "shipping_method": "pathao_courier",
    "tracking_number": "PTH123456789",
    "notes": "Please call before delivery",
    "created_at": "2026-05-15T10:00:00.000000Z",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "Cricket Bat",
        "sku": "CB-001-S",
        "quantity": 2,
        "unit_price": "1500.00",
        "total_price": "3000.00",
        "product": {
          "id": 1,
          "name": "Cricket Bat",
          "slug": "cricket-bat",
          "images": [ ... ]
        },
        "product_variation": { ... }
      }
    ],
    "shipping_address": {
      "id": 10,
      "address_line_1": "123 Main Street",
      "city": "Dhaka",
      "state": "Dhaka",
      "zip_code": "1200"
    },
    "payments": [ ... ],
    "invoice": { ... }
  }
}
```

---

### 13.3 Cancel Order
- **Method**: `POST`
- **URL**: `/api/orders/{orderNumber}/cancel`
- **Auth Required**: Yes (customer, must own the order)
- **Related Pages**: `/account/orders/{orderNumber}`

**Notes:** Only orders with status `pending` or `confirmed` can be cancelled.

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Validation Rules:**
- `reason`: required, string, max:500

**Success Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully.",
  "data": { ... order object ... }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Order cannot be cancelled at this stage."
}
```

---

### 13.4 Download Order Invoice
- **Method**: `GET`
- **URL**: `/api/orders/{orderNumber}/invoice`
- **Auth Required**: Yes (customer, must own the order)
- **Related Pages**: `/account/orders/{orderNumber}`

**Notes:** Returns a PDF file download (binary response), not JSON.

---

## 14. Authenticated Customer — Reviews

### 14.1 Submit a Review
- **Method**: `POST`
- **URL**: `/api/reviews`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/account/orders/{orderNumber}` (review form)

**Notes:** User must have purchased the product. Only one review per product per user.

**Request Body:**
```json
{
  "product_id": 1,
  "rating": 5,
  "title": "Excellent product",
  "comment": "Very happy with this purchase. Great quality and fast delivery."
}
```

**Validation Rules:**
- `product_id`: required, exists in products
- `rating`: required, integer, min:1, max:5
- `title`: nullable, string, max:255
- `comment`: required, string, max:2000

**Success Response (201):**
```json
{
  "success": true,
  "message": "Review submitted successfully. It will be visible after approval.",
  "data": {
    "id": 1,
    "product_id": 1,
    "user_id": 1,
    "rating": 5,
    "title": "Excellent product",
    "comment": "Very happy with this purchase...",
    "status": "pending",
    "created_at": "2026-05-15T10:00:00.000000Z"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You can only review products you have purchased."
}
```

---

### 14.2 Get My Reviews
- **Method**: `GET`
- **URL**: `/api/reviews/my-reviews`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/account/reviews`

**Success Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "rating": 5,
        "title": "Excellent product",
        "comment": "...",
        "status": "approved",
        "created_at": "2026-05-15T10:00:00.000000Z",
        "product": {
          "id": 1,
          "name": "Cricket Bat",
          "slug": "cricket-bat"
        }
      }
    ],
    "per_page": 10,
    "total": 5
  }
}
```

---

### 14.3 Get Reviewable Products from Order
- **Method**: `GET`
- **URL**: `/api/reviews/order/{orderNumber}`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/account/orders/{orderNumber}/review`

**Notes:** Order must have status `delivered` or `completed`.

**Success Response:**
```json
{
  "success": true,
  "data": {
    "order_number": "SS20260515ABCD",
    "order_date": "2026-05-15T10:00:00.000000Z",
    "order_status": "delivered",
    "products": [
      {
        "product_id": 1,
        "product_name": "Cricket Bat",
        "product_slug": "cricket-bat",
        "product_image": "http://localhost:8000/storage/products/bat.jpg",
        "sku": "CB-001-S",
        "quantity": 2,
        "has_reviewed": false,
        "review": null
      }
    ]
  }
}
```

---

### 14.4 Mark Review as Helpful
- **Method**: `POST`
- **URL**: `/api/reviews/{reviewId}/helpful`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/products/{slug}` (reviews section)

**Success Response:**
```json
{
  "success": true,
  "message": "Marked as helpful.",
  "data": {
    "helpful_count": 4
  }
}
```

---

## 15. Authenticated Customer — Returns

### 15.1 Get My Returns
- **Method**: `GET`
- **URL**: `/api/returns`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/account/returns`

---

### 15.2 Submit Return Request
- **Method**: `POST`
- **URL**: `/api/returns`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/account/orders/{orderNumber}`

**Request Body:**
```json
{
  "order_id": 123,
  "items": [
    {
      "order_item_id": 1,
      "quantity": 1,
      "reason": "defective"
    }
  ],
  "description": "The product arrived damaged.",
  "images": []
}
```

---

### 15.3 Get Single Return
- **Method**: `GET`
- **URL**: `/api/returns/{id}`
- **Auth Required**: Yes (customer)

---

## 16. Authenticated Customer — Dashboard & Profile

### 16.1 Get Dashboard
- **Method**: `GET`
- **URL**: `/api/dashboard`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/account`

**Success Response:**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "total_orders": 15,
      "pending_orders": 2,
      "processing_orders": 3,
      "delivered_orders": 8,
      "cancelled_orders": 2,
      "total_spent": 15000.00,
      "pending_reviews": 3,
      "active_returns": 1,
      "wishlist_count": 5,
      "preorder_balance": 2000.00
    },
    "recent_orders": [ ... ]
  }
}
```

---

### 16.2 Get Profile
- **Method**: `GET`
- **URL**: `/api/profile`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/account/profile`

**Success Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+8801700000000",
      "date_of_birth": "1990-01-01",
      "gender": "male",
      "avatar": null
    },
    "addresses": [ ... ],
    "default_shipping_address": { ... }
  }
}
```

---

## 17. Authenticated Customer — Addresses

### 17.1 Get All Addresses
- **Method**: `GET`
- **URL**: `/api/addresses`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/account/addresses`

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "user_id": 1,
      "address_line_1": "123 Main Street",
      "address_line_2": "Apt 4B",
      "contact_no": "+8801700000000",
      "city": "Dhaka",
      "state": "Dhaka",
      "zip_code": "1200",
      "address_type": "shipping_address",
      "is_default": true,
      "full_address": "123 Main Street, Apt 4B, Dhaka, Dhaka, 1200"
    }
  ]
}
```

---

### 17.2 Create Address
- **Method**: `POST`
- **URL**: `/api/addresses`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/account/addresses/new`, `/checkout`

**Request Body:**
```json
{
  "address_line_1": "123 Main Street",
  "address_line_2": "Apt 4B",
  "contact_no": "+8801700000000",
  "city": "Dhaka",
  "state": "Dhaka",
  "zip_code": "1200",
  "address_type": "shipping_address",
  "is_default": true
}
```

**Validation Rules:**
- `address_line_1`: required, string
- `address_line_2`: nullable, string
- `contact_no`: required, string, max:20
- `city`: required, string
- `state`: nullable, string
- `zip_code`: nullable, string
- `address_type`: required, in:`user_address`,`shipping_address`,`billing_address`
- `is_default`: nullable, boolean

---

### 17.3 Get Single Address
- **Method**: `GET`
- **URL**: `/api/addresses/{id}`
- **Auth Required**: Yes (customer)

---

### 17.4 Update Address
- **Method**: `PUT`
- **URL**: `/api/addresses/{id}`
- **Auth Required**: Yes (customer)

**Request Body:** Same fields as Create (all optional with `sometimes`)

---

### 17.5 Delete Address
- **Method**: `DELETE`
- **URL**: `/api/addresses/{id}`
- **Auth Required**: Yes (customer)

**Notes:** Cannot delete addresses associated with existing orders.

---

### 17.6 Set Default Address
- **Method**: `POST`
- **URL**: `/api/addresses/{id}/set-default`
- **Auth Required**: Yes (customer)

**Success Response:**
```json
{
  "success": true,
  "message": "Default address updated."
}
```

---

## 18. Authenticated Customer — Wishlist

### 18.1 Get Wishlist
- **Method**: `GET`
- **URL**: `/api/wishlist`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/account/wishlist`

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "product_id": 10,
      "created_at": "2026-05-01T10:00:00.000000Z",
      "product": {
        "id": 10,
        "name": "Cricket Bat",
        "slug": "cricket-bat",
        "price": "1500.00",
        "primary_image_url": "http://localhost:8000/storage/products/bat.jpg",
        "stock_status": "in_stock",
        "category": { ... },
        "brand": { ... }
      }
    }
  ]
}
```

---

### 18.2 Add to Wishlist
- **Method**: `POST`
- **URL**: `/api/wishlist`
- **Auth Required**: Yes (customer)

**Request Body:**
```json
{
  "product_id": 10
}
```

**Validation Rules:**
- `product_id`: required, exists in products

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product added to wishlist.",
  "data": { ... wishlist item ... }
}
```

---

### 18.3 Remove from Wishlist (by wishlist ID)
- **Method**: `DELETE`
- **URL**: `/api/wishlist/{id}`
- **Auth Required**: Yes (customer)

---

### 18.4 Remove from Wishlist (by product ID)
- **Method**: `DELETE`
- **URL**: `/api/wishlist/product/{productId}`
- **Auth Required**: Yes (customer)

---

### 18.5 Check if Product in Wishlist
- **Method**: `GET`
- **URL**: `/api/wishlist/check/{productId}`
- **Auth Required**: Yes (customer)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "in_wishlist": true
  }
}
```

---

### 18.6 Clear Wishlist
- **Method**: `POST`
- **URL**: `/api/wishlist/clear`
- **Auth Required**: Yes (customer)

---

## 19. Authenticated Customer — Notifications

### 19.1 Get Notifications
- **Method**: `GET`
- **URL**: `/api/notifications`
- **Auth Required**: Yes (customer)
- **Related Pages**: `/account/notifications`

**Notes:** Paginated, 20 per page.

**Success Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": "uuid-string",
        "type": "App\\Notifications\\OrderConfirmedNotification",
        "data": {
          "title": "Order Confirmed",
          "message": "Your order SS20260515ABCD has been confirmed.",
          "order_number": "SS20260515ABCD"
        },
        "read_at": null,
        "created_at": "2026-05-15T10:00:00.000000Z"
      }
    ],
    "per_page": 20,
    "total": 5
  }
}
```

---

### 19.2 Get Unread Count
- **Method**: `GET`
- **URL**: `/api/notifications/unread-count`
- **Auth Required**: Yes (customer)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "unread_count": 3
  }
}
```

---

### 19.3 Mark Notification as Read
- **Method**: `POST`
- **URL**: `/api/notifications/{id}/mark-as-read`
- **Auth Required**: Yes (customer)

---

### 19.4 Mark All Notifications as Read
- **Method**: `POST`
- **URL**: `/api/notifications/mark-all-as-read`
- **Auth Required**: Yes (customer)

---

### 19.5 Delete Notification
- **Method**: `DELETE`
- **URL**: `/api/notifications/{id}`
- **Auth Required**: Yes (customer)

---

### 19.6 Clear All Notifications
- **Method**: `POST`
- **URL**: `/api/notifications/clear`
- **Auth Required**: Yes (customer)

---
## 20. Admin — Dashboard

### 20.1 Get Admin Dashboard
- **Method**: `GET`
- **URL**: `/api/admin/dashboard`
- **Auth Required**: Yes (admin)
- **Related Pages**: `/admin`

**Success Response:**
```json
{
  "success": true,
  "data": {
    "today": {
      "orders": 12,
      "revenue": 45000.00
    },
    "this_month": {
      "orders": 250,
      "revenue": 850000.00
    },
    "pending": {
      "orders": 15,
      "reviews": 8,
      "returns": 3
    },
    "low_stock_count": 5
  }
}
```

---

## 21. Admin — Users

### 21.1 List Users
- **Method**: `GET`
- **URL**: `/api/admin/users`
- **Auth Required**: Yes (admin)
- **Related Pages**: `/admin/users`

**Query Parameters:**
- `search` (optional): Search by name/email
- `user_type` (optional): `customer`, `admin`
- `status` (optional): `1` (active), `0` (inactive)
- `per_page` (optional): default 15

---

### 21.2 Create User
- **Method**: `POST`
- **URL**: `/api/admin/users`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "phone": "+8801700000001",
  "password": "password123",
  "user_type": "customer",
  "status": true
}
```

---

### 21.3 Get User
- **Method**: `GET`
- **URL**: `/api/admin/users/{id}`
- **Auth Required**: Yes (admin)

---

### 21.4 Update User
- **Method**: `PUT`
- **URL**: `/api/admin/users/{id}`
- **Auth Required**: Yes (admin)

---

### 21.5 Delete User
- **Method**: `DELETE`
- **URL**: `/api/admin/users/{id}`
- **Auth Required**: Yes (admin)

---

### 21.6 Toggle User Status
- **Method**: `POST`
- **URL**: `/api/admin/users/{id}/toggle-status`
- **Auth Required**: Yes (admin)

**Success Response:**
```json
{
  "success": true,
  "message": "User status updated.",
  "data": { "status": false }
}
```

---

## 22. Admin — Categories

### 22.1 Get Category Tree
- **Method**: `GET`
- **URL**: `/api/admin/categories/tree`
- **Auth Required**: Yes (admin)

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sports Equipment",
      "slug": "sports-equipment",
      "children": [
        {
          "id": 2,
          "name": "Cricket",
          "children": [ ... ]
        }
      ]
    }
  ]
}
```

---

### 22.2 List Categories
- **Method**: `GET`
- **URL**: `/api/admin/categories`
- **Auth Required**: Yes (admin)

---

### 22.3 Create Category
- **Method**: `POST`
- **URL**: `/api/admin/categories`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "name": "Cricket",
  "slug": "cricket",
  "parent_id": 1,
  "description": "Cricket equipment and accessories",
  "image": "categories/cricket.jpg",
  "sort_order": 1,
  "is_active": true,
  "meta_title": "Cricket Equipment",
  "meta_description": "..."
}
```

---

### 22.4 Get Category
- **Method**: `GET`
- **URL**: `/api/admin/categories/{id}`
- **Auth Required**: Yes (admin)

---

### 22.5 Update Category
- **Method**: `PUT`
- **URL**: `/api/admin/categories/{id}`
- **Auth Required**: Yes (admin)

---

### 22.6 Delete Category
- **Method**: `DELETE`
- **URL**: `/api/admin/categories/{id}`
- **Auth Required**: Yes (admin)

---
## 23. Admin — Products

### 23.1 List Products (Admin)
- **Method**: `GET`
- **URL**: `/api/admin/products`
- **Auth Required**: Yes (admin)
- **Related Pages**: `/admin/products`

**Query Parameters:**
- `search`, `category_id`, `brand_id`, `status` (`active`,`inactive`,`draft`)
- `min_price`, `max_price`, `in_stock`, `is_featured`, `is_trending`
- `sort_by`, `sort_order`, `per_page`

**Notes:** Includes inactive products. Each product includes `review_stats`.

---

### 23.2 Create Product
- **Method**: `POST`
- **URL**: `/api/admin/products`
- **Auth Required**: Yes (admin)
- **Content-Type**: `multipart/form-data` (when uploading images) or `application/json`

**Request Body:**
```json
{
  "name": "Cricket Bat Pro",
  "category_id": 2,
  "brand_id": 1,
  "model_id": null,
  "shipping_class_id": null,
  "sku": "CB-PRO-001",
  "short_description": "Professional cricket bat",
  "description": "<p>Full description...</p>",
  "price": 2500.00,
  "compare_price": 3000.00,
  "cost_price": 1200.00,
  "quantity": 100,
  "low_stock_threshold": 10,
  "weight": 1.2,
  "weight_unit": "kg",
  "length": 85.0,
  "width": 10.0,
  "height": 5.0,
  "shipping_type": "default",
  "shipping_cost": null,
  "requires_shipping": true,
  "separate_shipping": false,
  "shipping_notes": null,
  "is_featured": true,
  "is_trending": false,
  "kinomap": false,
  "status": "active",
  "meta_title": "Cricket Bat Pro",
  "meta_description": "...",
  "meta_keywords": "cricket, bat, sports",
  "is_preorder": false,
  "preorder_release_date": null,
  "preorder_limit": null,
  "preorder_deposit_amount": null,
  "preorder_deposit_type": null,
  "images": [
    {
      "path": "products/bat.jpg",
      "alt_text": "Cricket Bat Front View",
      "is_primary": true,
      "sort_order": 0
    }
  ],
  "variations": [
    {
      "sku": "CB-PRO-001-S",
      "price": 2500.00,
      "quantity": 50,
      "is_default": true,
      "variation_values": [1, 3]
    }
  ]
}
```

**Validation Rules (key fields):**
- `name`: required, string, max:255
- `category_id`: required, exists in categories
- `price`: required, numeric, min:0
- `status`: nullable, in:`active`,`inactive`,`draft`
- `weight_unit`: nullable, in:`g`,`kg`,`lb`
- `shipping_type`: nullable, in:`default`,`free`,`fixed`,`per_item`
- `preorder_deposit_type`: nullable, in:`percentage`,`fixed`
- `images`: nullable, array, max:10
- `images.*.file`: nullable, image, mimes:jpeg,jpg,png,gif,webp, max:5120KB

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully.",
  "data": { ... full product with images and variations ... }
}
```

---

### 23.3 Get Product (Admin)
- **Method**: `GET`
- **URL**: `/api/admin/products/{id}`
- **Auth Required**: Yes (admin)

**Notes:** Includes `review_stats` with rating distribution.

---

### 23.4 Update Product
- **Method**: `PUT`
- **URL**: `/api/admin/products/{id}`
- **Auth Required**: Yes (admin)

**Request Body:** Same as Create, all fields optional (`sometimes`).

**Additional fields for update:**
```json
{
  "deleted_variation_ids": [5, 6]
}
```

---

### 23.5 Delete Product
- **Method**: `DELETE`
- **URL**: `/api/admin/products/{id}`
- **Auth Required**: Yes (admin)

---

### 23.6 Add Product Variation
- **Method**: `POST`
- **URL**: `/api/admin/products/{id}/variations`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "sku": "CB-PRO-001-M",
  "price": 2600.00,
  "quantity": 30,
  "is_default": false,
  "variation_values": [2, 3]
}
```

---

### 23.7 Update Product Variation
- **Method**: `PUT`
- **URL**: `/api/admin/products/{productId}/variations/{variationId}`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "sku": "CB-PRO-001-M",
  "price": 2700.00,
  "quantity": 25,
  "is_default": false,
  "shipping_type": "inherit",
  "shipping_cost": null,
  "reason": "Price adjustment"
}
```

---

### 23.8 Delete Product Variation
- **Method**: `DELETE`
- **URL**: `/api/admin/products/{productId}/variations/{variationId}`
- **Auth Required**: Yes (admin)

---

### 23.9 Add Product Images
- **Method**: `POST`
- **URL**: `/api/admin/products/{id}/images`
- **Auth Required**: Yes (admin)
- **Content-Type**: `multipart/form-data`

**Request Body:**
```json
{
  "images": [
    {
      "file": "<binary>",
      "alt_text": "Side view",
      "is_primary": false,
      "sort_order": 1
    }
  ]
}
```

---

### 23.10 Update Product Image
- **Method**: `PUT`
- **URL**: `/api/admin/products/{productId}/images/{imageId}`
- **Auth Required**: Yes (admin)

---

### 23.11 Delete Product Image
- **Method**: `DELETE`
- **URL**: `/api/admin/products/{productId}/images/{imageId}`
- **Auth Required**: Yes (admin)

---

### 23.12 Set Primary Image
- **Method**: `POST`
- **URL**: `/api/admin/products/{productId}/images/{imageId}/set-primary`
- **Auth Required**: Yes (admin)

---

### 23.13 Reorder Images
- **Method**: `POST`
- **URL**: `/api/admin/products/{productId}/images/reorder`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "image_ids": [3, 1, 2]
}
```

---

## 24. Admin — Product Import

### 24.1 Download Import Template
- **Method**: `GET`
- **URL**: `/api/admin/products/import/template`
- **Auth Required**: Yes (admin)
- **Notes**: Returns a CSV file download.

---

### 24.2 Upload Import File
- **Method**: `POST`
- **URL**: `/api/admin/products/import/upload`
- **Auth Required**: Yes (admin)
- **Content-Type**: `multipart/form-data`

**Request Body:**
- `file`: CSV file (required)

---

### 24.3 List Imports
- **Method**: `GET`
- **URL**: `/api/admin/products/import`
- **Auth Required**: Yes (admin)

---

### 24.4 Get Import Status
- **Method**: `GET`
- **URL**: `/api/admin/products/import/{id}`
- **Auth Required**: Yes (admin)

---

### 24.5 Get Import Errors
- **Method**: `GET`
- **URL**: `/api/admin/products/import/{id}/errors`
- **Auth Required**: Yes (admin)

---

### 24.6 Export Import Errors
- **Method**: `GET`
- **URL**: `/api/admin/products/import/{id}/export-errors`
- **Auth Required**: Yes (admin)
- **Notes**: Returns a CSV file download.

---

### 24.7 Cancel Import
- **Method**: `POST`
- **URL**: `/api/admin/products/import/{id}/cancel`
- **Auth Required**: Yes (admin)

---

### 24.8 Delete Import
- **Method**: `DELETE`
- **URL**: `/api/admin/products/import/{id}`
- **Auth Required**: Yes (admin)

---
## 25. Admin — Variations

### 25.1 List Variation Types
- **Method**: `GET`
- **URL**: `/api/admin/variations`
- **Auth Required**: Yes (admin)
- **Related Pages**: `/admin/variations`

**Success Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Size", "slug": "size" },
    { "id": 2, "name": "Color", "slug": "color" }
  ]
}
```

---

### 25.2 Create Variation Type
- **Method**: `POST`
- **URL**: `/api/admin/variations`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{ "name": "Material", "slug": "material" }
```

---

### 25.3 Get / Update / Delete Variation Type
- `GET /api/admin/variations/{id}`
- `PUT /api/admin/variations/{id}`
- `DELETE /api/admin/variations/{id}`
- **Auth Required**: Yes (admin)

---

### 25.4 List Variation Options
- **Method**: `GET`
- **URL**: `/api/admin/variations/{variationId}/options`
- **Auth Required**: Yes (admin)

---

### 25.5 Create Variation Option
- **Method**: `POST`
- **URL**: `/api/admin/variations/{variationId}/options`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{ "value": "Small", "slug": "small", "sort_order": 1 }
```

---

### 25.6 Bulk Create Variation Options
- **Method**: `POST`
- **URL**: `/api/admin/variations/{variationId}/options/bulk`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "options": [
    { "value": "Small", "slug": "small" },
    { "value": "Medium", "slug": "medium" },
    { "value": "Large", "slug": "large" }
  ]
}
```

---

### 25.7 Get / Update / Delete Variation Option
- `GET /api/admin/variations/{variationId}/options/{optionId}`
- `PUT /api/admin/variations/{variationId}/options/{optionId}`
- `DELETE /api/admin/variations/{variationId}/options/{optionId}`
- **Auth Required**: Yes (admin)

---

## 26. Admin — Brands & Product Models

### 26.1 Brands CRUD
- `GET /api/admin/brands` — List brands
- `POST /api/admin/brands` — Create brand
- `GET /api/admin/brands/{id}` — Get brand
- `PUT /api/admin/brands/{id}` — Update brand
- `DELETE /api/admin/brands/{id}` — Delete brand
- **Auth Required**: Yes (admin)

**Create/Update Request Body:**
```json
{
  "name": "Nike",
  "slug": "nike",
  "logo": "brands/nike.png",
  "description": "...",
  "website": "https://nike.com",
  "is_active": true,
  "sort_order": 1,
  "meta_title": "Nike Sports",
  "meta_description": "..."
}
```

---

### 26.2 Product Models CRUD
- `GET /api/admin/product-models` — List models
- `POST /api/admin/product-models` — Create model
- `GET /api/admin/product-models/{id}` — Get model
- `PUT /api/admin/product-models/{id}` — Update model
- `DELETE /api/admin/product-models/{id}` — Delete model
- **Auth Required**: Yes (admin)

---

## 27. Admin — Orders

### 27.1 List Orders (Admin)
- **Method**: `GET`
- **URL**: `/api/admin/orders`
- **Auth Required**: Yes (admin)
- **Related Pages**: `/admin/orders`

**Query Parameters:**
- `status`: `pending`,`confirmed`,`processing`,`shipped`,`delivered`,`cancelled`
- `payment_status`: `pending`,`paid`,`failed`,`refunded`
- `order_type`: `online`,`in_store`
- `shipping_method`: `pathao_courier`,`auxbeam_team`
- `search`: order number, customer name/email
- `date_from`, `date_to`: date filters
- `sort_by`, `sort_order`, `per_page`

---

### 27.2 Get Order (Admin)
- **Method**: `GET`
- **URL**: `/api/admin/orders/{id}`
- **Auth Required**: Yes (admin)

**Notes:** Returns full order with user, items, addresses, coupon, payments, invoice.

---

### 27.3 Update Order Status
- **Method**: `PUT`
- **URL**: `/api/admin/orders/{id}/status`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Valid Statuses:**
`pending` → `confirmed` → `processing` → `shipped` → `delivered` → `cancelled`

Also supported: `incomplete`, `good_but_no_response`, `advance_payment`, `on_hold`, `ready_to_ship`, `complete`, `return_requested`, `return_approved`, `refunded`

---

### 27.4 Cancel Order (Admin)
- **Method**: `POST`
- **URL**: `/api/admin/orders/{id}/cancel`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{ "reason": "Customer requested cancellation" }
```

---

### 27.5 Assign Tracking Number
- **Method**: `POST`
- **URL**: `/api/admin/orders/{id}/tracking`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{ "tracking_number": "PTH123456789" }
```

---

### 27.6 Update Order Notes
- **Method**: `PUT`
- **URL**: `/api/admin/orders/{id}/notes`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{ "notes": "Customer called, will deliver tomorrow." }
```

---

### 27.7 Download Order Invoice (Admin)
- **Method**: `GET`
- **URL**: `/api/admin/orders/{orderNumber}/invoice`
- **Auth Required**: Yes (admin)
- **Notes**: Returns PDF file download.

---

## 28. Admin — Order Management (Advanced)

### 28.1 Get Incomplete Orders
- **Method**: `GET`
- **URL**: `/api/admin/orders/incomplete`
- **Auth Required**: Yes (admin)

---

### 28.2 Get Hourly Order Report
- **Method**: `GET`
- **URL**: `/api/admin/orders/hourly-report`
- **Auth Required**: Yes (admin)

---

### 28.3 Get Orders by Source
- **Method**: `GET`
- **URL**: `/api/admin/orders/by-source`
- **Auth Required**: Yes (admin)

---

### 28.4 Get Orders by UTM Campaign
- **Method**: `GET`
- **URL**: `/api/admin/orders/by-utm-campaign`
- **Auth Required**: Yes (admin)

---

### 28.5 Get Orders Needing Follow-up
- **Method**: `GET`
- **URL**: `/api/admin/orders/needing-follow-up`
- **Auth Required**: Yes (admin)

---

### 28.6 Get Order Status Statistics
- **Method**: `GET`
- **URL**: `/api/admin/orders/status-statistics`
- **Auth Required**: Yes (admin)

---

### 28.7 Get Order Status History
- **Method**: `GET`
- **URL**: `/api/admin/orders/{id}/status-history`
- **Auth Required**: Yes (admin)

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "from_status": "pending",
      "to_status": "confirmed",
      "note": "Payment verified",
      "user_id": 1,
      "created_at": "2026-05-15T10:05:00.000000Z"
    }
  ]
}
```

---

### 28.8 Complete Follow-up
- **Method**: `POST`
- **URL**: `/api/admin/orders/{id}/complete-follow-up`
- **Auth Required**: Yes (admin)

---

### 28.9 Set Follow-up
- **Method**: `POST`
- **URL**: `/api/admin/orders/{id}/set-follow-up`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{ "follow_up_at": "2026-05-20T10:00:00" }
```

---

## 29. Admin — Order Notes

### 29.1 List Order Notes
- **Method**: `GET`
- **URL**: `/api/admin/orders/{orderId}/notes`
- **Auth Required**: Yes (admin)

---

### 29.2 Create Order Note
- **Method**: `POST`
- **URL**: `/api/admin/orders/{orderId}/notes`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "note": "Customer confirmed delivery address.",
  "note_type": "internal",
  "is_customer_notified": false
}
```

**Note Types:** `internal`, `customer`

---

### 29.3 Update / Delete Order Note
- `PUT /api/admin/orders/{orderId}/notes/{noteId}`
- `DELETE /api/admin/orders/{orderId}/notes/{noteId}`
- **Auth Required**: Yes (admin)

---

## 30. Admin — Order Reminders

### 30.1 List Order Reminders
- **Method**: `GET`
- **URL**: `/api/admin/orders/{orderId}/reminders`
- **Auth Required**: Yes (admin)

---

### 30.2 Create Reminder
- **Method**: `POST`
- **URL**: `/api/admin/orders/{orderId}/reminders`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "title": "Follow up on payment",
  "description": "Customer said they will pay by tomorrow",
  "remind_at": "2026-05-16T10:00:00",
  "assigned_to": 2
}
```

---

### 30.3 Update / Complete / Delete Reminder
- `PUT /api/admin/orders/{orderId}/reminders/{reminderId}`
- `POST /api/admin/orders/{orderId}/reminders/{reminderId}/complete`
- `DELETE /api/admin/orders/{orderId}/reminders/{reminderId}`
- **Auth Required**: Yes (admin)

---

### 30.4 Get Pending Reminders (Global)
- **Method**: `GET`
- **URL**: `/api/admin/reminders/pending`
- **Auth Required**: Yes (admin)

---

### 30.5 Get Upcoming Reminders (Global)
- **Method**: `GET`
- **URL**: `/api/admin/reminders/upcoming`
- **Auth Required**: Yes (admin)

---
## 31. Admin — RBAC (Roles & Permissions)

### 31.1 List Roles
- **Method**: `GET`
- **URL**: `/api/admin/roles`
- **Auth Required**: Yes (admin)

---

### 31.2 Create Role
- **Method**: `POST`
- **URL**: `/api/admin/roles`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "name": "order_manager",
  "display_name": "Order Manager",
  "description": "Can manage orders",
  "permissions": [1, 2, 3]
}
```

---

### 31.3 Get / Update / Delete Role
- `GET /api/admin/roles/{id}`
- `PUT /api/admin/roles/{id}`
- `DELETE /api/admin/roles/{id}`
- **Auth Required**: Yes (admin)

---

### 31.4 Get All Permissions
- **Method**: `GET`
- **URL**: `/api/admin/roles/permissions/all`
- **Auth Required**: Yes (admin)

---

### 31.5 Assign Users to Role
- **Method**: `POST`
- **URL**: `/api/admin/roles/{role}/assign-users`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{ "user_ids": [1, 2, 3] }
```

---

### 31.6 Remove Users from Role
- **Method**: `POST`
- **URL**: `/api/admin/roles/{role}/remove-users`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{ "user_ids": [1, 2] }
```

---

## 32. Admin — POS (Point of Sale)

### 32.1 Search Products (POS)
- **Method**: `GET`
- **URL**: `/api/admin/pos/products/search`
- **Auth Required**: Yes (admin)
- **Related Pages**: `/admin/pos`

**Query Parameters:**
- `q`: Search query (name, SKU)

---

### 32.2 Get Product by SKU
- **Method**: `GET`
- **URL**: `/api/admin/pos/products/sku/{sku}`
- **Auth Required**: Yes (admin)

---

### 32.3 Calculate POS Totals
- **Method**: `POST`
- **URL**: `/api/admin/pos/calculate`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "items": [
    { "product_id": 1, "variation_id": null, "quantity": 2 }
  ],
  "coupon_code": "SAVE10",
  "discount_amount": 0
}
```

---

### 32.4 Create POS Order
- **Method**: `POST`
- **URL**: `/api/admin/pos/orders`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "customer_name": "Walk-in Customer",
  "customer_phone": "+8801700000000",
  "items": [
    { "product_id": 1, "variation_id": null, "quantity": 2, "price": 1500.00 }
  ],
  "payment_method": "cash",
  "coupon_code": null,
  "discount_amount": 0,
  "notes": "In-store purchase"
}
```

---

## 33. Admin — Promotions

### 33.1 Promotions CRUD
- `GET /api/admin/promotions` — List promotions
- `POST /api/admin/promotions` — Create promotion
- `GET /api/admin/promotions/{id}` — Get promotion
- `PUT /api/admin/promotions/{id}` — Update promotion
- `DELETE /api/admin/promotions/{id}` — Delete promotion
- **Auth Required**: Yes (admin)

**Create/Update Request Body:**
```json
{
  "name": "Summer Sale 20%",
  "description": "20% off on all cricket equipment",
  "discount_type": "percentage",
  "discount_value": 20,
  "min_order_amount": 1000.00,
  "max_discount_amount": 500.00,
  "starts_at": "2026-06-01T00:00:00",
  "ends_at": "2026-06-30T23:59:59",
  "is_active": true,
  "applies_to": "specific_products",
  "product_ids": [1, 2, 3]
}
```

---

### 33.2 Toggle Promotion Status
- **Method**: `POST`
- **URL**: `/api/admin/promotions/{id}/toggle`
- **Auth Required**: Yes (admin)

---

## 34. Admin — Coupons

### 34.1 Coupons CRUD
- `GET /api/admin/coupons` — List coupons
- `POST /api/admin/coupons` — Create coupon
- `GET /api/admin/coupons/{id}` — Get coupon
- `PUT /api/admin/coupons/{id}` — Update coupon
- `DELETE /api/admin/coupons/{id}` — Delete coupon
- **Auth Required**: Yes (admin)

**Create/Update Request Body:**
```json
{
  "code": "SAVE10",
  "name": "10% Off",
  "description": "Get 10% off on all orders",
  "discount_type": "percentage",
  "discount_value": 10,
  "min_order_amount": 500.00,
  "max_discount_amount": 500.00,
  "usage_limit": 100,
  "usage_limit_per_user": 1,
  "applies_to": "all",
  "product_ids": [],
  "category_ids": [],
  "starts_at": "2026-01-01T00:00:00",
  "expires_at": "2026-12-31T23:59:59",
  "is_active": true
}
```

**Discount Types:** `percentage`, `fixed`, `free_shipping`

**Applies To:** `all`, `specific_products`, `specific_categories`

---

### 34.2 Get Coupon Usage History
- **Method**: `GET`
- **URL**: `/api/admin/coupons/{id}/usage`
- **Auth Required**: Yes (admin)

---

## 35. Admin — Shipping

### 35.1 Shipping Rates CRUD
- `GET /api/admin/shipping-rates` — List rates
- `POST /api/admin/shipping-rates` — Create rate
- `GET /api/admin/shipping-rates/{id}` — Get rate
- `PUT /api/admin/shipping-rates/{id}` — Update rate
- `DELETE /api/admin/shipping-rates/{id}` — Delete rate
- **Auth Required**: Yes (admin)

**Create/Update Request Body:**
```json
{
  "name": "Pathao Standard",
  "shipping_class_id": null,
  "method": "pathao_courier",
  "country": "Bangladesh",
  "delivery_time": "2-3 business days",
  "free_shipping_min_order": 3000.00,
  "base_cost": 60.00,
  "is_active": true
}
```

---

### 35.2 Shipping Classes CRUD
- `GET /api/admin/shipping-classes` — List classes
- `POST /api/admin/shipping-classes` — Create class
- `PUT /api/admin/shipping-classes/{id}` — Update class
- `DELETE /api/admin/shipping-classes/{id}` — Delete class
- **Auth Required**: Yes (admin)

**Create/Update Request Body:**
```json
{
  "name": "Heavy Equipment",
  "description": "Large and heavy sports equipment"
}
```

---

## 36. Admin — Inventory

### 36.1 List Inventory
- **Method**: `GET`
- **URL**: `/api/admin/inventory`
- **Auth Required**: Yes (admin)
- **Related Pages**: `/admin/inventory`

---

### 36.2 Get Low Stock Products
- **Method**: `GET`
- **URL**: `/api/admin/inventory/low-stock`
- **Auth Required**: Yes (admin)

---

### 36.3 Get Inventory Logs
- **Method**: `GET`
- **URL**: `/api/admin/inventory/logs`
- **Auth Required**: Yes (admin)

---

### 36.4 Get Product Inventory
- **Method**: `GET`
- **URL**: `/api/admin/inventory/{productId}`
- **Auth Required**: Yes (admin)

---

### 36.5 Adjust Inventory
- **Method**: `POST`
- **URL**: `/api/admin/inventory/{productId}/adjust`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "adjustment": 10,
  "reason": "Stock received from supplier",
  "variation_id": null
}
```

**Notes:** Use positive values to add stock, negative to reduce.

---

### 36.6 Bulk Adjust Inventory
- **Method**: `POST`
- **URL**: `/api/admin/inventory/bulk-adjust`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "adjustments": [
    { "product_id": 1, "adjustment": 50, "reason": "Restock" },
    { "product_id": 2, "adjustment": -5, "reason": "Damaged goods" }
  ]
}
```

---
## 37. Admin — Returns & Refunds

### 37.1 List Returns (Admin)
- **Method**: `GET`
- **URL**: `/api/admin/returns`
- **Auth Required**: Yes (admin)
- **Related Pages**: `/admin/returns`

---

### 37.2 Get Return (Admin)
- **Method**: `GET`
- **URL**: `/api/admin/returns/{id}`
- **Auth Required**: Yes (admin)

---

### 37.3 Approve Return
- **Method**: `POST`
- **URL**: `/api/admin/returns/{id}/approve`
- **Auth Required**: Yes (admin)

---

### 37.4 Reject Return
- **Method**: `POST`
- **URL**: `/api/admin/returns/{id}/reject`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{ "reason": "Return window has expired." }
```

---

### 37.5 Process Return
- **Method**: `POST`
- **URL**: `/api/admin/returns/{id}/process`
- **Auth Required**: Yes (admin)

---

### 37.6 List Refunds
- **Method**: `GET`
- **URL**: `/api/admin/refunds`
- **Auth Required**: Yes (admin)

---

### 37.7 Get Refund
- **Method**: `GET`
- **URL**: `/api/admin/refunds/{id}`
- **Auth Required**: Yes (admin)

---

### 37.8 Create Refund
- **Method**: `POST`
- **URL**: `/api/admin/refunds`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "order_id": 123,
  "amount": 1500.00,
  "reason": "Product returned in good condition",
  "refund_method": "original_payment"
}
```

---

### 37.9 Process Refund
- **Method**: `POST`
- **URL**: `/api/admin/refunds/{id}/process`
- **Auth Required**: Yes (admin)

---

### 37.10 Cancel Refund
- **Method**: `POST`
- **URL**: `/api/admin/refunds/{id}/cancel`
- **Auth Required**: Yes (admin)

---

## 38. Admin — Reviews

### 38.1 List Reviews (Admin)
- **Method**: `GET`
- **URL**: `/api/admin/reviews`
- **Auth Required**: Yes (admin)
- **Related Pages**: `/admin/reviews`

**Query Parameters:**
- `status`: `pending`, `approved`, `rejected`
- `product_id`, `user_id`, `rating`
- `per_page`

---

### 38.2 Get Review Statistics
- **Method**: `GET`
- **URL**: `/api/admin/reviews/statistics`
- **Auth Required**: Yes (admin)

---

### 38.3 Get Review
- **Method**: `GET`
- **URL**: `/api/admin/reviews/{id}`
- **Auth Required**: Yes (admin)

---

### 38.4 Approve Review
- **Method**: `POST`
- **URL**: `/api/admin/reviews/{id}/approve`
- **Auth Required**: Yes (admin)

---

### 38.5 Reject Review
- **Method**: `POST`
- **URL**: `/api/admin/reviews/{id}/reject`
- **Auth Required**: Yes (admin)

---

### 38.6 Respond to Review
- **Method**: `POST`
- **URL**: `/api/admin/reviews/{id}/respond`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{ "response": "Thank you for your feedback! We are glad you enjoyed the product." }
```

---

### 38.7 Delete Review
- **Method**: `DELETE`
- **URL**: `/api/admin/reviews/{id}`
- **Auth Required**: Yes (admin)

---

## 39. Admin — Campaigns

### 39.1 Campaigns CRUD
- `GET /api/admin/campaigns` — List campaigns
- `POST /api/admin/campaigns` — Create campaign
- `GET /api/admin/campaigns/{id}` — Get campaign
- `PUT /api/admin/campaigns/{id}` — Update campaign
- `DELETE /api/admin/campaigns/{id}` — Delete campaign
- **Auth Required**: Yes (admin)

**Create/Update Request Body:**
```json
{
  "name": "Summer Newsletter",
  "subject": "Exclusive Summer Deals!",
  "content": "<p>HTML email content...</p>",
  "type": "email",
  "target_segment": "all",
  "segment_ids": [],
  "scheduled_at": "2026-06-01T09:00:00",
  "is_active": true
}
```

---

### 39.2 Send Campaign
- **Method**: `POST`
- **URL**: `/api/admin/campaigns/{id}/send`
- **Auth Required**: Yes (admin)

---

### 39.3 Get Campaign Statistics
- **Method**: `GET`
- **URL**: `/api/admin/campaigns/{id}/statistics`
- **Auth Required**: Yes (admin)

---

### 39.4 Preview Campaign Recipients
- **Method**: `POST`
- **URL**: `/api/admin/campaigns/preview-recipients`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "target_segment": "specific",
  "segment_ids": [1, 2]
}
```

---

## 40. Admin — Content Management

### 40.1 Policies
- `GET /api/admin/content/policies` — List policies
- `GET /api/admin/content/policies/{id}` — Get policy
- `POST /api/admin/content/policies` — Create policy
- `PUT /api/admin/content/policies/{id}` — Update policy
- **Auth Required**: Yes (admin)

**Create/Update Request Body:**
```json
{
  "type": "privacy_policy",
  "title": "Privacy Policy",
  "content": "<p>HTML content...</p>",
  "is_active": true
}
```

---

### 40.2 CMS Pages
- `GET /api/admin/content/pages` — List pages
- `GET /api/admin/content/pages/{id}` — Get page
- `POST /api/admin/content/pages` — Create page
- `PUT /api/admin/content/pages/{id}` — Update page
- `DELETE /api/admin/content/pages/{id}` — Delete page
- **Auth Required**: Yes (admin)

---

### 40.3 Banners
- `GET /api/admin/content/banners` — List banners
- `POST /api/admin/content/banners` — Create banner
- `PUT /api/admin/content/banners/{id}` — Update banner
- `DELETE /api/admin/content/banners/{id}` — Delete banner
- **Auth Required**: Yes (admin)

**Create/Update Request Body:**
```json
{
  "title": "Summer Sale",
  "subtitle": "Up to 50% off",
  "image": "banners/summer.jpg",
  "link": "/shop?sale=true",
  "position": "hero",
  "is_active": true,
  "sort_order": 1,
  "starts_at": "2026-06-01T00:00:00",
  "ends_at": "2026-06-30T23:59:59"
}
```

---

## 41. Admin — Reports

### 41.1 Sales Report
- **Method**: `GET`
- **URL**: `/api/admin/reports/sales`
- **Auth Required**: Yes (admin)
- **Related Pages**: `/admin/reports/sales`

**Query Parameters:**
- `date_from` (optional): Start date
- `date_to` (optional): End date
- `group_by` (optional): `day`, `week`, `month`, `year`

**Success Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_orders": 250,
      "total_revenue": 850000.00,
      "total_discounts": 45000.00,
      "average_order_value": 3400.00
    },
    "chart_data": [
      {
        "period": "2026-05-15",
        "order_count": 12,
        "total_sales": 45000.00,
        "total_discounts": 2000.00,
        "average_order_value": 3750.00
      }
    ],
    "date_range": {
      "from": "2026-04-15",
      "to": "2026-05-15"
    }
  }
}
```

---

### 41.2 Product Performance Report
- **Method**: `GET`
- **URL**: `/api/admin/reports/products`
- **Auth Required**: Yes (admin)

**Query Parameters:** `date_from`, `date_to`, `limit` (default 20)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "top_products": [
      {
        "product_id": 1,
        "product_name": "Cricket Bat",
        "total_quantity": 150,
        "total_revenue": 225000.00,
        "order_count": 75
      }
    ],
    "low_stock": [
      { "id": 5, "name": "Football", "sku": "FB-001", "quantity": 3, "low_stock_threshold": 10 }
    ]
  }
}
```

---

### 41.3 Customer Report
- **Method**: `GET`
- **URL**: `/api/admin/reports/customers`
- **Auth Required**: Yes (admin)

**Query Parameters:** `date_from`, `date_to`, `limit`

---

### 41.4 Inventory Report
- **Method**: `GET`
- **URL**: `/api/admin/reports/inventory`
- **Auth Required**: Yes (admin)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_products": 500,
      "active_products": 450,
      "out_of_stock": 15,
      "low_stock": 25,
      "total_stock_value": 5000000.00
    },
    "by_category": [
      { "category": "Cricket", "product_count": 120, "total_stock": 3500 }
    ]
  }
}
```

---

### 41.5 Order Status Report
- **Method**: `GET`
- **URL**: `/api/admin/reports/order-status`
- **Auth Required**: Yes (admin)

**Query Parameters:** `date_from`, `date_to`

---

## 42. Admin — Flash Deals

### 42.1 Flash Deals CRUD
- `GET /api/admin/flash-deals` — List
- `POST /api/admin/flash-deals` — Create
- `GET /api/admin/flash-deals/{id}` — Get
- `PUT /api/admin/flash-deals/{id}` — Update
- `DELETE /api/admin/flash-deals/{id}` — Delete
- **Auth Required**: Yes (admin)

**Create/Update Request Body:**
```json
{
  "title": "Summer Flash Sale",
  "description": "Limited time offers",
  "starts_at": "2026-06-01T00:00:00",
  "ends_at": "2026-06-01T23:59:59",
  "is_active": true,
  "priority": 1,
  "products": [
    { "product_id": 1, "flash_price": 999.00, "quantity_limit": 50 }
  ]
}
```

---

### 42.2 Toggle Flash Deal Status
- **Method**: `POST`
- **URL**: `/api/admin/flash-deals/{id}/toggle`
- **Auth Required**: Yes (admin)

---

### 42.3 Get Flash Deal Statistics
- **Method**: `GET`
- **URL**: `/api/admin/flash-deals/{id}/statistics`
- **Auth Required**: Yes (admin)

---

## 43. Admin — Galleries

### 43.1 Galleries CRUD
- `GET /api/admin/galleries` — List
- `POST /api/admin/galleries` — Create
- `GET /api/admin/galleries/{id}` — Get
- `PUT /api/admin/galleries/{id}` — Update
- `DELETE /api/admin/galleries/{id}` — Delete
- **Auth Required**: Yes (admin)

---

### 43.2 Gallery Image Management
- `POST /api/admin/galleries/{id}/images` — Add image
- `PUT /api/admin/galleries/{galleryId}/images/{imageId}` — Update image
- `DELETE /api/admin/galleries/{galleryId}/images/{imageId}` — Delete image
- **Auth Required**: Yes (admin)

---
## 44. Admin — Dynamic Pages

### 44.1 Get Page Templates
- **Method**: `GET`
- **URL**: `/api/admin/page-templates`
- **Auth Required**: Yes (admin)

---

### 44.2 Get Templates by Category
- **Method**: `GET`
- **URL**: `/api/admin/page-templates/category/{category}`
- **Auth Required**: Yes (admin)

---

### 44.3 Get Templates by Page Type
- **Method**: `GET`
- **URL**: `/api/admin/page-templates/page-type/{pageType}`
- **Auth Required**: Yes (admin)

---

### 44.4 Get Template Schema
- **Method**: `GET`
- **URL**: `/api/admin/page-templates/{templateType}/schema`
- **Auth Required**: Yes (admin)

---

### 44.5 Pages CRUD
- `GET /api/admin/pages` — List pages
- `POST /api/admin/pages` — Create page
- `GET /api/admin/pages/{page}` — Get page
- `PUT /api/admin/pages/{page}` — Update page
- `DELETE /api/admin/pages/{page}` — Delete page
- **Auth Required**: Yes (admin)

---

### 44.6 Duplicate Page
- **Method**: `POST`
- **URL**: `/api/admin/pages/{page}/duplicate`
- **Auth Required**: Yes (admin)

---

### 44.7 Page Sections Management
- `GET /api/admin/pages/{page}/sections` — List sections
- `POST /api/admin/pages/{page}/sections` — Add section
- `GET /api/admin/pages/{page}/sections/{section}` — Get section
- `PUT /api/admin/pages/{page}/sections/{section}` — Update section
- `DELETE /api/admin/pages/{page}/sections/{section}` — Delete section
- `POST /api/admin/pages/{page}/sections/reorder` — Reorder sections
- **Auth Required**: Yes (admin)

---

## 45. Admin — Media Library

### 45.1 Media CRUD
- `GET /api/admin/media` — List media
- `POST /api/admin/media` — Upload media
- `GET /api/admin/media/{id}` — Get media
- `PUT /api/admin/media/{id}` — Update media
- `DELETE /api/admin/media/{id}` — Delete media
- **Auth Required**: Yes (admin)
- **Content-Type**: `multipart/form-data` for upload

**Upload Request Body:**
- `file`: Image/file (required)
- `alt_text`: string (optional)
- `folder`: string (optional, e.g., `products`, `banners`)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "image.jpg",
    "path": "media/image.jpg",
    "full_url": "http://localhost:8000/storage/media/image.jpg",
    "mime_type": "image/jpeg",
    "size": 102400,
    "alt_text": "Product image",
    "created_at": "2026-05-15T10:00:00.000000Z"
  }
}
```

---

## 46. Admin — Notifications

### 46.1 List Admin Notifications
- **Method**: `GET`
- **URL**: `/api/admin/notifications`
- **Auth Required**: Yes (admin)

---

### 46.2 Get Unread Count
- **Method**: `GET`
- **URL**: `/api/admin/notifications/unread-count`
- **Auth Required**: Yes (admin)

---

### 46.3 Mark as Read / Mark All as Read / Delete / Clear
- `POST /api/admin/notifications/{id}/mark-as-read`
- `POST /api/admin/notifications/mark-all-as-read`
- `DELETE /api/admin/notifications/{id}`
- `POST /api/admin/notifications/clear`
- **Auth Required**: Yes (admin)

---

## 47. Admin — Page Content Management

### 47.1 List Page Contents
- **Method**: `GET`
- **URL**: `/api/admin/page-contents`
- **Auth Required**: Yes (admin)

---

### 47.2 Create Page Content
- **Method**: `POST`
- **URL**: `/api/admin/page-contents`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "page_key": "homepage",
  "section_key": "hero_banner",
  "content_type": "banner",
  "title": "Welcome to Auxbeam",
  "content": { "image": "banners/hero.jpg", "cta": "Shop Now" },
  "sort_order": 1,
  "is_active": true
}
```

---

### 47.3 Get / Update / Delete Page Content
- `GET /api/admin/page-contents/{id}`
- `PUT /api/admin/page-contents/{id}`
- `DELETE /api/admin/page-contents/{id}`
- **Auth Required**: Yes (admin)

---

### 47.4 Get Page Content by Key
- **Method**: `GET`
- **URL**: `/api/admin/page-contents/page/{pageKey}`
- **Auth Required**: Yes (admin)

---

### 47.5 Update Sort Order
- **Method**: `POST`
- **URL**: `/api/admin/page-contents/sort-order`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "items": [
    { "id": 1, "sort_order": 0 },
    { "id": 2, "sort_order": 1 }
  ]
}
```

---

## 48. Admin — Visitor Popups

### 48.1 List Visitor Popups
- **Method**: `GET`
- **URL**: `/api/admin/visitor-popups`
- **Auth Required**: Yes (admin)

---

### 48.2 Get Popup Statistics
- **Method**: `GET`
- **URL**: `/api/admin/visitor-popups/statistics`
- **Auth Required**: Yes (admin)

---

### 48.3 Export Popup Data
- **Method**: `GET`
- **URL**: `/api/admin/visitor-popups/export`
- **Auth Required**: Yes (admin)
- **Notes**: Returns CSV file download.

---

### 48.4 Get Single Popup Entry
- **Method**: `GET`
- **URL**: `/api/admin/visitor-popups/{id}`
- **Auth Required**: Yes (admin)

---

## 49. Admin — Customer Segmentation

### 49.1 List Customer Segments
- **Method**: `GET`
- **URL**: `/api/admin/customer-segments`
- **Auth Required**: Yes (admin)

---

### 49.2 Create Customer Segment
- **Method**: `POST`
- **URL**: `/api/admin/customer-segments`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "name": "VIP Customers",
  "description": "Customers who spent over 50,000 BDT",
  "criteria": {
    "min_total_spent": 50000,
    "min_order_count": 5
  },
  "is_active": true
}
```

---

### 49.3 Get / Update / Delete Segment
- `GET /api/admin/customer-segments/{id}`
- `PUT /api/admin/customer-segments/{id}`
- `DELETE /api/admin/customer-segments/{id}`
- **Auth Required**: Yes (admin)

---

### 49.4 Get Segment Customers
- **Method**: `GET`
- **URL**: `/api/admin/customer-segments/{id}/customers`
- **Auth Required**: Yes (admin)

---

### 49.5 Assign / Remove Customers
- `POST /api/admin/customer-segments/{id}/assign-customers`
- `POST /api/admin/customer-segments/{id}/remove-customers`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{ "user_ids": [1, 2, 3] }
```

---

### 49.6 Auto-Assign All Customers
- **Method**: `POST`
- **URL**: `/api/admin/customer-segments/auto-assign-all`
- **Auth Required**: Yes (admin)

---

### 49.7 Special Segment Views
- `GET /api/admin/customer-segments/vip/customers` — VIP customers
- `GET /api/admin/customer-segments/cod-risk/customers` — COD risk customers
- `GET /api/admin/customer-segments/repeat/customers` — Repeat customers
- **Auth Required**: Yes (admin)

---

## 50. Admin — Customer Tags

### 50.1 Customer Tags CRUD
- `GET /api/admin/customer-tags` — List tags
- `POST /api/admin/customer-tags` — Create tag
- `GET /api/admin/customer-tags/{id}` — Get tag
- `PUT /api/admin/customer-tags/{id}` — Update tag
- `DELETE /api/admin/customer-tags/{id}` — Delete tag
- **Auth Required**: Yes (admin)

**Create/Update Request Body:**
```json
{
  "name": "Loyal Customer",
  "color": "#FFD700",
  "description": "Customers with 10+ orders"
}
```

---

### 50.2 Assign / Remove Tags from Customers
- `POST /api/admin/customer-tags/{id}/assign-to-customers`
- `POST /api/admin/customer-tags/{id}/remove-from-customers`
- **Auth Required**: Yes (admin)

---

### 50.3 Get Tag Customers
- **Method**: `GET`
- **URL**: `/api/admin/customer-tags/{id}/customers`
- **Auth Required**: Yes (admin)

---

## 51. Admin — Customer Analytics

### 51.1 Analytics Dashboard
- **Method**: `GET`
- **URL**: `/api/admin/customer-analytics/dashboard`
- **Auth Required**: Yes (admin)

---

### 51.2 Customer Growth Report
- **Method**: `GET`
- **URL**: `/api/admin/customer-analytics/growth-report`
- **Auth Required**: Yes (admin)

---

### 51.3 LTV Distribution
- **Method**: `GET`
- **URL**: `/api/admin/customer-analytics/ltv-distribution`
- **Auth Required**: Yes (admin)

---

### 51.4 Customer Spending Summary
- **Method**: `GET`
- **URL**: `/api/admin/customer-analytics/{customerId}/spending-summary`
- **Auth Required**: Yes (admin)

---

### 51.5 Calculate Customer Analytics
- **Method**: `POST`
- **URL**: `/api/admin/customer-analytics/{customerId}/calculate`
- **Auth Required**: Yes (admin)

---
## 52. Admin — SMS Management

### 52.1 SMS Templates
- `GET /api/admin/sms/templates` — List templates
- `POST /api/admin/sms/templates` — Create template
- `PUT /api/admin/sms/templates/{id}` — Update template
- `DELETE /api/admin/sms/templates/{id}` — Delete template
- **Auth Required**: Yes (admin)

**Create/Update Request Body:**
```json
{
  "name": "Order Confirmed",
  "slug": "order_confirmed",
  "content": "Dear {customer_name}, your order {order_number} has been confirmed. Total: {total_amount} BDT.",
  "variables": ["customer_name", "order_number", "total_amount"],
  "is_active": true
}
```

---

### 52.2 SMS Logs
- `GET /api/admin/sms/logs` — List logs
- `POST /api/admin/sms/logs/{id}/retry` — Retry failed SMS
- **Auth Required**: Yes (admin)

---

### 52.3 SMS Configurations
- `GET /api/admin/sms/configurations` — List configurations
- `POST /api/admin/sms/configurations` — Create configuration
- `PUT /api/admin/sms/configurations/{id}` — Update configuration
- `DELETE /api/admin/sms/configurations/{id}` — Delete configuration
- **Auth Required**: Yes (admin)

**Create/Update Request Body:**
```json
{
  "provider": "twilio",
  "api_key": "...",
  "api_secret": "...",
  "sender_id": "AUXBEAM",
  "is_active": true,
  "is_default": true
}
```

---

### 52.4 Send SMS
- **Method**: `POST`
- **URL**: `/api/admin/sms/send`
- **Auth Required**: Yes (admin)

**Request Body:**
```json
{
  "phone": "+8801700000000",
  "message": "Your order has been shipped.",
  "template_id": 1,
  "variables": {
    "customer_name": "John",
    "order_number": "SS20260515ABCD"
  }
}
```

---

### 52.5 SMS Statistics
- **Method**: `GET`
- **URL**: `/api/admin/sms/statistics`
- **Auth Required**: Yes (admin)

---

## 53. Admin — Enhanced Reports

### 53.1 Profit Report
- **Method**: `GET`
- **URL**: `/api/admin/enhanced-reports/profit`
- **Auth Required**: Yes (admin)

**Query Parameters:** `date_from`, `date_to`, `group_by`

---

### 53.2 COD vs Paid Report
- **Method**: `GET`
- **URL**: `/api/admin/enhanced-reports/cod-vs-paid`
- **Auth Required**: Yes (admin)

---

### 53.3 Customer Growth Report
- **Method**: `GET`
- **URL**: `/api/admin/enhanced-reports/customer-growth`
- **Auth Required**: Yes (admin)

---

### 53.4 Product Performance Report
- **Method**: `GET`
- **URL**: `/api/admin/enhanced-reports/product-performance`
- **Auth Required**: Yes (admin)

---

### 53.5 Order Source Report
- **Method**: `GET`
- **URL**: `/api/admin/enhanced-reports/order-source`
- **Auth Required**: Yes (admin)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "by_source": {
      "website": 150,
      "facebook": 45,
      "instagram": 30,
      "whatsapp": 20,
      "phone_call": 5
    }
  }
}
```

---

### 53.6 UTM Campaign Report
- **Method**: `GET`
- **URL**: `/api/admin/enhanced-reports/utm-campaign`
- **Auth Required**: Yes (admin)

---

## 54. Admin — Analytics

### 54.1 Analytics Dashboard
- **Method**: `GET`
- **URL**: `/api/admin/analytics/dashboard`
- **Auth Required**: Yes (admin)
- **Related Pages**: `/admin/analytics`

---

### 54.2 Visitor Analytics
- **Method**: `GET`
- **URL**: `/api/admin/analytics/visitors`
- **Auth Required**: Yes (admin)

**Query Parameters:** `date_from`, `date_to`, `per_page`

---

### 54.3 Get Visitor Details
- **Method**: `GET`
- **URL**: `/api/admin/analytics/visitors/{id}`
- **Auth Required**: Yes (admin)

---

### 54.4 Product Views Analytics
- **Method**: `GET`
- **URL**: `/api/admin/analytics/product-views`
- **Auth Required**: Yes (admin)

---

### 54.5 Checkout Funnel Analytics
- **Method**: `GET`
- **URL**: `/api/admin/analytics/checkout-funnel`
- **Auth Required**: Yes (admin)

**Success Response:**
```json
{
  "success": true,
  "data": {
    "product_views": 5000,
    "add_to_cart": 1200,
    "checkout_started": 450,
    "orders_placed": 250,
    "conversion_rate": 5.0
  }
}
```

---

### 54.6 Abandoned Carts
- **Method**: `GET`
- **URL**: `/api/admin/analytics/abandoned-carts`
- **Auth Required**: Yes (admin)

---

### 54.7 Cart Events
- **Method**: `GET`
- **URL**: `/api/admin/analytics/cart-events`
- **Auth Required**: Yes (admin)

---

### 54.8 Search Analytics
- **Method**: `GET`
- **URL**: `/api/admin/analytics/search`
- **Auth Required**: Yes (admin)

---

### 54.9 Page Views Analytics
- **Method**: `GET`
- **URL**: `/api/admin/analytics/page-views`
- **Auth Required**: Yes (admin)

---

### 54.10 Export Analytics Data
- **Method**: `GET`
- **URL**: `/api/admin/analytics/export`
- **Auth Required**: Yes (admin)
- **Notes**: Returns CSV file download.

---

# Complete Endpoint Reference

## Quick Reference Table

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/sanctum/csrf-cookie` | No | Initialize CSRF |
| GET | `/api/auth/csrf-token` | No | Get CSRF token |
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/auth/user` | Yes | Get current user |
| PUT | `/api/auth/profile` | Yes | Update profile |
| PUT | `/api/auth/password` | Yes | Change password |
| POST | `/api/auth/forgot-password` | No | Forgot password |
| POST | `/api/auth/reset-password` | No | Reset password (token) |
| POST | `/api/auth/send-otp` | No | Send OTP |
| POST | `/api/auth/send-registration-otp` | No | Send registration OTP |
| POST | `/api/auth/verify-otp` | No | Verify OTP |
| POST | `/api/auth/reset-password-otp` | No | Reset password (OTP) |
| POST | `/api/auth/google/callback` | No | Google OAuth |
| GET | `/api/catalog/categories` | No | List categories |
| GET | `/api/catalog/categories/{slug}` | No | Get category |
| GET | `/api/catalog/categories/{slug}/products` | No | Products by category |
| GET | `/api/catalog/brands` | No | List brands |
| GET | `/api/catalog/brands/{slug}/products` | No | Products by brand |
| GET | `/api/catalog/products` | No | Search products |
| GET | `/api/catalog/products/featured` | No | Featured products |
| GET | `/api/catalog/products/trending` | No | Trending products |
| GET | `/api/catalog/products/{slug}` | No | Get product |
| GET | `/api/flash-deals` | No | Active flash deals |
| GET | `/api/flash-deals/upcoming` | No | Upcoming flash deals |
| GET | `/api/flash-deals/{id}` | No | Get flash deal |
| GET | `/api/galleries` | No | List galleries |
| GET | `/api/galleries/{slug}` | No | Get gallery |
| POST | `/api/cart/summary` | No | Cart summary |
| POST | `/api/cart/validate-coupon` | No | Validate coupon |
| POST | `/api/cart/check-availability` | No | Check availability |
| GET | `/api/cart/available-coupons` | No | Available coupons |
| GET | `/api/products/{id}/reviews` | No | Product reviews |
| GET | `/api/policies` | No | All policies |
| GET | `/api/policies/{type}` | No | Policy by type |
| GET | `/api/pages/{slug}` | No | Page by slug |
| GET | `/api/banners/{position?}` | No | Banners |
| GET | `/api/page-content/{pageKey}` | No | Page content |
| GET | `/api/orders/{orderNumber}/track` | No | Track order |
| GET | `/api/orders/{orderNumber}` | No | Order details |
| POST | `/api/checkout/shipping-methods` | No | Shipping methods |
| POST | `/api/checkout/preview` | No | Checkout preview |
| POST | `/api/checkout/process` | No | Process checkout |
| GET | `/api/payments/{orderNumber}/status` | No | Payment status |
| POST | `/api/payments/{orderNumber}/retry` | Yes | Retry payment |
| GET | `/api/orders` | Yes | My orders |
| POST | `/api/orders/{orderNumber}/cancel` | Yes | Cancel order |
| GET | `/api/orders/{orderNumber}/invoice` | Yes | Download invoice |
| POST | `/api/reviews` | Yes | Submit review |
| GET | `/api/reviews/my-reviews` | Yes | My reviews |
| GET | `/api/reviews/order/{orderNumber}` | Yes | Order reviews |
| POST | `/api/reviews/{id}/helpful` | Yes | Mark helpful |
| GET | `/api/returns` | Yes | My returns |
| POST | `/api/returns` | Yes | Submit return |
| GET | `/api/returns/{id}` | Yes | Get return |
| GET | `/api/dashboard` | Yes | User dashboard |
| GET | `/api/profile` | Yes | User profile |
| GET | `/api/addresses` | Yes | List addresses |
| POST | `/api/addresses` | Yes | Create address |
| GET | `/api/addresses/{id}` | Yes | Get address |
| PUT | `/api/addresses/{id}` | Yes | Update address |
| DELETE | `/api/addresses/{id}` | Yes | Delete address |
| POST | `/api/addresses/{id}/set-default` | Yes | Set default |
| GET | `/api/wishlist` | Yes | Get wishlist |
| POST | `/api/wishlist` | Yes | Add to wishlist |
| DELETE | `/api/wishlist/{id}` | Yes | Remove from wishlist |
| DELETE | `/api/wishlist/product/{productId}` | Yes | Remove by product |
| GET | `/api/wishlist/check/{productId}` | Yes | Check wishlist |
| POST | `/api/wishlist/clear` | Yes | Clear wishlist |
| GET | `/api/notifications` | Yes | Get notifications |
| GET | `/api/notifications/unread-count` | Yes | Unread count |
| POST | `/api/notifications/{id}/mark-as-read` | Yes | Mark read |
| POST | `/api/notifications/mark-all-as-read` | Yes | Mark all read |
| DELETE | `/api/notifications/{id}` | Yes | Delete notification |
| POST | `/api/notifications/clear` | Yes | Clear all |
| GET | `/api/admin/dashboard` | Admin | Admin dashboard |
| GET | `/api/admin/users` | Admin | List users |
| POST | `/api/admin/users` | Admin | Create user |
| GET | `/api/admin/users/{id}` | Admin | Get user |
| PUT | `/api/admin/users/{id}` | Admin | Update user |
| DELETE | `/api/admin/users/{id}` | Admin | Delete user |
| POST | `/api/admin/users/{id}/toggle-status` | Admin | Toggle status |
| GET | `/api/admin/categories/tree` | Admin | Category tree |
| GET | `/api/admin/categories` | Admin | List categories |
| POST | `/api/admin/categories` | Admin | Create category |
| GET | `/api/admin/products` | Admin | List products |
| POST | `/api/admin/products` | Admin | Create product |
| GET | `/api/admin/products/{id}` | Admin | Get product |
| PUT | `/api/admin/products/{id}` | Admin | Update product |
| DELETE | `/api/admin/products/{id}` | Admin | Delete product |
| GET | `/api/admin/orders` | Admin | List orders |
| GET | `/api/admin/orders/{id}` | Admin | Get order |
| PUT | `/api/admin/orders/{id}/status` | Admin | Update status |
| POST | `/api/admin/orders/{id}/cancel` | Admin | Cancel order |
| POST | `/api/admin/orders/{id}/tracking` | Admin | Assign tracking |
| GET | `/api/admin/reports/sales` | Admin | Sales report |
| GET | `/api/admin/reports/products` | Admin | Product report |
| GET | `/api/admin/reports/customers` | Admin | Customer report |
| GET | `/api/admin/reports/inventory` | Admin | Inventory report |
| GET | `/api/admin/analytics/dashboard` | Admin | Analytics dashboard |

---

# Frontend Integration Notes

## CSRF Setup (Required Before Any Mutating Request)

```typescript
// Initialize CSRF cookie on app load
await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
```

## Axios Configuration

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Auto-attach XSRF token from cookie
api.interceptors.request.use((config) => {
  const token = getCookie('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
  }
  return config;
});
```

## Image URLs

All product/banner images are served from:
```
http://localhost:8000/storage/{path}
```

The `full_url` field on image objects already contains the complete URL.

## Order Number Format

Orders use the format: `SS{YYYYMMDD}{4-char-random}` (e.g., `SS20260515ABCD`)

## Order Statuses

| Status | Display |
|--------|---------|
| `pending` | Pending |
| `confirmed` | Confirmed |
| `processing` | Processing |
| `incomplete` | Incomplete |
| `good_but_no_response` | Good but No Response |
| `advance_payment` | Advance Payment |
| `on_hold` | On Hold |
| `ready_to_ship` | Ready to Ship |
| `shipped` | Shipped |
| `complete` | Complete |
| `cancelled` | Cancelled |
| `return_requested` | Return Requested |
| `return_approved` | Return Approved |
| `refunded` | Refunded |

## Payment Statuses

| Status | Description |
|--------|-------------|
| `pending` | Payment not yet made |
| `paid` | Payment successful |
| `failed` | Payment failed |
| `refunded` | Payment refunded |
| `deposit_paid` | Preorder deposit paid |
| `fully_paid` | Preorder fully paid |

## User Types

| Type | Description |
|------|-------------|
| `customer` | Regular customer |
| `admin` | Administrator |

## Address Types

| Type | Description |
|------|-------------|
| `user_address` | General address |
| `shipping_address` | Shipping address |
| `billing_address` | Billing address |

---

*Documentation generated from Laravel backend source analysis — Auxbeam E-Commerce Platform*
