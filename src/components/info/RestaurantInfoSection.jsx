import React, { useState } from 'react';
import { m } from 'framer-motion';
import { MapPin, Phone, Clock, Wifi, Copy, Check, ExternalLink, MessageCircle, Utensils } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { fadeUp } from '../../lib/motion';

const InstagramIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function RestaurantInfoSection() {
  const { activeRestaurant } = useRestaurant();
  const { showToast } = useCart();
  const [copiedWifi, setCopiedWifi] = useState(false);

  const { contact, theme } = activeRestaurant;

  const handleCopyWifi = () => {
    if (contact?.wifiPassword) {
      navigator.clipboard?.writeText(contact.wifiPassword);
      setCopiedWifi(true);
      showToast('WiFi password copied to clipboard!', 'success');
      setTimeout(() => setCopiedWifi(false), 2500);
    }
  };

  return (
    <m.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      style={{ padding: '20px 16px 30px' }}
    >
      <div
        className="restaurant-card"
        style={{
          padding: '20px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Utensils size={18} color="var(--color-accent)" />
          <h3
            style={{
              fontFamily: theme.fontHeading || "'Fraunces', serif",
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
            }}
          >
            Restaurant Information
          </h3>
        </div>

        {/* Story */}
        <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          {activeRestaurant.description}
        </p>

        {/* Guest WiFi */}
        {contact?.wifiPassword && (
          <div
            style={{
              background: 'rgba(196, 22, 28, 0.08)',
              border: '1px solid rgba(212, 166, 74, 0.25)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wifi size={16} color="var(--color-primary)" />
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)' }}>
                WiFi: <b>{contact.wifiSsid}</b>
              </div>
            </div>
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleCopyWifi}
              style={{
                background: copiedWifi ? '#15803d' : 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 11px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {copiedWifi ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedWifi ? 'Copied' : 'Copy Key'}</span>
            </m.button>
          </div>
        )}

        {/* Details List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
          {contact?.address && (
            <m.a
              whileHover={{ x: 3 }}
              href={contact.googleMapsUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', textDecoration: 'none', color: 'inherit' }}
            >
              <MapPin size={15} color="var(--color-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{contact.address}</span>
              <ExternalLink size={13} color="var(--color-text-muted)" />
            </m.a>
          )}

          {contact?.openingHours && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={15} color="var(--color-primary)" flexShrink={0} />
              <span>{contact.openingHours}</span>
            </div>
          )}

          {contact?.phone && (
            <m.a
              whileHover={{ x: 3 }}
              href={`tel:${contact.phone}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}
            >
              <Phone size={15} color="var(--color-primary)" flexShrink={0} />
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{contact.phone}</span>
            </m.a>
          )}
        </div>

        {/* Social & WhatsApp Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          {contact?.whatsapp && (
            <m.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '9px',
                background: 'rgba(37, 211, 102, 0.12)',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                borderRadius: '10px',
                color: '#22c55e',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </m.a>
          )}

          {contact?.instagram && (
            <m.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href={`https://instagram.com/${contact.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '9px',
                background: 'rgba(225, 48, 108, 0.12)',
                border: '1px solid rgba(225, 48, 108, 0.3)',
                borderRadius: '10px',
                color: '#f43f5e',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <InstagramIcon size={15} />
              <span>Instagram</span>
            </m.a>
          )}
        </div>
      </div>
    </m.section>
  );
}
