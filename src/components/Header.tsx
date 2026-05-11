import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useStore } from '@/store/useStore';

interface HeaderProps {
  page: string;
  onNavigate: (page: string) => void;
  search: string;
  onSearch: (v: string) => void;
}

export default function Header({ page, onNavigate, search, onSearch }: HeaderProps) {
  const { cartCount, user } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-lg" style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #1a4a6e 60%, #2d6a9f 100%)' }}>
      {/* Top strip */}
      <div className="border-b border-white/10 text-xs text-white/60 py-1.5 hidden md:block">
        <div className="container flex justify-between items-center">
          <span>🚚 Доставка по всей России · Самовывоз в Астрахани</span>
          <span>📞 +7 (985) 750 22 62</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-3 flex items-center gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 flex-shrink-0 group"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-md"
            style={{ background: 'linear-gradient(135deg, #d4a96a, #b8895a)' }}>
            🐟
          </div>
          <div className="text-left">
            <div className="font-oswald font-bold text-xl text-white leading-none tracking-wide group-hover:text-sand transition-colors">рыбнаятема.рф</div>
            <div className="text-[10px] text-white/50 tracking-widest uppercase">магазин рыбы и снеков</div>
          </div>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={e => onSearch(e.target.value)}
              placeholder="Найти рыбу... (вобла, лещ, судак...)"
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all"
              onFocus={() => search && onNavigate('catalog')}
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { id: 'home', label: 'Главная' },
            { id: 'catalog', label: 'Каталог' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                page === item.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          {/* User */}
          <button
            onClick={() => onNavigate('account')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
              page === 'account' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon name="User" size={18} />
            <span className="hidden md:inline">{user ? user.name.split(' ')[0] : 'Войти'}</span>
          </button>

          {/* Cart */}
          <button
            onClick={() => onNavigate('cart')}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              page === 'cart'
                ? 'text-white'
                : 'text-white/80 hover:text-white'
            }`}
            style={page !== 'cart' ? { background: 'rgba(212,169,106,0.25)' } : { background: 'rgba(212,169,106,0.5)' }}
          >
            <Icon name="ShoppingCart" size={18} />
            <span className="hidden md:inline">Корзина</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white animate-scale-in"
                style={{ background: '#d4a96a' }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white"
          >
            <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Поиск рыбы..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/15 transition-all"
          />
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1 animate-fade-in">
          {[
            { id: 'home', label: 'Главная', icon: 'Home' },
            { id: 'catalog', label: 'Каталог', icon: 'Fish' },
            { id: 'account', label: user ? user.name.split(' ')[0] : 'Войти', icon: 'User' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 text-sm text-left"
            >
              <Icon name={item.icon as 'Home'} size={16} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}