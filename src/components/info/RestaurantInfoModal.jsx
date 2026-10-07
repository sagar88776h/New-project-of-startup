import React, { useState } from 'react';
import { X, MapPin, Phone, Clock, Wifi, Copy, Check, MessageCircle, Utensils, Star, ExternalLink } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

const InstagramIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function RestaurantInfoModal({ isOpen, onClose }) {
  const { activeRestaurant } = useRestaurant();
  const { showToast } = useCart();
  const [copiedWifi, setCopiedWifi] = useState(false);

  if (!isOpen) return null;

  const { contact, theme } = activeRestaurant;

  const handleCopyWifi = () => {
    if (contact?.wifiPassword) {
      navigator.clipboard?.writeText(contact.wifiPassword);
      setCopiedWifi(true);
      showToast('WiFi Password copied to clipboard!', 'success');
      setTimeout(() => setCopiedWifi(false), 2500);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div
        className="bottom-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          maxHeight: '88vh',
          padding: '20px 20px 30px',
          color: '#ffffff',
        }}
      >
        <div className="sheet-handle" />

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={20} color={theme.primaryColor || '#c99738'} />
            <h3 style={{ fontFamily: theme.fontHeading || "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700 }}>
              Restaurant Information
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
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

        {/* Restaurant Story */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <h4 style={{ fontFamily: theme.fontHeading || "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: theme.primaryColor || '#c99738', marginBottom: '6px' }}>
            {activeRestaurant.name}
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#e5e7eb', lineHeight: 1.5, marginBottom: '8px' }}>
            {activeRestaurant.description}
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            <span>Kitchen Open & Serving Fresh</span>
          </div>
        </div>

        {/* Guest WiFi Card */}
        {contact?.wifiPassword && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(201, 151, 56, 0.15) 0%, rgba(201, 151, 56, 0.04) 100%)',
              border: `1px solid rgba(201, 151, 56, 0.3)`,
              borderRadius: '16px',
              padding: '14px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(201, 151, 56, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Wifi size={18} color={theme.primaryColor || '#c99738'} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Guest WiFi</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{contact.wifiSsid}</div>
              </div>
            </div>

            <button
              onClick={handleCopyWifi}
              style={{
                background: copiedWifi ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: copiedWifi ? '#0d0e12' : '#ffffff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
              }}
            >
              {copiedWifi ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedWifi ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
        )}

        {/* Contact & Hours Details Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          
          {/* Address */}
          <a
            href={contact?.googleMapsUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              textDecoration: 'none',
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={18} color={theme.primaryColor || '#c99738'} />
              <div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Location & Directions</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{contact?.address}</div>
              </div>
            </div>
            <ExternalLink size={15} color="#9ca3af" />
          </a>

          {/* Opening Hours */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <Clock size={18} color={theme.primaryColor || '#c99738'} />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Dining Hours</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{contact?.openingHours}</div>
            </div>
          </div>

          {/* Phone Number */}
          <a
            href={`tel:${contact?.phone}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              textDecoration: 'none',
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={18} color={theme.primaryColor || '#c99738'} />
              <div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Phone & Reservations</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{contact?.phone}</div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: theme.primaryColor || '#c99738', fontWeight: 700 }}>Call Now</span>
          </a>

          {/* WhatsApp & Instagram */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
            <a
              href={`https://wa.me/${contact?.whatsapp?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                background: 'rgba(37, 211, 102, 0.12)',
                border: '1px solid rgba(37, 211, 102, 0.25)',
                borderRadius: '12px',
                color: '#25d366',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>

            <a
              href={`https://instagram.com/${contact?.instagram?.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                background: 'rgba(225, 48, 108, 0.12)',
                border: '1px solid rgba(225, 48, 108, 0.25)',
                borderRadius: '12px',
                color: '#e1306c',
                fontSize: '0.82rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <InstagramIcon size={16} />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
