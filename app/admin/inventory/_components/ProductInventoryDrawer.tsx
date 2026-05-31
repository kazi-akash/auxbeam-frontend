'use client';

import { X, Package, TrendingUp, TrendingDown, RefreshCw, AlertTriangle, HelpCircle, RotateCcw, Loader2 } from 'lucide-react';
import { useAdminProductInventory } from '@/lib/hooks/admin/useAdminInventory';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  productId: number | null;
  onClose: () => void;
  onAdjust: (productId: number) => void;
}

interface InventoryLog {
  id: number;
  quantity: number;
  reason: string;
  notes?: string | null;
  created_at: string;
  created_by?: { id: number; full_name?: string; name?: string } | null;
  product_variation?: { id: number; sku?: string | null; attributes?: Record<string, string> } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const REASON_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  adjustment: { label: 'Manual Adjustment', icon: RefreshCw,     color: 'text-blue-600',   bg: 'bg-blue-50' },
  recount:    { label: 'Stock Recount',     icon: RotateCcw,     color: 'text-purple-600', bg: 'bg-purple-50' },
  return:     { label: 'Customer Return',   icon: TrendingUp,    color: 'text-emerald-600',bg: 'bg-emerald-50' },
  damage:     { label: 'Damaged / Lost',    icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50' },
  purchase:   { label: 'Purchase',          icon: TrendingUp,    color: 'text-emerald-600',bg: 'bg-emerald-50' },
  sale:       { label: 'Sale',              icon: TrendingDown,  color: 'text-amber-600',  bg: 'bg-amber-50' },
  other:      { label: 'Other',             icon: HelpCircle,    color: 'text-gray-600',   bg: 'bg-gray-100' },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function StockBadge({ qty, threshold }: { qty: number; threshold?: number }) {
  if (qty <= 0) return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100">
      Out of Stock
    </span>
  );
  if (threshold && qty <= threshold) return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
      Low Stock
    </span>
  );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
      In Stock
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductInventoryDrawer({ productId, onClose, onAdjust }: Props) {
  const { data, isLoading } = useAdminProductInventory(productId ?? 0);

  const product = data?.product;
  const logs: InventoryLog[] = data?.recent_logs ?? [];

  return (
    <>
      {/* Backdrop */}
      {productId && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          productId ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Package className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Inventory Detail</h2>
              {product && (
                <p className="text-xs text-gray-400 truncate max-w-[220px]">{product.name}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
            </div>
          ) : !product ? (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">
              Product not found.
            </div>
          ) : (
            <div className="p-5 space-y-5">

              {/* Product info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                    {product.sku && (
                      <p className="text-xs text-gray-400 font-mono mt-0.5">SKU: {product.sku}</p>
                    )}
                  </div>
                  <StockBadge qty={product.quantity} threshold={product.low_stock_threshold} />
                </div>
                <div className="flex items-center gap-4 pt-1">
                  <div>
                    <p className="text-xs text-gray-500">Total Stock</p>
                    <p className="text-xl font-bold text-gray-900">{product.quantity}</p>
                  </div>
                  {product.low_stock_threshold && (
                    <div>
                      <p className="text-xs text-gray-500">Low Stock Alert</p>
                      <p className="text-xl font-bold text-amber-500">{product.low_stock_threshold}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Variations breakdown */}
              {product.variations && product.variations.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Variations ({product.variations.length})
                  </p>
                  <div className="space-y-2">
                    {product.variations.map((v: { id: number; sku?: string | null; quantity: number; attributes?: Record<string, string>; is_default?: boolean }) => {
                      const label = v.attributes && Object.keys(v.attributes).length > 0
                        ? Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(' · ')
                        : v.sku ?? `Variation #${v.id}`;
                      return (
                        <div key={v.id} className="flex items-center justify-between px-3 py-2.5 bg-white border border-gray-100 rounded-lg">
                          <div>
                            <p className="text-xs font-medium text-gray-700 capitalize">{label}</p>
                            {v.sku && (
                              <p className="text-[11px] text-gray-400 font-mono">{v.sku}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {v.is_default && (
                              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Default</span>
                            )}
                            <span className={`text-sm font-bold ${v.quantity <= 0 ? 'text-red-500' : v.quantity <= (product.low_stock_threshold ?? 5) ? 'text-amber-500' : 'text-gray-800'}`}>
                              {v.quantity}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Adjust button */}
              <button
                onClick={() => onAdjust(product.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Adjust Stock
              </button>

              {/* Recent logs */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Recent Activity
                </p>
                {logs.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-400">
                    No inventory activity yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log) => {
                      const cfg = REASON_CONFIG[log.reason] ?? REASON_CONFIG.other;
                      const Icon = cfg.icon;
                      const isPositive = log.quantity > 0;
                      return (
                        <div key={log.id} className="flex items-start gap-3 px-3 py-2.5 bg-white border border-gray-100 rounded-lg">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                            <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-medium text-gray-700">{cfg.label}</p>
                              <span className={`text-xs font-bold shrink-0 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                                {isPositive ? '+' : ''}{log.quantity}
                              </span>
                            </div>
                            {log.product_variation && (
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {log.product_variation.attributes
                                  ? Object.values(log.product_variation.attributes).join(' / ')
                                  : log.product_variation.sku ?? `Variation #${log.product_variation.id}`}
                              </p>
                            )}
                            {log.notes && (
                              <p className="text-[11px] text-gray-400 mt-0.5 truncate">{log.notes}</p>
                            )}
                            <p className="text-[11px] text-gray-300 mt-0.5">
                              {formatDate(log.created_at)}
                              {log.created_by && ` · ${log.created_by.full_name ?? log.created_by.name}`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
