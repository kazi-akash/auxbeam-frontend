'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, TrendingUp, TrendingDown, RotateCcw, AlertTriangle, RefreshCw, HelpCircle } from 'lucide-react';
import type { AdjustInventoryPayload } from '@/lib/types/admin';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InventoryProduct {
  id: number;
  name: string;
  sku?: string | null;
  quantity: number;
  low_stock_threshold?: number;
  variations?: {
    id: number;
    sku?: string | null;
    quantity: number;
    attributes?: Record<string, string>;
  }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: AdjustInventoryPayload) => void;
  loading: boolean;
  product: InventoryProduct | null;
}

// ─── Reason config ────────────────────────────────────────────────────────────

const REASONS = [
  { value: 'adjustment',  label: 'Manual Adjustment', icon: RefreshCw,      color: 'text-blue-500',   bg: 'bg-blue-50 border-blue-200' },
  { value: 'recount',     label: 'Stock Recount',     icon: RotateCcw,      color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
  { value: 'return',      label: 'Customer Return',   icon: TrendingUp,     color: 'text-emerald-500',bg: 'bg-emerald-50 border-emerald-200' },
  { value: 'damage',      label: 'Damaged / Lost',    icon: AlertTriangle,  color: 'text-red-500',    bg: 'bg-red-50 border-red-200' },
  { value: 'other',       label: 'Other',             icon: HelpCircle,     color: 'text-gray-500',   bg: 'bg-gray-50 border-gray-200' },
] as const;

type Reason = typeof REASONS[number]['value'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function InventoryAdjustModal({ open, onClose, onSubmit, loading, product }: Props) {
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState<Reason>('adjustment');
  const [notes, setNotes] = useState('');
  const [variationId, setVariationId] = useState<number | null>(null);
  const [mode, setMode] = useState<'add' | 'subtract' | 'set'>('add');

  const hasVariations = (product?.variations?.length ?? 0) > 0;

  useEffect(() => {
    if (open) {
      setQuantity('');
      setReason('adjustment');
      setNotes('');
      setVariationId(null);
      setMode('add');
    }
  }, [open, product]);

  if (!open || !product) return null;

  // Current stock for selected target
  const currentStock = hasVariations && variationId
    ? (product.variations?.find(v => v.id === variationId)?.quantity ?? 0)
    : product.quantity;

  const qty = parseInt(quantity) || 0;
  const adjustment = mode === 'add' ? qty : mode === 'subtract' ? -qty : qty - currentStock;
  const newStock = currentStock + adjustment;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quantity) return;

    onSubmit({
      quantity: adjustment,
      reason,
      variation_id: variationId ?? null,
    });
  }

  const selectedReason = REASONS.find(r => r.value === reason)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Adjust Inventory</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Variation selector */}
          {hasVariations && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Variation <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={variationId ?? ''}
                onChange={e => setVariationId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
              >
                <option value="">— Select variation —</option>
                {product.variations?.map(v => {
                  const label = v.attributes
                    ? Object.values(v.attributes).join(' / ')
                    : v.sku ?? `Variation #${v.id}`;
                  return (
                    <option key={v.id} value={v.id}>
                      {label} (SKU: {v.sku ?? '—'}) — Stock: {v.quantity}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Current stock display */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900">{currentStock}</p>
            </div>
            {quantity && (
              <div className="text-right">
                <p className="text-xs text-gray-500">New Stock</p>
                <p className={`text-2xl font-bold ${newStock < 0 ? 'text-red-500' : newStock === 0 ? 'text-amber-500' : 'text-emerald-600'}`}>
                  {newStock}
                </p>
              </div>
            )}
            {quantity && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Change</p>
                <p className={`text-lg font-semibold flex items-center gap-1 ${adjustment > 0 ? 'text-emerald-600' : adjustment < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                  {adjustment > 0 ? <TrendingUp className="w-4 h-4" /> : adjustment < 0 ? <TrendingDown className="w-4 h-4" /> : null}
                  {adjustment > 0 ? '+' : ''}{adjustment}
                </p>
              </div>
            )}
          </div>

          {/* Mode selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Adjustment Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'add',      label: 'Add Stock',    icon: TrendingUp,   color: 'emerald' },
                { key: 'subtract', label: 'Remove Stock', icon: TrendingDown, color: 'red' },
                { key: 'set',      label: 'Set Exact',    icon: RefreshCw,    color: 'blue' },
              ] as const).map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key)}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-medium transition-all ${
                    mode === key
                      ? color === 'emerald' ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : color === 'red' ? 'bg-red-50 border-red-300 text-red-700'
                        : 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity input */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              {mode === 'set' ? 'New Quantity' : 'Quantity'} <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              required
              min={mode === 'subtract' ? 1 : 0}
              max={mode === 'subtract' ? currentStock : undefined}
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder={mode === 'set' ? `Current: ${currentStock}` : '0'}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
            />
            {mode === 'subtract' && qty > currentStock && (
              <p className="mt-1 text-xs text-red-500">Cannot remove more than current stock ({currentStock})</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Reason <span className="text-red-400">*</span></label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {REASONS.map(r => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReason(r.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      reason === r.value ? r.bg + ' ' + r.color : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes (optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={`e.g. ${selectedReason.label} — add context here...`}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition resize-none"
              maxLength={500}
            />
          </div>

          {/* Validation warning */}
          {newStock < 0 && quantity && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              Stock cannot go below 0. Adjust the quantity.
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !quantity || newStock < 0 || (mode === 'subtract' && qty > currentStock) || (hasVariations && !variationId)}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
