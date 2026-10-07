import React, { useState, useEffect } from 'react';
import { X, Star, Clock, Users, Flame, Sparkles, Check, AlertCircle, ChefHat } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function FoodDetailModal({ item, isOpen, onClose }) {
  const { addToCart, showToast } = useCart();
  const { activeRestaurant } = useRestaurant();
  const { currency, theme } = activeRestaurant;

  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedCustomizations([]);
      setSpecialInstructions('');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const toggleCustomization = (cust) => {
    setSelectedCustomizations(prev => {
      const exists = prev.some(c => c.id === cust.id);
      if (exists) {
        return prev.filter(c => c.id !== cust.id);
      } else {
        return [...prev, cust];
      }
    });
  };

  const customTotal = selectedCustomizations.reduce((sum, c) => sum + (c.price || 0), 0);
  const unitPrice = (item.price || 0) + customTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!item.isAvailable) {
      showToast('This dish is currently unavailable', 'warning');
      return;
    }
    addToCart(item, quantity, selectedCustomizations, specialInstructions);
    onClose();
  };

  const prepTimeText = item.minPrepTime && item.maxPrepTime
    ? `${item.minPrepTime}–${item.maxPrepTime} min`
    : item.prepTime || '15–20 min';

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div
        className="bottom-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="sheet-handle" />

        {/* Scrollable Content */}
        <div style={{ padding: '0 20px 85px', overflowY: 'auto' }}>
          
          {/* Header Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.isVeg ? (
                <span className="veg-indicator" style={{ width: '18px', height: '18px' }}>
                  <span className="veg-indicator-dot" style={{ width: '8px', height: '8px' }} />
                </span>
              ) : (
                <span className="non-veg-indicator" style={{ width: '18px', height: '18px' }}>
                  <span className="non-veg-indicator-triangle" />
                </span>
              )}
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: item.isVeg ? '#15803d' : '#dc2626' }}>
                {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.06)',
                border: 'none',
                color: 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Large Real Food Photograph */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '240px',
              borderRadius: '18px',
              overflow: 'hidden',
              marginBottom: '16px',
              backgroundColor: '#f3f4f6',
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Badges on Image */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
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

            {/* Estimated Prep Time Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'rgba(25, 28, 33, 0.9)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Clock size={12} color={theme.primaryColor || '#c98a2c'} />
              <span>⏱ Estimated: {prepTimeText}</span>
            </div>
          </div>

          {/* Title & Price */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
            <h2
              style={{
                fontFamily: theme.fontHeading || "'Playfair Display', serif",
                fontSize: '1.45rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.2,
              }}
            >
              {item.name}
            </h2>
            <div
              style={{
                fontFamily: theme.fontHeading || "'Playfair Display', serif",
                fontSize: '1.45rem',
                fontWeight: 800,
                color: theme.primaryColor || '#c98a2c',
                whiteSpace: 'nowrap',
              }}
            >
              {currency}{unitPrice}
            </div>
          </div>

          {/* Key Specs Card (Rating, Estimated Prep Time, Servings, Spice) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '10px 14px',
              background: 'rgba(0, 0, 0, 0.03)',
              borderRadius: '14px',
              border: '1px solid var(--color-card-border)',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308', fontSize: '0.82rem', fontWeight: 700 }}>
              <Star size={14} fill="#eab308" color="#eab308" />
              <span>{item.rating || '4.9'}</span>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: '0.74rem' }}>
                ({item.reviewCount || 42} reviews)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              <Clock size={13} color={theme.primaryColor || '#c98a2c'} />
              <span style={{ fontWeight: 600 }}>Ready in ~{prepTimeText}</span>
            </div>

            {item.serving && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                <Users size={13} color={theme.primaryColor || '#c98a2c'} />
                <span>{item.serving}</span>
              </div>
            )}
          </div>

          {/* Useful Dish Description */}
          <div style={{ marginBottom: '14px' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '5px' }}>
              About This Dish
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)', lineHeight: 1.55 }}>
              {item.description}
            </p>
          </div>

          {/* Preparation Information */}
          {item.preparationStyle && (
            <div style={{ marginBottom: '14px', padding: '10px 12px', background: 'rgba(201, 138, 44, 0.06)', borderRadius: '10px', border: '1px solid rgba(201, 138, 44, 0.18)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: theme.primaryColor || '#c98a2c', marginBottom: '3px' }}>
                <ChefHat size={14} />
                <span>Preparation & Style</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                {item.preparationStyle}
              </p>
            </div>
          )}

          {/* Spice Level Indicator */}
          {typeof item.isSpicy === 'number' && item.isSpicy > 0 && (
            <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Spice Level:</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[1, 2, 3].map(lvl => (
                  <span
                    key={lvl}
                    style={{
                      fontSize: '0.88rem',
                      opacity: lvl <= item.isSpicy ? 1 : 0.25,
                    }}
                  >
                    🌶
                  </span>
                ))}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>
                {item.isSpicy === 1 ? 'Mild Spice' : item.isSpicy === 2 ? 'Medium Spicy' : 'Authentic Hot 🔥'}
              </span>
            </div>
          )}

          {/* Ingredients Breakdown */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                Ingredients & Fresh Produce
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {item.ingredients.map((ing, idx) => (
                  <span key={idx} className="badge-tag">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergens Notice */}
          {item.allergens && item.allergens.length > 0 && (
            <div
              style={{
                marginBottom: '16px',
                padding: '10px 12px',
                background: 'rgba(220, 38, 38, 0.06)',
                border: '1px solid rgba(220, 38, 38, 0.15)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.76rem',
                color: '#b91c1c',
              }}
            >
              <AlertCircle size={15} color="#dc2626" flexShrink={0} />
              <span>Allergen Notice: Contains {item.allergens.join(', ')}</span>
            </div>
          )}

          {/* Customization Options */}
          {item.customizations && item.customizations.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.primaryColor || '#c98a2c', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                Customize Your Dish
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {item.customizations.map(cust => {
                  const isChecked = selectedCustomizations.some(c => c.id === cust.id);
                  return (
                    <div
                      key={cust.id}
                      onClick={() => toggleCustomization(cust)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: isChecked ? 'rgba(201, 138, 44, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                        border: isChecked ? `1.5px solid ${theme.primaryColor || '#c98a2c'}` : '1px solid var(--color-card-border)',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: isChecked ? 'none' : '1.5px solid #9ca3af',
                            background: isChecked ? theme.primaryColor : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isChecked && <Check size={13} color="#ffffff" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: isChecked ? 700 : 500 }}>
                          {cust.name}
                        </span>
                      </div>

                      {cust.price > 0 && (
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.primaryColor || '#c98a2c' }}>
                          +{currency}{cust.price}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kitchen Instructions */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '5px' }}>
              Special Kitchen Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Mild spicy, extra napkins, serve without garnish..."
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid var(--color-card-border)',
                color: 'var(--color-text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '14px 20px',
            background: 'var(--color-card-bg)',
            borderTop: '1px solid var(--color-card-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.06)',
            zIndex: 20,
          }}
        >
          {/* Quantity Stepper */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.05)',
              border: '1px solid var(--color-card-border)',
              borderRadius: '12px',
              padding: '4px',
            }}
          >
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{
                width: '32px',
                height: '32px',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-primary)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              -
            </button>
            <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              style={{
                width: '32px',
                height: '32px',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-primary)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              +
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="btn-primary"
            disabled={!item.isAvailable}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '14px',
              fontSize: '0.95rem',
              fontWeight: 800,
              opacity: item.isAvailable ? 1 : 0.5,
              cursor: item.isAvailable ? 'pointer' : 'not-allowed',
            }}
          >
            {item.isAvailable ? `ADD TO CART — ${currency}${totalPrice}` : 'CURRENTLY UNAVAILABLE'}
          </button>
        </div>
      </div>
    </div>
  );
}
