// ─────────────────────────────────────────────────────────────────────────────
// Catalog types — categories, brands, products
// ─────────────────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: number | null;
  sort_order: number;
  is_active: boolean;
  children?: Category[];
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website?: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface ProductImage {
  id: number;
  image_path: string;
  full_url: string;
  is_primary: boolean;
  sort_order: number;
  alt_text?: string | null;
}

export interface VariationOption {
  id: number;
  value: string;
  variation: { id: number; name: string };
}

export interface ProductVariationValue {
  id: number;
  variation_option: VariationOption;
}

export interface ProductVariation {
  id: number;
  sku: string;
  price: string;
  quantity: number;
  is_default: boolean;
  variation_values: ProductVariationValue[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string | null;
  description: string | null;
  price: string;
  compare_price: string | null;
  cost_price?: string | null;
  quantity: number;
  low_stock_threshold?: number;
  weight?: string | null;
  weight_unit?: string | null;
  length?: string | null;
  width?: string | null;
  height?: string | null;
  shipping_type?: string;
  requires_shipping?: boolean;
  is_featured: boolean;
  is_trending: boolean;
  is_preorder: boolean;
  preorder_release_date?: string | null;
  preorder_limit?: number | null;
  preorder_deposit_amount?: string | null;
  preorder_deposit_type?: 'percentage' | 'fixed' | null;
  status: 'active' | 'inactive' | 'draft';
  stock_status: 'in_stock' | 'out_of_stock' | 'low_stock';
  average_rating: number;
  review_count: number;
  meta_title?: string | null;
  meta_description?: string | null;
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  brand: Pick<Brand, 'id' | 'name' | 'slug'> | null;
  images: ProductImage[];
  primary_image_url: string | null;
  variations?: ProductVariation[];
}

export interface ProductFilters {
  search?: string;
  category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_featured?: boolean;
  is_trending?: boolean;
  is_preorder?: boolean;
  has_flash_deal?: boolean;
  has_promotion?: boolean;
  has_discount?: boolean;
  sort_by?: 'price' | 'name' | 'created_at' | 'rating';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface CategoryProductFilters {
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  sort_by?: 'price' | 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
