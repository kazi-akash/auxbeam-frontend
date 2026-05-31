'use client';

import { useState } from 'react';
import { MapPin, Plus, Star, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@/lib/hooks/customer/useAddresses';
import type { Address, CreateAddressPayload, AddressType } from '@/lib/types';

// ── Address Form Modal ─────────────────────────────────────────────────────────

const EMPTY_FORM: CreateAddressPayload = {
  address_line_1: '',
  address_line_2: '',
  contact_no: '',
  city: '',
  state: '',
  zip_code: '',
  address_type: 'user_address',
  is_default: false,
};

const ADDRESS_TYPES: { value: AddressType; label: string }[] = [
  { value: 'user_address', label: 'General' },
  { value: 'shipping_address', label: 'Shipping' },
  { value: 'billing_address', label: 'Billing' },
];

function AddressModal({
  initial,
  onClose,
}: {
  initial?: Address;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CreateAddressPayload>(
    initial
      ? {
          address_line_1: initial.address_line_1,
          address_line_2: initial.address_line_2 ?? '',
          contact_no: initial.contact_no,
          city: initial.city,
          state: initial.state ?? '',
          zip_code: initial.zip_code ?? '',
          address_type: initial.address_type,
          is_default: initial.is_default,
        }
      : EMPTY_FORM,
  );

  const create = useCreateAddress();
  const update = useUpdateAddress();
  const busy = create.isPending || update.isPending;

  function set(field: keyof CreateAddressPayload, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      address_line_2: form.address_line_2 || undefined,
      state: form.state || undefined,
      zip_code: form.zip_code || undefined,
    };
    if (initial) {
      await update.mutateAsync({ id: initial.id, payload });
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            {initial ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Address Line 1 *</label>
              <input
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FCE32D]/60"
                value={form.address_line_1}
                onChange={(e) => set('address_line_1', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Address Line 2</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FCE32D]/60"
                value={form.address_line_2 ?? ''}
                onChange={(e) => set('address_line_2', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">City *</label>
              <input
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FCE32D]/60"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">State</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FCE32D]/60"
                value={form.state ?? ''}
                onChange={(e) => set('state', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">ZIP / Postal Code</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FCE32D]/60"
                value={form.zip_code ?? ''}
                onChange={(e) => set('zip_code', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Contact No. *</label>
              <input
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FCE32D]/60"
                value={form.contact_no}
                onChange={(e) => set('contact_no', e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Address Type *</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FCE32D]/60 bg-white"
                value={form.address_type}
                onChange={(e) => set('address_type', e.target.value as AddressType)}
              >
                {ADDRESS_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              checked={form.is_default ?? false}
              onChange={(e) => set('is_default', e.target.checked)}
            />
            <span className="text-xs text-gray-600">Set as default address</span>
          </label>

          {(create.isError || update.isError) && (
            <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-[#FCE32D] rounded-lg hover:bg-[#e6cc28] disabled:opacity-60 transition-colors"
            >
              {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {initial ? 'Save Changes' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Address Card ───────────────────────────────────────────────────────────────

function AddressCard({ address }: { address: Address }) {
  const [editing, setEditing] = useState(false);
  const del = useDeleteAddress();
  const setDefault = useSetDefaultAddress();

  const typeLabel = ADDRESS_TYPES.find((t) => t.value === address.address_type)?.label ?? address.address_type;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{typeLabel}</span>
            {address.is_default && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-medium">
                <Star className="w-3 h-3 fill-current" />
                Default
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => del.mutate(address.id)}
              disabled={del.isPending}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              title="Delete"
            >
              {del.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-700 leading-relaxed">
          <p>{address.address_line_1}</p>
          {address.address_line_2 && <p>{address.address_line_2}</p>}
          <p>
            {[address.city, address.state, address.zip_code].filter(Boolean).join(', ')}
          </p>
          {address.contact_no && (
            <p className="text-xs text-gray-400 mt-1">{address.contact_no}</p>
          )}
        </div>

        {!address.is_default && (
          <button
            onClick={() => setDefault.mutate(address.id)}
            disabled={setDefault.isPending}
            className="self-start text-xs text-gray-500 hover:text-gray-900 underline underline-offset-2 disabled:opacity-50 transition-colors"
          >
            {setDefault.isPending ? 'Setting...' : 'Set as default'}
          </button>
        )}
      </div>

      {editing && <AddressModal initial={address} onClose={() => setEditing(false)} />}
    </>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AddressesPage() {
  const [adding, setAdding] = useState(false);
  const { data: addresses, isLoading, isError } = useAddresses();

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Saved Addresses</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage your delivery and billing addresses</p>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-black bg-[#FCE32D] rounded-lg hover:bg-[#e6cc28] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
          </div>
        )}

        {isError && (
          <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-medium text-gray-700">Failed to load addresses.</p>
            <p className="text-xs text-gray-400 mt-1">Please try refreshing the page.</p>
          </div>
        )}

        {!isLoading && !isError && addresses?.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-20 text-center">
            <MapPin className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-700">No addresses saved yet</p>
            <p className="text-xs text-gray-400 mt-1">Add an address to speed up checkout.</p>
            <button
              onClick={() => setAdding(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-[#FCE32D] rounded-lg hover:bg-[#e6cc28] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
          </div>
        )}

        {!isLoading && !isError && addresses?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr: Address) => (
              <AddressCard key={addr.id} address={addr} />
            ))}
          </div>
        )}
      </div>

      {adding && <AddressModal onClose={() => setAdding(false)} />}
    </>
  );
}
