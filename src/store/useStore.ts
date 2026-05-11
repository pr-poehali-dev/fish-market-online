import { useState, useEffect } from 'react';
import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: Order[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  address: string;
}

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Ожидает подтверждения',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
};

export { STATUS_LABELS };

// Simple global state via localStorage + custom hook
const CART_KEY = 'rybalov_cart';
const USER_KEY = 'rybalov_user';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveUser(user: User | null) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

// Shared state (module-level for cross-component sync)
let _cart: CartItem[] = loadCart();
let _user: User | null = loadUser();
let _listeners: (() => void)[] = [];

function notify() {
  _listeners.forEach(l => l());
}

export function useStore() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const trigger = () => rerender(n => n + 1);
    _listeners.push(trigger);
    return () => { _listeners = _listeners.filter(l => l !== trigger); };
  }, []);

  const cartCount = _cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = _cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  function addToCart(product: Product, qty = 1) {
    const existing = _cart.find(i => i.product.id === product.id);
    if (existing) {
      _cart = _cart.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
    } else {
      _cart = [..._cart, { product, quantity: qty }];
    }
    saveCart(_cart);
    notify();
  }

  function removeFromCart(productId: number) {
    _cart = _cart.filter(i => i.product.id !== productId);
    saveCart(_cart);
    notify();
  }

  function updateQty(productId: number, qty: number) {
    if (qty <= 0) { removeFromCart(productId); return; }
    _cart = _cart.map(i => i.product.id === productId ? { ...i, quantity: qty } : i);
    saveCart(_cart);
    notify();
  }

  function clearCart() {
    _cart = [];
    saveCart(_cart);
    notify();
  }

  function login(userData: Omit<User, 'orders'>) {
    _user = { ...userData, orders: _user?.orders || [] };
    saveUser(_user);
    notify();
  }

  function logout() {
    _user = null;
    saveUser(null);
    notify();
  }

  function updateUser(data: Partial<User>) {
    if (_user) {
      _user = { ..._user, ...data };
      saveUser(_user);
      notify();
    }
  }

  function placeOrder(address: string, comment: string) {
    if (!_user || _cart.length === 0) return null;
    const order: Order = {
      id: `RL-${Date.now()}`,
      date: new Date().toLocaleDateString('ru-RU'),
      items: [..._cart],
      total: cartTotal,
      status: 'pending',
      address,
    };
    _user = { ..._user, orders: [order, ..._user.orders] };
    saveUser(_user);
    clearCart();
    return order;
  }

  return {
    cart: _cart,
    cartCount,
    cartTotal,
    user: _user,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    login,
    logout,
    updateUser,
    placeOrder,
  };
}
