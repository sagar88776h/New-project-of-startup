import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Users, Flame, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { modalBackdropVariants, bottomSheetVariants } from '../../lib/motion';

function FoodDetailContent({ item, onClose }) {
  const { addToCart, showToast } = useCart();
  const { activeRestaurant } = useRestaurant();
  const { currency, theme } = activeRestaurant;

  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

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
    <motion.div
      variants={bottomSheetVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bottom-sheet"
      onClick={e => e.stopPropagation()}
      style={{
        maxHeight: '90svh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        paddingBottom: 0,
      }}
    >
      <div className="sheet-handle" />

      {/* Scrollable Content */}
      <div style={{ padding: '0 16px calc(90px + var(--sab))', overflowY: 'auto', flex: 1 }}>
        
        {/* Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {item.isVeg ? (
              <span className="veg-indicator" style={{ width: '16px', height: '16px' }}>
                <span className="veg-indicator-dot" style={{ width: '7px', height: '7px' }} />
              </span>
            ) : (
              <span className="non-veg-indicator" style={{ width: '16px', height: '16px' }}>
                <span className="non-veg-indicator-triangle" />
              </span>
            )}
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: item.isVeg ? '#15803d' : '#b91c1c' }}>
              {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </motion.button>
        </div>

        {/* Large Real Food Photograph */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(170px, 42vw, 230px)',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '14px',
            backgroundColor: '#141110',
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

          {/* Badges on Image */}
          <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '5px' }}>
            {item.isBestseller && (
              <span className="badge-burgundy">
                <Flame size={10} />
                <span>Bestseller</span>
              </span>
            )}
            {item.isChefSpecial && (
              <span className="badge-gold">
                <Sparkles size={10} />
                <span>Chef's Special</span>
              </span>
            )}
          </div>
        </div>

        {/* Title & Price */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
          <h2
            style={{
              fontFamily: theme.fontHeading || "'Playfair Display', serif",
              fontSize: 'clamp(1.15rem, 4vw, 1.4rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
              textTransform: 'uppercase',
              letterSpacing: '0.01em',
              overflowWrap: 'anywhere',
            }}
          >
            {item.name}
          </h2>
          <div
            style={{
              fontFamily: theme.fontHeading || "'Fraunces', serif",
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--color-accent)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {currency}{unitPrice}
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '14px', overflowWrap: 'anywhere' }}>
          {item.description}
        </p>

        {/* Meta Info Bar (Prep time, Spice, Servings) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '12px',
            border: '1px solid var(--color-card-border)',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
            <Clock size={13} color="var(--color-primary)" />
            <span>⏱ {prepTimeText}</span>
          </div>

          {typeof item.isSpicy === 'number' && item.isSpicy > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.78rem', color: '#b91c1c', fontWeight: 600 }}>
              <span>🌶 {item.isSpicy === 1 ? 'Mild' : item.isSpicy === 2 ? 'Medium' : 'Spicy'}</span>
            </div>
          )}

          {item.serving && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              <Users size={13} color="var(--color-primary)" />
              <span>{item.serving}</span>
            </div>
          )}
        </div>

        {/* INGREDIENTS SECTION */}
        {item.ingredients && item.ingredients.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              INGREDIENTS
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, overflowWrap: 'anywhere' }}>
              {item.ingredients.join(', ')}.
            </p>
          </div>
        )}

        {/* PREPARATION SECTION */}
        {item.preparationStyle && (
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              PREPARATION
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, overflowWrap: 'anywhere' }}>
              {item.preparationStyle}
            </p>
          </div>
        )}

        {/* Allergens Notice */}
        {item.allergens && item.allergens.length > 0 && (
          <div
            style={{
              marginBottom: '16px',
              padding: '8px 12px',
              background: 'rgba(185, 28, 28, 0.08)',
              border: '1px solid rgba(185, 28, 28, 0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.74rem',
              color: '#f87171',
            }}
          >
            <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>Contains: {item.allergens.join(', ')}</span>
          </div>
        )}

        {/* Customization Options */}
        {item.customizations && item.customizations.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              CUSTOMIZE YOUR DISH
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {item.customizations.map(cust => {
                const isChecked = selectedCustomizations.some(c => c.id === cust.id);
                return (
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    key={cust.id}
                    onClick={() => toggleCustomization(cust)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      background: isChecked ? 'rgba(196, 22, 28, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                      border: isChecked ? `1.5px solid var(--color-primary)` : '1px solid var(--color-card-border)',
                      cursor: 'pointer',
                      transition: 'border-color 0.18s ease, background 0.18s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          border: isChecked ? 'none' : '1.5px solid #9ca3af',
                          background: isChecked ? 'var(--color-primary)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isChecked && <Check size={12} color="#ffffff" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-primary)', fontWeight: isChecked ? 700 : 500 }}>
                        {cust.name}
                      </span>
                    </div>

                    {cust.price > 0 && (
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>
                        +{currency}{cust.price}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Kitchen Notes Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
            Special Kitchen Instructions
          </label>
          <input
            type="text"
            placeholder="e.g. Mild spicy, extra napkins, no garnish..."
            value={specialInstructions}
            onChange={e => setSpecialInstructions(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '9px 12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
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
          padding: '12px 16px calc(14px + var(--sab))',
          background: 'var(--color-card-bg)',
          borderTop: '1px solid var(--color-card-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
          zIndex: 20,
          boxSizing: 'border-box',
        }}
      >
        {/* Quantity Stepper */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--color-card-border)',
            borderRadius: '10px',
            padding: '2px',
            flexShrink: 0,
          }}
        >
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{
              width: '28px',
              height: '28px',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            -
          </motion.button>
          <span style={{ minWidth: '22px', textAlign: 'center', fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
            {quantity}
          </span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setQuantity(quantity + 1)}
            style={{
              width: '28px',
              height: '28px',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            +
          </motion.button>
        </div>

        {/* Add CTA */}
        <motion.button
          whileHover={{ scale: item.isAvailable ? 1.02 : 1 }}
          whileTap={{ scale: item.isAvailable ? 0.97 : 1 }}
          onClick={handleAddToCart}
          className="btn-primary"
          disabled={!item.isAvailable}
          style={{
            flex: 1,
            padding: '12px 10px',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontWeight: 800,
            opacity: item.isAvailable ? 1 : 0.5,
            cursor: item.isAvailable ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.isAvailable ? `ADD • ${currency}${totalPrice}` : 'SOLD OUT'}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function FoodDetailModal({ item, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          key="food-detail-backdrop"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="modal-overlay active"
          onClick={onClose}
        >
          <FoodDetailContent key={item.id} item={item} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
