import React from 'react';
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
    <div className="floating-cart-bar visible">
      {/* Left Item Count & Subtotal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
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
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
              {totalItemsCount} {totalItemsCount === 1 ? 'ITEM' : 'ITEMS'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>Table {tableNumber}</span>
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
      <button
        onClick={() => setIsCartOpen(true)}
        className="btn-primary"
        style={{
          padding: '10px 18px',
          borderRadius: '999px',
          fontSize: '0.85rem',
          fontWeight: 800,
          gap: '6px',
        }}
      >
        <span>View Order</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
