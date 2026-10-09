import React, { useState } from 'react';
import { Palette, Store, Wifi, Save } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function AdminRestaurantSettings() {
  const { activeRestaurant, updateRestaurantSettings, updateTheme } = useRestaurant();
  const { showToast } = useCart();

  const [form, setForm] = useState({
    name: activeRestaurant.name || '',
    tagline: activeRestaurant.tagline || '',
    description: activeRestaurant.description || '',
    currency: activeRestaurant.currency || '₹',
    coverImage: activeRestaurant.coverImage || '',
    phone: activeRestaurant.contact?.phone || '',
    whatsapp: activeRestaurant.contact?.whatsapp || '',
    address: activeRestaurant.contact?.address || '',
    openingHours: activeRestaurant.contact?.openingHours || '',
    wifiSsid: activeRestaurant.contact?.wifiSsid || '',
    wifiPassword: activeRestaurant.contact?.wifiPassword || '',
    instagram: activeRestaurant.contact?.instagram || '',
    taxRate: activeRestaurant.settings?.taxRate ?? 5,
    serviceChargeRate: activeRestaurant.settings?.serviceChargeRate ?? 5,
    tablesCount: activeRestaurant.settings?.tablesCount ?? 24,
    orderingEnabled: activeRestaurant.settings?.orderingEnabled ?? true,
    specialOffersEnabled: activeRestaurant.settings?.specialOffersEnabled ?? true,
  });

  const [themeForm, setThemeForm] = useState({
    primaryColor: activeRestaurant.theme?.primaryColor || '#c99738',
    accentColor: activeRestaurant.theme?.accentColor || '#8b1e2f',
    bgColor: activeRestaurant.theme?.bgColor || '#0d0e12',
    fontHeading: activeRestaurant.theme?.fontHeading || "'Playfair Display', serif",
  });

  const handleSave = (e) => {
    e.preventDefault();

    updateRestaurantSettings({
      name: form.name,
      tagline: form.tagline,
      description: form.description,
      currency: form.currency,
      coverImage: form.coverImage,
      contact: {
        phone: form.phone,
        whatsapp: form.whatsapp,
        address: form.address,
        openingHours: form.openingHours,
        wifiSsid: form.wifiSsid,
        wifiPassword: form.wifiPassword,
        instagram: form.instagram,
      },
      settings: {
        taxRate: Number(form.taxRate),
        serviceChargeRate: Number(form.serviceChargeRate),
        tablesCount: Number(form.tablesCount),
        orderingEnabled: form.orderingEnabled,
        specialOffersEnabled: form.specialOffersEnabled,
      },
    });

    updateTheme(themeForm);
    showToast('Restaurant settings & theme saved successfully', 'success');
  };

  const presetThemes = [
    { name: 'Royal Gold & Obsidian', primary: '#c99738', accent: '#8b1e2f', bg: '#0d0e12' },
    { name: 'Napoli Terracotta', primary: '#e5a951', accent: '#c84b31', bg: '#111413' },
    { name: 'Tokyo Sakura Velvet', primary: '#f43f5e', accent: '#fb7185', bg: '#09090b' },
    { name: 'Emerald Imperial', primary: '#10b981', accent: '#059669', bg: '#091510' },
  ];

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#ffffff' }}>
      
      {/* Brand Identity */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Store size={18} color={themeForm.primaryColor} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Brand Identity & Core Details</h4>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
            Restaurant Name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
            Tagline (Appears on QR scan entrance)
          </label>
          <input
            type="text"
            value={form.tagline}
            onChange={e => setForm({ ...form, tagline: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
            About Story / Description
          </label>
          <textarea
            rows={2}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem', resize: 'none' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
              Currency Symbol
            </label>
            <input
              type="text"
              value={form.currency}
              onChange={e => setForm({ ...form, currency: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
              Total Dining Tables Count
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={form.tablesCount}
              onChange={e => setForm({ ...form, tablesCount: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* Theme & Colors Customizer */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={18} color={themeForm.primaryColor} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Brand Palette & Luxury Theme</h4>
        </div>

        {/* Preset Palettes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {presetThemes.map(p => (
            <button
              key={p.name}
              type="button"
              onClick={() => setThemeForm({ ...themeForm, primaryColor: p.primary, accentColor: p.accent, bgColor: p.bg })}
              style={{
                padding: '8px 10px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: p.primary, border: '1px solid #fff' }} />
              <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 600 }}>{p.name}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
              Primary Gold / Brand Color
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="color"
                value={themeForm.primaryColor}
                onChange={e => setThemeForm({ ...themeForm, primaryColor: e.target.value })}
                style={{ width: '38px', height: '38px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }}
              />
              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{themeForm.primaryColor}</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
              Accent Color
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="color"
                value={themeForm.accentColor}
                onChange={e => setThemeForm({ ...themeForm, accentColor: e.target.value })}
                style={{ width: '38px', height: '38px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'none' }}
              />
              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{themeForm.accentColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest WiFi & Contact */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wifi size={18} color={themeForm.primaryColor} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Guest WiFi & Contact Information</h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
              WiFi Network (SSID)
            </label>
            <input
              type="text"
              value={form.wifiSsid}
              onChange={e => setForm({ ...form, wifiSsid: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
              WiFi Password
            </label>
            <input
              type="text"
              value={form.wifiPassword}
              onChange={e => setForm({ ...form, wifiPassword: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
            Restaurant Phone Number
          </label>
          <input
            type="text"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
            Physical Address
          </label>
          <input
            type="text"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="btn-primary"
        style={{ padding: '15px', borderRadius: '14px', fontSize: '0.95rem' }}
      >
        <Save size={18} />
        <span>Save All Settings</span>
      </button>
    </form>
  );
}
