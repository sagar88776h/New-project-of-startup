import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function FloatingCartBar() {
  const { cartItems, totalItemsCount, subtotal, setIsCartOpen, tableNumber } = useCart();
  const { activeRestaurant } = useRestaurant();
  const { currency, theme } = activeRestaurant;

  const isVisible = totalItemsCount > 0;

  return (
    <div className={`floating-cart-bar ${isVisible ? 'visible' : ''}`}>
      {/* Left Item Count & Subtotal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: theme.primaryColor || '#c99738',
            color: '#0d0e12',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(201, 151, 56, 0.4)',
          }}
        >
          <ShoppingBag size={18} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
              {totalItemsCount} {totalItemsCount === 1 ? 'ITEM' : 'ITEMS'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Table {tableNumber}</span>
          </div>
          <div
            style={{
              fontFamily: theme.fontHeading || "'Playfair Display', serif",
              fontSize: '1.05rem',
              fontWeight: 800,
              color: theme.primaryColor || '#c99738',
            }}
          >
            {currency}{subtotal}
          </div>
        </div>
      </div>

      {/* Right View Cart CTA */}
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
