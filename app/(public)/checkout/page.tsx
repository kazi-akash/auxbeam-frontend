'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
  Plus, Truck, CheckCircle2, Loader2, Tag, ChevronDown, ChevronUp,
  X, Check, ConciergeBell, Home, Building2, MapPin, Eye, EyeOff, Mail, Pencil,
} from 'lucide-react';
import Link from 'next/link';
import Breadcrumb from '../_components/Breadcrumb';
import { useShippingMethods, useCheckoutPreview, useProcessCheckout } from '@/lib/hooks/public/useCheckout';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useAvailableCoupons, useCartSummary } from '@/lib/hooks/public/useCart';
import { usePaymentMethods } from '@/lib/hooks/public/useServices';
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
} from '@/lib/hooks/customer/useAddresses';
import { useSendRegistrationOtp, useVerifyOtp } from '@/lib/hooks/public/useAuth';
import type { ShippingMethod, ShippingMethodOption, PaymentMethod } from '@/lib/types/order';
import type { AvailableCoupon } from '@/lib/types';
import type { Address, CreateAddressPayload, AddressType } from '@/lib/types/customer';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GuestFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  createAccount: boolean;
  password: string;
  confirmPassword: string;
}

const EMPTY_GUEST_FORM: GuestFormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  createAccount: true,
  password: '',
  confirmPassword: '',
};

const DELIVERY_TYPE_OPTIONS = [
  { value: 'home_delivery', label: 'Home Delivery' },
  { value: 'home_service', label: 'Home Service' },
  { value: 'office_booking', label: 'Office / Booking' },
  { value: 'outlet_pickup', label: 'Outlet Pickup' },
] as const;

const EMPTY_ADDRESS_FORM: CreateAddressPayload = {
  address_line_1: '',
  address_line_2: '',
  contact_no: '',
  city: '',
  state: '',
  zip_code: '',
  address_type: 'shipping_address',
  is_default: false,
};

const ADDRESS_TYPE_OPTIONS: { value: AddressType; label: string; icon: React.ReactNode }[] = [
  { value: 'user_address', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { value: 'shipping_address', label: 'Shipping', icon: <Building2 className="w-4 h-4" /> },
  { value: 'billing_address', label: 'Billing', icon: <MapPin className="w-4 h-4" /> },
];

// ─── Address Modal (add + edit) ───────────────────────────────────────────────
// IMPORTANT: rendered via portal-pattern — always outside the checkout <form>
// to prevent inner form submit from bubbling up to outer form.

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
      : EMPTY_ADDRESS_FORM,
  );
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const busy = createAddress.isPending || updateAddress.isPending;

  function set(field: keyof CreateAddressPayload, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // stopPropagation prevents this inner form submit from reaching the outer checkout form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    const payload = {
      ...form,
      address_line_2: form.address_line_2 || undefined,
      state: form.state || undefined,
      zip_code: form.zip_code || undefined,
    };
    try {
      if (initial) {
        await updateAddress.mutateAsync({ id: initial.id, payload });
        toast.success('Address updated');
      } else {
        await createAddress.mutateAsync(payload);
        toast.success('Address added');
      }
      onClose();
    } catch {
      // error shown inline
    }
  }

  const isError = createAddress.isError || updateAddress.isError;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            {initial ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Standalone form — NOT nested inside checkout form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Address Line 1 *</label>
            <input
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
              value={form.address_line_1}
              onChange={(e) => set('address_line_1', e.target.value)}
              placeholder="Street, House No, Apartment"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Address Line 2</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
              value={form.address_line_2 ?? ''}
              onChange={(e) => set('address_line_2', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">City *</label>
              <input
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">State</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
                value={form.state ?? ''}
                onChange={(e) => set('state', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">ZIP Code</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
                value={form.zip_code ?? ''}
                onChange={(e) => set('zip_code', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Contact No. *</label>
              <input
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
                value={form.contact_no}
                onChange={(e) => set('contact_no', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Address Type *</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/60 bg-white"
              value={form.address_type}
              onChange={(e) => set('address_type', e.target.value as AddressType)}
            >
              {ADDRESS_TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
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

          {isError && (
            <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-[#FCE32D] rounded-lg hover:bg-[#e6cc28] disabled:opacity-60"
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

// ─── Authenticated Shipping Section ──────────────────────────────────────────

function AuthShippingSection({
  selectedAddressId,
  onSelect,
  onAddNew,
  onEdit,
}: {
  selectedAddressId: number | null;
  onSelect: (id: number) => void;
  onAddNew: () => void;
  onEdit: (address: Address) => void;
}) {
  const { data: addresses = [], isLoading } = useAddresses();

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const def = addresses.find((a: Address) => a.is_default) ?? addresses[0];
      onSelect(def.id);
    }
  }, [addresses, selectedAddressId, onSelect]);

  const typeIcon = (type: AddressType) => {
    switch (type) {
      case 'user_address': return <Home className="w-4 h-4 text-blue-500" />;
      case 'shipping_address': return <Building2 className="w-4 h-4 text-green-500" />;
      default: return <MapPin className="w-4 h-4 text-gray-400" />;
    }
  };

  const typeLabel = (type: AddressType) => {
    switch (type) {
      case 'user_address': return 'Home';
      case 'shipping_address': return 'Shipping';
      case 'billing_address': return 'Billing';
      default: return type;
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-[20px] sm:text-[22px] font-[600] text-[#12100E]">Shipping Information</h2>
            <p className="text-xs text-gray-400 mt-0.5">Select Shipping Address</p>
          </div>
          <button
            type="button"
            onClick={onAddNew}
            className="flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            Add New Address
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-3">
          {isLoading && (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
            </div>
          )}

          {!isLoading && addresses.length === 0 && (
            <div className="flex flex-col items-center py-10 text-center gap-3">
              <MapPin className="w-10 h-10 text-gray-200" />
              <p className="text-sm text-gray-500">No saved addresses yet.</p>
              <button
                type="button"
                onClick={onAddNew}
                className="text-sm font-medium text-yellow-600 underline underline-offset-2"
              >
                Add your first address
              </button>
            </div>
          )}

          {!isLoading && addresses.map((address: Address) => {
            const isSelected = selectedAddressId === address.id;
            return (
              <div
                key={address.id}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-[#12100E] bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {/* Radio — clicking anywhere on the row selects it */}
                <button
                  type="button"
                  onClick={() => onSelect(address.id)}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'border-[#12100E] bg-[#12100E]' : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white block" />}
                </button>

                {/* Address Info */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onSelect(address.id)}
                >
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {typeIcon(address.address_type)}
                    <span className="text-sm font-semibold text-gray-900">{typeLabel(address.address_type)}</span>
                    {address.is_default && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{address.address_line_1}</p>
                  {address.address_line_2 && (
                    <p className="text-sm text-gray-600">{address.address_line_2}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {[address.city, address.state, address.zip_code].filter(Boolean).join(', ')}
                  </p>
                  {address.contact_no && (
                    <p className="text-xs text-gray-400 mt-1">{address.contact_no}</p>
                  )}
                </div>

                {/* Edit button */}
                <button
                  type="button"
                  onClick={() => onEdit(address)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                  title="Edit address"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </>
  );
}

// ─── Guest Shipping Section ───────────────────────────────────────────────────

function GuestShippingSection({
  formData,
  onChange,
}: {
  formData: GuestFormData;
  onChange: (updates: Partial<GuestFormData>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);

  const sendOtp = useSendRegistrationOtp();
  const verifyOtp = useVerifyOtp();

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    onChange({ [name]: type === 'checkbox' ? checked : value });
    // Reset verification if email changes
    if (name === 'email') {
      setEmailVerified(false);
      setOtpSent(false);
      setOtp('');
      setOtpError(null);
    }
  }

  async function handleSendOtp() {
    if (!formData.email) {
      toast.error('Please enter an email address first');
      return;
    }
    setOtpError(null);
    sendOtp.mutate(
      { email: formData.email },
      {
        onSuccess: () => {
          setOtpSent(true);
          toast.success('Verification code sent to your email');
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message ?? 'Failed to send verification code';
          toast.error(msg);
        },
      }
    );
  }

  async function handleVerifyOtp() {
    if (!otp.trim()) return;
    setOtpError(null);
    verifyOtp.mutate(
      { email: formData.email, otp: otp.trim() },
      {
        onSuccess: () => {
          setEmailVerified(true);
          setOtpSent(false);
          toast.success('Email verified successfully!');
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message ?? 'Invalid verification code';
          setOtpError(msg);
        },
      }
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB]">
      {/* Already have account banner */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-blue-50 rounded-t-lg border-b border-blue-100">
        <div>
          <p className="text-sm font-semibold text-gray-800">Already have an account?</p>
          <p className="text-xs text-blue-600 mt-0.5">Login to use saved addresses and faster checkout</p>
        </div>
        <Link
          href="/login?redirect=/checkout"
          className="px-5 py-2 bg-[#12100E] text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Login
        </Link>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Contact &amp; Shipping Information</h3>

        {/* Contact Information */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-3">Contact Information</p>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text" name="fullName"
                value={formData.fullName} onChange={handleInput}
                placeholder="Enter your full name" required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Email with OTP verify */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative flex gap-2">
                <input
                  type="email" name="email"
                  value={formData.email} onChange={handleInput}
                  placeholder="your.email@example.com" required
                  disabled={emailVerified}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-50"
                />
                {emailVerified ? (
                  <div className="flex items-center gap-1.5 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-xs font-medium text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendOtp.isPending || !formData.email}
                    className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-700 hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-medium rounded-lg whitespace-nowrap transition-colors"
                  >
                    {sendOtp.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                    {otpSent ? 'Resend' : 'Verify Email'}
                  </button>
                )}
              </div>

              {/* OTP Input */}
              {otpSent && !emailVerified && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-500">Enter the 6-digit code sent to <strong>{formData.email}</strong></p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value); setOtpError(null); }}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={verifyOtp.isPending || otp.length < 4}
                      className="px-4 py-2.5 bg-[#FDDE35] hover:bg-[#ffed4e] disabled:opacity-50 text-gray-900 text-sm font-semibold rounded-lg transition-colors"
                    >
                      {verifyOtp.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                    </button>
                  </div>
                  {otpError && <p className="text-xs text-red-500">{otpError}</p>}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel" name="phoneNumber"
                value={formData.phoneNumber} onChange={handleInput}
                placeholder="+880 1XXX-XXXXXX" required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-3">Shipping Address</p>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Street, House, Apartment <span className="text-red-500">*</span>
              </label>
              <input
                type="text" name="streetAddress"
                value={formData.streetAddress} onChange={handleInput}
                placeholder="Enter Street Address, House No, Apartment No" required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="city"
                  value={formData.city} onChange={handleInput}
                  placeholder="e.g. Dhaka" required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">State / Division</label>
                <input
                  type="text" name="state"
                  value={formData.state} onChange={handleInput}
                  placeholder="e.g. Dhaka"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Zip Code</label>
                <input
                  type="text" name="zipCode"
                  value={formData.zipCode} onChange={handleInput}
                  placeholder="e.g. 1200"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Create Account checkbox */}
        <div className="border-t border-gray-100 pt-5 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox" name="createAccount"
              checked={formData.createAccount}
              onChange={handleInput}
              className="w-4 h-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
            />
            <span className="text-sm font-medium text-gray-800">Create an account for faster checkout next time</span>
          </label>

          {formData.createAccount && (
            <div className="space-y-4 pl-7">
              <p className="text-xs text-blue-600">Your account will be created after successful payment</p>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password} onChange={handleInput}
                    placeholder="Enter password (min 8 characters)"
                    minLength={8} required={formData.createAccount}
                    className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword} onChange={handleInput}
                    placeholder="Re-enter your password"
                    required={formData.createAccount}
                    className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items: cartItems, clearCart, appliedCoupon, setAppliedCoupon } = useCart();

  // Auth user: selected address id
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  // Address modals — lifted here so they render outside <form>
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  // Guest user: form data
  const [guestForm, setGuestForm] = useState<GuestFormData>(EMPTY_GUEST_FORM);

  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash_on_delivery');
  const [deliveryType, setDeliveryType] = useState<string>('home_delivery');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [showCouponList, setShowCouponList] = useState(false);
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(true);
  const shippingFetchedRef = useRef(false);

  // ── Hooks ──────────────────────────────────────────────────────────────────
  const shippingMethodsMutation = useShippingMethods();
  const checkoutPreviewMutation = useCheckoutPreview();
  const processCheckout = useProcessCheckout();
  const { data: availableCoupons, isLoading: couponsLoading } = useAvailableCoupons();
  const cartSummaryMutation = useCartSummary();
  const { data: paymentMethodOptions = [], isLoading: paymentMethodsLoading } = usePaymentMethods(deliveryType);

  const shippingOptions: ShippingMethodOption[] = shippingMethodsMutation.data ?? [];
  const preview = checkoutPreviewMutation.data;

  const [cartSummary, setCartSummary] = useState<{
    subtotal: number;
    promotion_discount: number;
    coupon_discount: number;
    total: number;
  } | null>(null);

  const rawSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const promotionDiscount = cartSummary?.promotion_discount ?? preview?.promotion_discount ?? 0;

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (cartItems.length === 0) { setCartSummary(null); return; }
    cartSummaryMutation.mutate(
      { items: cartItems.map((i) => ({ product_id: i.product_id, variation_id: i.variation_id ?? null, quantity: i.quantity })) },
      { onSuccess: (data) => setCartSummary(data) }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  useEffect(() => {
    if (cartItems.length === 0 || shippingFetchedRef.current) return;
    shippingFetchedRef.current = true;
    shippingMethodsMutation.mutate({
      items: cartItems.map((i) => ({
        product_id: i.product_id,
        variation_id: i.variation_id ?? null,
        quantity: i.quantity,
      })),
      subtotal: rawSubtotal,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  useEffect(() => {
    if (shippingOptions.length > 0 && !selectedShipping) {
      const recommended = shippingOptions.find((o) => o.recommended) ?? shippingOptions[0];
      setSelectedShipping(recommended.code);
    }
  }, [shippingOptions, selectedShipping]);

  useEffect(() => {
    if (paymentMethodOptions.length > 0) {
      const current = paymentMethodOptions.find((m) => m.value === selectedPayment);
      if (!current) setSelectedPayment(paymentMethodOptions[0].value as PaymentMethod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethodOptions]);

  useEffect(() => {
    if (!selectedShipping || cartItems.length === 0) return;
    checkoutPreviewMutation.mutate({
      items: cartItems.map((i) => ({
        product_id: i.product_id,
        variation_id: i.variation_id ?? null,
        quantity: i.quantity,
        price: i.product.price,
      })),
      shipping_method: selectedShipping,
      coupon_code: appliedCoupon?.code || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShipping, appliedCoupon]);

  // ── Coupon handlers ────────────────────────────────────────────────────────
  function handleApplyCoupon(code: string) {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setCouponError(null);
    cartSummaryMutation.mutate(
      {
        items: cartItems.map((i) => ({ product_id: i.product_id, variation_id: i.variation_id ?? null, quantity: i.quantity })),
        coupon_code: trimmed,
      },
      {
        onSuccess: (data) => {
          if (data.coupon_error) {
            setCouponError(data.coupon_error);
          } else {
            setAppliedCoupon({ code: trimmed, discount: data.coupon_discount ?? 0 });
            setCouponCode('');
            setShowCouponList(false);
          }
        },
        onError: (err: unknown) => {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          setCouponError(msg ?? 'Invalid coupon code.');
        },
      }
    );
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponCode('');
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedShipping) {
      toast.error('Please select a shipping method');
      return;
    }

    if (user && !selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }

    if (!user && guestForm.createAccount) {
      if (guestForm.password !== guestForm.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (guestForm.password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }
    }

    const commonServicePayload = {
      delivery_type: deliveryType,
      selected_services: selectedServices.map((s) => ({
        service_id: s.service_id,
        scheduled_date: s.scheduled_date || undefined,
        scheduled_time: s.scheduled_time || undefined,
      })),
    };

    const payload = user
      ? {
          items: cartItems.map((i) => ({
            product_id: i.product_id,
            variation_id: i.variation_id ?? null,
            quantity: i.quantity,
            price: i.product.price,
          })),
          shipping_address_id: selectedAddressId ?? undefined,
          shipping_method: selectedShipping,
          payment_method: selectedPayment,
          coupon_code: appliedCoupon?.code || undefined,
          notes: undefined,
          ...commonServicePayload,
        }
      : {
          items: cartItems.map((i) => ({
            product_id: i.product_id,
            variation_id: i.variation_id ?? null,
            quantity: i.quantity,
            price: i.product.price,
          })),
          guest_email: guestForm.email,
          guest_name: guestForm.fullName,
          guest_phone: guestForm.phoneNumber,
          shipping_address: {
            address_line_1: guestForm.streetAddress,
            city: guestForm.city,
            state: guestForm.state || undefined,
            postal_code: guestForm.zipCode || undefined,
            country: 'Bangladesh',
            phone: guestForm.phoneNumber,
          },
          ...(guestForm.createAccount ? {
            create_account: true,
            password: guestForm.password,
            password_confirmation: guestForm.confirmPassword,
          } : {}),
          shipping_method: selectedShipping,
          payment_method: selectedPayment,
          coupon_code: appliedCoupon?.code || undefined,
          ...commonServicePayload,
        };

    processCheckout.mutate(payload, {
      onSuccess: (data) => {
        clearCart();
        if (data?.payment?.gateway_url) {
          window.location.href = data.payment.gateway_url;
        } else {
          toast.success('Order placed successfully!');
          router.push(`/orders/${data?.order?.order_number ?? ''}`);
        }
      },
      onError: (e: any) => {
        toast.error(e.response?.data?.message ?? 'Failed to place order. Please try again.');
      },
    });
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const shippingCost = preview?.shipping_cost ?? 0;
  const couponDiscount = preview?.coupon_discount ?? appliedCoupon?.discount ?? 0;

  const serviceMap = new Map<number, { service_id: number; name: string; type: string; price: number; scheduled_date?: string; scheduled_time?: string }>();
  for (const item of cartItems) {
    for (const svc of item.selectedServices ?? []) {
      const existing = serviceMap.get(svc.service_id);
      if (!existing || svc.price > existing.price) serviceMap.set(svc.service_id, svc);
    }
  }
  const selectedServices = Array.from(serviceMap.values());
  const serviceCost = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const total = preview?.total ?? (rawSubtotal - promotionDiscount - couponDiscount + shippingCost + serviceCost);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* ── Left Column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">

              {/* Shipping Section — auth vs guest */}
              {user ? (
                <AuthShippingSection
                  selectedAddressId={selectedAddressId}
                  onSelect={setSelectedAddressId}
                  onAddNew={() => setShowAddAddressModal(true)}
                  onEdit={setEditingAddress}
                />
              ) : (
                <GuestShippingSection
                  formData={guestForm}
                  onChange={(updates) => setGuestForm((prev) => ({ ...prev, ...updates }))}
                />
              )}

              {/* ── Shipping Method ────────────────────────────────────────── */}
              <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">Shipping Method</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Select how you want your order delivered</p>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {shippingMethodsMutation.isPending ? (
                    <div className="flex flex-col items-center gap-3 py-8 text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                      <span className="text-sm">Calculating shipping rates…</span>
                    </div>
                  ) : shippingOptions.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8">
                      <Truck className="w-8 h-8 text-gray-200" />
                      <p className="text-sm text-gray-400 text-center">
                        No shipping methods available.<br />Please check your cart items or contact support.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {shippingOptions.map((option) => {
                        const isSelected = selectedShipping === option.code;
                        return (
                          <label
                            key={option.code}
                            className={`flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#ffd700] bg-amber-50/50 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                            }`}
                          >
                            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? 'border-[#ffd700] bg-[#ffd700]' : 'border-gray-300 bg-white'
                            }`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-gray-900 block" />}
                            </div>
                            <input
                              type="radio" name="shippingMethod"
                              value={option.code} checked={isSelected}
                              onChange={() => setSelectedShipping(option.code)}
                              className="sr-only"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-sm font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                                  {option.name}
                                </span>
                                {option.recommended && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> Best Match
                                  </span>
                                )}
                                {option.is_free && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                                    FREE
                                  </span>
                                )}
                              </div>
                              {option.description && (
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{option.description}</p>
                              )}
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                                {option.delivery_time && (
                                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                    </svg>
                                    {option.delivery_time}
                                  </span>
                                )}
                                {!option.is_free && option.free_shipping_min_order && (
                                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path d="M5 13l4 4L19 7" />
                                    </svg>
                                    Free over ৳{Number(option.free_shipping_min_order).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                              {option.is_free ? (
                                <div>
                                  <span className="text-sm font-bold text-emerald-600">Free</span>
                                  {option.cost > 0 && (
                                    <p className="text-[10px] text-gray-400 line-through">৳{Number(option.cost).toFixed(0)}</p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm font-bold text-gray-900">
                                  ৳{Number(option.cost).toFixed(0)}
                                </span>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Services Summary ───────────────────────────────────────── */}
              {selectedServices.length > 0 && (
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-4">
                    <ConciergeBell className="w-5 h-5 text-gray-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Selected Services</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedServices.map((svc) => (
                      <div key={svc.service_id} className="flex justify-between items-center text-sm py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <span className="font-medium text-gray-800">{svc.name}</span>
                          {svc.scheduled_date && (
                            <span className="ml-2 text-xs text-gray-500">
                              {svc.scheduled_date}{svc.scheduled_time ? ` at ${svc.scheduled_time}` : ''}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-gray-900">{svc.price > 0 ? `৳${svc.price.toFixed(2)}` : 'Free'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Delivery Type ──────────────────────────────────────────── */}
              <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#E5E7EB]">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Delivery Type</h3>
                <div className="grid grid-cols-2 gap-3">
                  {DELIVERY_TYPE_OPTIONS.map((dt) => (
                    <label
                      key={dt.value}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-2 ${
                        deliveryType === dt.value
                          ? 'border-[#ffd700] bg-yellow-50/40'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio" name="deliveryType"
                        value={dt.value} checked={deliveryType === dt.value}
                        onChange={() => setDeliveryType(dt.value)}
                        className="w-4 h-4 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                      />
                      <span className="text-sm font-medium text-gray-900">{dt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Payment Method ─────────────────────────────────────────── */}
              <div className="bg-white rounded-lg border border-[#E5E7EB]">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E5E7EB]">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Select a Payment Method</h2>
                  <button
                    type="button"
                    onClick={() => setIsPaymentExpanded(!isPaymentExpanded)}
                    className="text-gray-400 hover:text-gray-600 transition-transform"
                    style={{ transform: isPaymentExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                {isPaymentExpanded && (
                  <div className="p-4 sm:p-6 space-y-3">
                    {paymentMethodsLoading ? (
                      <div className="flex items-center gap-2 py-4 text-gray-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading payment methods...
                      </div>
                    ) : (
                      paymentMethodOptions.map((pm) => (
                        <label
                          key={pm.value}
                          className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors border-2 ${
                            selectedPayment === pm.value
                              ? 'border-[#ffd700] bg-yellow-50/40'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <input
                            type="radio" name="paymentMethod"
                            value={pm.value} checked={selectedPayment === pm.value}
                            onChange={() => setSelectedPayment(pm.value as PaymentMethod)}
                            className="w-5 h-5 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                          />
                          <span className="text-sm font-medium text-gray-900">{pm.label}</span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Column — Order Summary ─────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-[#E5E7EB] lg:sticky lg:top-4 overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-bold text-[#101114]">Order Summary</h2>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  {/* Cart items */}
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center">Your cart is empty.</p>
                  ) : (
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-2 sm:gap-3">
                          <div className="w-14 h-14 bg-gray-50 rounded-lg flex-shrink-0 relative border border-gray-100">
                            {item.product.image ? (
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                fill unoptimized
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs rounded-lg">No img</div>
                            )}
                            <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 min-w-[18px] bg-gray-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[12px] sm:text-[13px] font-medium text-gray-900 mb-1 line-clamp-2 leading-snug">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[11px] text-gray-400">
                                ৳{item.product.price.toFixed(0)} × {item.quantity}
                              </span>
                              <span className="text-[13px] font-semibold text-gray-900">
                                ৳{(item.product.price * item.quantity).toFixed(0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Coupon */}
                  <div className="mb-1">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-[4px] px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-[13px] font-[600] text-green-700">{appliedCoupon.code}</span>
                          <span className="text-[12px] text-green-600">- {appliedCoupon.discount.toFixed(2)} BDT</span>
                        </div>
                        <button type="button" onClick={handleRemoveCoupon} className="text-gray-400 hover:text-gray-600 ml-2">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => { setCouponCode(e.target.value); setCouponError(null); }}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon(couponCode)}
                            className="w-full h-[48px] px-3 pr-28 bg-white border border-gray-300 rounded-[4px] text-[14px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyCoupon(couponCode)}
                            disabled={cartSummaryMutation.isPending}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-[100px] h-[36px] bg-[#FDDE35] hover:bg-[#ffed4e] disabled:opacity-60 text-[#12100E] text-[13px] font-[600] px-2 rounded-[4px] flex items-center justify-center gap-1 whitespace-nowrap"
                          >
                            {cartSummaryMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply Coupon'}
                          </button>
                        </div>
                        {couponError && <p className="text-[12px] text-red-500 mt-1.5 px-1">{couponError}</p>}

                        <button
                          type="button"
                          onClick={() => setShowCouponList((v) => !v)}
                          className="mt-2 flex items-center gap-1.5 text-[12px] text-[#6B7280] hover:text-[#374151] transition-colors"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          View available coupons
                          {showCouponList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {showCouponList && (
                          <div className="mt-2 bg-white border border-gray-200 rounded-[8px] overflow-hidden">
                            {couponsLoading ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                              </div>
                            ) : !availableCoupons?.length ? (
                              <p className="text-[13px] text-gray-400 text-center py-4">No coupons available.</p>
                            ) : (
                              <ul className="divide-y divide-gray-100 max-h-[240px] overflow-y-auto">
                                {(availableCoupons as AvailableCoupon[]).map((coupon) => (
                                  <li key={coupon.id} className="p-3 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                          <span className="font-[700] text-[13px] text-[#101114] tracking-wide">{coupon.code}</span>
                                          <span className="text-[11px] font-[600] text-[#FDDE35] bg-[#101114] px-1.5 py-0.5 rounded">
                                            {coupon.discount_type === 'percentage'
                                              ? `${coupon.discount_value}% OFF`
                                              : coupon.discount_type === 'free_shipping'
                                              ? 'FREE SHIP'
                                              : `${coupon.discount_value} BDT OFF`}
                                          </span>
                                        </div>
                                        {coupon.description && (
                                          <p className="text-[12px] text-gray-500 leading-snug">{coupon.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-x-3 mt-1">
                                          {coupon.min_order_amount && (
                                            <span className="text-[11px] text-gray-400">Min: {coupon.min_order_amount} BDT</span>
                                          )}
                                          {coupon.max_discount_amount && (
                                            <span className="text-[11px] text-gray-400">Max off: {coupon.max_discount_amount} BDT</span>
                                          )}
                                          {coupon.expires_at && (
                                            <span className="text-[11px] text-gray-400">
                                              Expires: {new Date(coupon.expires_at).toLocaleDateString()}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleApplyCoupon(coupon.code)}
                                        disabled={cartSummaryMutation.isPending}
                                        className="flex-shrink-0 text-[12px] font-[600] text-[#101114] bg-[#FDDE35] hover:bg-[#ffed4e] disabled:opacity-60 px-2.5 py-1.5 rounded-[4px] whitespace-nowrap"
                                      >
                                        Apply
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 space-y-2.5">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-gray-500">
                          Subtotal
                          <span className="ml-1 text-[11px] text-gray-400">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                        </span>
                        {cartSummaryMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                        ) : (
                          <span className="font-medium text-gray-800">৳{rawSubtotal.toFixed(0)}</span>
                        )}
                      </div>

                      {promotionDiscount > 0 && (
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-emerald-600 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7" /></svg>
                            Promo Discount
                          </span>
                          <span className="font-medium text-emerald-600">−৳{promotionDiscount.toFixed(0)}</span>
                        </div>
                      )}

                      {couponDiscount > 0 && (
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-emerald-600 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            Coupon ({appliedCoupon?.code})
                          </span>
                          <span className="font-medium text-emerald-600">−৳{couponDiscount.toFixed(0)}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-gray-400" />
                          Shipping
                          {selectedShipping && !checkoutPreviewMutation.isPending && (
                            <span className="text-[10px] text-gray-400 ml-1">
                              ({shippingOptions.find(o => o.code === selectedShipping)?.name ?? selectedShipping})
                            </span>
                          )}
                        </span>
                        {checkoutPreviewMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                        ) : !selectedShipping ? (
                          <span className="text-[12px] text-gray-400 italic">Select method</span>
                        ) : shippingCost === 0 ? (
                          <span className="font-semibold text-emerald-600 text-xs">FREE</span>
                        ) : (
                          <span className="font-medium text-gray-800">৳{shippingCost.toFixed(0)}</span>
                        )}
                      </div>

                      {serviceCost > 0 && (
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-gray-500">Services</span>
                          <span className="font-medium text-gray-800">৳{serviceCost.toFixed(0)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-100">
                      <span className="text-[14px] sm:text-[15px] font-bold text-gray-900">Total</span>
                      <span className="text-[16px] sm:text-[18px] font-bold text-gray-900">৳{total.toFixed(0)}</span>
                    </div>
                  </div>

                  {/* Place Order */}
                  <button
                    type="submit"
                    disabled={processCheckout.isPending || cartItems.length === 0 || !selectedShipping}
                    className="w-full flex items-center justify-center gap-2 bg-[#FDDE35] hover:bg-[#ffed4e] disabled:opacity-60 disabled:cursor-not-allowed text-[#181910] text-[14px] sm:text-[16px] font-[600] py-3 rounded-lg transition-colors"
                  >
                    {processCheckout.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {processCheckout.isPending ? 'Placing Order…' : 'Place Order'}
                  </button>

                  <p className="text-[11px] text-gray-400 text-center">
                    By placing your order you agree to our Terms &amp; Conditions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Address modals — outside <form> so their submit never triggers checkout submit */}
      {showAddAddressModal && (
        <AddressModal onClose={() => setShowAddAddressModal(false)} />
      )}
      {editingAddress && (
        <AddressModal
          initial={editingAddress}
          onClose={() => setEditingAddress(null)}
        />
      )}
    </div>
  );
}
