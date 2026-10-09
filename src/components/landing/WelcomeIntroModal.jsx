import React, { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { modalBackdropVariants } from '../../lib/motion';

export default function WelcomeIntroModal({ isOpen, onClose }) {
  const { activeRestaurant } = useRestaurant();
  const { tableNumber } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    // Auto dismiss after 2s
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  const { theme } = activeRestaurant;

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          key="welcome-intro-modal"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          role="dialog"
          aria-label="Welcome Intro"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: '#0E0B0A',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 20px calc(28px + env(safe-area-inset-bottom))',
            color: '#F6EFE3',
            overflow: 'hidden',
            boxSizing: 'border-box',
            cursor: 'pointer',
          }}
        >
          {/* Top Bar with Skip */}
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              display: 'flex',
              justifyContent: 'flex-end',
              zIndex: 10,
            }}
          >
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={e => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(212, 166, 74, 0.3)',
                color: '#F6EFE3',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Skip ✕
            </m.button>
          </div>

          {/* Central Brand Reveal Medallion */}
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 10,
              padding: '0 16px',
            }}
          >
            {/* Gold Ring Medallion */}
            <m.div
              animate={{
                boxShadow: [
                  '0 0 25px rgba(212, 166, 74, 0.3), 0 10px 30px rgba(0, 0, 0, 0.8)',
                  '0 0 50px rgba(212, 166, 74, 0.6), 0 10px 30px rgba(0, 0, 0, 0.8)',
                  '0 0 25px rgba(212, 166, 74, 0.3), 0 10px 30px rgba(0, 0, 0, 0.8)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{
                position: 'relative',
                width: 'clamp(140px, 38vw, 175px)',
                height: 'clamp(140px, 38vw, 175px)',
                borderRadius: '50%',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(212, 166, 74, 0.8)',
                background: '#141110',
                padding: '6px',
              }}
            >
              <img
                src="/devi-logo.png"
                alt="Devi - The Real Fast Food Centre"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  display: 'block',
                }}
              />
            </m.div>

            {/* Brand Name */}
            <m.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontFamily: theme.fontHeading || "'Fraunces', Georgia, serif",
                fontSize: 'clamp(1.8rem, 6.5vw, 2.3rem)',
                fontWeight: 900,
                color: '#F6EFE3',
                letterSpacing: '0.04em',
                lineHeight: 1.15,
                marginBottom: '4px',
              }}
            >
              DEVI
            </m.h1>

            {/* Tagline */}
            <m.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{
                fontSize: 'clamp(0.85rem, 3.2vw, 0.95rem)',
                fontWeight: 800,
                color: 'var(--color-accent)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              The Real Fast Food Centre
            </m.h2>

            {/* Scan. Order. Enjoy. */}
            <m.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                fontSize: '0.84rem',
                color: '#B8AEA2',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Scan • Order • Enjoy
            </m.p>
          </m.div>

          {/* Table Seat Confirmation */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            style={{
              fontSize: '0.75rem',
              color: '#8E8478',
              letterSpacing: '0.05em',
              fontWeight: 600,
              zIndex: 10,
            }}
          >
            {tableNumber ? `Seated at Table ${tableNumber}` : 'Digital Table Ordering'}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
