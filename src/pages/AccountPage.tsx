import { useState } from 'react';
import { useStore, STATUS_LABELS, BONUS_RATE, PROMO_CODES } from '@/store/useStore';
import { products } from '@/data/products';
import Icon from '@/components/ui/icon';
import ProductCard from '@/components/ProductCard';

interface AccountPageProps {
  onNavigate: (page: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
};

const BONUS_TIERS = [
  { min: 0, max: 999, label: 'Новичок', icon: '🐟', color: '#6b7280' },
  { min: 1000, max: 4999, label: 'Рыбак', icon: '🎣', color: '#b8895a' },
  { min: 5000, max: 14999, label: 'Мастер', icon: '🏆', color: '#2d6a9f' },
  { min: 15000, max: Infinity, label: 'Эксперт', icon: '⭐', color: '#d4a96a' },
];

function getBonusTier(points: number) {
  return BONUS_TIERS.find(t => points >= t.min && points <= t.max) || BONUS_TIERS[0];
}

export default function AccountPage({ onNavigate }: AccountPageProps) {
  const { user, login, logout, updateUser, removeAddress, addAddress, setDefaultAddress, updateAddress, toggleFavorite } = useStore();
  const [tab, setTab] = useState<'profile' | 'orders' | 'favorites' | 'bonuses' | 'addresses'>('profile');

  const [loginForm, setLoginForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });

  const [showAddAddr, setShowAddAddr] = useState(false);
  const [addrForm, setAddrForm] = useState({ label: '', value: '', isDefault: false });
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [editAddrForm, setEditAddrForm] = useState({ label: '', value: '' });

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginForm.name.trim() || !loginForm.email.trim()) return;
    login({ name: loginForm.name, email: loginForm.email, phone: loginForm.phone, address: loginForm.address });
  }

  function handleSaveProfile() {
    updateUser(editForm);
    setEditMode(false);
  }

  function startEdit() {
    setEditForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
    setEditMode(true);
  }

  function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!addrForm.label.trim() || !addrForm.value.trim()) return;
    addAddress(addrForm.label, addrForm.value, addrForm.isDefault);
    setAddrForm({ label: '', value: '', isDefault: false });
    setShowAddAddr(false);
  }

  function startEditAddr(id: string, label: string, value: string) {
    setEditingAddrId(id);
    setEditAddrForm({ label, value });
  }

  function handleSaveAddr() {
    if (!editingAddrId) return;
    updateAddress(editingAddrId, editAddrForm.label, editAddrForm.value);
    setEditingAddrId(null);
  }

  if (!user) {
    return (
      <div className="min-h-screen py-12">
        <div className="container max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}>
              👤
            </div>
            <h1 className="font-oswald font-bold text-3xl mb-2">Личный кабинет</h1>
            <p className="text-muted-foreground text-sm">Войдите, чтобы получить доступ к бонусам, заказам и избранному</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm animate-fade-in">
            <h2 className="font-oswald font-bold text-xl mb-6">Вход / Регистрация</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Имя *</label>
                <input type="text" value={loginForm.name} onChange={e => setLoginForm({ ...loginForm, name: e.target.value })}
                  placeholder="Иван Иванов" required
                  className="w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email *</label>
                <input type="email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="ivan@email.ru" required
                  className="w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Телефон</label>
                <input type="tel" value={loginForm.phone} onChange={e => setLoginForm({ ...loginForm, phone: e.target.value })}
                  placeholder="+7 (999) 999-99-99"
                  className="w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
              </div>
              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}>
                Войти / Зарегистрироваться
              </button>
            </form>
            <div className="mt-5 p-4 rounded-xl border border-border bg-muted/40">
              <p className="text-xs text-muted-foreground font-medium mb-2">Тестовые промокоды:</p>
              <div className="flex flex-wrap gap-1.5">
                {PROMO_CODES.map(p => (
                  <span key={p.code} className="px-2 py-1 rounded bg-background border border-border text-xs font-mono font-bold text-ocean-deep">
                    {p.code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tier = getBonusTier(user.bonusPoints || 0);
  const nextTier = BONUS_TIERS[BONUS_TIERS.indexOf(tier) + 1];
  const progress = nextTier
    ? Math.round(((user.bonusPoints - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100;

  const favProducts = products.filter(p => (user.favorites || []).includes(p.id));

  const TABS = [
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'bonuses', label: 'Бонусы', icon: 'Gift' },
    { id: 'addresses', label: 'Адреса', icon: 'MapPin' },
    { id: 'orders', label: `Заказы${(user.orders || []).length ? ` (${user.orders.length})` : ''}`, icon: 'Package' },
    { id: 'favorites', label: `Избранное${favProducts.length ? ` (${favProducts.length})` : ''}`, icon: 'Heart' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-5xl">

        {/* Profile header */}
        <div className="rounded-2xl p-6 mb-6 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #1a4a6e 60%, #2d6a9f 100%)' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
              style={{ background: 'rgba(212,169,106,0.3)', border: '2px solid rgba(212,169,106,0.6)' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h1 className="font-oswald font-bold text-2xl text-white">{user.name}</h1>
                <span className="text-lg">{tier.icon}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white border border-white/30"
                  style={{ background: 'rgba(255,255,255,0.15)' }}>{tier.label}</span>
              </div>
              <p className="text-white/60 text-sm">{user.email}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-center px-4 py-3 rounded-xl"
                style={{ background: 'rgba(212,169,106,0.25)', border: '1px solid rgba(212,169,106,0.4)' }}>
                <div className="font-oswald font-bold text-2xl text-white">{user.bonusPoints || 0}</div>
                <div className="text-xs text-white/60">бонусов</div>
              </div>
              <div className="text-center px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div className="font-oswald font-bold text-2xl text-white">{(user.orders || []).length}</div>
                <div className="text-xs text-white/60">заказов</div>
              </div>
              <button onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm">
                <Icon name="LogOut" size={15} />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                tab === t.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <Icon name={t.icon as 'User'} size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PROFILE ── */}
        {tab === 'profile' && (
          <div className="bg-card rounded-2xl border border-border p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-oswald font-bold text-xl">Личные данные</h2>
              {!editMode ? (
                <button onClick={startEdit}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-secondary transition-all">
                  <Icon name="Pencil" size={14} />Редактировать
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditMode(false)}
                    className="px-4 py-2 rounded-lg text-sm border border-border hover:bg-secondary">Отмена</button>
                  <button onClick={handleSaveProfile}
                    className="px-4 py-2 rounded-lg text-sm font-bold text-white hover:brightness-110"
                    style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}>Сохранить</button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {([
                { label: 'Имя', key: 'name', type: 'text', placeholder: 'Ваше имя' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'email@example.ru' },
                { label: 'Телефон', key: 'phone', type: 'tel', placeholder: '+7 (999) 999-99-99' },
              ] as const).map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{field.label}</label>
                  {editMode ? (
                    <input type={field.type} value={editForm[field.key]}
                      onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
                  ) : (
                    <div className="px-3 py-2.5 rounded-lg bg-muted text-sm">
                      {(user as Record<string, unknown>)[field.key] as string || <span className="text-muted-foreground">Не указано</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BONUSES ── */}
        {tab === 'bonuses' && (
          <div className="space-y-5 animate-fade-in">
            <div className="rounded-2xl p-6 text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #1a3a5c, #2d6a9f)' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Ваш баланс</p>
                  <div className="font-oswald font-bold text-5xl">{user.bonusPoints || 0}</div>
                  <p className="text-white/50 text-xs mt-1">бонусных баллов · 1 балл = 1 ₽</p>
                </div>
                <div className="text-5xl">{tier.icon}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{tier.label}</span>
                {nextTier && (
                  <>
                    <div className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #d4a96a, #f0c87a)' }} />
                    </div>
                    <span className="text-xs text-white/50">до «{nextTier.label}»: {nextTier.min - (user.bonusPoints || 0)} б.</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-oswald font-bold text-lg mb-4">Уровни лояльности</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {BONUS_TIERS.map(t => (
                  <div key={t.label}
                    className={`rounded-xl p-4 text-center border-2 transition-all ${tier.label === t.label ? 'border-ocean-deep shadow-md' : 'border-border'}`}
                    style={tier.label === t.label ? { background: 'rgba(26,74,110,0.06)' } : {}}>
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <div className="font-oswald font-bold text-sm">{t.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.max === Infinity ? `от ${t.min.toLocaleString()} б.` : `${t.min}–${t.max.toLocaleString()} б.`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-oswald font-bold text-lg mb-4">Как работают бонусы</h3>
              <div className="space-y-3">
                {[
                  { icon: '🛒', title: `${Math.round(BONUS_RATE * 100)}% с каждого заказа`, desc: 'Бонусы начисляются автоматически после оформления' },
                  { icon: '💳', title: 'Списание при оплате', desc: '1 балл = 1 ₽, до 30% от суммы заказа' },
                  { icon: '🎯', title: 'Промокоды', desc: 'Вводятся при оформлении заказа, суммируются с бонусами' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-oswald font-bold text-lg mb-4">Промокоды</h3>
              <div className="space-y-2">
                {PROMO_CODES.map(p => (
                  <div key={p.code} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm px-2.5 py-1 rounded bg-background border border-border text-ocean-deep">{p.code}</span>
                      <span className="text-sm text-muted-foreground">{p.label}</span>
                    </div>
                    <span className="font-bold text-sm" style={{ color: '#1a4a6e' }}>
                      -{p.type === 'percent' ? `${p.discount}%` : `${p.discount} ₽`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {(user.orders || []).some(o => o.bonusEarned > 0) && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-oswald font-bold text-lg mb-4">История начислений</h3>
                <div className="space-y-2">
                  {(user.orders || []).filter(o => o.bonusEarned > 0).map(o => (
                    <div key={o.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <span className="text-sm font-medium">Заказ #{o.id}</span>
                        <span className="text-xs text-muted-foreground ml-2">{o.date}</span>
                      </div>
                      <span className="text-green-600 font-bold text-sm">+{o.bonusEarned} б.</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ADDRESSES ── */}
        {tab === 'addresses' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-oswald font-bold text-xl">Адреса доставки</h2>
              <button onClick={() => setShowAddAddr(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}>
                <Icon name="Plus" size={15} />Добавить
              </button>
            </div>

            {showAddAddr && (
              <div className="bg-card rounded-2xl border border-border p-6 animate-fade-in">
                <h3 className="font-oswald font-bold text-lg mb-4">Новый адрес</h3>
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Название *</label>
                      <input type="text" value={addrForm.label}
                        onChange={e => setAddrForm({ ...addrForm, label: e.target.value })}
                        placeholder="Дом, Работа, Дача..."
                        className="w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Адрес *</label>
                      <input type="text" value={addrForm.value}
                        onChange={e => setAddrForm({ ...addrForm, value: e.target.value })}
                        placeholder="Город, улица, дом, квартира"
                        className="w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={addrForm.isDefault}
                      onChange={e => setAddrForm({ ...addrForm, isDefault: e.target.checked })} className="rounded" />
                    Использовать по умолчанию
                  </label>
                  <div className="flex gap-2">
                    <button type="submit"
                      className="px-5 py-2.5 rounded-lg text-sm font-bold text-white hover:brightness-110"
                      style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}>Сохранить</button>
                    <button type="button" onClick={() => setShowAddAddr(false)}
                      className="px-5 py-2.5 rounded-lg text-sm border border-border hover:bg-secondary">Отмена</button>
                  </div>
                </form>
              </div>
            )}

            {!(user.addresses || []).length && !showAddAddr && (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <div className="text-5xl mb-4">📍</div>
                <h3 className="font-oswald font-bold text-xl mb-2">Адресов пока нет</h3>
                <p className="text-muted-foreground text-sm mb-5">Добавьте адрес для быстрого оформления</p>
                <button onClick={() => setShowAddAddr(true)}
                  className="px-5 py-2.5 rounded-xl text-white font-bold hover:brightness-110"
                  style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}>Добавить первый адрес</button>
              </div>
            )}

            <div className="space-y-3">
              {(user.addresses || []).map(addr => (
                <div key={addr.id} className="bg-card rounded-2xl border border-border p-5">
                  {editingAddrId === addr.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" value={editAddrForm.label}
                          onChange={e => setEditAddrForm({ ...editAddrForm, label: e.target.value })}
                          placeholder="Название"
                          className="px-3 py-2 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
                        <input type="text" value={editAddrForm.value}
                          onChange={e => setEditAddrForm({ ...editAddrForm, value: e.target.value })}
                          placeholder="Адрес"
                          className="px-3 py-2 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleSaveAddr}
                          className="px-4 py-2 rounded-lg text-sm font-bold text-white hover:brightness-110"
                          style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}>Сохранить</button>
                        <button onClick={() => setEditingAddrId(null)}
                          className="px-4 py-2 rounded-lg text-sm border border-border hover:bg-secondary">Отмена</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${addr.isDefault ? 'bg-ocean-deep/10' : 'bg-muted'}`}>📍</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full text-white font-medium"
                              style={{ background: '#2d6a9f' }}>По умолчанию</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{addr.value}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!addr.isDefault && (
                          <button onClick={() => setDefaultAddress(addr.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                            title="Сделать основным">
                            <Icon name="Star" size={14} />
                          </button>
                        )}
                        <button onClick={() => startEditAddr(addr.id, addr.label, addr.value)}
                          className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                          <Icon name="Pencil" size={14} />
                        </button>
                        <button onClick={() => removeAddress(addr.id)}
                          className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div className="animate-fade-in">
            {!(user.orders || []).length ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="font-oswald font-bold text-xl mb-2">Заказов пока нет</h3>
                <p className="text-muted-foreground mb-6 text-sm">Оформите первый заказ в каталоге</p>
                <button onClick={() => onNavigate('catalog')}
                  className="px-6 py-2.5 rounded-xl font-bold text-white hover:brightness-110"
                  style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}>В каталог</button>
              </div>
            ) : (
              <div className="space-y-4">
                {(user.orders || []).map(order => (
                  <div key={order.id} className="bg-card rounded-2xl border border-border overflow-hidden">
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="w-full flex flex-wrap items-center gap-4 p-5 text-left hover:bg-muted/30 transition-all">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-oswald font-bold text-base">#{order.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status]}`}>
                            {STATUS_LABELS[order.status]}
                          </span>
                          {order.promoUsed && (
                            <span className="px-2 py-0.5 rounded text-xs font-mono bg-muted text-muted-foreground">🎟 {order.promoUsed}</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{order.date} · {order.items.length} {order.items.length === 1 ? 'товар' : 'товаров'}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-oswald font-bold text-xl" style={{ color: '#1a4a6e' }}>{order.total} ₽</div>
                        {order.discount > 0 && <div className="text-xs text-green-600">скидка {order.discount} ₽</div>}
                        {order.bonusEarned > 0 && <div className="text-xs text-amber-600">+{order.bonusEarned} б.</div>}
                      </div>
                      <Icon name={expandedOrder === order.id ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground flex-shrink-0" />
                    </button>

                    {expandedOrder === order.id && (
                      <div className="border-t border-border p-5 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Состав заказа</p>
                            <div className="space-y-2">
                              {order.items.map(item => (
                                <div key={item.product.id} className="flex items-center gap-3">
                                  <img src={item.product.image} alt={item.product.name}
                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.quantity} × {item.product.price} ₽</p>
                                  </div>
                                  <span className="text-sm font-semibold">{item.product.price * item.quantity} ₽</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Адрес</p>
                              <p className="text-sm">{order.address}</p>
                            </div>
                            {order.comment && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Комментарий</p>
                                <p className="text-sm">{order.comment}</p>
                              </div>
                            )}
                            <div className="pt-3 border-t border-border space-y-1">
                              {order.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Скидка</span>
                                  <span className="text-green-600">−{order.discount} ₽</span>
                                </div>
                              )}
                              {order.bonusEarned > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Начислено бонусов</span>
                                  <span className="text-amber-600 font-medium">+{order.bonusEarned} б.</span>
                                </div>
                              )}
                              <div className="flex justify-between font-oswald font-bold text-lg pt-1">
                                <span>Итого</span>
                                <span style={{ color: '#1a4a6e' }}>{order.total} ₽</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── FAVORITES ── */}
        {tab === 'favorites' && (
          <div className="animate-fade-in">
            {!favProducts.length ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <div className="text-5xl mb-4">❤️</div>
                <h3 className="font-oswald font-bold text-xl mb-2">Избранное пусто</h3>
                <p className="text-muted-foreground mb-6 text-sm">Нажмите ❤️ на карточке товара, чтобы сохранить</p>
                <button onClick={() => onNavigate('catalog')}
                  className="px-6 py-2.5 rounded-xl font-bold text-white hover:brightness-110"
                  style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}>В каталог</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-oswald font-bold text-xl">Избранное ({favProducts.length})</h2>
                  <button onClick={() => [...(user.favorites || [])].forEach(id => toggleFavorite(id))}
                    className="text-sm text-muted-foreground hover:text-destructive transition-colors">
                    Очистить всё
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {favProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
