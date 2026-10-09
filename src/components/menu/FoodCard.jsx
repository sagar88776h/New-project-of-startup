import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flame, Sparkles, Plus, Minus } from 'lucide-react';
import CardWrapper from '../common/CardWrapper';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function FoodCard({ item, onOpenDetail, index = 0 }) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { activeRestaurant } = useRestaurant();
  const { currency, theme, settings } = activeRestaurant;

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

  const prepTimeText = item.minPrepTime && item.maxPrepTime
    ? `${item.minPrepTime}–${item.maxPrepTime} min`
    : item.prepTime || '15–20 min';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      style={{ width: '100%', minWidth: 0 }}
    >
      <CardWrapper
        onClick={() => onOpenDetail(item)}
        style={{
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          position: 'relative',
          opacity: item.isAvailable ? 1 : 0.6,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      >
        {/* Left: Food Image Thumbnail */}
        <div
          style={{
            position: 'relative',
            width: 'clamp(76px, 22vw, 98px)',
            height: 'clamp(76px, 22vw, 98px)',
            borderRadius: '12px',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: '#1a1514',
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
              transition: 'transform 0.4s ease',
            }}
          />

          {/* Dietary Indicator (Veg/Non-Veg) in top-left of image */}
          <div
            style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              zIndex: 5,
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              padding: '2px',
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

          {/* Unavailable Gray Overlay */}
          {!item.isAvailable && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(20, 15, 14, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                fontWeight: 800,
                fontSize: '0.68rem',
                textAlign: 'center',
                padding: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Sold Out
            </div>
          )}
        </div>

        {/* Right: Dish Information */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
          
          {/* Top Badges Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px', flexWrap: 'wrap' }}>
            {item.isBestseller && (
              <span className="badge-burgundy">
                <Flame size={10} />
                <span>Bestseller</span>
              </span>
            )}
            {item.isChefSpecial && (
              <span className="badge-gold">
                <Sparkles size={10} />
                <span>Chef Special</span>
              </span>
            )}
            {item.isSpicy > 0 && (
              <span style={{ fontSize: '0.65rem', color: '#b91c1c', fontWeight: 600 }}>
                {'🌶'.repeat(item.isSpicy)}
              </span>
            )}
          </div>

          {/* Dish Name */}
          <h3
            style={{
              fontFamily: theme.fontHeading || "'Playfair Display', serif",
              fontSize: 'clamp(0.9rem, 3.2vw, 1rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.25,
              marginBottom: '2px',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.name}
          </h3>

          {/* Price */}
          <div
            style={{
              fontFamily: theme.fontHeading || "'Fraunces', serif",
              fontSize: '1.05rem',
              fontWeight: 800,
              color: 'var(--color-accent)',
              marginBottom: '2px',
            }}
          >
            {currency}{item.price}
          </div>

          {/* Short Descriptive Explanation */}
          <p
            style={{
              fontSize: '0.74rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.35,
              marginBottom: '4px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
            }}
          >
            {item.description}
          </p>

          {/* Bottom Row: Estimated Preparation Time & Optional Add CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', flexWrap: 'wrap' }}>
            <span className="badge-prep-time">
              <Clock size={10} />
              <span>⏱ {prepTimeText}</span>
            </span>

            {/* Add / Stepper Button if ordering enabled */}
            {settings?.orderingEnabled && (
              item.isAvailable ? (
                totalQtyInCart > 0 ? (
                  <div className="qty-stepper-container" onClick={e => e.stopPropagation()}>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="qty-stepper-btn touch-target-44"
                      onClick={handleDecrement}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={11} />
                    </motion.button>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={totalQtyInCart}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="qty-stepper-val"
                      >
                        {totalQtyInCart}
                      </motion.span>
                    </AnimatePresence>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="qty-stepper-btn touch-target-44"
                      onClick={handleIncrement}
                      aria-label="Increase quantity"
                    >
                      <Plus size={11} />
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={handleQuickAdd}
                    className="btn-add-stepper touch-target-44"
                    aria-label={`Add ${item.name}`}
                    style={{
                      minHeight: '36px',
                      minWidth: '60px',
                    }}
                  >
                    <Plus size={12} />
                    <span>ADD</span>
                  </motion.button>
                )
              ) : (
                <button
                  type="button"
                  disabled
                  className="btn-add-stepper touch-target-44"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#9ca3af',
                    cursor: 'not-allowed',
                    opacity: 0.7,
                    minHeight: '36px',
                    minWidth: '60px',
                  }}
                  aria-label={`${item.name} is sold out`}
                >
                  <span>Sold Out</span>
                </button>
              )
            )}
          </div>
        </div>
      </CardWrapper>
    </motion.div>
  );
}
