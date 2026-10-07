import React, { useState } from 'react';
import { X, QrCode, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function TableSelectorModal({ isOpen, onClose }) {
  const { tableNumber, setTableNumber, showToast } = useCart();
  const { activeRestaurant } = useRestaurant();
  const { theme, settings } = activeRestaurant;

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

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div
        className="bottom-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          padding: '20px 20px 30px',
          color: '#ffffff',
          maxHeight: '85vh',
        }}
      >
        <div className="sheet-handle" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={20} color={theme.primaryColor || '#c99738'} />
            <div>
              <h3 style={{ fontFamily: theme.fontHeading || "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700 }}>
                Select Your Table
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                Currently seated at Table {tableNumber}
              </span>
            </div>
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

        <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '16px' }}>
          Orders and service requests will be delivered directly to the selected table.
        </p>

        {/* Table Number Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            maxHeight: '50vh',
            overflowY: 'auto',
            padding: '4px',
          }}
        >
          {tables.map(num => {
            const isSelected = tableNumber === num;
            return (
              <button
                key={num}
                onClick={() => handleSelect(num)}
                style={{
                  padding: '16px 8px',
                  borderRadius: '14px',
                  background: isSelected ? theme.primaryColor : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected ? `2px solid ${theme.primaryColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isSelected ? '#0d0e12' : '#ffffff',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 15px rgba(201, 151, 56, 0.35)' : 'none',
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: isSelected ? 0.8 : 0.6, textTransform: 'uppercase' }}>Table</span>
                <span>{num}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
