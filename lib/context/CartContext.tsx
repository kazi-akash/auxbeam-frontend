'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface SelectedService {
  service_id: number;
  name: string;
  type: string;
  price: number;
  scheduled_date?: string;
  scheduled_time?: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  variation_id?: number;
  quantity: number;
  service?: string;
  bulbSize?: string;
  selectedServices?: SelectedService[];
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    compare_price?: number;
    image: string;
  };
}

export interface AppliedCoupon {
  code: string;
  discount: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  appliedCoupon: AppliedCoupon | null;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  updateItemServices: (id: number, services: SelectedService[]) => void;
  clearCart: () => void;
}

const GUEST_CART_KEY = 'cart_guest';

function userCartKey(userId: number | string) {
  return `cart_user_${userId}`;
}

function loadCart(key: string): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(key: string, items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(items));
}

// Merge guest items into base items — increments quantity for duplicates.
function mergeItems(base: CartItem[], incoming: CartItem[]): CartItem[] {
  const result = [...base];
  for (const inc of incoming) {
    const existing = result.find(
      (i) =>
        i.product_id === inc.product_id &&
        i.variation_id === inc.variation_id &&
        i.service === inc.service &&
        i.bulbSize === inc.bulbSize
    );
    if (existing) {
      existing.quantity += inc.quantity;
    } else {
      result.push({ ...inc, id: Date.now() + Math.random() });
    }
  }
  return result;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  // Track which storage key is currently active so we persist to the right place.
  const storageKeyRef = useRef<string>(GUEST_CART_KEY);
  // Whether the initial auth resolution has been handled.
  const initializedRef = useRef(false);
  // Previous user ref to detect login/logout transitions post-init.
  const prevUserRef = useRef<typeof user>(null);

  // Wait for auth to finish loading, then do the initial cart setup once.
  useEffect(() => {
    if (authLoading || initializedRef.current) return;
    initializedRef.current = true;

    if (user) {
      // Already logged in on page load — load user cart, merge any guest items.
      const key = userCartKey(user.id);
      storageKeyRef.current = key;
      const guestItems = loadCart(GUEST_CART_KEY);
      const userItems = loadCart(key);
      const merged = guestItems.length ? mergeItems(userItems, guestItems) : userItems;
      if (guestItems.length) {
        saveCart(key, merged);
        localStorage.removeItem(GUEST_CART_KEY);
      }
      setItems(merged);
    } else {
      // Guest — load guest cart.
      storageKeyRef.current = GUEST_CART_KEY;
      setItems(loadCart(GUEST_CART_KEY));
    }

    prevUserRef.current = user;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  // Handle subsequent login / logout transitions.
  useEffect(() => {
    if (!initializedRef.current) return;

    const prevUser = prevUserRef.current;
    prevUserRef.current = user;

    if (user && !prevUser) {
      // ── Login: merge guest cart into user cart ──────────────────────────────
      const key = userCartKey(user.id);
      storageKeyRef.current = key;
      const guestItems = loadCart(GUEST_CART_KEY);
      const userItems = loadCart(key);
      const merged = guestItems.length ? mergeItems(userItems, guestItems) : userItems;
      saveCart(key, merged);
      localStorage.removeItem(GUEST_CART_KEY);
      setItems(merged);
    } else if (!user && prevUser) {
      // ── Logout: switch to fresh guest cart ─────────────────────────────────
      storageKeyRef.current = GUEST_CART_KEY;
      setItems(loadCart(GUEST_CART_KEY));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Persist items whenever they change, but only after initialization has run.
  useEffect(() => {
    if (!initializedRef.current) return;
    saveCart(storageKeyRef.current, items);
  }, [items]);

  const addItem = useCallback((newItem: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.product_id === newItem.product_id &&
          i.variation_id === newItem.variation_id &&
          i.service === newItem.service &&
          i.bulbSize === newItem.bulbSize
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prev, { ...newItem, id: Date.now() }];
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []);

  const updateItemServices = useCallback((id: number, services: SelectedService[]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, selectedServices: services } : i)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, total, appliedCoupon, setAppliedCoupon, addItem, removeItem, updateQuantity, updateItemServices, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
