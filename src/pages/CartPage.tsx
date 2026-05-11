import { useState } from 'react';
import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { cart, cartTotal, updateQty, removeFromCart, user } = useStore();
  const [removingId, setRemovingId] = useState<number | null>(null);

  function handleRemove(id: number) {
    setRemovingId(id);
    setTimeout(() => { removeFromCart(id); setRemovingId(null); }, 200);
  }

  const delivery = cartTotal >= 2000 ? 0 : 350;
  const totalWithDelivery = cartTotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="text-7xl mb-6 animate-float">🛒</div>
        <h2 className="font-oswald font-bold text-3xl mb-3">Корзина пуста</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Добавьте вяленую или копчёную рыбу из нашего каталога
        </p>
        <button
          onClick={() => onNavigate('catalog')}
          className="px-7 py-3 rounded-xl font-bold text-white transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}
        >
          Перейти в каталог
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('catalog')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <h1 className="font-oswald font-bold text-3xl">Корзина</h1>
          <span className="text-muted-foreground text-sm">({cart.length} {cart.length === 1 ? 'товар' : cart.length < 5 ? 'товара' : 'товаров'})</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map(item => (
              <div
                key={item.product.id}
                className={`bg-card rounded-xl border border-border p-4 flex gap-4 transition-all duration-200 ${
                  removingId === item.product.id ? 'opacity-0 scale-95' : 'opacity-100'
                }`}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-oswald font-semibold text-base leading-tight">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.product.type === 'dried' ? '🌿 Вяленая' : '🔥 Копчёная'} · {item.product.weight} г
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 p-1"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty control */}
                    <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                      >
                        <Icon name="Minus" size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                      >
                        <Icon name="Plus" size={14} />
                      </button>
                    </div>
                    <span className="font-oswald font-bold text-xl text-ocean-deep">
                      {item.product.price * item.quantity} ₽
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h3 className="font-oswald font-bold text-xl mb-5">Итого</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Товары ({cart.length})</span>
                  <span>{cartTotal} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доставка</span>
                  <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>
                    {delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}
                  </span>
                </div>
                {delivery > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Бесплатная доставка от 2 000 ₽ (ещё {2000 - cartTotal} ₽)
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between font-oswald font-bold text-2xl">
                  <span>К оплате</span>
                  <span style={{ color: '#1a4a6e' }}>{totalWithDelivery} ₽</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all hover:brightness-110 active:scale-95 shadow-md"
                style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}
              >
                Оформить заказ
              </button>

              {!user && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  <button onClick={() => onNavigate('account')} className="text-ocean-deep hover:underline">
                    Войдите
                  </button>, чтобы отслеживать заказы
                </p>
              )}

              <button
                onClick={() => onNavigate('catalog')}
                className="w-full mt-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-all border border-border"
              >
                Продолжить покупки
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
