'use client';

import { useState, useRef, useEffect } from 'react';
import { Star, Minus, Plus, ShoppingBag, Calendar, Clock, AlertCircle, Loader2, ChevronDown, Check } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useProductServices } from '@/lib/hooks/public/useServices';
import type { SelectedService } from '@/lib/context/CartContext';

interface ProductInfoProps {
  product: {
    id: number;
    slug: string;
    brand: string;
    name: string;
    rating: number;
    reviews: number;
    sku: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    inStock: boolean;
    image: string;
    compare_price?: number;
  };
}

// "No service" sentinel — null means the user explicitly chose no optional service
const NO_SERVICE_ID = -1;

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [paymentOption, setPaymentOption] = useState('full');
  const [added, setAdded] = useState(false);

  // One selected optional service at a time (null = none chosen yet, NO_SERVICE_ID = "No Installation")
  const [selectedOptionalId, setSelectedOptionalId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [scheduledDates, setScheduledDates] = useState<Record<number, string>>({});
  const [scheduledTimes, setScheduledTimes] = useState<Record<number, string>>({});

  const { data: services = [], isLoading: servicesLoading } = useProductServices(product.id);

  const requiredServices = services.filter((s) => s.is_required);
  const optionalServices = services.filter((s) => !s.is_required);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When services load, auto-select the first optional service if any
  useEffect(() => {
    if (optionalServices.length > 0 && selectedOptionalId === null) {
      setSelectedOptionalId(optionalServices[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services]);

  const selectedOptionalService = selectedOptionalId !== null && selectedOptionalId !== NO_SERVICE_ID
    ? services.find((s) => s.id === selectedOptionalId)
    : null;

  // All active service ids (required + chosen optional)
  const activeServiceIds = [
    ...requiredServices.map((s) => s.id),
    ...(selectedOptionalService ? [selectedOptionalService.id] : []),
  ];

  // Total cost of selected services
  const serviceCost = [
    ...requiredServices,
    ...(selectedOptionalService ? [selectedOptionalService] : []),
  ].reduce((sum, s) => sum + s.price, 0);

  function buildSelectedServices(): SelectedService[] {
    return activeServiceIds.reduce<SelectedService[]>((acc, id) => {
      const svc = services.find((s) => s.id === id);
      if (!svc) return acc;
      acc.push({
        service_id: svc.id,
        name: svc.name,
        type: svc.type as string,
        price: svc.price,
        scheduled_date: scheduledDates[svc.id] || undefined,
        scheduled_time: scheduledTimes[svc.id] || undefined,
      });
      return acc;
    }, []);
  }

  const schedulingRequiredIds = activeServiceIds.filter(
    (id) => services.find((s) => s.id === id)?.requires_scheduling,
  );
  const missingScheduling = schedulingRequiredIds.some(
    (id) => !scheduledDates[id] || !scheduledTimes[id],
  );
  const canAddToCart = product.inStock && !missingScheduling;

  // Price shown in payment options = product price + service cost
  const totalWithServices = product.price + serviceCost;

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      quantity,
      selectedServices: buildSelectedServices(),
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        compare_price: product.compare_price,
        image: product.image,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Label shown inside the dropdown trigger
  const dropdownLabel = selectedOptionalId === null
    ? 'Select a service'
    : selectedOptionalId === NO_SERVICE_ID
    ? 'No Installation'
    : (selectedOptionalService?.name ?? 'Select a service');

  return (
    <div className="flex flex-col w-full font-sans">
      {/* Brand */}
      <div className="text-[#FF3B30] text-[14px] font-[500] mb-2">{product.brand}</div>

      {/* Title */}
      <h1 className="text-[24px] font-[500] text-[#181910] leading-tight mb-4">
        {product.name}
      </h1>

      {/* Ratings and SKU */}
      <div className="flex items-center gap-6 text-sm mb-3">
        <div className="flex items-center gap-2">
          <div className="flex text-[#FF8904]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-[16px] h-[16px] ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-[#4D4C44] text-[14px] font-[400] underline decoration-gray-400 underline-offset-2 cursor-pointer hover:text-gray-700">
            ({product.reviews} Reviews)
          </span>
        </div>
        <div className="text-[#12100E] text-[16px] font-[400]">
          Sku: {product.sku}
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-center gap-4 pb-4 border-b border-[#E5E7EB] mb-5">
        <span className="text-[24px] font-[600] text-[#12100E]">{product.price.toFixed(2)} BDT</span>
        {product.originalPrice && (
          <>
            <span className="text-[#4D4C44] line-through text-[16px] font-[400]">BDT {product.originalPrice.toFixed(2)}</span>
            {product.discount && (
              <span className="bg-[#FF3B30] text-white text-[12px] font-[600] px-2 py-1 rounded-[2px]">
                -{product.discount}% off
              </span>
            )}
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-[16px] h-[16px] rounded-full border-2 border-[#E5E7EB] ${product.inStock ? 'bg-[#00A63E]' : 'bg-red-500'}`} />
        <span className={`text-[16px] font-[600] ${product.inStock ? 'text-[#00A63E]' : 'text-red-500'}`}>
          {product.inStock ? 'Available in stock' : 'Out of stock'}
        </span>
      </div>

      {/* Quantity + Service row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-[20px]">
        {/* Quantity */}
        <div className="flex flex-col gap-2 w-full sm:w-[206px]">
          <span className="text-[#12100E] text-[16px] font-[500]">Quantity:</span>
          <div className="flex items-center border border-gray-200 rounded-md h-12 w-full justify-between px-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-gray-400 hover:text-[#181910]"
            >
              <Minus className="w-[10px] h-[24px] text-[#6A7282]" />
            </button>
            <span className="text-[16px] font-[600] text-[#12100E]">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-gray-400 hover:text-[#181910]"
            >
              <Plus className="w-[10px] h-[24px] text-[#161617]" />
            </button>
          </div>
        </div>

        {/* Service dropdown (only when optional services exist) */}
        {servicesLoading ? (
          <div className="flex flex-col gap-2 flex-1">
            <span className="text-[#12100E] text-[16px] font-[500]">Service</span>
            <div className="flex items-center h-12 px-4 border border-gray-200 rounded-md text-gray-400 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading…
            </div>
          </div>
        ) : optionalServices.length > 0 ? (
          <div className="flex flex-col gap-2 flex-1 relative" ref={dropdownRef}>
            <span className="text-[#12100E] text-[16px] font-[500]">
              Service <span className="text-red-500">*</span>
            </span>
            {/* Trigger */}
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className={`flex items-center justify-between h-12 px-4 border-2 rounded-md text-left transition-colors bg-white ${
                dropdownOpen ? 'border-[#FACD15]' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`text-[14px] font-[500] ${selectedOptionalId === null ? 'text-gray-400' : 'text-[#12100E]'}`}>
                {dropdownLabel}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown panel */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-md shadow-lg z-20 overflow-hidden">
                {optionalServices.map((svc) => {
                  const isActive = selectedOptionalId === svc.id;
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => { setSelectedOptionalId(svc.id); setDropdownOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left text-[14px] transition-colors ${
                        isActive ? 'bg-[#FACD15]/20 font-[600] text-[#12100E]' : 'hover:bg-gray-50 font-[400] text-[#12100E]'
                      }`}
                    >
                      <span>{svc.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-[500] text-[#4D4C44]">
                          {svc.price > 0 ? `+${svc.price.toFixed(2)} BDT` : 'Free'}
                        </span>
                        {isActive && <Check className="w-4 h-4 text-[#12100E]" />}
                      </div>
                    </button>
                  );
                })}
                {/* No Installation option */}
                <button
                  type="button"
                  onClick={() => { setSelectedOptionalId(NO_SERVICE_ID); setDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left text-[14px] transition-colors border-t border-gray-100 ${
                    selectedOptionalId === NO_SERVICE_ID ? 'bg-[#FACD15]/20 font-[600] text-[#12100E]' : 'hover:bg-gray-50 font-[400] text-[#6B7280]'
                  }`}
                >
                  <span>No Installation</span>
                  {selectedOptionalId === NO_SERVICE_ID && <Check className="w-4 h-4 text-[#12100E]" />}
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Required services (always shown, not in dropdown) */}
      {requiredServices.length > 0 && (
        <div className="mb-[20px] rounded-lg border border-[#E5E7EB] overflow-hidden">
          <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100">
            <span className="text-[13px] font-[600] text-amber-700">Included Services</span>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {requiredServices.map((svc) => (
              <div key={svc.id} className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-[#FDDE35] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-gray-900" strokeWidth={3} />
                  </div>
                  <span className="text-[14px] font-[600] text-[#12100E]">{svc.name}</span>
                  <span className="ml-auto text-[13px] font-[600] text-[#12100E]">
                    {svc.price > 0 ? `+${svc.price.toFixed(2)} BDT` : 'Free'}
                  </span>
                </div>
                {svc.description && <p className="text-[12px] text-[#4D4C44] ml-6">{svc.description}</p>}
                {svc.requires_scheduling && (
                  <div className="mt-3 ml-6 grid grid-cols-2 gap-2">
                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-[600] text-gray-600 mb-1">
                        <Calendar className="w-3 h-3" /> Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={scheduledDates[svc.id] ?? ''}
                        onChange={(e) => setScheduledDates((p) => ({ ...p, [svc.id]: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-2 py-1.5 text-[12px] border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1 text-[11px] font-[600] text-gray-600 mb-1">
                        <Clock className="w-3 h-3" /> Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={scheduledTimes[svc.id] ?? ''}
                        onChange={(e) => setScheduledTimes((p) => ({ ...p, [svc.id]: e.target.value }))}
                        className="w-full px-2 py-1.5 text-[12px] border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduling for the chosen optional service */}
      {selectedOptionalService?.requires_scheduling && (
        <div className="mb-[20px] rounded-lg border border-[#E5E7EB] p-4">
          <p className="text-[13px] font-[600] text-[#12100E] mb-3">
            Schedule: {selectedOptionalService.name}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="flex items-center gap-1 text-[11px] font-[600] text-gray-600 mb-1">
                <Calendar className="w-3 h-3" /> Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={scheduledDates[selectedOptionalService.id] ?? ''}
                onChange={(e) => setScheduledDates((p) => ({ ...p, [selectedOptionalService.id]: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-2 py-1.5 text-[12px] border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-[11px] font-[600] text-gray-600 mb-1">
                <Clock className="w-3 h-3" /> Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={scheduledTimes[selectedOptionalService.id] ?? ''}
                onChange={(e) => setScheduledTimes((p) => ({ ...p, [selectedOptionalService.id]: e.target.value }))}
                className="w-full px-2 py-1.5 text-[12px] border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>
      )}

      {missingScheduling && (
        <div className="flex items-center gap-2 mb-[20px] px-4 py-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 text-[12px]">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Please select a date and time for all scheduled services.
        </div>
      )}

      {/* Payment Options */}
      <div className="flex flex-col gap-3 mb-[20px]">
        <span className="text-[#12100E] text-[16px] font-[500]">Payment Options</span>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <button
            onClick={() => setPaymentOption('full')}
            className={`flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-colors ${
              paymentOption === 'full' ? 'border-[#FACD15]' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              paymentOption === 'full' ? 'border-[#FACD15]' : 'border-gray-300'
            }`}>
              {paymentOption === 'full' && <div className="w-2.5 h-2.5 bg-[#FACD15] rounded-full" />}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[16px] font-[500] text-[#12100E]">{totalWithServices.toFixed(2)} BDT</div>
              <div className="text-[12px] text-[#4D4C44] font-[400]">Online / Cash Payment</div>
              {serviceCost > 0 && (
                <div className="text-[11px] text-[#6B7280]">
                  Includes {serviceCost.toFixed(2)} BDT service fee
                </div>
              )}
            </div>
          </button>

          <button
            onClick={() => setPaymentOption('emi')}
            className={`flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-colors ${
              paymentOption === 'emi' ? 'border-[#FACD15]' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              paymentOption === 'emi' ? 'border-[#FACD15]' : 'border-gray-300'
            }`}>
              {paymentOption === 'emi' && <div className="w-2.5 h-2.5 bg-[#FACD15] rounded-full" />}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[16px] font-[500] text-[#12100E]">
                {(totalWithServices / 12).toFixed(2)} BDT <span className="text-[#4D4C44] font-[500]">/month</span>
              </div>
              <div className="text-[12px] font-[400] text-[#12100E]">Regular Price {totalWithServices.toFixed(2)} BDT</div>
              <div className="text-[12px] font-[400] text-[#4D4C44]">0% EMI for up to 12 Months</div>
            </div>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className={`h-12 text-[#181910] text-[14px] font-[600] rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            added ? 'bg-green-400 hover:bg-green-400' : 'bg-[#FDDE35] hover:bg-[#FACC15]'
          }`}
        >
          <ShoppingBag className="w-[16px] h-[16px]" />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
        <a
          href="/cart"
          className="h-12 border border-gray-900 text-[#181910] text-[14px] font-[600] rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <ShoppingBag className="w-[16px] h-[16px]" />
          Buy It Now
        </a>
      </div>
    </div>
  );
}
