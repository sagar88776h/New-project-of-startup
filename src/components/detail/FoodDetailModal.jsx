import React, { useState, useEffect } from 'react';
import { X, Star, Clock, Users, Flame, Sparkles, Check, AlertCircle, Box, Image as ImageIcon } from 'lucide-react';
import FoodDetailCanvas from '../3d/FoodDetailCanvas';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function FoodDetailModal({ item, isOpen, onClose }) {
  const { addToCart, showToast } = useCart();
  const { activeRestaurant } = useRestaurant();
  const { currency, theme } = activeRestaurant;

  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [view3D, setView3D] = useState(false);

  // Reset state when item changes or modal opens
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedCustomizations([]);
      setSpecialInstructions('');
      setView3D(false);
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

        {/* Scrollable Modal Content */}
        <div style={{ padding: '0 20px 80px', overflowY: 'auto' }}>
          
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
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.isVeg ? '#10b981' : '#ef4444' }}>
                {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* 3D / Photo View Switcher */}
              <button
                onClick={() => setView3D(!view3D)}
                style={{
                  background: view3D ? theme.primaryColor : 'rgba(255, 255, 255, 0.08)',
                  color: view3D ? '#0d0e12' : '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {view3D ? <ImageIcon size={12} /> : <Box size={12} />}
                <span>{view3D ? 'Photo' : '3D View'}</span>
              </button>

              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Hero Media (3D Canvas or HD Image) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '240px',
              borderRadius: '20px',
              overflow: 'hidden',
              marginBottom: '16px',
              background: '#12141c',
            }}
          >
            {view3D ? (
              <FoodDetailCanvas
                imageUrl={item.image}
                dishName={item.name}
                primaryColor={theme.primaryColor}
              />
            ) : (
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}

            {/* Badges on top of image */}
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
                  <span>Chef's Choice</span>
                </span>
              )}
            </div>
          </div>

          {/* Dish Title & Price */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
            <h2
              style={{
                fontFamily: theme.fontHeading || "'Playfair Display', serif",
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#ffffff',
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
                color: theme.primaryColor || '#c99738',
                whiteSpace: 'nowrap',
              }}
            >
              {currency}{unitPrice}
            </div>
          </div>

          {/* Rating, Prep time, Serving size info row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#facc15', fontSize: '0.8rem', fontWeight: 700 }}>
              <Star size={14} fill="#facc15" color="#facc15" />
              <span>{item.rating || '4.9'}</span>
              <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.72rem' }}>
                ({item.reviewCount || 42} reviews)
              </span>
            </div>

            {item.prepTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d1d5db', fontSize: '0.75rem' }}>
                <Clock size={13} color={theme.primaryColor || '#c99738'} />
                <span>{item.prepTime}</span>
              </div>
            )}

            {item.serving && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d1d5db', fontSize: '0.75rem' }}>
                <Users size={13} color={theme.primaryColor || '#c99738'} />
                <span>{item.serving}</span>
              </div>
            )}

            {item.calories && (
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                🔥 {item.calories}
              </div>
            )}
          </div>

          {/* Full Description */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              About This Dish
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.55 }}>
              {item.description}
            </p>
          </div>

          {/* Spice Level Indicator */}
          {typeof item.isSpicy === 'number' && (
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Spice Level:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4].map(lvl => (
                  <span
                    key={lvl}
                    style={{
                      fontSize: '0.9rem',
                      opacity: lvl <= item.isSpicy ? 1 : 0.25,
                      filter: lvl <= item.isSpicy ? 'none' : 'grayscale(1)',
                    }}
                  >
                    🌶
                  </span>
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                {item.isSpicy === 0 ? 'Mild' : item.isSpicy === 1 ? 'Medium Spiced' : item.isSpicy === 2 ? 'Authentic Spicy' : 'Extra Hot 🔥'}
              </span>
            </div>
          )}

          {/* Ingredients Pills */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Key Ingredients
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {item.ingredients.map((ing, idx) => (
                  <span key={idx} className="badge-tag" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
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
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.76rem',
                color: '#fca5a5',
              }}
            >
              <AlertCircle size={15} color="#ef4444" flexShrink={0} />
              <span>Contains: {item.allergens.join(', ')}</span>
            </div>
          )}

          {/* Customization Options */}
          {item.customizations && item.customizations.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.primaryColor || '#c99738', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
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
                        background: isChecked ? 'rgba(201, 151, 56, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                        border: isChecked ? `1px solid ${theme.primaryColor || '#c99738'}` : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: isChecked ? `none` : '1.5px solid rgba(255, 255, 255, 0.3)',
                            background: isChecked ? theme.primaryColor : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isChecked && <Check size={13} color="#0d0e12" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#f3f4f6', fontWeight: isChecked ? 600 : 400 }}>
                          {cust.name}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.primaryColor || '#c99738' }}>
                        +{currency}{cust.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kitchen Cooking Note / Instructions */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Special Kitchen Instructions
            </h4>
            <input
              type="text"
              placeholder="e.g. Less oil, extra crispy, sauce on the side..."
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '14px 20px',
            background: 'rgba(18, 20, 28, 0.95)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 20,
          }}
        >
          {/* Quantity Stepper */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '14px',
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
                color: '#ffffff',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              -
            </button>
            <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              style={{
                width: '32px',
                height: '32px',
                background: 'none',
                border: 'none',
                color: '#ffffff',
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
