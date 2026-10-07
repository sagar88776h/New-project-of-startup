import React from 'react';
import { Star, Flame, Sparkles, Plus, Check } from 'lucide-react';
import Card3DWrapper from '../3d/Card3DWrapper';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function FoodCard({ item, onOpenDetail }) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { activeRestaurant } = useRestaurant();
  const { currency, theme } = activeRestaurant;

  // Check if item is already in cart
  const itemInCart = cartItems.find(i => i.id === item.id);
  const totalQtyInCart = cartItems
    .filter(i => i.id === item.id)
    .reduce((sum, i) => sum + i.quantity, 0);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    
    // If item has required customizations, open detail modal
    if (item.customizations && item.customizations.length > 0) {
      onOpenDetail(item);
      return;
    }

    addToCart(item, 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (itemInCart) {
      updateQuantity(itemInCart.cartItemId, itemInCart.quantity + 1);
    } else {
      addToCart(item, 1);
    }
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (itemInCart) {
      updateQuantity(itemInCart.cartItemId, itemInCart.quantity - 1);
    }
  };

  return (
    <Card3DWrapper
      onClick={() => onOpenDetail(item)}
      className="glass-panel"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--color-card-border)',
        opacity: item.isAvailable ? 1 : 0.65,
      }}
    >
      {/* Top Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '160px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: '10px',
          backgroundColor: '#1b1e28',
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="card-3d-image-layer"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Dietary Indicator (Veg/Non-Veg) in top-left */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            padding: '3px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {item.isVeg ? (
            <span className="veg-indicator">
              <span className="veg-indicator-dot" />
            </span>
          ) : (
            <span className="non-veg-indicator">
              <span className="non-veg-indicator-triangle" />
            </span>
          )}
        </div>

        {/* Badges Top Right (Bestseller or Chef's Special) */}
        <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
          {item.isBestseller && (
            <span className="badge-gold">
              <Flame size={10} />
              <span>Bestseller</span>
            </span>
          )}
          {item.isChefSpecial && (
            <span className="badge-chef">
              <Sparkles size={10} />
              <span>Chef's Pick</span>
            </span>
          )}
        </div>

        {/* Rating overlay bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            zIndex: 10,
            background: 'rgba(13, 14, 18, 0.85)',
            backdropFilter: 'blur(6px)',
            borderRadius: '999px',
            padding: '2px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#facc15',
          }}
        >
          <Star size={11} fill="#facc15" color="#facc15" />
          <span>{item.rating || '4.9'}</span>
          <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.62rem' }}>
            ({item.reviewCount || 42})
          </span>
        </div>

        {/* Unavailable Overlay */}
        {!item.isAvailable && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f87171',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Currently Unavailable
          </div>
        )}
      </div>

      {/* Dish Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3
          style={{
            fontFamily: theme.fontHeading || "'Playfair Display', serif",
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '4px',
            lineHeight: 1.25,
          }}
        >
          {item.name}
        </h3>

        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.4,
            marginBottom: '10px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.description}
        </p>

        {/* Prep time and serving pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          {item.prepTime && (
            <span className="badge-tag" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
              ⏱ {item.prepTime}
            </span>
          )}
          {item.isSpicy > 0 && (
            <span className="badge-tag" style={{ fontSize: '0.68rem', padding: '1px 6px', color: '#f87171' }}>
              {'🌶'.repeat(item.isSpicy)}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row: Price & Add Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '6px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</span>
          <span
            style={{
              fontFamily: theme.fontHeading || "'Playfair Display', serif",
              fontSize: '1.15rem',
              fontWeight: 800,
              color: theme.primaryColor || '#c99738',
            }}
          >
            {currency}{item.price}
          </span>
        </div>

        {/* Add Button or Stepper */}
        {item.isAvailable ? (
          totalQtyInCart > 0 ? (
            <div className="qty-stepper-container" onClick={e => e.stopPropagation()}>
              <button className="qty-stepper-btn" onClick={handleDecrement} aria-label="Decrease quantity">
                -
              </button>
              <span className="qty-stepper-val">{totalQtyInCart}</span>
              <button className="qty-stepper-btn" onClick={handleIncrement} aria-label="Increase quantity">
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="btn-add-stepper"
              aria-label={`Add ${item.name} to order`}
            >
              <Plus size={14} />
              <span>ADD</span>
            </button>
          )
        ) : (
          <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontStyle: 'italic' }}>Sold Out</span>
        )}
      </div>
    </Card3DWrapper>
  );
}
