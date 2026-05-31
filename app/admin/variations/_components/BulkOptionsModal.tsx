'use client';

import { useState } from 'react';
import { X, Loader2, Info } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: string[]) => void;
  loading: boolean;
  variationName: string;
}

export default function BulkOptionsModal({
  open,
  onClose,
  onSubmit,
  loading,
  variationName,
}: Props) {
  const [raw, setRaw] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = raw
      .split('\n')
      .map((v) => v.trim())
      .filter(Boolean);
    if (values.length === 0) return;
    onSubmit(values);
  }

  function handleClose() {
    setRaw('');
    onClose();
  }

  if (!open) return null;

  const preview = raw
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Bulk Add Options</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Variation: <span className="font-medium text-gray-600">{variationName}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Hint */}
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Enter one option value per line. Each line becomes a separate option.
            </p>
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Option Values <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={8}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder={'Small\nMedium\nLarge\nX-Large'}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 resize-none font-mono"
            />
          </div>

          {/* Preview count */}
          {preview.length > 0 && (
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">{preview.length}</span> option
              {preview.length !== 1 ? 's' : ''} will be created
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || preview.length === 0}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Add {preview.length > 0 ? preview.length : ''} Option{preview.length !== 1 ? 's' : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
