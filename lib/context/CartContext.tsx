'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: number;
  product_id: number;
  variation_id?: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.product_id === newItem.product_id &&
          item.variation_id === newItem.variation_id
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }

      return [...prev, { ...newItem, id: Date.now() }];
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, total, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
