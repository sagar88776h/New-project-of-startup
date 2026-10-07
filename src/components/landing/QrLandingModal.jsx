import React, { useState, useEffect } from 'react';
import { Sparkles, Utensils, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import HeroFoodCanvas from '../3d/HeroFoodCanvas';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function QrLandingModal({ onExplore }) {
  const { activeRestaurant } = useRestaurant();
  const { tableNumber } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Check if user already skipped or entered in this session
    const hasSeenIntro = sessionStorage.getItem(`seen_intro_${activeRestaurant.slug}`);
    if (hasSeenIntro) {
      setIsVisible(false);
      onExplore?.();
      return;
    }

    // Step sequence for smooth luxury entrance animation
    const t1 = setTimeout(() => setStep(1), 100);
    const t2 = setTimeout(() => setStep(2), 600);
    const t3 = setTimeout(() => setStep(3), 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [activeRestaurant.slug]);

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
        background: 'radial-gradient(circle at 50% 30%, #171b26 0%, #090a0d 100%)',
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
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', opacity: step >= 1 ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#d1d5db',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(8px)',
          }}
        >
          Skip Intro →
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        {/* Table Number Scanned Badge */}
        <div
          style={{
            opacity: step >= 1 ? 1 : 0,
            transform: step >= 1 ? 'translateY(0)' : 'translateY(-12px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            background: 'rgba(201, 151, 56, 0.15)',
            border: '1px solid rgba(201, 151, 56, 0.4)',
            color: theme.primaryColor || '#c99738',
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
        <div
          style={{
            opacity: step >= 1 ? 1 : 0,
            transform: step >= 1 ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              margin: '0 auto 12px',
              background: 'linear-gradient(135deg, rgba(201, 151, 56, 0.25) 0%, rgba(201, 151, 56, 0.05) 100%)',
              border: `2px solid ${theme.primaryColor || '#c99738'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(201, 151, 56, 0.3)',
            }}
          >
            <Utensils size={28} color={theme.primaryColor || '#c99738'} />
          </div>

          <h1
            style={{
              fontFamily: theme.fontHeading || "'Playfair Display', serif",
              fontSize: '1.85rem',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '6px',
            }}
          >
            {activeRestaurant.name}
          </h1>

          <p
            style={{
              fontFamily: theme.fontBody || "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.85rem',
              color: '#9ca3af',
              maxWidth: '300px',
              margin: '0 auto',
              lineHeight: 1.4,
            }}
          >
            {activeRestaurant.tagline}
          </p>
        </div>

        {/* 3D Hero Platter Showcase */}
        <div
          style={{
            width: '100%',
            opacity: step >= 2 ? 1 : 0,
            transform: step >= 2 ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.95)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            margin: '12px 0',
          }}
        >
          <HeroFoodCanvas
            coverImage={activeRestaurant.coverImage}
            restaurantName={activeRestaurant.name}
            primaryColor={theme.primaryColor}
          />
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          opacity: step >= 3 ? 1 : 0,
          transform: step >= 3 ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
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
            boxShadow: '0 10px 30px rgba(201, 151, 56, 0.4)',
          }}
        >
          <span>EXPLORE MENU</span>
          <ArrowRight size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#6b7280' }}>
          <ShieldCheck size={13} color="#10b981" />
          <span>Contactless 3D Digital Dining & Ordering</span>
        </div>
      </div>
    </div>
  );
}
