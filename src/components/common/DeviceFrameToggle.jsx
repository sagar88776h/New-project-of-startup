import React from 'react';
import { QrCode, Settings, Shield } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function DeviceFrameToggle({ onOpenQr, onOpenAdmin }) {
  const { activeRestaurant, switchRestaurant, restaurants } = useRestaurant();
  const { theme } = activeRestaurant;

  return (
    <div
      className="desktop-test-bar"
      style={{
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        background: '#090a0d',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '0.78rem',
        color: '#9ca3af',
        zIndex: 100,
      }}
    >
      {/* Left: Admin Mode & Restaurant Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)', fontWeight: 700 }}>
          <Shield size={14} />
          <span>Admin Controls</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Switch:</span>
          <select
            value={activeRestaurant.slug}
            onChange={e => switchRestaurant(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: '0.75rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {restaurants.map(r => (
              <option key={r.slug} value={r.slug} style={{ background: '#11141a', color: '#fff' }}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* QR Code Studio Button */}
        <button
          onClick={onOpenQr}
          style={{
            background: 'rgba(212, 166, 74, 0.15)',
            border: '1px solid rgba(212, 166, 74, 0.3)',
            color: 'var(--color-accent)',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <QrCode size={13} />
          <span>QR Studio</span>
        </button>

        {/* Admin Dashboard */}
        <button
          onClick={onOpenAdmin}
          style={{
            background: 'var(--color-primary)',
            border: 'none',
            color: '#ffffff',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Settings size={13} />
          <span>Admin Portal</span>
        </button>
      </div>
    </div>
  );
}
