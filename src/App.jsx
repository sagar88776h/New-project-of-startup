import React, { useState, useEffect } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { CartProvider, useCart } from './context/CartContext';
import './styles/index.css';

// Components
import StickyHeader from './components/header/StickyHeader';
import RestaurantHero from './components/header/RestaurantHero';
import InlineSearch from './components/search/InlineSearch';
import QuickFilterBar from './components/header/QuickFilterBar';
import CategoryNav from './components/menu/CategoryNav';
import FeaturedSection from './components/menu/FeaturedSection';
import SpecialOffersBanner from './components/menu/SpecialOffersBanner';
import MenuSection from './components/menu/MenuSection';
import FoodDetailModal from './components/detail/FoodDetailModal';
import InstantSearchModal from './components/search/InstantSearchModal';
import FloatingCartBar from './components/cart/FloatingCartBar';
import CartDrawer from './components/cart/CartDrawer';
import OrderSuccessModal from './components/cart/OrderSuccessModal';
import RestaurantInfoModal from './components/info/RestaurantInfoModal';
import RestaurantInfoSection from './components/info/RestaurantInfoSection';
import CallWaiterModal from './components/info/CallWaiterModal';
import TableSelectorModal from './components/info/TableSelectorModal';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminQrGenerator from './components/admin/AdminQrGenerator';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import DeviceFrameToggle from './components/common/DeviceFrameToggle';
import WelcomeIntroModal from './components/landing/WelcomeIntroModal';
import ScrollProgressBar from './components/common/ScrollProgressBar';

function MainApp() {
  const { activeRestaurant } = useRestaurant();
  const { isTableModalOpen, setIsTableModalOpen } = useCart();
  const { categories = [], items = [] } = activeRestaurant;

  // Admin access via ?admin=1 in URL parameter
  const [isAdminParam] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('admin') === '1';
    } catch {
      return false;
    }
  });

  // Search & Filter State
  const [inlineSearchQuery, setInlineSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategoryId, setActiveCategoryId] = useState(() => categories[0]?.id || 'favorites');

  // Welcome Intro Modal State
  const [isIntroOpen, setIsIntroOpen] = useState(() => {
    try {
      return !sessionStorage.getItem('seen_devi_intro');
    } catch {
      return true;
    }
  });

  // Modals UI State
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isQrStudioOpen, setIsQrStudioOpen] = useState(false);

  // Handle Category Click / Smooth Scroll
  const handleSelectCategory = (catId) => {
    setActiveCategoryId(catId);
    if (catId === 'favorites') {
      const favEl = document.getElementById('section-favorites');
      if (favEl) {
        favEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 180, behavior: 'smooth' });
      }
      return;
    }
    const targetElement = document.getElementById(`section-${catId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scrollspy to auto-detect active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 170;
      const visibleCategories = categories.filter(c => c.active && c.id !== 'favorites');

      for (let i = visibleCategories.length - 1; i >= 0; i--) {
        const cat = visibleCategories[i];
        const el = document.getElementById(`section-${cat.id}`);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveCategoryId(cat.id);
          return;
        }
      }

      if (window.scrollY < 340) {
        setActiveCategoryId('favorites');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  // Filter Items based on Quick Filter & Search Query
  const getFilteredItems = (catItems) => {
    return catItems.filter(item => {
      // Search matching
      if (inlineSearchQuery.trim()) {
        const q = inlineSearchQuery.toLowerCase().trim();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.ingredients?.some(ing => ing.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Dietary filter
      if (activeFilter === 'veg') return item.isVeg;
      if (activeFilter === 'nonveg') return !item.isVeg;
      if (activeFilter === 'bestsellers') return item.isBestseller;
      if (activeFilter === 'chef') return item.isChefSpecial;
      return true;
    });
  };

  const activeCategories = categories.filter(c => c.active);

  return (
    <div className="app-viewport-wrapper">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />
      
      {/* Admin Test & Controls Toolbar (Only shown when ?admin=1 is in URL) */}
      {isAdminParam && (
        <DeviceFrameToggle
          onOpenQr={() => setIsQrStudioOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      )}

      {/* Main Responsive Container */}
      <div className="site-main-container">
        
        {/* Sticky Compact Header */}
        <StickyHeader
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenInfo={() => setIsInfoOpen(true)}
          onOpenService={() => setIsServiceOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onChangeTable={() => setIsTableModalOpen(true)}
          onOpenIntro={() => setIsIntroOpen(true)}
        />

        {/* Restaurant Hero Banner */}
        <RestaurantHero
          onExploreClick={() => handleSelectCategory('favorites')}
          onOpenIntro={() => setIsIntroOpen(true)}
        />

        {/* Responsive Content Body */}
        <div className="site-content-container">
          {/* Clean Rounded Search Field */}
          <InlineSearch
            searchQuery={inlineSearchQuery}
            onSearchChange={setInlineSearchQuery}
            onClear={() => setInlineSearchQuery('')}
          />

          {/* Quick Filter Bar (Veg / Non-Veg / Bestseller) */}
          <QuickFilterBar
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
          />

          {/* Circular Category Navigation */}
          <CategoryNav
            activeCategoryId={activeCategoryId}
            onSelectCategory={handleSelectCategory}
          />

          {/* Popular Dishes / Featured Section */}
          {!inlineSearchQuery && activeFilter === 'all' && (
            <div id="section-favorites">
              <FeaturedSection
                onOpenDetail={item => setSelectedDetailItem(item)}
              />
            </div>
          )}

          {/* Special Offers & Combos */}
          {!inlineSearchQuery && activeFilter === 'all' && (
            <SpecialOffersBanner
              onOpenDetail={item => setSelectedDetailItem(item)}
            />
          )}

          {/* Category-by-Category Menu Sections */}
          <main style={{ minHeight: '50vh' }}>
            {activeCategories
              .filter(c => c.id !== 'favorites')
              .map(category => {
                const categoryItems = items.filter(i => i.categoryId === category.id);
                const filteredItems = getFilteredItems(categoryItems);

                if (filteredItems.length === 0) {
                  return null;
                }

                return (
                  <MenuSection
                    key={category.id}
                    category={category}
                    items={filteredItems}
                    onOpenDetail={item => setSelectedDetailItem(item)}
                  />
                );
              })}

            {/* Search No Results State */}
            {inlineSearchQuery && items.filter(i => getFilteredItems([i]).length > 0).length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔍</div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                  No dishes found matching "{inlineSearchQuery}"
                </h3>
                <p style={{ fontSize: '0.82rem', marginBottom: '14px' }}>
                  Try searching for biryani, chicken, paneer, fish, breads or desserts.
                </p>
                <button
                  onClick={() => setInlineSearchQuery('')}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  Clear Search
                </button>
              </div>
            )}
          </main>

          {/* On-Page Restaurant Information */}
          <RestaurantInfoSection />
        </div>

        {/* Floating Cart Bar (if items in cart and ordering enabled) */}
        <FloatingCartBar />

        {/* Footer */}
        <Footer
          onOpenAdmin={() => setIsAdminOpen(true)}
          onSwitchRestaurantClick={() => setIsAdminOpen(true)}
        />
      </div>

      {/* Dish Detail Bottom Sheet Modal */}
      <FoodDetailModal
        item={selectedDetailItem}
        isOpen={Boolean(selectedDetailItem)}
        onClose={() => setSelectedDetailItem(null)}
      />

      {/* Fullscreen Instant Search Overlay Modal */}
      <InstantSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenDetail={item => setSelectedDetailItem(item)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        onChangeTable={() => {
          setIsTableModalOpen(true);
        }}
      />

      {/* Order Confirmed Modal with Kitchen Simulation */}
      <OrderSuccessModal />

      {/* Restaurant Info Popup Modal */}
      <RestaurantInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      {/* Call Waiter Service Modal */}
      <CallWaiterModal
        isOpen={isServiceOpen}
        onClose={() => setIsServiceOpen(false)}
      />

      {/* Table Selector Modal */}
      <TableSelectorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Standalone QR Studio Modal */}
      {isQrStudioOpen && (
        <div className="modal-overlay active" onClick={() => setIsQrStudioOpen(false)}>
          <div
            className="bottom-sheet"
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: '90vh', padding: '20px', color: '#ffffff', background: '#141720' }}
          >
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <button
                onClick={() => setIsQrStudioOpen(false)}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
            <AdminQrGenerator />
          </div>
        </div>
      )}

      {/* Welcome to Devi Intro Modal */}
      <WelcomeIntroModal
        isOpen={isIntroOpen}
        onClose={() => {
          try {
            sessionStorage.setItem('seen_devi_intro', 'true');
          } catch {
            // ignore
          }
          setIsIntroOpen(false);
        }}
      />

      {/* Toast Feedback */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </RestaurantProvider>
  );
}
