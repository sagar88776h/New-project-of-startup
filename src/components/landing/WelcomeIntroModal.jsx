import React, { useState, useEffect } from 'react';
import { Utensils, ArrowRight, Sparkles, QrCode, ShieldCheck, Flame, Clock } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function WelcomeIntroModal({ isOpen, onClose }) {
  const { activeRestaurant } = useRestaurant();
  const { tableNumber } = useCart();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    // Auto progress timer over 3 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onClose();
          }, 350);
          return 100;
        }
        return prev + 2;
      });
    }, 55);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { theme } = activeRestaurant;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: '#090a0e',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 20px calc(28px + env(safe-area-inset-bottom))',
        color: '#ffffff',
        overflow: 'hidden',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.3s ease-out forwards',
      }}
    >
      {/* Ambient Background Glow Effect */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 138, 44, 0.28) 0%, rgba(139, 29, 44, 0.22) 45%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Bar: Skip Button */}
      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#9ca3af' }}>
          <Sparkles size={13} color="#facc15" />
          <span>Devi Fast Food Experience</span>
        </div>

        <button
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#e5e7eb',
            padding: '5px 14px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Skip Intro →
        </button>
      </div>

      {/* Central Brand Showcase */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        {/* Table Number Scanned Pill */}
        <div
          style={{
            background: 'rgba(201, 138, 44, 0.18)',
            border: '1.5px solid rgba(201, 138, 44, 0.55)',
            color: '#fef08a',
            padding: '5px 16px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            marginBottom: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 15px rgba(201, 138, 44, 0.25)',
          }}
        >
          <QrCode size={14} color="#facc15" />
          <span>SEATED AT TABLE {tableNumber}</span>
        </div>

        {/* 3D Devi Logo Medallion */}
        <div
          style={{
            position: 'relative',
            width: 'clamp(145px, 40vw, 185px)',
            height: 'clamp(145px, 40vw, 185px)',
            borderRadius: '50%',
            marginBottom: '16px',
            boxShadow: '0 12px 40px rgba(139, 29, 44, 0.45), 0 0 60px rgba(201, 138, 44, 0.35)',
            transition: 'transform 0.3s ease',
          }}
        >
          <img
            src="/devi-logo.png"
            alt="DEVI - The Real Fast Food Centre"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
              display: 'block',
            }}
          />
        </div>

        {/* Welcome Greeting */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{ fontSize: '0.76rem', color: '#facc15', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>
            ✨ WELCOME TO
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.9rem, 6.5vw, 2.3rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.02em',
              lineHeight: 1.1,
              textShadow: '0 2px 14px rgba(0,0,0,0.8)',
              marginBottom: '4px',
            }}
          >
            DEVI
          </h1>
          <h2
            style={{
              fontSize: 'clamp(0.85rem, 3.2vw, 0.95rem)',
              fontWeight: 800,
              color: '#facc15',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            The Real Fast Food Centre
          </h2>
          <p
            style={{
              fontSize: '0.8rem',
              color: '#94a3b8',
              lineHeight: 1.45,
              maxWidth: '300px',
              margin: '0 auto',
            }}
          >
            Mouthwatering, freshly prepared authentic delicacies crafted with top quality ingredients.
          </p>
        </div>
      </div>

      {/* Bottom Action Area: Progress Bar + Enter Menu CTA */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
        }}
      >
        {/* Loading Progress Bar */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#9ca3af' }}>
            <span>Opening digital menu...</span>
            <span style={{ color: '#facc15', fontWeight: 700 }}>{progress}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '4px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #8b1d2c 0%, #c98a2c 50%, #facc15 100%)',
                borderRadius: '999px',
                transition: 'width 0.08s linear',
              }}
            />
          </div>
        </div>

        {/* Enter Menu Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '16px',
            fontSize: '0.96rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            boxShadow: '0 8px 30px rgba(139, 29, 44, 0.5), 0 0 20px rgba(201, 138, 44, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #8b1d2c 0%, #b91c1c 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            cursor: 'pointer',
          }}
        >
          <span>VIEW DIGITAL MENU</span>
          <ArrowRight size={18} />
        </button>

        {/* Contactless Verification Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#64748b' }}>
          <ShieldCheck size={13} color="#22c55e" />
          <span>Contactless Dining • Instant Kitchen Order</span>
        </div>
      </div>
    </div>
  );
}
