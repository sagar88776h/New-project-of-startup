import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, X, Plus } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { modalBackdropVariants } from '../../lib/motion';

export default function InstantSearchModal({ isOpen, onClose, onOpenDetail }) {
  const { activeRestaurant } = useRestaurant();
  const { addToCart } = useCart();
  const { currency, theme, items = [], categories = [] } = activeRestaurant;

  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setQuery('');
    setSelectedTag(null);
    onClose();
  };

  // Filter Items
  const filteredItems = items.filter(item => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.ingredients?.some(ing => ing.toLowerCase().includes(q)) ||
      categories.find(c => c.id === item.categoryId)?.name.toLowerCase().includes(q);

    const matchesTag =
      !selectedTag ||
      (selectedTag === 'veg' && item.isVeg) ||
      (selectedTag === 'nonveg' && !item.isVeg) ||
      (selectedTag === 'bestseller' && item.isBestseller) ||
      (selectedTag === 'chef' && item.isChefSpecial);

    return matchesQuery && matchesTag;
  });

  const popularKeywords = ['Biryani', 'Truffle', 'Kebab', 'Pasta', 'Pizza', 'Dessert', 'Lassi', 'Ramen'];

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          key="instant-search-overlay"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(10, 11, 15, 0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            color: '#ffffff',
          }}
        >
          {/* Top Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: `1.5px solid ${theme.primaryColor || '#c99738'}`,
                borderRadius: '16px',
                padding: '10px 16px',
              }}
            >
              <Search size={18} color={theme.primaryColor || '#c99738'} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search dishes, drinks, desserts, ingredients..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                }}
              />
              {query && (
                <m.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={16} />
                </m.button>
              )}
            </m.div>

            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#e5e7eb',
                borderRadius: '14px',
                padding: '10px 14px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </m.button>
          </div>

          {/* Quick Search Tag Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {popularKeywords.map(keyword => (
              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={keyword}
                onClick={() => setQuery(keyword)}
                style={{
                  padding: '5px 13px',
                  borderRadius: '999px',
                  background: query.toLowerCase() === keyword.toLowerCase() ? theme.primaryColor || 'var(--color-primary)' : 'rgba(255, 255, 255, 0.08)',
                  color: query.toLowerCase() === keyword.toLowerCase() ? '#ffffff' : '#e5e7eb',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {keyword}
              </m.button>
            ))}
          </div>

          {/* Search Results List */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔍</div>
                <h4 style={{ fontSize: '1.05rem', color: '#f3f4f6', marginBottom: '6px' }}>No matches found</h4>
                <p style={{ fontSize: '0.82rem' }}>Try typing "biryani", "paneer", "chicken", or "dessert".</p>
              </div>
            ) : (
              filteredItems.map(dish => (
                <m.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01, background: 'rgba(255, 255, 255, 0.08)' }}
                  onClick={() => {
                    handleClose();
                    onOpenDetail(dish);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {dish.name}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 700 }}>
                        {currency}{dish.price}
                      </div>
                    </div>
                  </div>

                  <m.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(dish, 1);
                      handleClose();
                    }}
                    style={{
                      background: 'rgba(196, 22, 28, 0.2)',
                      border: '1px solid rgba(196, 22, 28, 0.4)',
                      color: 'var(--color-primary)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus size={12} />
                    <span>ADD</span>
                  </m.button>
                </m.div>
              ))
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
