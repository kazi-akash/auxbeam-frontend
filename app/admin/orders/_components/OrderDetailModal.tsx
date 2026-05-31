'use client';

import { useState, useRef } from 'react';
import {
  X, Loader2, Package, User, MapPin, Clock, FileText,
  Bell, History, Truck, Download, Ban, ChevronRight,
  Plus, Trash2, CheckCircle, AlertCircle, Tag, Globe,
  Printer, ExternalLink, Phone, Mail,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  useAdminOrder,
  useAdminOrderNotes,
  useAdminOrderReminders,
  useAdminOrderStatusHistory,
  useAdminUpdateOrderStatus,
  useAdminCancelOrder,
  useAdminAssignTracking,
  useAdminCreateOrderNote,
  useAdminDeleteOrderNote,
  useAdminCreateOrderReminder,
  useAdminCompleteOrderReminder,
  useAdminDeleteOrderReminder,
  useAdminDownloadOrderInvoice,
} from '@/lib/hooks/admin/useAdminOrders';
import { OrderStatusBadge, PaymentStatusBadge, ORDER_STATUS_CONFIG } from './OrderStatusBadge';
import type {
  AdminOrder, AdminOrderNote, AdminOrderReminder, AdminOrderStatusHistory,
  NoteType,
} from '@/lib/types/admin';
import type { OrderStatus } from '@/lib/types/order';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'items' | 'notes' | 'reminders' | 'history' | 'tracking';

interface Props {
  open: boolean;
  onClose: () => void;
  orderId: number | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const UPDATABLE_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'incomplete',
  'good_but_no_response', 'advance_payment', 'on_hold',
  'ready_to_ship', 'shipped', 'complete', 'cancelled',
];

const NOTE_TYPE_CONFIG: Record<NoteType, { label: string; cls: string }> = {
  internal: { label: 'Internal', cls: 'bg-gray-100 text-gray-600 border border-gray-200' },
  customer: { label: 'Customer', cls: 'bg-blue-50 text-blue-600 border border-blue-100' },
  system:   { label: 'System',   cls: 'bg-purple-50 text-purple-600 border border-purple-100' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(date: string) {
  try { return format(new Date(date), 'MMM d, yyyy · h:mm a'); }
  catch { return date; }
}

function fmtDate(date: string) {
  try { return format(new Date(date), 'MMM d, yyyy'); }
  catch { return date; }
}

function currency(val: string | number) {
  return '৳' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function userName(u?: { first_name?: string; last_name?: string; full_name?: string; email?: string } | null) {
  if (!u) return 'System';
  return u.full_name || `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || u.email || 'Unknown';
}

// ─── TabButton ────────────────────────────────────────────────────────────────

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active
          ? 'border-amber-400 text-amber-700'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Items Tab ────────────────────────────────────────────────────────────────

function ItemsTab({ order }: { order: AdminOrder }) {
  const items = order.items ?? [];
  const paid = order.payments
    ? (order.payments as any[]).filter((p) => p.status === 'completed').reduce((s, p) => s + Number(p.amount), 0)
    : 0;
  const due = Math.max(0, Number(order.total_amount) - paid);

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No items found.</p>
      ) : (
        items.map((item) => {
          const img = item.product?.images?.find((i) => i.is_primary) ?? item.product?.images?.[0];
          const variations = item.variation_details
            ? Object.entries(item.variation_details).map(([k, v]) => `${k}: ${v}`).join(', ')
            : item.product_variation?.variation_values
              ?.map((vv) => `${vv.variation_option.variation.name}: ${vv.variation_option.value}`)
              .join(', ');
          return (
            <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              {img ? (
                <img src={img.full_url} alt={item.product_name} className="w-14 h-14 object-cover rounded-lg border border-gray-200 shrink-0" />
              ) : (
                <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.product_name}</p>
                {variations && <p className="text-xs text-gray-500 mt-0.5">{variations}</p>}
                {item.product_variation?.sku && (
                  <p className="text-xs text-gray-400 font-mono mt-0.5">SKU: {item.product_variation.sku}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-gray-800">{currency(item.total_price)}</p>
                <p className="text-xs text-gray-500 mt-0.5">{currency(item.unit_price)} × {item.quantity}</p>
              </div>
            </div>
          );
        })
      )}

      {/* Financial Summary */}
      <div className="border border-gray-100 rounded-xl overflow-hidden mt-2">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Financial Summary</p>
        </div>
        <div className="px-4 py-3 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span>{currency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery</span><span>{currency(order.shipping_cost)}</span>
          </div>
          {Number(order.discount_amount) > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Discount</span><span>-{currency(order.discount_amount)}</span>
            </div>
          )}
          {Number(order.tax_amount ?? 0) > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax</span><span>{currency(order.tax_amount ?? 0)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-100 pt-2">
            <span>Total</span><span>{currency(order.total_amount)}</span>
          </div>
          {paid > 0 && (
            <div className="flex justify-between text-sm text-emerald-600 font-medium">
              <span>Paid</span><span>{currency(paid)}</span>
            </div>
          )}
          {due > 0 && (
            <div className="flex justify-between text-sm text-red-600 font-semibold">
              <span>Due</span><span>{currency(due)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── UTM / Source Tracking Tab ────────────────────────────────────────────────

function TrackingTab({ order }: { order: AdminOrder }) {
  const hasUtm = order.utm_source || order.utm_medium || order.utm_campaign;

  return (
    <div className="space-y-4">
      {/* Order Source */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order Source</p>
        </div>
        <div className="px-4 py-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Source</p>
            <p className="text-sm font-medium text-gray-800 capitalize">
              {order.order_source?.replace(/_/g, ' ') ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Order Type</p>
            <p className="text-sm font-medium text-gray-800 capitalize">
              {order.order_type?.replace(/_/g, ' ') ?? '—'}
            </p>
          </div>
        </div>
      </div>

      {/* UTM Parameters */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">UTM Tracking</p>
        </div>
        {!hasUtm ? (
          <p className="px-4 py-4 text-sm text-gray-400">No UTM parameters recorded.</p>
        ) : (
          <div className="px-4 py-3 grid grid-cols-2 gap-3">
            {[
              { key: 'utm_source',   label: 'UTM Source',   val: order.utm_source   },
              { key: 'utm_medium',   label: 'UTM Medium',   val: order.utm_medium   },
              { key: 'utm_campaign', label: 'UTM Campaign', val: order.utm_campaign },
              { key: 'utm_content',  label: 'UTM Content',  val: (order as any).utm_content  },
              { key: 'utm_term',     label: 'UTM Term',     val: (order as any).utm_term     },
            ].map(({ key, label, val }) => val ? (
              <div key={key}>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm font-medium text-gray-800 break-all">{val}</p>
              </div>
            ) : null)}
          </div>
        )}
      </div>

      {/* Referrer URL */}
      {(order as any).referrer_url && (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Referrer URL</p>
          </div>
          <div className="px-4 py-3">
            <a
              href={(order as any).referrer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1 break-all"
            >
              {(order as any).referrer_url}
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </div>
      )}

      {/* Follow-up */}
      {order.follow_up_at && (
        <div className="border border-amber-100 rounded-xl overflow-hidden">
          <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Follow-up Reminder</p>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">{fmt(order.follow_up_at)}</p>
              <p className={`text-xs mt-0.5 ${order.follow_up_completed ? 'text-emerald-600' : 'text-amber-600'}`}>
                {order.follow_up_completed ? '✓ Completed' : 'Pending'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────

function NotesTab({ orderId }: { orderId: number }) {
  const { data: notes = [], isLoading } = useAdminOrderNotes(orderId);
  const createNote = useAdminCreateOrderNote();
  const deleteNote = useAdminDeleteOrderNote();

  const [noteText, setNoteText]         = useState('');
  const [noteType, setNoteType]         = useState<NoteType>('internal');
  const [notifyCustomer, setNotify]     = useState(false);
  const [showForm, setShowForm]         = useState(false);

  function handleCreate() {
    if (!noteText.trim()) { toast.error('Note cannot be empty'); return; }
    createNote.mutate(
      { orderId, payload: { note: noteText, note_type: noteType, is_customer_notified: notifyCustomer } },
      {
        onSuccess: () => { toast.success('Note added'); setNoteText(''); setShowForm(false); },
        onError: () => toast.error('Failed to add note'),
      }
    );
  }

  function handleDelete(noteId: number) {
    if (!confirm('Delete this note?')) return;
    deleteNote.mutate({ orderId, noteId }, {
      onSuccess: () => toast.success('Note deleted'),
      onError: () => toast.error('Failed to delete note'),
    });
  }

  const noteList: AdminOrderNote[] = Array.isArray(notes) ? notes : (notes as any)?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add Note
        </button>
      </div>

      {showForm && (
        <div className="border border-amber-200 rounded-xl p-4 space-y-3 bg-amber-50/40">
          <textarea
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a note..."
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 resize-none bg-white"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value as NoteType)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 bg-white"
            >
              <option value="internal">Internal</option>
              <option value="customer">Customer</option>
            </select>
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" checked={notifyCustomer} onChange={(e) => setNotify(e.target.checked)} className="rounded" />
              Notify customer
            </label>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
              <button
                onClick={handleCreate}
                disabled={createNote.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 transition"
              >
                {createNote.isPending && <Loader2 className="w-3 h-3 animate-spin" />} Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : noteList.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No notes yet.</p>
      ) : (
        noteList.map((note) => {
          const cfg = NOTE_TYPE_CONFIG[note.note_type] ?? NOTE_TYPE_CONFIG.internal;
          return (
            <div key={note.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.cls}`}>{cfg.label}</span>
                  {note.is_customer_notified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <CheckCircle className="w-2.5 h-2.5" /> Notified
                    </span>
                  )}
                  <span className="text-[11px] text-gray-400">{userName(note.user)}</span>
                  <span className="text-[11px] text-gray-400">·</span>
                  <span className="text-[11px] text-gray-400">{fmt(note.created_at)}</span>
                </div>
                <button onClick={() => handleDelete(note.id)} className="p-1 text-gray-300 hover:text-red-400 transition shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{note.note}</p>
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── Reminders Tab ────────────────────────────────────────────────────────────

function RemindersTab({ orderId }: { orderId: number }) {
  const { data: reminders = [], isLoading } = useAdminOrderReminders(orderId);
  const createReminder  = useAdminCreateOrderReminder();
  const completeReminder = useAdminCompleteOrderReminder();
  const deleteReminder  = useAdminDeleteOrderReminder();

  const [showForm, setShowForm]       = useState(false);
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [remindAt, setRemindAt]       = useState('');

  function handleCreate() {
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!remindAt) { toast.error('Remind date/time is required'); return; }
    createReminder.mutate(
      { orderId, payload: { title, description: description || undefined, remind_at: remindAt } },
      {
        onSuccess: () => {
          toast.success('Reminder created');
          setTitle(''); setDescription(''); setRemindAt(''); setShowForm(false);
        },
        onError: () => toast.error('Failed to create reminder'),
      }
    );
  }

  const reminderList: AdminOrderReminder[] = Array.isArray(reminders) ? reminders : (reminders as any)?.data ?? [];
  const now = new Date();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add Reminder
        </button>
      </div>

      {showForm && (
        <div className="border border-amber-200 rounded-xl p-4 space-y-3 bg-amber-50/40">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Reminder title..."
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 bg-white"
          />
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)..."
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 resize-none bg-white"
          />
          <div className="flex items-center gap-3">
            <input
              type="datetime-local"
              value={remindAt}
              onChange={(e) => setRemindAt(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition bg-white"
            />
            <button onClick={() => setShowForm(false)} className="px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            <button
              onClick={handleCreate}
              disabled={createReminder.isPending}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 transition"
            >
              {createReminder.isPending && <Loader2 className="w-3 h-3 animate-spin" />} Save
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : reminderList.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No reminders set.</p>
      ) : (
        reminderList.map((r) => {
          const isPast = !r.is_completed && new Date(r.remind_at) <= now;
          return (
            <div key={r.id} className={`p-4 rounded-xl border space-y-2 ${r.is_completed ? 'bg-gray-50 border-gray-100 opacity-60' : isPast ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {r.is_completed
                    ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    : isPast
                      ? <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      : <Bell className="w-4 h-4 text-amber-500 shrink-0" />
                  }
                  <p className={`text-sm font-semibold ${r.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{r.title}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!r.is_completed && (
                    <button
                      onClick={() => completeReminder.mutate({ orderId, reminderId: r.id }, { onSuccess: () => toast.success('Reminder completed'), onError: () => toast.error('Failed') })}
                      className="p-1 text-gray-400 hover:text-emerald-500 transition" title="Mark complete"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => { if (!confirm('Delete this reminder?')) return; deleteReminder.mutate({ orderId, reminderId: r.id }, { onSuccess: () => toast.success('Deleted'), onError: () => toast.error('Failed') }); }}
                    className="p-1 text-gray-300 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {r.description && <p className="text-xs text-gray-600 leading-relaxed">{r.description}</p>}
              <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-wrap">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{fmt(r.remind_at)}</span>
                {r.creator && <span>By {userName(r.creator)}</span>}
                {r.assignee && <span>→ {userName(r.assignee)}</span>}
                {r.is_completed && r.completed_at && <span className="text-emerald-500">Completed {fmtDate(r.completed_at)}</span>}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── Status History Tab ───────────────────────────────────────────────────────

function StatusHistoryTab({ orderId }: { orderId: number }) {
  const { data: history = [], isLoading } = useAdminOrderStatusHistory(orderId);
  const historyList: AdminOrderStatusHistory[] = Array.isArray(history) ? history : (history as any)?.data ?? [];

  return (
    <div className="space-y-3">
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : historyList.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No status history.</p>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
          <div className="space-y-4">
            {historyList.map((h, idx) => {
              const toCfg = ORDER_STATUS_CONFIG[h.to_status] ?? ORDER_STATUS_CONFIG.pending;
              return (
                <div key={h.id} className="relative flex gap-4 pl-10">
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-white mt-1 ${idx === 0 ? 'bg-amber-400' : 'bg-gray-300'}`} />
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {h.from_status && (
                        <>
                          <span className="text-xs text-gray-400">{ORDER_STATUS_CONFIG[h.from_status]?.label ?? h.from_status}</span>
                          <ChevronRight className="w-3 h-3 text-gray-300" />
                        </>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${toCfg.cls}`}>{toCfg.label}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 flex-wrap">
                      <span>{fmt(h.created_at)}</span>
                      {h.user && <span>· {userName(h.user)}</span>}
                    </div>
                    {h.note && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{h.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Print Invoice ────────────────────────────────────────────────────────────

function printInvoice(order: AdminOrder) {
  const items = order.items ?? [];
  const paid = order.payments
    ? (order.payments as any[]).filter((p) => p.status === 'completed').reduce((s, p) => s + Number(p.amount), 0)
    : 0;
  const due = Math.max(0, Number(order.total_amount) - paid);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${order.order_number}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #111; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
    .brand { font-size: 22px; font-weight: 800; color: #d97706; }
    .invoice-meta { text-align: right; }
    .invoice-meta h2 { font-size: 18px; font-weight: 700; color: #111; }
    .invoice-meta p { color: #666; font-size: 12px; margin-top: 2px; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 6px; }
    .section-value { font-size: 13px; color: #111; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
    td { padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
    .text-right { text-align: right; }
    .totals { margin-left: auto; width: 260px; }
    .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
    .totals-row.total { font-weight: 700; font-size: 15px; border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 4px; }
    .totals-row.paid { color: #059669; }
    .totals-row.due { color: #dc2626; font-weight: 700; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #9ca3af; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Auxbeam</div>
      <p style="color:#666;font-size:12px;margin-top:4px;">Sports Equipment</p>
    </div>
    <div class="invoice-meta">
      <h2>INVOICE</h2>
      <p>Order #${order.order_number}</p>
      <p>Date: ${new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  </div>
  <hr class="divider" />
  <div class="grid2">
    <div>
      <div class="section-title">Bill To</div>
      <div class="section-value">
        ${order.user ? `${order.user.full_name || `${order.user.first_name} ${order.user.last_name}`.trim()}` : order.customer_name ?? 'Guest'}<br/>
        ${order.user?.email ?? order.customer_email ?? ''}${order.customer_phone ? `<br/>${order.customer_phone}` : ''}
      </div>
    </div>
    <div>
      <div class="section-title">Ship To</div>
      <div class="section-value">
        ${order.shipping_address
          ? `${order.shipping_address.address_line_1}${order.shipping_address.address_line_2 ? ', ' + order.shipping_address.address_line_2 : ''}<br/>${order.shipping_address.city}${order.shipping_address.state ? ', ' + order.shipping_address.state : ''}${order.shipping_address.zip_code ? ' ' + order.shipping_address.zip_code : ''}`
          : 'N/A'}
      </div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>SKU</th>
        <th class="text-right">Qty</th>
        <th class="text-right">Unit Price</th>
        <th class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((item) => `
      <tr>
        <td>${item.product_name}</td>
        <td style="font-family:monospace;font-size:11px;color:#666">${item.product_variation?.sku ?? '—'}</td>
        <td class="text-right">${item.quantity}</td>
        <td class="text-right">৳${Number(item.unit_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
        <td class="text-right">৳${Number(item.total_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
      </tr>`).join('')}
    </tbody>
  </table>
  <div class="totals">
    <div class="totals-row"><span>Subtotal</span><span>৳${Number(order.subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
    <div class="totals-row"><span>Delivery</span><span>৳${Number(order.shipping_cost).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
    ${Number(order.discount_amount) > 0 ? `<div class="totals-row" style="color:#059669"><span>Discount</span><span>-৳${Number(order.discount_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>` : ''}
    <div class="totals-row total"><span>Total</span><span>৳${Number(order.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
    ${paid > 0 ? `<div class="totals-row paid"><span>Paid</span><span>৳${paid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>` : ''}
    ${due > 0 ? `<div class="totals-row due"><span>Due</span><span>৳${due.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>` : ''}
  </div>
  <div class="footer">Thank you for your order!</div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) { toast.error('Popup blocked. Please allow popups.'); return; }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function OrderDetailModal({ open, onClose, orderId }: Props) {
  const [activeTab, setActiveTab]         = useState<Tab>('items');
  const [showStatusForm, setShowStatus]   = useState(false);
  const [newStatus, setNewStatus]         = useState<OrderStatus>('pending');
  const [showCancelForm, setShowCancel]   = useState(false);
  const [cancelReason, setCancelReason]   = useState('');
  const [showTrackingForm, setShowTracking] = useState(false);
  const [trackingNumber, setTracking]     = useState('');

  const { data: order, isLoading } = useAdminOrder(orderId ?? 0);
  const updateStatus   = useAdminUpdateOrderStatus();
  const cancelOrder    = useAdminCancelOrder();
  const assignTracking = useAdminAssignTracking();
  const downloadInvoice = useAdminDownloadOrderInvoice();

  if (!open) return null;

  function closeAllForms() {
    setShowStatus(false); setShowCancel(false); setShowTracking(false);
  }

  function handleUpdateStatus() {
    if (!orderId) return;
    updateStatus.mutate(
      { id: orderId, payload: { status: newStatus } },
      {
        onSuccess: () => { toast.success('Status updated'); closeAllForms(); },
        onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to update status'),
      }
    );
  }

  function handleCancel() {
    if (!orderId || !cancelReason.trim()) { toast.error('Cancellation reason is required'); return; }
    cancelOrder.mutate(
      { id: orderId, reason: cancelReason },
      {
        onSuccess: () => { toast.success('Order cancelled'); closeAllForms(); setCancelReason(''); },
        onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to cancel order'),
      }
    );
  }

  function handleAssignTracking() {
    if (!orderId || !trackingNumber.trim()) { toast.error('Tracking number is required'); return; }
    assignTracking.mutate(
      { id: orderId, payload: { tracking_number: trackingNumber } },
      {
        onSuccess: () => { toast.success('Tracking number assigned'); closeAllForms(); setTracking(''); },
        onError: () => toast.error('Failed to assign tracking'),
      }
    );
  }

  function handleDownloadInvoice() {
    if (!order?.order_number) return;
    downloadInvoice.mutate(order.order_number, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${order.order_number}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      onError: () => toast.error('Failed to download invoice'),
    });
  }

  const o: AdminOrder | null = order ?? null;
  const canCancel = o && ['pending', 'confirmed', 'processing'].includes(o.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            {isLoading ? (
              <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
            ) : o ? (
              <>
                <h2 className="text-base font-bold text-gray-900">Order #{o.order_number}</h2>
                <OrderStatusBadge status={o.status} />
                <PaymentStatusBadge status={o.payment_status} />
              </>
            ) : null}
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Content */}
        {!isLoading && o && (
          <div className="flex-1 overflow-y-auto">

            {/* Order meta cards */}
            <div className="px-6 pt-5 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Customer */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <User className="w-3 h-3" /> Customer
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  {o.user ? userName(o.user) : o.customer_name ?? 'Guest'}
                </p>
                {(o.user?.email ?? o.customer_email) && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3 shrink-0" />
                    {o.user?.email ?? o.customer_email}
                  </p>
                )}
                {o.customer_phone && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone className="w-3 h-3 shrink-0" />
                    {o.customer_phone}
                  </p>
                )}
              </div>

              {/* Shipping address */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <MapPin className="w-3 h-3" /> Shipping Address
                </div>
                {o.shipping_address ? (
                  <>
                    <p className="text-xs text-gray-700">{o.shipping_address.address_line_1}</p>
                    {o.shipping_address.address_line_2 && <p className="text-xs text-gray-700">{o.shipping_address.address_line_2}</p>}
                    <p className="text-xs text-gray-700">
                      {o.shipping_address.city}{o.shipping_address.state ? `, ${o.shipping_address.state}` : ''}
                    </p>
                    {o.shipping_address.zip_code && <p className="text-xs text-gray-500">{o.shipping_address.zip_code}</p>}
                    {o.shipping_address.phone && <p className="text-xs text-gray-500">{o.shipping_address.phone}</p>}
                  </>
                ) : <p className="text-xs text-gray-400">No address</p>}
              </div>

              {/* Order info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <Tag className="w-3 h-3" /> Order Info
                </div>
                <p className="text-xs text-gray-600">
                  <span className="text-gray-400">Date:</span> {fmtDate(o.created_at)}
                </p>
                <p className="text-xs text-gray-600 capitalize">
                  <span className="text-gray-400">Source:</span> {o.order_source?.replace(/_/g, ' ') ?? '—'}
                </p>
                <p className="text-xs text-gray-600 capitalize">
                  <span className="text-gray-400">Shipping:</span> {o.shipping_method?.replace(/_/g, ' ') ?? '—'}
                </p>
                {o.tracking_number && (
                  <p className="text-xs text-gray-600 font-mono">
                    <span className="text-gray-400 font-sans">Tracking:</span> {o.tracking_number}
                  </p>
                )}
                {o.coupon && (
                  <p className="text-xs text-emerald-600">
                    <span className="text-gray-400">Coupon:</span> {o.coupon.code}
                  </p>
                )}
              </div>
            </div>

            {/* Action bar */}
            <div className="px-6 pb-4 flex items-center gap-2 flex-wrap">
              <button
                onClick={() => { setShowStatus((v) => !v); setShowCancel(false); setShowTracking(false); }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border rounded-lg transition ${showStatusForm ? 'bg-amber-50 border-amber-200 text-amber-700' : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <History className="w-3.5 h-3.5" /> Update Status
              </button>
              <button
                onClick={() => { setShowTracking((v) => !v); setShowStatus(false); setShowCancel(false); }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border rounded-lg transition ${showTrackingForm ? 'bg-amber-50 border-amber-200 text-amber-700' : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                <Truck className="w-3.5 h-3.5" /> {o.tracking_number ? 'Update Tracking' : 'Assign Tracking'}
              </button>
              <button
                onClick={() => printInvoice(o)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <Printer className="w-3.5 h-3.5" /> Print Invoice
              </button>
              <button
                onClick={handleDownloadInvoice}
                disabled={downloadInvoice.isPending}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition"
              >
                {downloadInvoice.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} Download PDF
              </button>
              {canCancel && (
                <button
                  onClick={() => { setShowCancel((v) => !v); setShowStatus(false); setShowTracking(false); }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border rounded-lg transition ${showCancelForm ? 'bg-red-100 border-red-200 text-red-700' : 'text-red-600 bg-red-50 border-red-100 hover:bg-red-100'}`}
                >
                  <Ban className="w-3.5 h-3.5" /> Cancel Order
                </button>
              )}
            </div>

            {/* Inline: Update Status */}
            {showStatusForm && (
              <div className="mx-6 mb-4 border border-amber-200 rounded-xl p-4 space-y-3 bg-amber-50/40">
                <p className="text-sm font-semibold text-gray-800">Update Order Status</p>
                <div className="flex items-center gap-3">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="flex-1 px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 bg-white"
                  >
                    {UPDATABLE_STATUSES.map((s) => (
                      <option key={s} value={s}>{ORDER_STATUS_CONFIG[s]?.label ?? s}</option>
                    ))}
                  </select>
                  <button onClick={closeAllForms} className="px-3 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updateStatus.isPending}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 transition"
                  >
                    {updateStatus.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Update
                  </button>
                </div>
              </div>
            )}

            {/* Inline: Assign Tracking */}
            {showTrackingForm && (
              <div className="mx-6 mb-4 border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/40">
                <p className="text-sm font-semibold text-gray-800">Assign Tracking Number</p>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTracking(e.target.value)}
                    placeholder={o.tracking_number ?? 'Enter tracking number...'}
                    className="flex-1 px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition placeholder:text-gray-400 bg-white"
                  />
                  <button onClick={closeAllForms} className="px-3 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                  <button
                    onClick={handleAssignTracking}
                    disabled={assignTracking.isPending}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-black bg-amber-400 rounded-lg hover:bg-amber-500 disabled:opacity-60 transition"
                  >
                    {assignTracking.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save
                  </button>
                </div>
              </div>
            )}

            {/* Inline: Cancel */}
            {showCancelForm && (
              <div className="mx-6 mb-4 border border-red-200 rounded-xl p-4 space-y-3 bg-red-50/40">
                <p className="text-sm font-semibold text-gray-800">Cancel Order</p>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Reason for cancellation (required)..."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition placeholder:text-gray-400 resize-none bg-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={cancelOrder.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-60 transition"
                  >
                    {cancelOrder.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Confirm Cancel
                  </button>
                  <button onClick={closeAllForms} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">Back</button>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-100 px-6 flex gap-1 overflow-x-auto">
              <TabButton active={activeTab === 'items'} onClick={() => setActiveTab('items')}>
                <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Items ({o.items?.length ?? 0})</span>
              </TabButton>
              <TabButton active={activeTab === 'tracking'} onClick={() => setActiveTab('tracking')}>
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Source & UTM</span>
              </TabButton>
              <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Notes</span>
              </TabButton>
              <TabButton active={activeTab === 'reminders'} onClick={() => setActiveTab('reminders')}>
                <span className="flex items-center gap-1.5"><Bell className="w-3.5 h-3.5" /> Reminders</span>
              </TabButton>
              <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
                <span className="flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Status History</span>
              </TabButton>
            </div>

            {/* Tab content */}
            <div className="px-6 py-5">
              {activeTab === 'items'    && <ItemsTab order={o} />}
              {activeTab === 'tracking' && <TrackingTab order={o} />}
              {activeTab === 'notes'    && <NotesTab orderId={o.id} />}
              {activeTab === 'reminders' && <RemindersTab orderId={o.id} />}
              {activeTab === 'history'  && <StatusHistoryTab orderId={o.id} />}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
