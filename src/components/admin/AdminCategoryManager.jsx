import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';

export default function AdminCategoryManager() {
  const {
    activeRestaurant,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  } = useRestaurant();
  const { showToast } = useCart();
  const { categories = [] } = activeRestaurant;

  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🍽️');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), newCatIcon || '🍽️');
    showToast(`Added category "${newCatName}"`, 'success');
    setNewCatName('');
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon || '🍽️');
  };

  const handleSaveEdit = (catId) => {
    if (!editName.trim()) return;
    updateCategory(catId, { name: editName.trim(), icon: editIcon || '🍽️' });
    setEditingId(null);
    showToast('Category updated', 'success');
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const reordered = [...categories];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    reorderCategories(reordered);
  };

  const emojiOptions = ['🔥', '🍢', '🍚', '🍛', '🍕', '🍝', '🥗', '🍔', '🥟', '🍣', '🍜', '🫓', '🥤', '🍸', '🍨', '🍰', '☕'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Create New Category Card */}
      <form
        onSubmit={handleAdd}
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
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
          Create New Category
        </h4>

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Icon selector */}
          <select
            value={newCatIcon}
            onChange={e => setNewCatIcon(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '10px',
              background: '#181b24',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '1.1rem',
              color: '#ffffff',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {emojiOptions.map(emoji => (
              <option key={emoji} value={emoji}>{emoji}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="e.g. Artisanal Sourdough Pizzas"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />

          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '10px 16px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Categories Reordering & List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {categories.map((cat, idx) => {
          const isEditing = editingId === cat.id;

          return (
            <div
              key={cat.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <input
                    type="text"
                    value={editIcon}
                    onChange={e => setEditIcon(e.target.value)}
                    style={{ width: '40px', padding: '6px', textAlign: 'center', borderRadius: '8px', background: '#1c202a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                  />
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', background: '#1c202a', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.85rem' }}
                  />
                  <button onClick={() => handleSaveEdit(cat.id)} style={{ padding: '6px 10px', background: '#10b981', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditingId(null)} style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  {/* Category Display */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{cat.icon || '🍽️'}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>{cat.name}</span>
                  </div>

                  {/* Actions (Move, Edit, Delete) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => handleMove(idx, -1)}
                      disabled={idx === 0}
                      style={{ background: 'none', border: 'none', color: idx === 0 ? '#4b5563' : '#d1d5db', cursor: idx === 0 ? 'default' : 'pointer', padding: '4px' }}
                    >
                      <ArrowUp size={15} />
                    </button>

                    <button
                      onClick={() => handleMove(idx, 1)}
                      disabled={idx === categories.length - 1}
                      style={{ background: 'none', border: 'none', color: idx === categories.length - 1 ? '#4b5563' : '#d1d5db', cursor: idx === categories.length - 1 ? 'default' : 'pointer', padding: '4px' }}
                    >
                      <ArrowDown size={15} />
                    </button>

                    <button
                      onClick={() => handleStartEdit(cat)}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
