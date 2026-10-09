import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Clock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function FloatingCartBar() {
  const { cartItems, totalItemsCount, subtotal, setIsCartOpen, tableNumber } = useCart();
  const { activeRestaurant } = useRestaurant();
  const { currency, theme, settings } = activeRestaurant;

  if (!settings?.orderingEnabled || totalItemsCount === 0) {
    return null;
  }

  // Calculate maximum estimated preparation time among items in cart
  const maxPrepEstimate = cartItems.reduce((max, item) => {
    const itemMax = item.maxPrepTime || 20;
    return Math.max(max, itemMax);
  }, 15);

  return (
    <AnimatePresence>
      {totalItemsCount > 0 && (
        <m.div
          key="floating-cart"
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="floating-cart-bar visible"
          style={{
            bottom: 'max(16px, calc(16px + env(safe-area-inset-bottom, 0px)))',
          }}
        >
          {/* Left Item Count & Subtotal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <m.div
              key={totalItemsCount}
              initial={{ scale: 0.8, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: theme.primaryColor || '#c98a2c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
              }}
            >
              <ShoppingBag size={18} />
            </m.div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
                  {totalItemsCount} {totalItemsCount === 1 ? 'ITEM' : 'ITEMS'}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>•</span>
                <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>Table {tableNumber || '?'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: theme.fontHeading || "'Playfair Display', serif",
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: theme.primaryColor || '#c98a2c',
                  }}
                >
                  {currency}{subtotal.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={11} />
                  <span>⏱ ~{maxPrepEstimate} min</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right View Order CTA */}
          <m.button
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsCartOpen(true)}
            aria-label="View Order Cart"
            className="btn-primary touch-target-44"
            style={{
              padding: '10px 18px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              gap: '6px',
              minHeight: '44px',
            }}
          >
            <span>View Order</span>
            <ArrowRight size={16} />
          </m.button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
