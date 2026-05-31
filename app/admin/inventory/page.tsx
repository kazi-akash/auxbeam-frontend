'use client';

import { useState, useCallback } from 'react';
import {
  Package, AlertTriangle, TrendingDown, BarChart3,
  Search, SlidersHorizontal, RefreshCw, ChevronLeft, ChevronRight,
  Eye, Loader2, TrendingUp, RotateCcw, HelpCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useAdminInventory,
  useAdminLowStockProducts,
  useAdminInventoryLogs,
  useAdminAdjustInventory,
} from '@/lib/hooks/admin/useAdminInventory';
import InventoryAdjustModal, { type InventoryProduct } from './_components/InventoryAdjustModal';
import ProductInventoryDrawer from './_components/ProductInventoryDrawer';
import type { AdjustInventoryPayload } from '@/lib/types/admin';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'low_stock' | 'logs';
type StockFilter = 'all' | 'in' | 'low' | 'out';

interface ProductRow {
  id: number;
  name: string;
  sku?: string | null;
  quantity: number;
  low_stock_threshold?: number | null;
  stock_status?: string;
  category?: { id: number; name: string } | null;
  brand?: { id: number; name: string } | null;
  variations?: {
    id: number;
    sku?: string | null;
    quantity: number;
    attributes?: Record<string, string>;
    is_default?: boolean;
  }[];
}

interface LogRow {
  id: number;
  product_id: number;
  quantity: number;
  reason: string;
  notes?: string | null;
  created_at: string;
  product?: { id: number; name: string; sku?: string | null } | null;
  product_variation?: { id: number; sku?: string | null; attributes?: Record<string, string> } | null;
  created_by?: { id: number; full_name?: string; name?: string } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STOCK_CONFIG = {
  in_stock:     { label: 'In Stock',     cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  low_stock:    { label: 'Low Stock',    cls: 'bg-amber-50   text-amber-600   border-amber-100'   },
  out_of_stock: { label: 'Out of Stock', cls: 'bg-red-50     text-red-500     border-red-100'     },
} as const;

const REASON_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  adjustment: { label: 'Manual Adjustment', icon: RefreshCw,     color: 'text-blue-600',   bg: 'bg-blue-50' },
  recount:    { label: 'Stock Recount',     icon: RotateCcw,     color: 'text-purple-600', bg: 'bg-purple-50' },
  return:     { label: 'Customer Return',   icon: TrendingUp,    color: 'text-emerald-600',bg: 'bg-emerald-50' },
  damage:     { label: 'Damaged / Lost',    icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50' },
  purchase:   { label: 'Purchase',          icon: TrendingUp,    color: 'text-emerald-600',bg: 'bg-emerald-50' },
  sale:       { label: 'Sale',              icon: TrendingDown,  color: 'text-amber-600',  bg: 'bg-amber-50' },
  other:      { label: 'Other',             icon: HelpCircle,    color: 'text-gray-600',   bg: 'bg-gray-100' },
};

function getStockStatus(product: ProductRow): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (product.stock_status) return product.stock_status as 'in_stock' | 'low_stock' | 'out_of_stock';
  const qty = product.quantity ?? 0;
  if (qty <= 0) return 'out_of_stock';
  if (product.low_stock_threshold && qty <= product.low_stock_threshold) return 'low_stock';
  return 'in_stock';
}

function StockBadge({ status }: { status: 'in_stock' | 'low_stock' | 'out_of_stock' }) {
  const cfg = STOCK_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function StockBar({ qty, threshold }: { qty: number; threshold?: number | null }) {
  const max = Math.max(qty, (threshold ?? 0) * 3, 10);
  const pct = Math.min((qty / max) * 100, 100);
  const color = qty <= 0 ? 'bg-red-400' : threshold && qty <= threshold ? 'bg-amber-400' : 'bg-emerald-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{qty}</span>
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  // Modals / drawer state
  const [adjustProduct, setAdjustProduct] = useState<InventoryProduct | null>(null);
  const [drawerProductId, setDrawerProductId] = useState<number | null>(null);

  // Debounce search
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    clearTimeout((handleSearch as unknown as { _t: ReturnType<typeof setTimeout> })._t);
    (handleSearch as unknown as { _t: ReturnType<typeof setTimeout> })._t = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  }, []);

  // Queries
  const { data: inventoryData, isLoading: inventoryLoading, isFetching } = useAdminInventory({
    search: debouncedSearch || undefined,
    per_page: PER_PAGE,
    page,
  });

  const { data: lowStockData, isLoading: lowStockLoading } = useAdminLowStockProducts();
  const { data: logsData, isLoading: logsLoading } = useAdminInventoryLogs();
  const adjustInventory = useAdminAdjustInventory();

  // Normalise inventory response (Laravel paginator)
  const allProducts: ProductRow[] = Array.isArray(inventoryData?.data)
    ? inventoryData.data
    : (inventoryData?.data?.data ?? []);
  const total: number = inventoryData?.data?.total ?? allProducts.length;
  const lastPage: number = inventoryData?.data?.last_page ?? Math.ceil(total / PER_PAGE);

  // Low stock
  const lowStockProducts: ProductRow[] = Array.isArray(lowStockData) ? lowStockData : [];

  // Logs
  const logs: LogRow[] = Array.isArray(logsData?.data)
    ? logsData.data
    : (logsData?.data?.data ?? []);

  // Client-side stock filter (for overview tab)
  const filteredProducts = stockFilter === 'all'
    ? allProducts
    : allProducts.filter(p => {
        const s = getStockStatus(p);
        if (stockFilter === 'in')  return s === 'in_stock';
        if (stockFilter === 'low') return s === 'low_stock';
        if (stockFilter === 'out') return s === 'out_of_stock';
        return true;
      });

  // Stats
  const inStockCount  = allProducts.filter(p => getStockStatus(p) === 'in_stock').length;
  const lowStockCount = allProducts.filter(p => getStockStatus(p) === 'low_stock').length;
  const outOfStockCount = allProducts.filter(p => getStockStatus(p) === 'out_of_stock').length;

  // Handlers
  function openAdjust(product: ProductRow) {
    setAdjustProduct({
      id: product.id,
      name: product.name,
      sku: product.sku,
      quantity: product.quantity,
      low_stock_threshold: product.low_stock_threshold ?? undefined,
      variations: product.variations,
    });
  }

  function handleAdjustSubmit(payload: AdjustInventoryPayload) {
    if (!adjustProduct) return;
    adjustInventory.mutate(
      { productId: adjustProduct.id, payload },
      {
        onSuccess: () => {
          toast.success('Inventory adjusted successfully');
          setAdjustProduct(null);
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          toast.error(msg ?? 'Failed to adjust inventory');
        },
      },
    );
  }

  const pageNumbers: number[] = [];
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    pageNumbers.push(i);
  }
  const from = (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, total);

  return (
    <>
      <div className="space-y-5">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Package,       label: 'Total Products', value: total,          color: 'text-blue-500 bg-blue-50' },
            { icon: BarChart3,     label: 'In Stock',       value: inStockCount,   color: 'text-emerald-500 bg-emerald-50' },
            { icon: AlertTriangle, label: 'Low Stock',      value: lowStockCount,  color: 'text-amber-500 bg-amber-50' },
            { icon: TrendingDown,  label: 'Out of Stock',   value: outOfStockCount,color: 'text-red-500 bg-red-50' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {([
            { key: 'overview',  label: 'All Products' },
            { key: 'low_stock', label: `Low Stock${lowStockProducts.length > 0 ? ` (${lowStockProducts.length})` : ''}` },
            { key: 'logs',      label: 'Activity Logs' },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products or SKU..."
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 placeholder:text-gray-400 transition"
                />
              </div>
              {/* Stock filter pills */}
              <div className="flex items-center gap-1.5">
                {([
                  { key: 'all', label: 'All' },
                  { key: 'in',  label: 'In Stock' },
                  { key: 'low', label: 'Low Stock' },
                  { key: 'out', label: 'Out of Stock' },
                ] as { key: StockFilter; label: string }[]).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setStockFilter(key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      stockFilter === key
                        ? 'bg-amber-400 border-amber-400 text-black'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition ml-auto">
                <SlidersHorizontal className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">SKU</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Variations</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-40">Stock Level</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`transition-opacity duration-150 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                    {inventoryLoading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          <td className="px-5 py-4"><div className="h-3.5 w-40 bg-gray-100 rounded animate-pulse" /></td>
                          {[...Array(5)].map((_, j) => (
                            <td key={j} className="px-4 py-4"><div className="h-3.5 w-20 bg-gray-100 rounded animate-pulse" /></td>
                          ))}
                          <td className="px-5 py-4"><div className="h-3.5 w-16 bg-gray-100 rounded animate-pulse ml-auto" /></td>
                        </tr>
                      ))
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-16 text-center">
                          <div className="flex flex-col items-center gap-3 text-gray-400">
                            <Package className="w-10 h-10 text-gray-200" />
                            <p className="text-sm">No products found.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(product => {
                        const status = getStockStatus(product);
                        const varCount = product.variations?.length ?? 0;
                        return (
                          <tr key={product.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                            </td>
                            <td className="px-4 py-4 text-gray-500 font-mono text-xs">{product.sku || '—'}</td>
                            <td className="px-4 py-4 text-gray-600 text-xs">{product.category?.name ?? '—'}</td>
                            <td className="px-4 py-4">
                              {varCount > 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                  {varCount} variant{varCount !== 1 ? 's' : ''}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-4 w-40">
                              <StockBar qty={product.quantity} threshold={product.low_stock_threshold} />
                            </td>
                            <td className="px-4 py-4"><StockBadge status={status} /></td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setDrawerProductId(product.id)}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                  title="View detail"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openAdjust(product)}
                                  className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                                  title="Adjust stock"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!inventoryLoading && total > 0 && (
                <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-white">
                  <p className="text-xs text-gray-400">
                    Showing {from}–{to} of <span className="font-medium text-gray-600">{total.toLocaleString()} products</span>
                  </p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>
                    {pageNumbers.map(n => (
                      <button key={n} onClick={() => setPage(n)}
                        className={`w-8 h-8 text-xs font-semibold rounded-lg transition ${n === page ? 'bg-amber-400 text-black border border-amber-400' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                        {n}
                      </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page >= lastPage}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Low Stock Tab ── */}
        {activeTab === 'low_stock' && (
          <div className="space-y-4">
            {lowStockProducts.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span><strong>{lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''}</strong> need restocking.</span>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">SKU</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-40">Stock Level</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Threshold</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          {[...Array(7)].map((_, j) => (
                            <td key={j} className="px-4 py-4"><div className="h-3.5 w-24 bg-gray-100 rounded animate-pulse" /></td>
                          ))}
                        </tr>
                      ))
                    ) : lowStockProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-16 text-center">
                          <div className="flex flex-col items-center gap-3 text-gray-400">
                            <BarChart3 className="w-10 h-10 text-gray-200" />
                            <p className="text-sm font-medium text-gray-500">All products are well stocked</p>
                            <p className="text-xs">No products are below their low stock threshold.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      lowStockProducts.map(product => {
                        const status = getStockStatus(product);
                        return (
                          <tr key={product.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                            </td>
                            <td className="px-4 py-4 text-gray-500 font-mono text-xs">{product.sku || '—'}</td>
                            <td className="px-4 py-4 text-gray-600 text-xs">{product.category?.name ?? '—'}</td>
                            <td className="px-4 py-4 w-40">
                              <StockBar qty={product.quantity} threshold={product.low_stock_threshold} />
                            </td>
                            <td className="px-4 py-4 text-xs font-medium text-gray-600">
                              {product.low_stock_threshold ?? '—'}
                            </td>
                            <td className="px-4 py-4"><StockBadge status={status} /></td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => setDrawerProductId(product.id)}
                                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors" title="View detail">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => openAdjust(product)}
                                  className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Adjust stock">
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Activity Logs Tab ── */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Variation</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Reason</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Change</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Notes</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">By</th>
                      <th className="text-left px-4 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logsLoading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          {[...Array(7)].map((_, j) => (
                            <td key={j} className="px-4 py-4"><div className="h-3.5 w-24 bg-gray-100 rounded animate-pulse" /></td>
                          ))}
                        </tr>
                      ))
                    ) : logs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-16 text-center">
                          <div className="flex flex-col items-center gap-3 text-gray-400">
                            <BarChart3 className="w-10 h-10 text-gray-200" />
                            <p className="text-sm">No inventory activity yet.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      logs.map(log => {
                        const cfg = REASON_CONFIG[log.reason] ?? REASON_CONFIG.other;
                        const Icon = cfg.icon;
                        const isPositive = log.quantity > 0;
                        const varLabel = log.product_variation
                          ? (log.product_variation.attributes && Object.keys(log.product_variation.attributes).length > 0
                              ? Object.values(log.product_variation.attributes).join(' / ')
                              : log.product_variation.sku ?? `#${log.product_variation.id}`)
                          : null;
                        return (
                          <tr key={log.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-800 line-clamp-1">{log.product?.name ?? `Product #${log.product_id}`}</p>
                              {log.product?.sku && <p className="text-[11px] text-gray-400 font-mono">{log.product.sku}</p>}
                            </td>
                            <td className="px-4 py-4 text-xs text-gray-500">
                              {varLabel ?? <span className="text-gray-300">—</span>}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${cfg.bg}`}>
                                  <Icon className={`w-3 h-3 ${cfg.color}`} />
                                </div>
                                <span className="text-xs font-medium text-gray-700">{cfg.label}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                                {isPositive ? '+' : ''}{log.quantity}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-xs text-gray-500 max-w-[160px] truncate">
                              {log.notes ?? <span className="text-gray-300">—</span>}
                            </td>
                            <td className="px-4 py-4 text-xs text-gray-500">
                              {log.created_by?.full_name ?? log.created_by?.name ?? <span className="text-gray-300">System</span>}
                            </td>
                            <td className="px-4 py-4 text-xs text-gray-400 whitespace-nowrap">
                              {formatDate(log.created_at)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Modals & Drawer ── */}
      <InventoryAdjustModal
        open={!!adjustProduct}
        onClose={() => setAdjustProduct(null)}
        onSubmit={handleAdjustSubmit}
        loading={adjustInventory.isPending}
        product={adjustProduct}
      />

      <ProductInventoryDrawer
        productId={drawerProductId}
        onClose={() => setDrawerProductId(null)}
        onAdjust={id => {
          setDrawerProductId(null);
          const product = allProducts.find(p => p.id === id) ?? lowStockProducts.find(p => p.id === id);
          if (product) openAdjust(product);
        }}
      />
    </>
  );
}
