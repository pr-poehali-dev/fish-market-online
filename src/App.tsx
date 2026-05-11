import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AccountPage from '@/pages/AccountPage';

type Page = 'home' | 'catalog' | 'cart' | 'checkout' | 'account';

function AppContent() {
  const [page, setPage] = useState<Page>('home');
  const [search, setSearch] = useState('');

  function handleNavigate(p: string) {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSearch(v: string) {
    setSearch(v);
    if (v.trim()) {
      setPage('catalog');
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        page={page}
        onNavigate={handleNavigate}
        search={search}
        onSearch={handleSearch}
      />
      <main className="flex-1">
        {page === 'home' && (
          <HomePage search={search} onSearch={handleSearch} onNavigate={handleNavigate} />
        )}
        {page === 'catalog' && (
          <CatalogPage search={search} onSearch={handleSearch} />
        )}
        {page === 'cart' && (
          <CartPage onNavigate={handleNavigate} />
        )}
        {page === 'checkout' && (
          <CheckoutPage onNavigate={handleNavigate} />
        )}
        {page === 'account' && (
          <AccountPage onNavigate={handleNavigate} />
        )}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

const App = () => (
  <TooltipProvider>
    <Toaster />
    <AppContent />
  </TooltipProvider>
);

export default App;
