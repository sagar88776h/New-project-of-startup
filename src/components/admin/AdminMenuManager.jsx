import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, Flame, Check, X, Clock, ChefHat, Search } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { REAL_FOOD_IMAGES } from '../../data/defaultRestaurants';

export default function AdminMenuManager() {
  const {
    activeRestaurant,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
  } = useRestaurant();
  const { showToast } = useCart();
  const { currency, theme, items = [], categories = [] } = activeRestaurant;

  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State with Min / Max Prep Time
  const initialForm = {
    name: '',
    categoryId: categories[0]?.id || 'curries',
    price: 299,
    description: '',
    preparationStyle: '',
    minPrepTime: 15,
    maxPrepTime: 20,
    serving: 'Serves 1–2 (450g)',
    calories: '520 kcal',
    image: REAL_FOOD_IMAGES.chickenBiryani,
    isVeg: true,
    isBestseller: false,
    isChefSpecial: false,
    isSpicy: 1,
    isAvailable: true,
    ingredientsStr: 'Fresh Produce, Whole Spices, Desi Butter',
    customizations: [
      { id: 'c1', name: 'Extra Portion / Sauce', price: 40 },
    ],
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      minPrepTime: item.minPrepTime || 15,
      maxPrepTime: item.maxPrepTime || 20,
      preparationStyle: item.preparationStyle || '',
      ingredientsStr: item.ingredients?.join(', ') || '',
      customizations: item.customizations || [],
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a dish name', 'warning');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      minPrepTime: Number(formData.minPrepTime),
      maxPrepTime: Number(formData.maxPrepTime),
      isSpicy: Number(formData.isSpicy),
      ingredients: formData.ingredientsStr
        ? formData.ingredientsStr.split(',').map(s => s.trim()).filter(Boolean)
        : [],
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, payload);
      showToast(`Updated ${payload.name}`, 'success');
    } else {
      addMenuItem(payload);
      showToast(`Added new dish ${payload.name}`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteMenuItem(item.id);
      showToast(`Deleted ${item.name}`, 'info');
    }
  };

  const filteredItems = items.filter(
    i =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Top Header & Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search menu dishes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontSize: '0.82rem',
              outline: 'none',
            }}
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
        >
          <Plus size={16} />
          <span>Add Real Dish</span>
        </button>
      </div>

      {/* Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredItems.map(item => {
          const cat = categories.find(c => c.id === item.categoryId);
          const prepText = item.minPrepTime && item.maxPrepTime
            ? `${item.minPrepTime}–${item.maxPrepTime} min`
            : item.prepTime || '15–20 min';

          return (
            <div
              key={item.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                opacity: item.isAvailable ? 1 : 0.6,
              }}
            >
              {/* Thumbnail and Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.isVeg ? (
                      <span className="veg-indicator" style={{ width: '12px', height: '12px' }}><span className="veg-indicator-dot" style={{ width: '5px', height: '5px' }} /></span>
                    ) : (
                      <span className="non-veg-indicator" style={{ width: '12px', height: '12px' }}><span className="non-veg-indicator-triangle" style={{ borderLeftWidth: '3px', borderRightWidth: '3px', borderBottomWidth: '5px' }} /></span>
                    )}
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </h4>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span>{cat?.name || 'Dish'}</span>
                    <span>•</span>
                    <span style={{ fontWeight: 700, color: theme.primaryColor || '#c98a2c' }}>{currency}{item.price}</span>
                    <span>•</span>
                    <span style={{ color: '#cbd5e1' }}>⏱ {prepText}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => toggleItemAvailability(item.id)}
                  title={item.isAvailable ? 'Mark as Out of Stock' : 'Mark as Available'}
                  style={{
                    background: item.isAvailable ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: 'none',
                    color: item.isAvailable ? '#22c55e' : '#ef4444',
                    padding: '6px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  {item.isAvailable ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>

                <button
                  onClick={() => handleOpenEdit(item)}
                  title="Edit Dish"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '6px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <Edit2 size={15} />
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  title="Delete Dish"
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: 'none',
                    color: '#ef4444',
                    padding: '6px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay active" onClick={() => setIsModalOpen(false)}>
          <div
            className="bottom-sheet"
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: '92vh', padding: '20px', color: '#ffffff', background: '#141720' }}
          >
            <div className="sheet-handle" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: theme.fontHeading || "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700 }}>
                {editingItem ? 'Edit Menu Item' : 'Add New Real Dish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
              
              {/* Dish Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shahi Chicken Dum Biryani"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              {/* Category & Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: '#1c202a',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                    }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
                    Price ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
              </div>

              {/* Preparation Time: Min Time & Max Time */}
              <div style={{ background: 'rgba(201, 138, 44, 0.08)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(201, 138, 44, 0.2)' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: theme.primaryColor || '#c98a2c', marginBottom: '8px' }}>
                  ⏱ Estimated Preparation Time (Minutes)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block', marginBottom: '3px' }}>Minimum Time (min)</span>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={formData.minPrepTime}
                      onChange={e => setFormData({ ...formData, minPrepTime: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: '#1c202a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block', marginBottom: '3px' }}>Maximum Time (min)</span>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={formData.maxPrepTime}
                      onChange={e => setFormData({ ...formData, maxPrepTime: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: '#1c202a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '6px' }}>
                  Customer will see: <b>⏱ {formData.minPrepTime}–{formData.maxPrepTime} min</b>
                </div>
              </div>

              {/* Real Food Photograph URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
                  Real Food Photograph URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              {/* Meaningful Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
                  Meaningful Description (Explain clearly what customer is getting)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Boneless chicken cooked with fragrant basmati rice, caramelized onions, and saffron..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Preparation Style */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
                  Preparation Style & Technique
                </label>
                <input
                  type="text"
                  placeholder="e.g. Slow-cooked in sealed clay handi over wood charcoal embers"
                  value={formData.preparationStyle}
                  onChange={e => setFormData({ ...formData, preparationStyle: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              {/* Ingredients */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
                  Key Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Basmati Rice, Chicken, Saffron, Desi Ghee, Cardamom"
                  value={formData.ingredientsStr}
                  onChange={e => setFormData({ ...formData, ingredientsStr: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              {/* Serving Size & Calories */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
                    Serving Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Serves 1–2 (600g)"
                    value={formData.serving}
                    onChange={e => setFormData({ ...formData, serving: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
                    Calories (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 580 kcal"
                    value={formData.calories}
                    onChange={e => setFormData({ ...formData, calories: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Dietary Checkboxes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#e5e7eb', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={e => setFormData({ ...formData, isVeg: e.target.checked })}
                  />
                  <span>🌱 Pure Vegetarian</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#e5e7eb', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={e => setFormData({ ...formData, isBestseller: e.target.checked })}
                  />
                  <span>⭐ Bestseller Badge</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#e5e7eb', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isChefSpecial}
                    onChange={e => setFormData({ ...formData, isChefSpecial: e.target.checked })}
                  />
                  <span>👨‍🍳 Chef's Special</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#e5e7eb', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                  />
                  <span>✅ Available in Kitchen</span>
                </label>
              </div>

              {/* Spice Level Range */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>
                  Spice Level (0: Mild, 1: Medium, 2: Spicy, 3: Hot)
                </label>
                <input
                  type="range"
                  min={0}
                  max={3}
                  value={formData.isSpicy}
                  onChange={e => setFormData({ ...formData, isSpicy: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#9ca3af' }}>
                  <span>0 (Mild)</span>
                  <span>1 (Medium)</span>
                  <span>2 (Spicy)</span>
                  <span>3 (Extra Hot 🌶)</span>
                </div>
              </div>

              {/* Save CTA */}
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '8px' }}
              >
                {editingItem ? 'Save Changes' : 'Add Item to Menu'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
