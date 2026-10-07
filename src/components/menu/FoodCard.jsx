import React from 'react';
import { Star, Clock, Flame, Sparkles, Plus, Minus } from 'lucide-react';
import CardWrapper from '../common/CardWrapper';
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

  // Preparation time range display
  const prepTimeText = item.minPrepTime && item.maxPrepTime
    ? `${item.minPrepTime}–${item.maxPrepTime} min`
    : item.prepTime || '15–20 min';

  return (
    <CardWrapper
      onClick={() => onOpenDetail(item)}
      style={{
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        position: 'relative',
        opacity: item.isAvailable ? 1 : 0.6,
      }}
    >
      {/* Top Real Food Photography Container */}
      <div
        className="image-zoom-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '180px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '12px',
          backgroundColor: '#f3f4f6',
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
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
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            padding: '4px',
            borderRadius: '5px',
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
              <Flame size={11} />
              <span>Bestseller</span>
            </span>
          )}
          {item.isChefSpecial && (
            <span className="badge-chef">
              <Sparkles size={11} />
              <span>Chef's Special</span>
            </span>
          )}
        </div>

        {/* Estimated Prep Time Pill on Image Bottom Right */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            zIndex: 10,
            background: 'rgba(25, 28, 33, 0.88)',
            backdropFilter: 'blur(6px)',
            color: '#ffffff',
            borderRadius: '999px',
            padding: '3px 9px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.68rem',
            fontWeight: 700,
          }}
          title="Estimated preparation time"
        >
          <Clock size={11} color={theme.primaryColor || '#c98a2c'} />
          <span>⏱ {prepTimeText}</span>
        </div>

        {/* Unavailable Overlay */}
        {!item.isAvailable && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626',
              fontWeight: 800,
              fontSize: '0.8rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Currently Unavailable
          </div>
        )}
      </div>

      {/* Dish Information */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Title & Rating */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
          <h3
            style={{
              fontFamily: theme.fontHeading || "'Playfair Display', serif",
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.25,
            }}
          >
            {item.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#eab308', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
            <Star size={12} fill="#eab308" color="#eab308" />
            <span>{item.rating || '4.9'}</span>
          </div>
        </div>

        {/* Useful Culinary Description */}
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.45,
            marginBottom: '8px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.description}
        </p>

        {/* Prepared with / Ingredients Snippet */}
        {item.ingredients && item.ingredients.length > 0 && (
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '10px', lineHeight: 1.35 }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Prepared with: </span>
            <span>{item.ingredients.slice(0, 4).join(', ')}{item.ingredients.length > 4 ? '...' : ''}</span>
          </div>
        )}

        {/* Meta badges: Spice & Serving */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          {item.isSpicy > 0 && (
            <span className="badge-tag" style={{ color: '#dc2626', fontWeight: 600 }}>
              {'🌶'.repeat(item.isSpicy)} {item.isSpicy === 1 ? 'Mild Spice' : item.isSpicy === 2 ? 'Medium' : 'Spicy'}
            </span>
          )}
          {item.serving && (
            <span className="badge-tag">
              {item.serving}
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
          paddingTop: '8px',
          borderTop: '1px solid var(--color-card-border)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
            Price
          </span>
          <span
            style={{
              fontFamily: theme.fontHeading || "'Playfair Display', serif",
              fontSize: '1.2rem',
              fontWeight: 800,
              color: theme.primaryColor || '#c98a2c',
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
                <Minus size={12} />
              </button>
              <span className="qty-stepper-val">{totalQtyInCart}</span>
              <button className="qty-stepper-btn" onClick={handleIncrement} aria-label="Increase quantity">
                <Plus size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="btn-add-stepper"
              aria-label={`Add ${item.name}`}
            >
              <Plus size={14} />
              <span>ADD</span>
            </button>
          )
        ) : (
          <span style={{ fontSize: '0.74rem', color: '#9ca3af', fontStyle: 'italic' }}>Sold Out</span>
        )}
      </div>
    </CardWrapper>
  );
}
