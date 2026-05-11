import { useState, useMemo } from 'react';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';

interface HomePageProps {
  search: string;
  onSearch: (v: string) => void;
  onNavigate: (page: string) => void;
}

const BANNER_IMG = 'https://cdn.poehali.dev/projects/0a48bec4-ad72-4dec-954d-2e8af7b2e423/files/141eb813-c818-444b-b5ff-4e7dcbffede1.jpg';

export default function HomePage({ search, onSearch, onNavigate }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== 'all') list = list.filter(p => p.type === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.species.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, search]);

  const newProducts = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div>
      {/* HERO BANNER */}
      <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <div className="absolute inset-0">
          <img src={BANNER_IMG} alt="баннер" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(20,50,80,0.92) 0%, rgba(26,74,110,0.75) 50%, rgba(26,74,110,0.3) 100%)' }} />
          {/* Wood grain overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24"
            style={{ background: 'linear-gradient(to top, rgba(61,36,16,0.4), transparent)' }} />
        </div>

        <div className="relative container py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 border border-white/20 mb-4"
              style={{ background: 'rgba(255,255,255,0.1)' }}>
              🎣 Натуральная продукция из Астрахани
            </div>
            <h1 className="font-oswald font-bold text-4xl md:text-6xl text-white leading-tight mb-4">
              Вяленая<br />
              <span style={{ color: '#d4a96a' }}>и копчёная</span><br />
              рыба
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-md">
              Традиционные рецепты, свежий улов, доставка по всей России
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('catalog')}
                className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:brightness-110 active:scale-95 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #d4a96a, #b8895a)' }}
              >
                Смотреть каталог
              </button>
              <button
                onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 transition-all"
              >
                Новинки ↓
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex md:flex-col gap-4 animate-fade-in delay-300">
            {[
              { num: '50+', label: 'видов рыбы' },
              { num: '10 лет', label: 'на рынке' },
              { num: '98%', label: 'довольны' },
            ].map(s => (
              <div key={s.label} className="text-center px-5 py-3 rounded-xl border border-white/20"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <div className="font-oswald font-bold text-2xl text-white">{s.num}</div>
                <div className="text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <div className="wood-texture border-y border-wood-mid/30">
        <div className="container py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🚚', title: 'Быстрая доставка', sub: 'По всей России' },
              { icon: '🌿', title: 'Натуральный состав', sub: 'Без химии' },
              { icon: '❄️', title: 'Свежий улов', sub: 'Прямо с Волги' },
              { icon: '🎁', title: 'Подарочная упаковка', sub: 'По запросу' },
            ].map(f => (
              <div key={f.title} className="flex items-center gap-3 py-1">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <div className="font-oswald font-semibold text-sm text-white">{f.title}</div>
                  <div className="text-xs text-white/50">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATALOG SECTION (main focus) */}
      <section id="catalog-section" className="py-12 scale-pattern">
        <div className="container">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#b8895a' }}>
                наш ассортимент
              </div>
              <h2 className="font-oswald font-bold text-3xl md:text-4xl text-foreground">
                Каталог товаров
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="flex items-center gap-2 text-sm font-medium text-ocean-deep hover:text-ocean-mid transition-colors"
            >
              Расширенный каталог с фильтрами
              <Icon name="ArrowRight" size={16} />
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'text-white shadow-md'
                    : 'bg-white/80 text-muted-foreground hover:bg-white border border-border'
                }`}
                style={activeCategory === cat.id ? { background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' } : {}}
              >
                <span>{cat.icon}</span>
                {cat.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search result info */}
          {search && (
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Icon name="Search" size={14} />
              Поиск: «{search}» — найдено {filtered.length} товаров
              <button onClick={() => onSearch('')} className="ml-2 text-destructive hover:underline">
                Сбросить
              </button>
            </div>
          )}

          {/* Products grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🐟</div>
              <p className="text-muted-foreground">Ничего не найдено по запросу «{search}»</p>
              <button onClick={() => onSearch('')} className="mt-3 text-sm text-ocean-deep hover:underline">
                Сбросить поиск
              </button>
            </div>
          )}
        </div>
      </section>

      {/* New arrivals */}
      {newProducts.length > 0 && (
        <section className="py-12 bg-cream">
          <div className="container">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#b8895a' }}>
                  только появились
                </div>
                <h2 className="font-oswald font-bold text-3xl text-foreground">Новинки</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {newProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Banner CTA */}
      <section className="py-16 ocean-bg">
        <div className="container text-center">
          <div className="text-4xl mb-4 animate-float">🎣</div>
          <h2 className="font-oswald font-bold text-3xl text-white mb-3">
            Первый заказ — скидка 10%
          </h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Зарегистрируйтесь и получите промокод на первую покупку
          </p>
          <button
            onClick={() => onNavigate('account')}
            className="px-8 py-3 rounded-xl font-bold text-ocean-deep transition-all hover:brightness-105 active:scale-95 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #d4a96a, #b8895a)', color: '#1a3a5c' }}
          >
            Зарегистрироваться
          </button>
        </div>
      </section>
    </div>
  );
}
