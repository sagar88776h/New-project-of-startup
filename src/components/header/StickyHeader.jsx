import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Info, BellRing, Settings, UtensilsCrossed, Sun, Moon } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { fadeDown } from '../../lib/motion';

export default function StickyHeader({
  onOpenSearch,
  onOpenInfo,
  onOpenService,
  onOpenAdmin,
  onChangeTable,
  onOpenIntro,
}) {
  const { activeRestaurant, themeMode, toggleThemeMode } = useRestaurant();
  const { totalItemsCount, setIsCartOpen, tableNumber } = useCart();
  const { theme, settings } = activeRestaurant;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const buttonHoverTap = {
    whileHover: { scale: 1.08, y: -1 },
    whileTap: { scale: 0.92 },
    transition: { type: 'spring', stiffness: 450, damping: 25 },
  };

  return (
    <m.header
      variants={fadeDown}
      initial="hidden"
      animate="visible"
      className={`glass-nav ${isScrolled ? 'scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        padding: 'max(6px, env(safe-area-inset-top, 6px)) 8px 6px',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease',
        boxShadow: isScrolled
          ? '0 4px 20px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(212, 166, 74, 0.1)'
          : 'none',
      }}
    >
      <div className="header-inner-container" style={{ gap: '4px' }}>
        {/* Left: Brand Monogram & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
          <m.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.94 }}
            onClick={onOpenIntro}
            title="Click to replay Welcome Intro"
            style={{
              width: 'clamp(30px, 7.5vw, 36px)',
              height: 'clamp(30px, 7.5vw, 36px)',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `2px solid ${theme.primaryColor || 'var(--color-primary)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer',
              background: '#ffffff',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }}
          >
            {activeRestaurant.logo ? (
              <img
                src={activeRestaurant.logo}
                alt={activeRestaurant.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <UtensilsCrossed size={15} color="var(--color-primary)" />
            )}
          </m.div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <h2
              onClick={onOpenIntro}
              style={{
                fontFamily: theme.fontHeading || "'Playfair Display', serif",
                fontSize: 'clamp(0.78rem, 3.2vw, 0.95rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2,
                cursor: 'pointer',
              }}
              title="Click to replay Welcome to Devi intro"
            >
              {activeRestaurant.name}
            </h2>
            <m.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onChangeTable}
              aria-label="Select table"
              className="touch-target-44"
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.64rem',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                fontWeight: 600,
                minHeight: '20px',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title="Click to select/change table"
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: tableNumber ? '#15803d' : '#f59e0b',
                  boxShadow: tableNumber ? '0 0 8px #15803d' : '0 0 8px #f59e0b',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {tableNumber ? `Table ${tableNumber}` : 'Select Table'}
              </span>
            </m.button>
          </div>
        </div>

        {/* Right Action Icons with Accessible Hit Areas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(2px, 1vw, 4px)', flexShrink: 0 }}>
          {/* Search Button */}
          <m.button
            {...buttonHoverTap}
            onClick={onOpenSearch}
            aria-label="Search Dishes"
            className="touch-target-44"
            style={{
              width: 'clamp(28px, 7.5vw, 34px)',
              height: 'clamp(28px, 7.5vw, 34px)',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(212, 166, 74, 0.2)',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Search size={14} />
          </m.button>

          {/* Call Waiter / Service Button */}
          <m.button
            {...buttonHoverTap}
            onClick={onOpenService}
            aria-label="Call Waiter"
            title="Call Waiter / Table Service"
            className="touch-target-44"
            style={{
              width: 'clamp(28px, 7.5vw, 34px)',
              height: 'clamp(28px, 7.5vw, 34px)',
              borderRadius: '50%',
              background: 'rgba(196, 22, 28, 0.12)',
              border: '1px solid rgba(196, 22, 28, 0.35)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <BellRing size={14} />
          </m.button>

          {/* Dark / Light Theme Toggle */}
          <m.button
            {...buttonHoverTap}
            onClick={toggleThemeMode}
            aria-label={themeMode === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            title={themeMode === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="touch-target-44"
            style={{
              width: 'clamp(28px, 7.5vw, 34px)',
              height: 'clamp(28px, 7.5vw, 34px)',
              borderRadius: '50%',
              background: themeMode === 'dark' ? 'rgba(212, 166, 74, 0.14)' : 'rgba(0, 0, 0, 0.04)',
              border: themeMode === 'dark' ? '1px solid rgba(212, 166, 74, 0.35)' : '1px solid rgba(0, 0, 0, 0.12)',
              color: themeMode === 'dark' ? '#D4A64A' : 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {themeMode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </m.button>

          {/* Restaurant Info Button */}
          <m.button
            {...buttonHoverTap}
            onClick={onOpenInfo}
            aria-label="Restaurant Info"
            title="About Restaurant & WiFi"
            className="touch-target-44"
            style={{
              width: 'clamp(28px, 7.5vw, 34px)',
              height: 'clamp(28px, 7.5vw, 34px)',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(212, 166, 74, 0.2)',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Info size={14} />
          </m.button>

          {/* Cart Trigger (If Ordering Enabled) */}
          {settings?.orderingEnabled && (
            <m.button
              {...buttonHoverTap}
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="touch-target-44"
              style={{
                position: 'relative',
                width: 'clamp(28px, 7.5vw, 34px)',
                height: 'clamp(28px, 7.5vw, 34px)',
                borderRadius: '50%',
                background: totalItemsCount > 0 ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.06)',
                border: totalItemsCount > 0 ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(212, 166, 74, 0.2)',
                color: totalItemsCount > 0 ? '#ffffff' : 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: totalItemsCount > 0 ? '0 2px 10px rgba(196, 22, 28, 0.4)' : 'none',
              }}
            >
              <ShoppingBag size={14} />
              <AnimatePresence>
                {totalItemsCount > 0 && (
                  <m.span
                    key={totalItemsCount}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      background: '#15803d',
                      color: '#ffffff',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    {totalItemsCount}
                  </m.span>
                )}
              </AnimatePresence>
            </m.button>
          )}

          {/* Admin Portal */}
          <m.button
            {...buttonHoverTap}
            onClick={onOpenAdmin}
            aria-label="Admin Dashboard"
            title="Restaurant Admin Portal"
            className="touch-target-44"
            style={{
              width: 'clamp(26px, 6.5vw, 30px)',
              height: 'clamp(26px, 6.5vw, 30px)',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px dashed rgba(212, 166, 74, 0.3)',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Settings size={12} />
          </m.button>
        </div>
      </div>
    </m.header>
  );
}
