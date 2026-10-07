import React from 'react';
import { X, Bell, Droplets, Utensils, Receipt, Sparkles, AlertCircle, FileText } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

export default function CallWaiterModal({ isOpen, onClose }) {
  const { tableNumber, callWaiter } = useCart();
  const { activeRestaurant } = useRestaurant();
  const { theme } = activeRestaurant;

  if (!isOpen) return null;

  const handleAction = (serviceName) => {
    callWaiter(serviceName);
    onClose();
  };

  const services = [
    { title: 'Call Waiter', desc: 'General table assistance', icon: <Bell size={20} color="#f59e0b" />, action: 'General Assistance' },
    { title: 'Request Water', desc: 'Complimentary cold drinking water', icon: <Droplets size={20} color="#38bdf8" />, action: 'Drinking Water' },
    { title: 'Cutlery & Plates', desc: 'Extra forks, spoons, or small bowls', icon: <Utensils size={20} color="#10b981" />, action: 'Fresh Cutlery & Plates' },
    { title: 'Extra Napkins', desc: 'Paper napkins & wet wipes', icon: <FileText size={20} color="#a78bfa" />, action: 'Extra Napkins' },
    { title: 'Request Table Bill', desc: 'Cash / Card / UPI machine to table', icon: <Receipt size={20} color={theme.primaryColor || '#c99738'} />, action: 'Bill & Payment Machine' },
  ];

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div
        className="bottom-sheet dark-sheet"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#141720',
          maxHeight: '90svh',
          padding: '16px 16px calc(24px + var(--sab))',
          color: '#ffffff',
          boxSizing: 'border-box',
        }}
      >
        <div className="sheet-handle" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontFamily: theme.fontHeading || "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700 }}>
              Table Assistant
            </h3>
            <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600 }}>
              Assisting Table {tableNumber}
            </span>
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
          Select what you need and our table service captain will arrive at Table {tableNumber} immediately.
        </p>

        {/* Services List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {services.map((srv, idx) => (
            <button
              key={idx}
              onClick={() => handleAction(srv.action)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {srv.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{srv.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{srv.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
