import React, { useState } from 'react';
import { X, BarChart3, Utensils, Layers, QrCode, Settings, Store, ArrowLeft } from 'lucide-react';
import AdminAnalytics from './AdminAnalytics';
import AdminMenuManager from './AdminMenuManager';
import AdminCategoryManager from './AdminCategoryManager';
import AdminQrGenerator from './AdminQrGenerator';
import AdminRestaurantSettings from './AdminRestaurantSettings';
import AdminRestaurantSwitcher from './AdminRestaurantSwitcher';
import { useRestaurant } from '../../context/RestaurantContext';

export default function AdminDashboard({ isOpen, onClose }) {
  const { activeRestaurant } = useRestaurant();
  const [activeTab, setActiveTab] = useState('analytics');

  if (!isOpen) return null;

  const { theme } = activeRestaurant;

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
    { id: 'menu', label: 'Dishes', icon: <Utensils size={16} /> },
    { id: 'categories', label: 'Categories', icon: <Layers size={16} /> },
    { id: 'qr', label: 'QR Studio', icon: <QrCode size={16} /> },
    { id: 'settings', label: 'Branding', icon: <Settings size={16} /> },
    { id: 'restaurants', label: 'Branches', icon: <Store size={16} /> },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: '#090a0e',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Admin Top Header */}
      <header
        style={{
          padding: '12px 20px',
          background: 'rgba(18, 20, 28, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Menu</span>
          </button>

          <div>
            <h2 style={{ fontFamily: theme.fontHeading || "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700 }}>
              Restaurant Admin Portal
            </h2>
            <div style={{ fontSize: '0.72rem', color: theme.primaryColor || '#c99738' }}>
              Managing: {activeRestaurant.name}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: '34px',
            height: '34px',
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
      </header>

      {/* Admin Navigation Tabs */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 16px',
          background: 'rgba(13, 14, 18, 0.98)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                border: isActive ? `1px solid ${theme.primaryColor || '#c99738'}` : '1px solid transparent',
                background: isActive ? 'rgba(201, 151, 56, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? (theme.primaryColor || '#c99738') : '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body View */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 60px', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        {activeTab === 'analytics' && <AdminAnalytics />}
        {activeTab === 'menu' && <AdminMenuManager />}
        {activeTab === 'categories' && <AdminCategoryManager />}
        {activeTab === 'qr' && <AdminQrGenerator />}
        {activeTab === 'settings' && <AdminRestaurantSettings />}
        {activeTab === 'restaurants' && <AdminRestaurantSwitcher />}
      </main>
    </div>
  );
}
