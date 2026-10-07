import React, { useState } from 'react';
import { Store, Plus, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function AdminRestaurantSwitcher() {
  const {
    restaurants,
    activeSlug,
    switchRestaurant,
    createNewRestaurant,
    resetToSampleData,
  } = useRestaurant();
  const { showToast } = useCart();

  const [newRestName, setNewRestName] = useState('');
  const [newRestSlug, setNewRestSlug] = useState('');

  const handleNameChange = (e) => {
    const val = e.target.value;
    setNewRestName(val);
    setNewRestSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-'));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newRestName.trim() || !newRestSlug.trim()) {
      showToast('Please enter a restaurant name', 'warning');
      return;
    }

    if (restaurants.some(r => r.slug === newRestSlug)) {
      showToast('A restaurant with this slug already exists', 'warning');
      return;
    }

    createNewRestaurant(newRestName.trim(), newRestSlug.trim());
    showToast(`Created and switched to ${newRestName}`, 'success');
    setNewRestName('');
    setNewRestSlug('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#ffffff' }}>
      
      {/* Existing Restaurants List */}
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
        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Switch Active Restaurant</h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {restaurants.map(rest => {
            const isActive = rest.slug === activeSlug;
            return (
              <div
                key={rest.slug}
                onClick={() => switchRestaurant(rest.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(201, 151, 56, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive ? `1.5px solid var(--color-primary)` : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={rest.coverImage}
                    alt={rest.name}
                    style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>{rest.name}</h5>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>/menu/{rest.slug}</span>
                  </div>
                </div>

                {isActive ? (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} />
                    <span>Active</span>
                  </span>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Select →</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create New Restaurant Form */}
      <form
        onSubmit={handleCreate}
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
        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Add New Restaurant Branch / Brand</h4>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
            Restaurant Name
          </label>
          <input
            type="text"
            placeholder="e.g. Bella Italia Trattoria"
            value={newRestName}
            onChange={handleNameChange}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
            URL Slug (/menu/{newRestSlug || 'your-slug'})
          </label>
          <input
            type="text"
            value={newRestSlug}
            onChange={e => setNewRestSlug(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}
        >
          <Plus size={16} />
          <span>Create & Launch Restaurant</span>
        </button>
      </form>

      {/* Reset to Demo Data */}
      <div style={{ textAlign: 'center', paddingTop: '10px' }}>
        <button
          onClick={() => {
            if (window.confirm('Reset all restaurants and menus to default demo samples?')) {
              resetToSampleData();
              showToast('Reset to demo sample restaurants', 'info');
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <RotateCcw size={13} />
          <span>Reset All Sample Data</span>
        </button>
      </div>
    </div>
  );
}
