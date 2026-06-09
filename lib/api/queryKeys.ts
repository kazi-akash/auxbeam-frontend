// ─────────────────────────────────────────────────────────────────────────────
// Centralised TanStack Query key factory
// Keeps cache invalidation consistent across the entire app.
// ─────────────────────────────────────────────────────────────────────────────

export const queryKeys = {
  // Auth
  auth: {
    user: () => ['auth', 'user'] as const,
    csrf: () => ['auth', 'csrf'] as const,
  },

  // Catalog — public
  catalog: {
    categories: () => ['catalog', 'categories'] as const,
    category: (slug: string) => ['catalog', 'category', slug] as const,
    categoryProducts: (slug: string, filters?: object) =>
      ['catalog', 'category', slug, 'products', filters] as const,
    brands: () => ['catalog', 'brands'] as const,
    brandProducts: (slug: string, filters?: object) =>
      ['catalog', 'brand', slug, 'products', filters] as const,
    products: (filters?: object) => ['catalog', 'products', filters] as const,
    product: (slug: string) => ['catalog', 'product', slug] as const,
    featuredProducts: () => ['catalog', 'products', 'featured'] as const,
    trendingProducts: () => ['catalog', 'products', 'trending'] as const,
  },

  // Flash deals — public
  flashDeals: {
    active: () => ['flash-deals', 'active'] as const,
    upcoming: () => ['flash-deals', 'upcoming'] as const,
    single: (id: number) => ['flash-deals', id] as const,
  },

  // Galleries — public
  galleries: {
    all: () => ['galleries'] as const,
    single: (slug: string) => ['galleries', slug] as const,
  },

  // Cart — public
  cart: {
    availableCoupons: () => ['cart', 'available-coupons'] as const,
  },

  // Services — public
  services: {
    all: () => ['services'] as const,
    product: (productId: number) => ['services', 'product', productId] as const,
    paymentMethods: (deliveryType: string) => ['services', 'payment-methods', deliveryType] as const,
  },

  // Reviews — public
  reviews: {
    product: (productId: number, filters?: object) =>
      ['reviews', 'product', productId, filters] as const,
  },

  // Content — public
  content: {
    policies: () => ['content', 'policies'] as const,
    policy: (type: string) => ['content', 'policy', type] as const,
    page: (slug: string) => ['content', 'page', slug] as const,
    pagesByType: (type: string) => ['content', 'pages', 'type', type] as const,
    banners: (position?: string) => ['content', 'banners', position] as const,
    pageContent: (key: string) => ['content', 'page-content', key] as const,
    brandPageContent: (brandSlug: string) =>
      ['content', 'page-content', 'brand', brandSlug] as const,
  },

  // Orders — public & customer
  orders: {
    track: (orderNumber: string) => ['orders', 'track', orderNumber] as const,
    detail: (orderNumber: string) => ['orders', orderNumber] as const,
    myOrders: (filters?: object) => ['orders', 'my', filters] as const,
    invoice: (orderNumber: string) => ['orders', orderNumber, 'invoice'] as const,
    statusHistory: (id: number) => ['orders', id, 'status-history'] as const,
  },

  // Payments
  payments: {
    status: (orderNumber: string) => ['payments', orderNumber, 'status'] as const,
  },

  // Customer — dashboard & profile
  customer: {
    dashboard: () => ['customer', 'dashboard'] as const,
    profile: () => ['customer', 'profile'] as const,
  },

  // Addresses
  addresses: {
    all: () => ['addresses'] as const,
    single: (id: number) => ['addresses', id] as const,
  },

  // Wishlist
  wishlist: {
    all: () => ['wishlist'] as const,
    check: (productId: number) => ['wishlist', 'check', productId] as const,
  },

  // Customer reviews
  myReviews: {
    all: (filters?: object) => ['my-reviews', filters] as const,
    orderReviewable: (orderNumber: string) =>
      ['my-reviews', 'order', orderNumber] as const,
  },

  // Returns
  returns: {
    all: () => ['returns'] as const,
    single: (id: number) => ['returns', id] as const,
  },

  // Notifications
  notifications: {
    all: (filters?: object) => ['notifications', filters] as const,
    unreadCount: () => ['notifications', 'unread-count'] as const,
  },

  // ─── Admin ──────────────────────────────────────────────────────────────────

  admin: {
    dashboard: () => ['admin', 'dashboard'] as const,

    users: {
      list: (filters?: object) => ['admin', 'users', filters] as const,
      single: (id: number) => ['admin', 'users', id] as const,
    },

    categories: {
      tree: () => ['admin', 'categories', 'tree'] as const,
      list: (filters?: object) => ['admin', 'categories', filters] as const,
      single: (id: number) => ['admin', 'categories', id] as const,
    },

    products: {
      list: (filters?: object) => ['admin', 'products', filters] as const,
      single: (id: number) => ['admin', 'products', id] as const,
      imports: {
        list: () => ['admin', 'products', 'imports'] as const,
        single: (id: number) => ['admin', 'products', 'imports', id] as const,
        errors: (id: number) => ['admin', 'products', 'imports', id, 'errors'] as const,
      },
    },

    variations: {
      list: () => ['admin', 'variations'] as const,
      single: (id: number) => ['admin', 'variations', id] as const,
      options: (variationId: number) =>
        ['admin', 'variations', variationId, 'options'] as const,
    },

    brands: {
      list: (filters?: object) => ['admin', 'brands', filters] as const,
      single: (id: number) => ['admin', 'brands', id] as const,
    },

    productModels: {
      list: () => ['admin', 'product-models'] as const,
      single: (id: number) => ['admin', 'product-models', id] as const,
    },

    orders: {
      list: (filters?: object) => ['admin', 'orders', filters] as const,
      single: (id: number) => ['admin', 'orders', id] as const,
      incomplete: () => ['admin', 'orders', 'incomplete'] as const,
      hourlyReport: () => ['admin', 'orders', 'hourly-report'] as const,
      bySource: () => ['admin', 'orders', 'by-source'] as const,
      byUtmCampaign: () => ['admin', 'orders', 'by-utm-campaign'] as const,
      needingFollowUp: () => ['admin', 'orders', 'needing-follow-up'] as const,
      statusStatistics: () => ['admin', 'orders', 'status-statistics'] as const,
      statusHistory: (id: number) => ['admin', 'orders', id, 'status-history'] as const,
      notes: (orderId: number) => ['admin', 'orders', orderId, 'notes'] as const,
      reminders: (orderId: number) => ['admin', 'orders', orderId, 'reminders'] as const,
    },

    reminders: {
      pending: () => ['admin', 'reminders', 'pending'] as const,
      upcoming: () => ['admin', 'reminders', 'upcoming'] as const,
    },

    roles: {
      list: () => ['admin', 'roles'] as const,
      single: (id: number) => ['admin', 'roles', id] as const,
      permissions: () => ['admin', 'roles', 'permissions'] as const,
    },

    pos: {
      productSearch: (q: string) => ['admin', 'pos', 'products', q] as const,
    },

    promotions: {
      list: (filters?: object) => ['admin', 'promotions', filters] as const,
      single: (id: number) => ['admin', 'promotions', id] as const,
    },

    coupons: {
      list: (filters?: object) => ['admin', 'coupons', filters] as const,
      single: (id: number) => ['admin', 'coupons', id] as const,
      usage: (id: number) => ['admin', 'coupons', id, 'usage'] as const,
    },

    shipping: {
      rates: () => ['admin', 'shipping-rates'] as const,
      rate: (id: number) => ['admin', 'shipping-rates', id] as const,
      classes: () => ['admin', 'shipping-classes'] as const,
    },

    inventory: {
      list: (filters?: object) => ['admin', 'inventory', filters] as const,
      lowStock: () => ['admin', 'inventory', 'low-stock'] as const,
      logs: () => ['admin', 'inventory', 'logs'] as const,
      product: (productId: number) => ['admin', 'inventory', productId] as const,
    },

    returns: {
      list: (filters?: object) => ['admin', 'returns', filters] as const,
      single: (id: number) => ['admin', 'returns', id] as const,
    },

    refunds: {
      list: () => ['admin', 'refunds'] as const,
      single: (id: number) => ['admin', 'refunds', id] as const,
    },

    reviews: {
      list: (filters?: object) => ['admin', 'reviews', filters] as const,
      single: (id: number) => ['admin', 'reviews', id] as const,
      statistics: () => ['admin', 'reviews', 'statistics'] as const,
    },

    campaigns: {
      list: (filters?: object) => ['admin', 'campaigns', filters] as const,
      single: (id: number) => ['admin', 'campaigns', id] as const,
      statistics: (id: number) => ['admin', 'campaigns', id, 'statistics'] as const,
      recipients: (id: number, filters?: object) => ['admin', 'campaigns', id, 'recipients', filters] as const,
    },

    content: {
      policies: () => ['admin', 'content', 'policies'] as const,
      policy: (id: number) => ['admin', 'content', 'policies', id] as const,
      pages: () => ['admin', 'content', 'pages'] as const,
      page: (id: number) => ['admin', 'content', 'pages', id] as const,
      banners: () => ['admin', 'content', 'banners'] as const,
    },

    reports: {
      sales: (filters?: object) => ['admin', 'reports', 'sales', filters] as const,
      products: (filters?: object) => ['admin', 'reports', 'products', filters] as const,
      customers: (filters?: object) => ['admin', 'reports', 'customers', filters] as const,
      inventory: () => ['admin', 'reports', 'inventory'] as const,
      orderStatus: (filters?: object) =>
        ['admin', 'reports', 'order-status', filters] as const,
    },

    flashDeals: {
      list: () => ['admin', 'flash-deals'] as const,
      single: (id: number) => ['admin', 'flash-deals', id] as const,
    },

    analytics: {
      dashboard: (filters?: object) => ['admin', 'analytics', 'dashboard', filters] as const,
      visitors: (filters?: object) => ['admin', 'analytics', 'visitors', filters] as const,
      visitorDetails: (id: number) => ['admin', 'analytics', 'visitors', id] as const,
      productViews: (filters?: object) => ['admin', 'analytics', 'product-views', filters] as const,
      checkoutFunnel: (filters?: object) => ['admin', 'analytics', 'checkout-funnel', filters] as const,
      abandonedCarts: (filters?: object) => ['admin', 'analytics', 'abandoned-carts', filters] as const,
      cartEvents: (filters?: object) => ['admin', 'analytics', 'cart-events', filters] as const,
      pageViews: (filters?: object) => ['admin', 'analytics', 'page-views', filters] as const,
      search: (filters?: object) => ['admin', 'analytics', 'search', filters] as const,
    },

    customerSegments: {
      list: (filters?: object) => ['admin', 'customer-segments', filters] as const,
      single: (id: number) => ['admin', 'customer-segments', id] as const,
      customers: (id: number, filters?: object) => ['admin', 'customer-segments', id, 'customers', filters] as const,
      vip: (filters?: object) => ['admin', 'customer-segments', 'vip', filters] as const,
      codRisk: (filters?: object) => ['admin', 'customer-segments', 'cod-risk', filters] as const,
      repeat: (filters?: object) => ['admin', 'customer-segments', 'repeat', filters] as const,
    },

    customerTags: {
      list: (filters?: object) => ['admin', 'customer-tags', filters] as const,
      single: (id: number) => ['admin', 'customer-tags', id] as const,
      customers: (id: number, filters?: object) => ['admin', 'customer-tags', id, 'customers', filters] as const,
    },

    customerAnalytics: {
      dashboard: () => ['admin', 'customer-analytics', 'dashboard'] as const,
      growthReport: (filters?: object) => ['admin', 'customer-analytics', 'growth-report', filters] as const,
      ltvDistribution: () => ['admin', 'customer-analytics', 'ltv-distribution'] as const,
      spendingSummary: (customerId: number) => ['admin', 'customer-analytics', customerId, 'spending-summary'] as const,
    },

    services: {
      list: (filters?: object) => ['admin', 'services', filters] as const,
      single: (id: number) => ['admin', 'services', id] as const,
      productServices: (productId: number) => ['admin', 'products', productId, 'services'] as const,
    },

    metaPixel: {
      configuration: () => ['admin', 'meta-pixel', 'configuration'] as const,
      events: (filters?: object) => ['admin', 'meta-pixel', 'events', filters] as const,
      statistics: (filters?: object) => ['admin', 'meta-pixel', 'statistics', filters] as const,
    },

    enhancedReports: {
      profit: (filters?: object) => ['admin', 'enhanced-reports', 'profit', filters] as const,
      codVsPaid: (filters?: object) => ['admin', 'enhanced-reports', 'cod-vs-paid', filters] as const,
      customerGrowth: (filters?: object) => ['admin', 'enhanced-reports', 'customer-growth', filters] as const,
      productPerformance: (filters?: object) => ['admin', 'enhanced-reports', 'product-performance', filters] as const,
      orderSource: (filters?: object) => ['admin', 'enhanced-reports', 'order-source', filters] as const,
      utmCampaign: (filters?: object) => ['admin', 'enhanced-reports', 'utm-campaign', filters] as const,
    },
  },
} as const;
