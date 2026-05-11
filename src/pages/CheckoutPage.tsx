import { useState } from 'react';
import { useStore } from '@/store/useStore';
import Icon from '@/components/ui/icon';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { cart, cartTotal, user, placeOrder } = useStore();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    comment: '',
    delivery: 'courier',
    payment: 'card',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const delivery = cartTotal >= 2000 ? 0 : 350;

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Введите имя';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Введите корректный телефон';
    if (!form.address.trim()) e.address = 'Введите адрес доставки';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const order = placeOrder(form.address, form.comment);
    if (order) {
      setOrderId(order.id);
    } else {
      setOrderId(`RL-${Date.now()}`);
    }
    setSubmitted(true);
  }

  if (cart.length === 0 && !submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="font-oswald font-bold text-3xl mb-3">Корзина пуста</h2>
        <button
          onClick={() => onNavigate('catalog')}
          className="px-7 py-3 rounded-xl font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}
        >
          В каталог
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6 animate-scale-in shadow-xl"
          style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}>
          ✓
        </div>
        <h2 className="font-oswald font-bold text-4xl text-foreground mb-3 animate-fade-in">
          Заказ оформлен!
        </h2>
        <p className="text-muted-foreground mb-2 animate-fade-in delay-100">
          Ваш заказ <span className="font-semibold text-foreground">#{orderId}</span> принят
        </p>
        <p className="text-sm text-muted-foreground mb-8 animate-fade-in delay-200">
          Мы свяжемся с вами по телефону {form.phone} для подтверждения
        </p>
        <div className="flex gap-3 flex-wrap justify-center animate-fade-in delay-300">
          <button
            onClick={() => onNavigate('account')}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}
          >
            Мои заказы
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-6 py-3 rounded-xl font-semibold border border-border hover:bg-secondary transition-all"
          >
            Продолжить покупки
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => onNavigate('cart')} className="text-muted-foreground hover:text-foreground">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <h1 className="font-oswald font-bold text-3xl">Оформление заказа</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-oswald font-bold text-xl mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm text-white font-bold"
                  style={{ background: '#1a4a6e' }}>1</span>
                Контактные данные
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Имя и фамилия *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Иван Иванов"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all bg-background ${
                      errors.name ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Телефон *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+7 (999) 999-99-99"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all bg-background ${
                      errors.phone ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-oswald font-bold text-xl mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm text-white font-bold"
                  style={{ background: '#1a4a6e' }}>2</span>
                Доставка
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  { id: 'courier', label: 'Курьером', desc: 'До двери', icon: '🚚' },
                  { id: 'pickup', label: 'Самовывоз', desc: 'г. Астрахань', icon: '🏪' },
                ].map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setForm({ ...form, delivery: d.id })}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${
                      form.delivery === d.id ? 'border-ocean-deep' : 'border-border hover:border-muted-foreground'
                    }`}
                    style={form.delivery === d.id ? { borderColor: '#1a4a6e', background: 'rgba(26,74,110,0.05)' } : {}}
                  >
                    <span className="text-2xl">{d.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{d.label}</div>
                      <div className="text-xs text-muted-foreground">{d.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Адрес доставки *</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Город, улица, дом, квартира"
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all bg-background ${
                    errors.address ? 'border-destructive' : 'border-input'
                  }`}
                />
                {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-oswald font-bold text-xl mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm text-white font-bold"
                  style={{ background: '#1a4a6e' }}>3</span>
                Оплата
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  { id: 'card', label: 'Картой онлайн', icon: '💳' },
                  { id: 'cash', label: 'Наличными', icon: '💵' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setForm({ ...form, payment: p.id })}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${
                      form.payment === p.id ? 'border-ocean-deep' : 'border-border hover:border-muted-foreground'
                    }`}
                    style={form.payment === p.id ? { borderColor: '#1a4a6e', background: 'rgba(26,74,110,0.05)' } : {}}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <span className="font-semibold text-sm">{p.label}</span>
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Комментарий к заказу</label>
                <textarea
                  value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                  placeholder="Особые пожелания, время доставки..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all bg-background resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all hover:brightness-110 active:scale-[0.99] shadow-lg"
              style={{ background: 'linear-gradient(135deg, #1a4a6e, #2d6a9f)' }}
            >
              Подтвердить заказ
            </button>
          </form>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h3 className="font-oswald font-bold text-xl mb-4">Ваш заказ</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} шт × {item.product.price} ₽</p>
                    </div>
                    <span className="text-sm font-semibold whitespace-nowrap">{item.product.price * item.quantity} ₽</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Товары</span>
                  <span>{cartTotal} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доставка</span>
                  <span className={delivery === 0 ? 'text-green-600' : ''}>{delivery === 0 ? 'Бесплатно' : `${delivery} ₽`}</span>
                </div>
                <div className="flex justify-between font-oswald font-bold text-xl pt-2 border-t border-border">
                  <span>Итого</span>
                  <span style={{ color: '#1a4a6e' }}>{cartTotal + delivery} ₽</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
