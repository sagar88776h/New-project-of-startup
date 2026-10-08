import React from 'react';
import { Utensils, MapPin, Phone, Clock, MessageCircle, Heart, ShieldCheck, Settings } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

const InstagramIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer({ onOpenAdmin, onSwitchRestaurantClick }) {
  const { activeRestaurant } = useRestaurant();
  const { contact, theme } = activeRestaurant;

  return (
    <footer
      style={{
        marginTop: '30px',
        padding: '24px 16px calc(90px + var(--sab))',
        background: 'rgba(14, 11, 10, 0.98)',
        borderTop: '1px solid rgba(212, 166, 74, 0.15)',
        color: '#9ca3af',
        textAlign: 'center',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        
        {/* Monogram Logo */}
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `2px solid var(--color-accent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            background: '#1A1514',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          }}
        >
          {activeRestaurant.logo ? (
            <img
              src={activeRestaurant.logo}
              alt={activeRestaurant.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Utensils size={24} color="var(--color-accent)" />
          )}
        </div>

        <h3
          style={{
            fontFamily: theme.fontHeading || "'Fraunces', serif",
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#F6EFE3',
            marginBottom: '4px',
          }}
        >
          {activeRestaurant.name}
        </h3>

        <p style={{ fontSize: '0.8rem', color: '#9ca3af', maxWidth: '320px', margin: '0 auto 16px', lineHeight: 1.4 }}>
          {activeRestaurant.tagline}
        </p>

        {/* Contact Snippets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: '#d1d5db', marginBottom: '20px' }}>
          <div>📍 {contact?.address}</div>
          <div>📞 {contact?.phone}</div>
          <div>⏰ {contact?.openingHours}</div>
        </div>

        {/* Social Links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
          <a
            href={`https://instagram.com/${contact?.instagram?.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              textDecoration: 'none',
            }}
          >
            <InstagramIcon size={17} />
          </a>

          <a
            href={`https://wa.me/${contact?.whatsapp?.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              textDecoration: 'none',
            }}
          >
            <MessageCircle size={17} />
          </a>
        </div>

        {/* Multi-Restaurant Switcher & Admin quick links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={onSwitchRestaurantClick}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#e5e7eb',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            🔄 Switch Restaurant
          </button>

          <button
            onClick={onOpenAdmin}
            style={{
              background: 'rgba(201, 151, 56, 0.12)',
              border: '1px solid rgba(201, 151, 56, 0.3)',
              color: theme.primaryColor || '#c99738',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Settings size={13} />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Copyright */}
        <div style={{ fontSize: '0.7rem', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <span>Crafted with</span>
          <Heart size={11} color="#ef4444" fill="#ef4444" />
          <span>for Contactless Dining • Digital QR Menu</span>
        </div>
      </div>
    </footer>
  );
}
