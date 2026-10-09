import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Clock, Wifi, Copy, Check, MessageCircle, Utensils, ExternalLink } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { modalBackdropVariants, bottomSheetVariants } from '../../lib/motion';

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

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      return () => document.body.classList.remove('modal-open');
    }
  }, [isOpen]);

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="restaurant-info-backdrop"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="modal-overlay active"
          onClick={onClose}
        >
          <motion.div
            key="restaurant-info-sheet"
            variants={bottomSheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bottom-sheet"
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: '90dvh', height: 'auto', padding: '20px 18px max(20px, env(safe-area-inset-bottom, 20px))', overflowY: 'auto', overscrollBehavior: 'contain' }}
          >
            <div className="sheet-handle" />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Utensils size={20} color={theme.primaryColor || '#c98a2c'} />
                <h3 style={{ fontFamily: theme.fontHeading || "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  About {activeRestaurant.name}
                </h3>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Close modal"
                className="touch-target-44"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
              {activeRestaurant.description}
            </p>

            {/* Complimentary Guest WiFi Box */}
            {contact?.wifiSsid && (
              <div
                style={{
                  background: 'rgba(212, 166, 74, 0.08)',
                  border: `1.5px solid rgba(212, 166, 74, 0.3)`,
                  borderRadius: '16px',
                  padding: '14px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  minWidth: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(212, 166, 74, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Wifi size={18} color="var(--color-accent)" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      GUEST WI-FI
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {contact.wifiSsid}
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleCopyWifi}
                  className="btn-primary touch-target-44"
                  style={{ padding: '8px 14px', fontSize: '0.78rem', gap: '5px', minHeight: '38px' }}
                >
                  {copiedWifi ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedWifi ? 'Copied' : 'Copy Key'}</span>
                </motion.button>
              </div>
            )}

            {/* Contact & Hours Info Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {contact?.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid var(--color-card-border)' }}>
                  <MapPin size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Address</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--color-text-primary)' }}>{contact.address}</div>
                  </div>
                </div>
              )}

              {contact?.openingHours && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid var(--color-card-border)' }}>
                  <Clock size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Dine-In Hours</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--color-text-primary)' }}>{contact.openingHours}</div>
                  </div>
                </div>
              )}

              {contact?.phone && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid var(--color-card-border)' }}>
                  <Phone size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Phone & Reservations</div>
                    <a href={`tel:${contact.phone}`} style={{ fontSize: '0.84rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {contact?.whatsapp && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary touch-target-44"
                  style={{ flex: 1, padding: '10px', fontSize: '0.82rem', justifyContent: 'center', textDecoration: 'none', color: '#ffffff', minHeight: '44px' }}
                >
                  <MessageCircle size={15} color="#22c55e" />
                  <span>WhatsApp</span>
                  <ExternalLink size={12} color="#9ca3af" />
                </motion.a>
              )}

              {contact?.instagram && (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://instagram.com/${contact.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary touch-target-44"
                  style={{ flex: 1, padding: '10px', fontSize: '0.82rem', justifyContent: 'center', textDecoration: 'none', color: '#ffffff', minHeight: '44px' }}
                >
                  <InstagramIcon size={15} color="#ec4899" />
                  <span>Instagram</span>
                  <ExternalLink size={12} color="#9ca3af" />
                </motion.a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
