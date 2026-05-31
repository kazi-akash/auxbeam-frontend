'use client';

import { X, Package, Layers, Tag, Loader2, Pencil } from 'lucide-react';
import { useAdminPromotion } from '@/lib/hooks/admin/useAdminPromotions';
import type { AdminPromotion } from './PromotionModal';

interface Props {
  promotionId: number | null;
  onClose: () => void;
  onEdit: (promotion: AdminPromotion) => void;
}

function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const TYPE_LABELS: Record<string, string> = {
  percentage: 'Percentage',
  fixed_amount: 'Fixed Amount',
  flash_sale: 'Flash Sale',
  combo_offer: 'Combo Offer',
  free_delivery: 'Free Delivery',
};

const TYPE_COLORS: Record<string, string> = {
  percentage: 'bg-blue-50 text-blue-600 border-blue-100',
  fixed_amount: 'bg-purple-50 text-purple-600 border-purple-100',
  flash_sale: 'bg-red-50 text-red-600 border-red-100',
  combo_offer: 'bg-orange-50 text-orange-600 border-orange-100',
  free_delivery: 'bg-teal-50 text-teal-600 border-teal-100',
};

function SectionList({
  icon: Icon,
  title,
  items,
  emptyText,
}: {
  icon: React.ElementType;
  title: string;
  items: { id: number; name: string; sub?: string }[];
  emptyText: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        {items.length > 0 && (
          <span className="ml-auto text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
            {items.length}
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 italic pl-5">{emptyText}</p>
      ) : (
        <ul className="space-y-1 pl-5">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
              <span className="text-sm text-gray-700 truncate">{item.name}</span>
              {item.sub && (
                <span className="text-[10px] text-gray-400 font-mono shrink-0">{item.sub}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PromotionDetailDrawer({ promotionId, onClose, onEdit }: Props) {
  const { data: promotion, isLoading } = useAdminPromotion(promotionId ?? 0);

  if (!promotionId) return null;

  const now = new Date();
  const isExpired = promotion?.ends_at && new Date(promotion.ends_at) < now;
  const isScheduled = promotion?.starts_at && new Date(promotion.starts_at) > now;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Promotion Details</h2>
            {promotion && (
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[240px]">{promotion.name}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {promotion && (
              <button
                onClick={() => onEdit(promotion as AdminPromotion)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            </div>
          ) : !promotion ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
              Promotion not found
            </div>
          ) : (
            <div className="px-6 py-5 space-y-6">
              {/* Status + Type badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                    TYPE_COLORS[promotion.promotion_type] ?? 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {TYPE_LABELS[promotion.promotion_type] ?? promotion.promotion_type}
                </span>
                {!promotion.is_active ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                    Inactive
                  </span>
                ) : isExpired ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-500 border border-red-100">
                    Expired
                  </span>
                ) : isScheduled ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-500 border border-blue-100">
                    Scheduled
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                    Active
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                  {promotion.apply_level === 'cart' ? 'Cart Level' : 'Product Level'}
                </span>
              </div>

              {/* Description */}
              {promotion.description && (
                <p className="text-sm text-gray-600 leading-relaxed">{promotion.description}</p>
              )}

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3.5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Discount</p>
                  <p className="text-lg font-bold text-gray-800">
                    {promotion.promotion_type === 'free_delivery'
                      ? 'Free'
                      : promotion.promotion_type === 'percentage' || promotion.promotion_type === 'flash_sale'
                      ? `${promotion.discount_value}%`
                      : `$${Number(promotion.discount_value).toFixed(2)}`}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Priority</p>
                  <p className="text-lg font-bold text-gray-800">{promotion.priority}</p>
                </div>
                {Number(promotion.min_purchase_amount) > 0 && (
                  <div className="bg-gray-50 rounded-xl p-3.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Min Purchase</p>
                    <p className="text-base font-bold text-gray-800">
                      ${Number(promotion.min_purchase_amount).toFixed(2)}
                    </p>
                  </div>
                )}
                {promotion.max_discount_amount && (
                  <div className="bg-gray-50 rounded-xl p-3.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Max Discount</p>
                    <p className="text-base font-bold text-gray-800">
                      ${Number(promotion.max_discount_amount).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              {/* Date range */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Starts</span>
                  <span className="font-medium text-gray-800">{formatDate(promotion.starts_at)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Ends</span>
                  <span className={`font-medium ${isExpired ? 'text-red-500' : 'text-gray-800'}`}>
                    {formatDate(promotion.ends_at)}
                  </span>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Scope — products / brands / categories */}
              <div className="space-y-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Applies To:{' '}
                  <span className="text-amber-600 normal-case font-semibold">
                    {{
                      all_products: 'All Products',
                      specific_products: 'Specific Products',
                      specific_brands: 'Specific Brands',
                      specific_categories: 'Specific Categories',
                    }[promotion.applies_to] ?? promotion.applies_to}
                  </span>
                </p>

                {promotion.applies_to === 'specific_products' && (
                  <SectionList
                    icon={Package}
                    title="Products"
                    items={(promotion.products ?? []).map((p) => ({ id: p.id, name: p.name }))}
                    emptyText="No products assigned"
                  />
                )}

                {promotion.applies_to === 'specific_brands' && (
                  <SectionList
                    icon={Layers}
                    title="Brands"
                    items={(promotion.brands ?? []).map((b) => ({ id: b.id, name: b.name }))}
                    emptyText="No brands assigned"
                  />
                )}

                {promotion.applies_to === 'specific_categories' && (
                  <SectionList
                    icon={Tag}
                    title="Categories"
                    items={(promotion.categories ?? []).map((c) => ({ id: c.id, name: c.name }))}
                    emptyText="No categories assigned"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
