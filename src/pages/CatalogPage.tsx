import { useState, useMemo } from 'react';
import { products, SPECIES, TYPES, WEIGHTS } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/ui/icon';

interface CatalogPageProps {
  search: string;
  onSearch: (v: string) => void;
}

export default function CatalogPage({ search, onSearch }: CatalogPageProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<'' | 'dried' | 'smoked'>('');
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'new'>('popular');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.species.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (selectedType) list = list.filter(p => p.type === selectedType);
    if (selectedSpecies.length) list = list.filter(p => selectedSpecies.includes(p.species));
    if (selectedWeight) list = list.filter(p => p.weight === selectedWeight);

    if (sortBy === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'new') list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    else list.sort((a, b) => b.reviews - a.reviews);

    return list;
  }, [search, selectedType, selectedSpecies, selectedWeight, sortBy]);

  const activeFiltersCount = [
    selectedType !== '',
    selectedSpecies.length > 0,
    selectedWeight !== null,
  ].filter(Boolean).length;

  function resetFilters() {
    setSelectedSpecies([]);
    setSelectedType('');
    setSelectedWeight(null);
    onSearch('');
  }

  function toggleSpecies(s: string) {
    setSelectedSpecies(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Type */}
      <div>
        <div className="font-oswald font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          Тип обработки
        </div>
        <div className="space-y-2">
          {(['', 'dried', 'smoked'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all ${
                selectedType === t
                  ? 'text-white font-medium'
                  : 'hover:bg-secondary text-foreground'
              }`}
              style={selectedType === t ? { background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' } : {}}
            >
              {t === '' ? '🐟 Все виды' : t === 'dried' ? '🌿 Вяленая' : '🔥 Копчёная'}
            </button>
          ))}
        </div>
      </div>

      {/* Species */}
      <div>
        <div className="font-oswald font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          Вид рыбы
        </div>
        <div className="flex flex-wrap gap-2">
          {SPECIES.map(s => (
            <button
              key={s}
              onClick={() => toggleSpecies(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedSpecies.includes(s)
                  ? 'text-white border-transparent'
                  : 'border-border hover:border-wood-mid text-muted-foreground'
              }`}
              style={selectedSpecies.includes(s) ? { background: '#b8895a', borderColor: '#b8895a' } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div>
        <div className="font-oswald font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          Вес упаковки
        </div>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedWeight(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              selectedWeight === null
                ? 'text-white font-medium'
                : 'hover:bg-secondary text-foreground'
            }`}
            style={selectedWeight === null ? { background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' } : {}}
          >
            Любой вес
          </button>
          {WEIGHTS.map(w => (
            <button
              key={w}
              onClick={() => setSelectedWeight(w)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                selectedWeight === w
                  ? 'text-white font-medium'
                  : 'hover:bg-secondary text-foreground'
              }`}
              style={selectedWeight === w ? { background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' } : {}}
            >
              {w >= 1000 ? `${w / 1000} кг` : `${w} г`}
            </button>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full py-2 rounded-lg border border-destructive text-destructive text-sm hover:bg-destructive/5 transition-all"
        >
          Сбросить фильтры ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="py-8 border-b border-border"
        style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #1a4a6e 100%)' }}>
        <div className="container">
          <h1 className="font-oswald font-bold text-4xl text-white mb-2">Каталог рыбы</h1>
          <p className="text-white/60">Вяленая и копчёная рыба из Астрахани</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="font-oswald font-bold text-lg mb-5 flex items-center gap-2">
                <Icon name="SlidersHorizontal" size={18} />
                Фильтры
                {activeFiltersCount > 0 && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-white font-medium"
                    style={{ background: '#b8895a' }}>
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Mobile filter button */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-all"
              >
                <Icon name="SlidersHorizontal" size={15} />
                Фильтры
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                    style={{ background: '#b8895a' }}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="text-sm text-muted-foreground">
                Найдено: <span className="font-semibold text-foreground">{filtered.length}</span> товаров
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">Сортировка:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="border border-border rounded-lg px-3 py-1.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="popular">По популярности</option>
                  <option value="price_asc">Дешевле сначала</option>
                  <option value="price_desc">Дороже сначала</option>
                  <option value="new">Новинки</option>
                </select>
              </div>
            </div>

            {/* Mobile filters */}
            {filtersOpen && (
              <div className="lg:hidden bg-card rounded-xl border border-border p-5 mb-6 animate-fade-in">
                <FilterContent />
              </div>
            )}

            {/* Search info */}
            {search && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-secondary text-sm">
                <Icon name="Search" size={14} />
                Поиск: «{search}» — {filtered.length} товаров
                <button onClick={() => onSearch('')} className="ml-auto text-destructive hover:underline">
                  Очистить
                </button>
              </div>
            )}

            {/* Products */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🐟</div>
                <h3 className="font-oswald font-bold text-xl mb-2">Ничего не найдено</h3>
                <p className="text-muted-foreground mb-4">
                  Попробуйте изменить фильтры или поисковый запрос
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:brightness-110"
                  style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}
                >
                  Сбросить всё
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
