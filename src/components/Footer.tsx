interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer
      className="wood-texture border-t-4 mt-0"
      style={{ borderColor: "#b8895a" }}
    >
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                style={{
                  background: "linear-gradient(135deg, #d4a96a, #b8895a)",
                }}
              >
                🐟
              </div>
              <div>
                <div className="font-oswald font-bold text-xl text-white">
                  РыбаЛов
                </div>
                <div className="text-[10px] text-white/40 tracking-widest uppercase">
                  магазин рыбы
                </div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Натуральная вяленая и копчёная рыба из Астрахани. Традиционные
              рецепты, свежий улов.
            </p>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="font-oswald font-semibold text-white mb-4 tracking-wide">
              Каталог
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Все товары", page: "catalog" },
                { label: "Вяленая рыба", page: "catalog" },
                { label: "Копчёная рыба", page: "catalog" },
                { label: "Новинки", page: "catalog" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onNavigate(item.page)}
                    className="text-white/50 hover:text-white/90 text-sm transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-oswald font-semibold text-white mb-4 tracking-wide">
              Покупателям
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Личный кабинет", page: "account" },
                { label: "Мои заказы", page: "account" },
                { label: "Корзина", page: "cart" },
                { label: "Оформить заказ", page: "checkout" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onNavigate(item.page)}
                    className="text-white/50 hover:text-white/90 text-sm transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-oswald font-semibold text-white mb-4 tracking-wide">
              Контакты
            </h4>
            <ul className="space-y-3 mb-5">
              <li className="flex items-center gap-2 text-sm text-white/60">
                📞 <span>8 (800) 123-45-67</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                ✉️ <span>info@rybalov.ru</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                📍 <span>г. Астрахань, ул. Рыбная, 7</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                🕐 <span>Пн–Вс: 9:00 – 21:00</span>
              </li>
            </ul>

            {/* Social links */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
                Мы в соцсетях
              </p>
              <div className="flex gap-2">
                {[
                  { label: "VK", href: "#" },
                  { label: "TG", href: "#" },
                  { label: "WA", href: "#" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all hover:scale-105"
                    style={{
                      background: "rgba(212,169,106,0.25)",
                      border: "1px solid rgba(212,169,106,0.3)",
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © 2024 Рыбнаятема. Все права защищены.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              Политика конфиденциальности
            </a>
            <a
              href="#"
              className="text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              Условия доставки
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
