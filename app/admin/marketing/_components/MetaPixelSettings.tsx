'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Info,
  ToggleLeft,
  ToggleRight,
  Share2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useMetaPixelConfiguration,
  useSaveMetaPixelConfiguration,
  useToggleMetaPixelActive,
} from '@/lib/hooks/admin/useAdminMetaPixel';
import type { MetaPixelEventName } from '@/lib/types/admin';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_EVENTS: MetaPixelEventName[] = [
  'ViewContent',
  'AddToCart',
  'InitiateCheckout',
  'Purchase',
];

const EVENT_DESCRIPTIONS: Record<MetaPixelEventName, string> = {
  ViewContent:      'Fired when a visitor views a product page',
  AddToCart:        'Fired when a product is added to the cart',
  InitiateCheckout: 'Fired when checkout is started',
  Purchase:         'Fired when an order is completed',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MetaPixelSettings() {
  const { data: config, isLoading } = useMetaPixelConfiguration();
  const save   = useSaveMetaPixelConfiguration();
  const toggle = useToggleMetaPixelActive();

  const [pixelId, setPixelId]                   = useState('');
  const [accessToken, setAccessToken]           = useState('');
  const [showToken, setShowToken]               = useState(false);
  const [enablePixel, setEnablePixel]           = useState(true);
  const [enableConvApi, setEnableConvApi]       = useState(false);
  const [eventsToTrack, setEventsToTrack]       = useState<MetaPixelEventName[]>([...ALL_EVENTS]);

  // Populate form from loaded config
  useEffect(() => {
    if (config) {
      setPixelId(config.pixel_id ?? '');
      setEnablePixel(config.enable_pixel ?? true);
      setEnableConvApi(config.enable_conversion_api ?? false);
      setEventsToTrack(config.events_to_track ?? [...ALL_EVENTS]);
    }
  }, [config]);

  function toggleEvent(event: MetaPixelEventName) {
    setEventsToTrack((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!pixelId.trim()) {
      toast.error('Pixel ID is required');
      return;
    }

    const payload: Parameters<typeof save.mutate>[0] = {
      pixel_id:              pixelId.trim(),
      enable_pixel:          enablePixel,
      enable_conversion_api: enableConvApi,
      events_to_track:       eventsToTrack,
    };

    if (accessToken.trim()) {
      payload.access_token = accessToken.trim();
    }

    save.mutate(payload, {
      onSuccess: () => {
        toast.success('Meta Pixel configuration saved');
        setAccessToken('');
      },
      onError: () => toast.error('Failed to save configuration'),
    });
  }

  function handleToggle() {
    toggle.mutate(undefined, {
      onSuccess: (data) => toast.success(data.message),
      onError: () => toast.error('Failed to toggle pixel'),
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const isConfigured = !!config?.pixel_id;
  const isActive     = config?.is_active ?? false;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* ── Left: Status card ── */}
      <div className="space-y-4">

        {/* Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Facebook Pixel</p>
              <p className="text-xs text-gray-400">Meta Ads Integration</p>
            </div>
          </div>

          {/* Active badge */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
            isActive
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : 'bg-gray-50 text-gray-500 border border-gray-100'
          }`}>
            {isActive
              ? <CheckCircle2 className="w-4 h-4" />
              : <XCircle className="w-4 h-4" />}
            {isActive ? 'Pixel Active' : 'Pixel Inactive'}
          </div>

          {isConfigured && (
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Pixel ID</span>
                <span className="font-mono font-medium text-gray-700">{config.pixel_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Browser Pixel</span>
                <span className={config.enable_pixel ? 'text-emerald-600 font-medium' : 'text-gray-400'}>
                  {config.enable_pixel ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Conversion API</span>
                <span className={config.enable_conversion_api ? 'text-emerald-600 font-medium' : 'text-gray-400'}>
                  {config.enable_conversion_api ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          )}

          {isConfigured && (
            <button
              onClick={handleToggle}
              disabled={toggle.isPending}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition ${
                isActive
                  ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
              } disabled:opacity-60`}
            >
              {toggle.isPending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : isActive
                ? <ToggleLeft className="w-4 h-4" />
                : <ToggleRight className="w-4 h-4" />}
              {isActive ? 'Disable Pixel' : 'Enable Pixel'}
            </button>
          )}
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
            <Info className="w-3.5 h-3.5" /> How it works
          </div>
          <ul className="text-xs text-blue-600 space-y-1.5 list-disc list-inside">
            <li>Browser Pixel fires events client-side via the Meta Pixel script</li>
            <li>Conversion API sends events server-side for better accuracy</li>
            <li>Both can run together for deduplication</li>
            <li>UTM parameters are captured on every order automatically</li>
          </ul>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

          <h2 className="text-sm font-semibold text-gray-900">Pixel Configuration</h2>

          {/* Pixel ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Pixel ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              placeholder="e.g. 1234567890123456"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition font-mono placeholder:text-gray-400 placeholder:font-sans"
            />
            <p className="text-[11px] text-gray-400">
              Found in Meta Events Manager → Data Sources → Your Pixel
            </p>
          </div>

          {/* Access Token */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Conversion API Access Token
              <span className="ml-2 text-[10px] font-normal text-gray-400 normal-case">(optional — for server-side events)</span>
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder={config?.enable_conversion_api ? '••••••••••••••••••••••••••••••••' : 'Paste your access token here'}
                className="w-full px-3.5 py-2.5 pr-10 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition font-mono placeholder:font-sans placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowToken((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {config?.enable_conversion_api && (
              <p className="text-[11px] text-emerald-600">
                ✓ Access token is saved. Leave blank to keep the existing token.
              </p>
            )}
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <ToggleCard
              label="Browser Pixel"
              description="Inject the Meta Pixel script on all pages"
              enabled={enablePixel}
              onChange={setEnablePixel}
            />
            <ToggleCard
              label="Conversion API"
              description="Send events server-side via the Meta CAPI"
              enabled={enableConvApi}
              onChange={setEnableConvApi}
            />
          </div>

          {/* Events to track */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Events to Track
            </label>
            <div className="grid grid-cols-2 gap-3">
              {ALL_EVENTS.map((event) => {
                const checked = eventsToTrack.includes(event);
                return (
                  <button
                    key={event}
                    type="button"
                    onClick={() => toggleEvent(event)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition ${
                      checked
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border transition ${
                      checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'
                    }`}>
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${checked ? 'text-blue-700' : 'text-gray-700'}`}>
                        {event}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {EVENT_DESCRIPTIONS[event]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={save.isPending}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {save.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Toggle Card ──────────────────────────────────────────────────────────────

function ToggleCard({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition ${
        enabled
          ? 'border-blue-200 bg-blue-50'
          : 'border-gray-100 bg-gray-50 hover:border-gray-200'
      }`}
    >
      <div className={`mt-0.5 w-9 h-5 rounded-full flex items-center transition-colors shrink-0 ${
        enabled ? 'bg-blue-600' : 'bg-gray-300'
      }`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${
          enabled ? 'translate-x-4' : 'translate-x-0'
        }`} />
      </div>
      <div>
        <p className={`text-xs font-semibold ${enabled ? 'text-blue-700' : 'text-gray-700'}`}>
          {label}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
      </div>
    </button>
  );
}
