import { useState } from 'react';
import { useStore, STATUS_LABELS } from '@/store/useStore';
import Icon from '@/components/ui/icon';

interface AccountPageProps {
  onNavigate: (page: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function AccountPage({ onNavigate }: AccountPageProps) {
  const { user, login, logout, updateUser } = useStore();
  const [tab, setTab] = useState<'profile' | 'orders' | 'favorites'>('profile');

  // Login form
  const [loginForm, setLoginForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', address: '' });

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginForm.name.trim() || !loginForm.email.trim()) return;
    login({ name: loginForm.name, email: loginForm.email, phone: loginForm.phone, address: loginForm.address });
  }

  function handleSave() {
    updateUser(editForm);
    setEditMode(false);
  }

  function startEdit() {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    setEditMode(true);
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
            <p className="text-muted-foreground text-sm">Войдите, чтобы отслеживать заказы и сохранять данные</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm animate-fade-in">
            <h2 className="font-oswald font-bold text-xl mb-6">Вход / Регистрация</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Имя *</label>
                <input
                  type="text"
                  value={loginForm.name}
                  onChange={e => setLoginForm({ ...loginForm, name: e.target.value })}
                  placeholder="Иван Иванов"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email *</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="ivan@email.ru"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Телефон</label>
                <input
                  type="tel"
                  value={loginForm.phone}
                  onChange={e => setLoginForm({ ...loginForm, phone: e.target.value })}
                  placeholder="+7 (999) 999-99-99"
                  className="w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Адрес доставки</label>
                <input
                  type="text"
                  value={loginForm.address}
                  onChange={e => setLoginForm({ ...loginForm, address: e.target.value })}
                  placeholder="Город, улица, дом"
                  className="w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}
              >
                Войти / Зарегистрироваться
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-5xl">
        {/* Profile header */}
        <div className="rounded-2xl p-6 mb-6 flex items-center gap-5 shadow-md"
          style={{ background: 'linear-gradient(135deg, #1a3a5c, #1a4a6e)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: 'rgba(212,169,106,0.3)', border: '2px solid rgba(212,169,106,0.5)' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="font-oswald font-bold text-2xl text-white">{user.name}</h1>
            <p className="text-white/60 text-sm">{user.email}</p>
            {user.phone && <p className="text-white/60 text-sm">{user.phone}</p>}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center hidden sm:block">
              <div className="font-oswald font-bold text-2xl text-white">{user.orders?.length || 0}</div>
              <div className="text-xs text-white/50">заказов</div>
            </div>
            <button
              onClick={() => { logout(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
            >
              <Icon name="LogOut" size={15} />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6">
          {[
            { id: 'profile', label: 'Профиль', icon: 'User' },
            { id: 'orders', label: `Заказы (${user.orders?.length || 0})`, icon: 'Package' },
            { id: 'favorites', label: 'Избранное', icon: 'Heart' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={t.icon as 'User'} size={15} />
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {tab === 'profile' && (
          <div className="bg-card rounded-2xl border border-border p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-oswald font-bold text-xl">Личные данные</h2>
              {!editMode ? (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-secondary transition-all"
                >
                  <Icon name="Pencil" size={14} />
                  Редактировать
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 rounded-lg text-sm border border-border hover:bg-secondary transition-all"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:brightness-110"
                    style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}
                  >
                    Сохранить
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'Имя', key: 'name', type: 'text', placeholder: 'Ваше имя' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'email@example.ru' },
                { label: 'Телефон', key: 'phone', type: 'tel', placeholder: '+7 (999) 999-99-99' },
                { label: 'Адрес доставки', key: 'address', type: 'text', placeholder: 'Город, улица, дом' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    {field.label}
                  </label>
                  {editMode ? (
                    <input
                      type={field.type}
                      value={editForm[field.key as keyof typeof editForm]}
                      onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                    />
                  ) : (
                    <div className="px-3 py-2.5 rounded-lg bg-muted text-sm">
                      {user[field.key as keyof typeof user] as string || <span className="text-muted-foreground">Не указано</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div className="animate-fade-in">
            {!user.orders?.length ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="font-oswald font-bold text-xl mb-2">Заказов пока нет</h3>
                <p className="text-muted-foreground mb-6 text-sm">Оформите первый заказ в нашем каталоге</p>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="px-6 py-2.5 rounded-xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}
                >
                  В каталог
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {user.orders.map(order => (
                  <div key={order.id} className="bg-card rounded-2xl border border-border p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="font-oswald font-bold text-lg">Заказ #{order.id}</div>
                        <div className="text-sm text-muted-foreground">{order.date}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                        <span className="font-oswald font-bold text-xl" style={{ color: '#1a4a6e' }}>
                          {order.total} ₽
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {order.items.slice(0, 4).map(item => (
                        <div key={item.product.id} className="flex items-center gap-2">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="text-xs">
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-muted-foreground">{item.quantity} шт</div>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          +{order.items.length - 4} ещё
                        </div>
                      )}
                    </div>
                    {order.address && (
                      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground flex items-center gap-1.5">
                        <Icon name="MapPin" size={12} />
                        {order.address}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites tab */}
        {tab === 'favorites' && (
          <div className="text-center py-20 bg-card rounded-2xl border border-border animate-fade-in">
            <div className="text-5xl mb-4">❤️</div>
            <h3 className="font-oswald font-bold text-xl mb-2">Избранное пусто</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Сохраняйте понравившиеся товары, нажав на сердечко
            </p>
            <button
              onClick={() => onNavigate('catalog')}
              className="px-6 py-2.5 rounded-xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}
            >
              Перейти в каталог
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
