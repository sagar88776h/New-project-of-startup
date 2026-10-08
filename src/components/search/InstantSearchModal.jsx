import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Flame, Sparkles, Plus, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function InstantSearchModal({ isOpen, onClose, onOpenDetail }) {
  const { activeRestaurant } = useRestaurant();
  const { addToCart } = useCart();
  const { currency, theme, items = [], categories = [] } = activeRestaurant;

  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setQuery('');
      setSelectedTag(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(10, 11, 15, 0.96)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        color: '#ffffff',
      }}
    >
      {/* Top Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div
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
            <button
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
            </button>
          )}
        </div>

        <button
          onClick={onClose}
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
        </button>
      </div>

      {/* Quick Search Tag Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {popularKeywords.map(keyword => (
          <button
            key={keyword}
            onClick={() => setQuery(keyword)}
            style={{
              padding: '4px 12px',
              borderRadius: '999px',
              background: query.toLowerCase() === keyword.toLowerCase() ? theme.primaryColor : 'rgba(255, 255, 255, 0.06)',
              color: query.toLowerCase() === keyword.toLowerCase() ? '#0d0e12' : '#d1d5db',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {keyword}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.78rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {filteredItems.length} {filteredItems.length === 1 ? 'Match Found' : 'Matches Found'}
        </span>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSelectedTag(null);
            }}
            style={{ background: 'none', border: 'none', color: theme.primaryColor || '#c99738', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Results List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredItems.length > 0 ? (
          filteredItems.map(dish => {
            const categoryObj = categories.find(c => c.id === dish.categoryId);
            return (
              <div
                key={dish.id}
                onClick={() => {
                  onClose();
                  onOpenDetail(dish);
                }}
                className="glass-panel"
                style={{
                  padding: '10px 12px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Image & Indicators */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    <img src={dish.image} alt={dish.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '4px', left: '4px' }}>
                      {dish.isVeg ? (
                        <span className="veg-indicator" style={{ width: '12px', height: '12px' }}><span className="veg-indicator-dot" style={{ width: '5px', height: '5px' }} /></span>
                      ) : (
                        <span className="non-veg-indicator" style={{ width: '12px', height: '12px' }}><span className="non-veg-indicator-triangle" style={{ borderLeftWidth: '3px', borderRightWidth: '3px', borderBottomWidth: '5px' }} /></span>
                      )}
                    </div>
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.68rem', color: theme.primaryColor || '#c99738', fontWeight: 600 }}>
                        {categoryObj?.name || 'Gourmet Special'}
                      </span>
                      {dish.isBestseller && (
                        <span className="badge-gold" style={{ fontSize: '0.58rem', padding: '1px 5px' }}>
                          Bestseller
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {dish.name}
                    </h4>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: theme.primaryColor || '#c99738' }}>
                      {currency}{dish.price}
                    </span>
                  </div>
                </div>

                {/* Quick Add / View Action */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    addToCart(dish, 1);
                  }}
                  className="btn-add-stepper"
                  style={{ padding: '6px 12px', fontSize: '0.75rem', flexShrink: 0 }}
                >
                  <Plus size={13} />
                  <span>ADD</span>
                </button>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🍽️</div>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '6px' }}>No dishes found</h3>
            <p style={{ fontSize: '0.82rem' }}>Try searching for biryani, pasta, pizza, drinks, or desserts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
