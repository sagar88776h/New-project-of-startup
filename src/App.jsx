import React, { useState, useEffect, useRef } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { CartProvider, useCart } from './context/CartContext';
import './styles/index.css';
import './styles/3d-effects.css';

// Components
import QrLandingModal from './components/landing/QrLandingModal';
import StickyHeader from './components/header/StickyHeader';
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
import CallWaiterModal from './components/info/CallWaiterModal';
import TableSelectorModal from './components/info/TableSelectorModal';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminQrGenerator from './components/admin/AdminQrGenerator';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import DeviceFrameToggle from './components/common/DeviceFrameToggle';

function MainApp() {
  const { activeRestaurant } = useRestaurant();
  const { tableNumber } = useCart();
  const { categories = [], items = [], theme } = activeRestaurant;

  // Modals & UI State
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isQrStudioOpen, setIsQrStudioOpen] = useState(false);
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);

  // Active Category & Quick Filters
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategoryId, setActiveCategoryId] = useState(() => categories[0]?.id || 'favorites');

  // Handle Category Click / Smooth Scroll
  const handleSelectCategory = (catId) => {
    setActiveCategoryId(catId);
    if (catId === 'favorites') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const scrollPosition = window.scrollY + 140;
      const visibleCategories = categories.filter(c => c.active && c.id !== 'favorites');

      for (let i = visibleCategories.length - 1; i >= 0; i--) {
        const cat = visibleCategories[i];
        const el = document.getElementById(`section-${cat.id}`);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveCategoryId(cat.id);
          return;
        }
      }

      if (window.scrollY < 250) {
        setActiveCategoryId('favorites');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  // Filter Items based on active quick filter (All / Veg / Non-Veg / Bestsellers / Chef's)
  const getFilteredItems = (catItems) => {
    return catItems.filter(item => {
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
      
      {/* Top Test & Simulator Toolbar */}
      <DeviceFrameToggle
        isDesktopExpanded={isDesktopExpanded}
        onToggleExpanded={() => setIsDesktopExpanded(!isDesktopExpanded)}
        onOpenQr={() => setIsQrStudioOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Mobile / Desktop Responsive Container */}
      <div className={`mobile-device-frame ${isDesktopExpanded ? 'desktop-expanded' : ''}`}>
        
        {/* QR Cinematic Intro Landing */}
        <QrLandingModal />

        {/* Sticky Header */}
        <StickyHeader
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenInfo={() => setIsInfoOpen(true)}
          onOpenService={() => setIsServiceOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onChangeTable={() => setIsTableModalOpen(true)}
        />

        {/* Quick Filter Bar */}
        <QuickFilterBar
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* Sticky Category Navigation */}
        <CategoryNav
          activeCategoryId={activeCategoryId}
          onSelectCategory={handleSelectCategory}
        />

        {/* Customer Favorites / Featured Section */}
        {activeFilter === 'all' && (
          <FeaturedSection
            onOpenDetail={item => setSelectedDetailItem(item)}
          />
        )}

        {/* Special Offers & Combos */}
        {activeFilter === 'all' && (
          <SpecialOffersBanner
            onOpenDetail={item => setSelectedDetailItem(item)}
          />
        )}

        {/* Category-by-Category Menu Sections */}
        <main style={{ minHeight: '60vh' }}>
          {activeCategories
            .filter(c => c.id !== 'favorites')
            .map(category => {
              const categoryItems = items.filter(i => i.categoryId === category.id);
              const filteredItems = getFilteredItems(categoryItems);

              if (filteredItems.length === 0 && activeFilter !== 'all') {
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
        </main>

        {/* Floating Cart Button */}
        <FloatingCartBar />

        {/* Footer */}
        <Footer
          onOpenAdmin={() => setIsAdminOpen(true)}
          onSwitchRestaurantClick={() => setIsAdminOpen(true)}
        />
      </div>

      {/* Modals & Overlays */}
      <FoodDetailModal
        item={selectedDetailItem}
        isOpen={Boolean(selectedDetailItem)}
        onClose={() => setSelectedDetailItem(null)}
      />

      <InstantSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenDetail={item => setSelectedDetailItem(item)}
      />

      <CartDrawer
        onChangeTable={() => {
          setIsTableModalOpen(true);
        }}
      />

      <OrderSuccessModal />

      <RestaurantInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      <CallWaiterModal
        isOpen={isServiceOpen}
        onClose={() => setIsServiceOpen(false)}
      />

      <TableSelectorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

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
            style={{ maxHeight: '90vh', padding: '20px', color: '#ffffff' }}
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

      {/* Toast Alert Feedback */}
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
