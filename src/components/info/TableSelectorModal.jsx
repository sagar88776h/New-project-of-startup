import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { modalBackdropVariants, bottomSheetVariants } from '../../lib/motion';

export default function TableSelectorModal({ isOpen, onClose }) {
  const { tableNumber, setTableNumber, showToast } = useCart();
  const { activeRestaurant } = useRestaurant();
  const { theme, settings } = activeRestaurant;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      return () => document.body.classList.remove('modal-open');
    }
  }, [isOpen]);

  const totalTables = settings?.tablesCount || 24;
  const tables = Array.from({ length: totalTables }, (_, i) => String(i + 1).padStart(2, '0'));

  const handleSelect = (num) => {
    setTableNumber(num);
    // Update URL query ?table=
    const url = new URL(window.location.href);
    url.searchParams.set('table', num);
    window.history.pushState({}, '', url.toString());

    showToast(`Switched to Table ${num}`, 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="table-selector-backdrop"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="modal-overlay active"
          onClick={onClose}
        >
          <motion.div
            key="table-selector-sheet"
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={20} color={theme.primaryColor || '#c98a2c'} />
                <h3 style={{ fontFamily: theme.fontHeading || "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Select Your Dining Table
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

            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '18px' }}>
              Select the table number printed on your table's wooden QR stand to route your orders accurately.
            </p>

            {/* Tables Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              {tables.map(num => {
                const isSelected = tableNumber === num;
                return (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(num)}
                    className="touch-target-44"
                    style={{
                      aspectRatio: '1',
                      minHeight: '48px',
                      minWidth: '48px',
                      borderRadius: '14px',
                      border: isSelected
                        ? `2px solid var(--color-primary)`
                        : '1px solid var(--color-card-border)',
                      background: isSelected ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? '#ffffff' : 'var(--color-text-primary)',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 15px rgba(196, 22, 28, 0.35)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '0.62rem', opacity: 0.75, fontWeight: 700 }}>TBL</span>
                    <span>{num}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
