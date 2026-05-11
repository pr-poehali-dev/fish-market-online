import { useState } from 'react';
import { Product, TYPES } from '@/data/products';
import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div
      className="group bg-card rounded-xl overflow-hidden border border-border hover-scale shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col animate-fade-in"
      style={{ animationDelay: `${index * 0.06}s`, opacity: 0, animationFillMode: 'forwards' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-sand/40">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <span className="px-2 py-0.5 rounded text-[11px] font-bold text-white shadow"
              style={{ background: '#d4a96a' }}>
              {product.badge}
            </span>
          )}
          {product.isNew && !product.badge && (
            <span className="px-2 py-0.5 rounded text-[11px] font-bold text-white shadow"
              style={{ background: '#2d6a9f' }}>
              Новинка
            </span>
          )}
        </div>

        {/* Type badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium text-white/90 ${
            product.type === 'smoked' ? 'bg-gray-700/70' : 'bg-green-700/70'
          }`}>
            {product.type === 'smoked' ? '🔥 Копчёная' : '🌿 Вяленая'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-oswald font-semibold text-lg text-foreground leading-tight mb-1 group-hover:text-ocean-deep transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Icon name="Weight" size={12} fallback="Scale" />
            {product.weight} г
          </span>
          <span className="flex items-center gap-1 text-amber-500">
            ⭐ {product.rating}
            <span className="text-muted-foreground">({product.reviews})</span>
          </span>
        </div>

        {/* Price + button */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <span className="font-oswald font-bold text-2xl text-ocean-deep">
              {product.price} ₽
            </span>
            <span className="text-xs text-muted-foreground ml-1">/ шт</span>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              added
                ? 'bg-green-600 text-white scale-95'
                : 'text-white hover:brightness-110 active:scale-95'
            }`}
            style={!added ? { background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' } : {}}
          >
            <Icon name={added ? 'Check' : 'ShoppingCart'} size={15} />
            <span>{added ? 'Добавлено' : 'В корзину'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
