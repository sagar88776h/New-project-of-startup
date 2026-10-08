import React, { useEffect, useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function WelcomeIntroModal({ isOpen, onClose }) {
  const { activeRestaurant } = useRestaurant();
  const { tableNumber } = useCart();
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsFadingOut(false);
      return;
    }

    // Auto fade out after 1.5s and close at 1.8s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1500);

    const closeTimer = setTimeout(() => {
      onClose();
    }, 1800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { theme } = activeRestaurant;

  return (
    <div
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
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.35s ease',
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
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(212, 166, 74, 0.25)',
            color: '#F6EFE3',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Skip ✕
        </button>
      </div>

      {/* Central Brand Reveal Medallion */}
      <div
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
        <div
          style={{
            position: 'relative',
            width: 'clamp(140px, 38vw, 175px)',
            height: 'clamp(140px, 38vw, 175px)',
            borderRadius: '50%',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 45px rgba(212, 166, 74, 0.25), 0 10px 30px rgba(0, 0, 0, 0.8)',
            border: '2px solid rgba(212, 166, 74, 0.8)',
            background: '#141110',
            padding: '6px',
            animation: 'introScaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
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
        </div>

        {/* Brand Name */}
        <h1
          style={{
            fontFamily: theme.fontHeading || "'Fraunces', Georgia, serif",
            fontSize: 'clamp(1.8rem, 6.5vw, 2.3rem)',
            fontWeight: 900,
            color: '#F6EFE3',
            letterSpacing: '0.04em',
            lineHeight: 1.15,
            marginBottom: '4px',
            animation: 'introFadeUp 0.9s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          DEVI
        </h1>

        {/* Tagline */}
        <h2
          style={{
            fontSize: 'clamp(0.85rem, 3.2vw, 0.95rem)',
            fontWeight: 800,
            color: 'var(--color-accent)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px',
            animation: 'introFadeUp 0.9s 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          The Real Fast Food Centre
        </h2>

        {/* Scan. Order. Enjoy. */}
        <p
          style={{
            fontSize: '0.84rem',
            color: '#B8AEA2',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 600,
            animation: 'introFadeUp 0.9s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          Scan • Order • Enjoy
        </p>
      </div>

      {/* Table Seat Confirmation */}
      <div
        style={{
          fontSize: '0.75rem',
          color: '#8E8478',
          letterSpacing: '0.05em',
          fontWeight: 600,
          zIndex: 10,
        }}
      >
        {tableNumber ? `Seated at Table ${tableNumber}` : 'Digital Table Ordering'}
      </div>

      {/* Inline styles for intro keyframes */}
      <style>{`
        @keyframes introScaleIn {
          0% { transform: scale(0.75); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes introFadeUp {
          0% { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes introScaleIn { 0% { opacity: 0; } 100% { opacity: 1; } }
          @keyframes introFadeUp { 0% { opacity: 0; } 100% { opacity: 1; } }
        }
      `}</style>
    </div>
  );
}
