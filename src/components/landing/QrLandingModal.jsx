import React, { useState } from 'react';
import { Utensils, ArrowRight, ShieldCheck, QrCode, Clock } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function QrLandingModal({ onExplore }) {
  const { activeRestaurant } = useRestaurant();
  const { tableNumber } = useCart();
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return !sessionStorage.getItem(`seen_intro_${activeRestaurant.slug}`);
    } catch {
      return true;
    }
  });

  const handleDismiss = () => {
    sessionStorage.setItem(`seen_intro_${activeRestaurant.slug}`, 'true');
    setIsVisible(false);
    onExplore?.();
  };

  if (!isVisible) return null;

  const { theme } = activeRestaurant;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'linear-gradient(180deg, #191c24 0%, #0d0e12 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 20px 32px',
        overflowY: 'auto',
        color: '#ffffff',
      }}
    >
      {/* Top Skip Button */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#e5e7eb',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Skip →
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        {/* Table Number Scanned Badge */}
        <div
          style={{
            background: 'rgba(201, 138, 44, 0.2)',
            border: '1px solid rgba(201, 138, 44, 0.5)',
            color: '#facc15',
            padding: '5px 14px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.05em',
            marginBottom: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <QrCode size={14} />
          <span>TABLE {tableNumber} SCANNED</span>
        </div>

        {/* Logo Monogram & Name */}
        <div style={{ marginBottom: '14px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              margin: '0 auto 12px',
              background: 'linear-gradient(135deg, rgba(201, 138, 44, 0.3) 0%, rgba(201, 138, 44, 0.1) 100%)',
              border: `2px solid ${theme.primaryColor || '#c98a2c'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Utensils size={26} color={theme.primaryColor || '#c98a2c'} />
          </div>

          <h1
            style={{
              fontFamily: theme.fontHeading || "'Playfair Display', serif",
              fontSize: '1.85rem',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '6px',
            }}
          >
            {activeRestaurant.name}
          </h1>

          <p
            style={{
              fontSize: '0.85rem',
              color: '#cbd5e1',
              maxWidth: '300px',
              margin: '0 auto',
              lineHeight: 1.4,
            }}
          >
            {activeRestaurant.tagline}
          </p>
        </div>

        {/* Real Food Photograph Hero Showcase */}
        <div
          style={{
            width: '100%',
            height: '220px',
            borderRadius: '20px',
            overflow: 'hidden',
            margin: '12px 0 16px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
            position: 'relative',
          }}
        >
          <img
            src={activeRestaurant.coverImage}
            alt={activeRestaurant.name}
            width="360"
            height="220"
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(0, 0, 0, 0.75)',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Clock size={12} color={theme.primaryColor || '#c98a2c'} />
            <span>Freshly Made to Order</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <button
          onClick={handleDismiss}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '1rem',
            borderRadius: '16px',
            letterSpacing: '0.04em',
            boxShadow: '0 8px 25px rgba(201, 138, 44, 0.4)',
          }}
        >
          <span>EXPLORE MENU</span>
          <ArrowRight size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
          <ShieldCheck size={13} color="#22c55e" />
          <span>Contactless Digital Dining & Instant Ordering</span>
        </div>
      </div>
    </div>
  );
}
