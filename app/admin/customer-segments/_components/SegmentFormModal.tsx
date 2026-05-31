'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  useAdminCreateCustomerSegment,
  useAdminUpdateCustomerSegment,
} from '@/lib/hooks/admin/useAdminCustomerSegments';
import type { CustomerSegment, CreateCustomerSegmentPayload } from '@/lib/types/admin';

interface Props {
  open: boolean;
  onClose: () => void;
  segment: CustomerSegment | null;
}

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#6B7280'];

export default function SegmentFormModal({ open, onClose, segment }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [isActive, setIsActive] = useState(true);
  const [priority, setPriority] = useState(0);
  const [error, setError] = useState('');

  const create = useAdminCreateCustomerSegment();
  const update = useAdminUpdateCustomerSegment();
  const isPending = create.isPending || update.isPending;

  useEffect(() => {
    if (segment) {
      setName(segment.name);
      setDescription(segment.description ?? '');
      setColor(segment.color ?? COLORS[0]);
      setIsActive(segment.is_active);
      setPriority(segment.priority);
    } else {
      setName(''); setDescription(''); setColor(COLORS[0]); setIsActive(true); setPriority(0);
    }
    setError('');
  }, [segment, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const payload: CreateCustomerSegmentPayload = { name, description: description || undefined, color, is_active: isActive, priority };
    try {
      if (segment) {
        await update.mutateAsync({ id: segment.id, payload });
      } else {
        await create.mutateAsync(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Something went wrong.');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{segment ? 'Edit Segment' : 'New Segment'}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
              placeholder="e.g. VIP Customers" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 resize-none"
              placeholder="Optional description..." />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Priority</label>
            <input type="number" value={priority} onChange={(e) => setPriority(Number(e.target.value))} min={0}
              className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="seg-active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-amber-400 focus:ring-amber-200" />
            <label htmlFor="seg-active" className="text-sm text-gray-700">Active</label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={isPending}
              className="px-5 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-50 transition">
              {isPending ? 'Saving...' : segment ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
