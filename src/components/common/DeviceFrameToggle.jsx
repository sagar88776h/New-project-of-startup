import React from 'react';
import { Smartphone, Monitor, QrCode, Settings, Sparkles } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function DeviceFrameToggle({ isDesktopExpanded, onToggleExpanded, onOpenQr, onOpenAdmin }) {
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
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '0.78rem',
        color: '#9ca3af',
        zIndex: 100,
      }}
    >
      {/* Left: Restaurant Switcher Quick Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: theme.primaryColor || '#c99738', fontWeight: 700 }}>Restaurant:</span>
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

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Device View Toggle */}
        <button
          onClick={onToggleExpanded}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#d1d5db',
            borderRadius: '6px',
            padding: '3px 10px',
            fontSize: '0.72rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
          title="Toggle Mobile Simulator vs Full Desktop Width"
        >
          {isDesktopExpanded ? <Smartphone size={13} /> : <Monitor size={13} />}
          <span>{isDesktopExpanded ? 'Mobile View' : 'Desktop View'}</span>
        </button>

        {/* QR Code Studio Button */}
        <button
          onClick={onOpenQr}
          style={{
            background: 'rgba(201, 151, 56, 0.15)',
            border: '1px solid rgba(201, 151, 56, 0.3)',
            color: theme.primaryColor || '#c99738',
            borderRadius: '6px',
            padding: '3px 10px',
            fontSize: '0.72rem',
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
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            borderRadius: '6px',
            padding: '3px 10px',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Settings size={13} />
          <span>Admin</span>
        </button>
      </div>
    </div>
  );
}
