import { useState, useEffect } from 'react';
import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SavedAddress {
  id: string;
  label: string;
  value: string;
  isDefault: boolean;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  addresses: SavedAddress[];
  orders: Order[];
  bonusPoints: number;
  favorites: number[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  discount: number;
  bonusEarned: number;
  promoUsed?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  address: string;
  comment?: string;
}

export const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Ожидает подтверждения',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
};

export interface PromoCode {
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  label: string;
}

export const PROMO_CODES: PromoCode[] = [
  { code: 'RYBA10', discount: 10, type: 'percent', label: 'Скидка 10%' },
  { code: 'FIRST15', discount: 15, type: 'percent', label: 'Скидка 15% для новых' },
  { code: 'FISH200', discount: 200, type: 'fixed', label: 'Скидка 200 ₽' },
  { code: 'BONUS50', discount: 50, type: 'fixed', label: 'Скидка 50 ₽' },
];

export const BONUS_RATE = 0.05;
export const BONUS_VALUE = 1;

const CART_KEY = 'rybalov_cart';
const USER_KEY = 'rybalov_user';

function loadCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}
function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    return {
      addresses: [],
      bonusPoints: 0,
      favorites: [],
      ...u,
      orders: u.orders || [],
    };
  } catch { return null; }
}
function saveUser(user: User | null) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

let _cart: CartItem[] = loadCart();
let _user: User | null = loadUser();
let _listeners: (() => void)[] = [];

function notify() { _listeners.forEach(l => l()); }

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

  function login(userData: Omit<User, 'orders' | 'bonusPoints' | 'favorites' | 'addresses'>) {
    _user = {
      ...userData,
      addresses: _user?.addresses || [],
      orders: _user?.orders || [],
      bonusPoints: _user?.bonusPoints || 0,
      favorites: _user?.favorites || [],
    };
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

  // Favorites
  function toggleFavorite(productId: number) {
    if (!_user) return;
    const favs = _user.favorites || [];
    _user = {
      ..._user,
      favorites: favs.includes(productId)
        ? favs.filter(id => id !== productId)
        : [...favs, productId],
    };
    saveUser(_user);
    notify();
  }

  function isFavorite(productId: number) {
    return (_user?.favorites || []).includes(productId);
  }

  // Addresses
  function addAddress(label: string, value: string, isDefault = false) {
    if (!_user) return;
    const newAddr: SavedAddress = { id: `addr_${Date.now()}`, label, value, isDefault };
    let addresses = _user.addresses || [];
    if (isDefault) addresses = addresses.map(a => ({ ...a, isDefault: false }));
    _user = { ..._user, addresses: [...addresses, newAddr] };
    saveUser(_user);
    notify();
  }

  function removeAddress(id: string) {
    if (!_user) return;
    _user = { ..._user, addresses: (_user.addresses || []).filter(a => a.id !== id) };
    saveUser(_user);
    notify();
  }

  function setDefaultAddress(id: string) {
    if (!_user) return;
    _user = {
      ..._user,
      addresses: (_user.addresses || []).map(a => ({ ...a, isDefault: a.id === id })),
    };
    saveUser(_user);
    notify();
  }

  function updateAddress(id: string, label: string, value: string) {
    if (!_user) return;
    _user = {
      ..._user,
      addresses: (_user.addresses || []).map(a => a.id === id ? { ...a, label, value } : a),
    };
    saveUser(_user);
    notify();
  }

  // Promo
  function applyPromo(code: string): PromoCode | null {
    return PROMO_CODES.find(p => p.code.toUpperCase() === code.toUpperCase()) || null;
  }

  function calcDiscount(promo: PromoCode | null, bonusSpend: number, total: number): number {
    let d = bonusSpend;
    if (promo) {
      d += promo.type === 'percent' ? Math.round(total * promo.discount / 100) : promo.discount;
    }
    return Math.min(d, total);
  }

  // Order
  function placeOrder(address: string, comment: string, promo: PromoCode | null, bonusSpend: number) {
    if (!_cart.length) return null;
    const discount = calcDiscount(promo, bonusSpend, cartTotal);
    const finalTotal = cartTotal - discount;
    const bonusEarned = Math.floor(finalTotal * BONUS_RATE);

    const order: Order = {
      id: `RL-${Date.now()}`,
      date: new Date().toLocaleDateString('ru-RU'),
      items: [..._cart],
      total: finalTotal,
      discount,
      bonusEarned,
      promoUsed: promo?.code,
      status: 'pending',
      address,
      comment,
    };

    if (_user) {
      const newBonus = (_user.bonusPoints || 0) - bonusSpend + bonusEarned;
      _user = {
        ..._user,
        bonusPoints: Math.max(0, newBonus),
        orders: [order, ...(_user.orders || [])],
      };
      saveUser(_user);
    }
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
    toggleFavorite,
    isFavorite,
    addAddress,
    removeAddress,
    setDefaultAddress,
    updateAddress,
    applyPromo,
    calcDiscount,
    placeOrder,
  };
}
