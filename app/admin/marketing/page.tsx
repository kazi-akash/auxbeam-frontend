'use client';

import { useState } from 'react';
import {
  Megaphone,
  Settings,
  BarChart2,
  List,
  TrendingUp,
} from 'lucide-react';
import MetaPixelSettings from './_components/MetaPixelSettings';
import MetaPixelStats from './_components/MetaPixelStats';
import MetaPixelEventLog from './_components/MetaPixelEventLog';
import UtmPerformance from './_components/UtmPerformance';

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = 'settings' | 'statistics' | 'events' | 'utm';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'settings',   label: 'Pixel Settings',  icon: Settings   },
  { id: 'statistics', label: 'Statistics',       icon: BarChart2  },
  { id: 'events',     label: 'Event Log',        icon: List       },
  { id: 'utm',        label: 'UTM Performance',  icon: TrendingUp },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('settings');

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
          <Megaphone className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Marketing & Meta Ads</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Facebook Pixel, Conversion API, UTM tracking and ad performance
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'settings'   && <MetaPixelSettings />}
      {activeTab === 'statistics' && <MetaPixelStats />}
      {activeTab === 'events'     && <MetaPixelEventLog />}
      {activeTab === 'utm'        && <UtmPerformance />}
    </div>
  );
}
