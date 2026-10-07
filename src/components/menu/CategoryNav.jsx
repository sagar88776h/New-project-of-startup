import React, { useRef, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function CategoryNav({ activeCategoryId, onSelectCategory }) {
  const { activeRestaurant } = useRestaurant();
  const navRef = useRef(null);
  const activeTabRef = useRef(null);

  const categories = activeRestaurant.categories.filter(c => c.active);

  // Auto scroll active category chip into view horizontally
  useEffect(() => {
    if (activeTabRef.current && navRef.current) {
      const scrollLeft =
        activeTabRef.current.offsetLeft -
        navRef.current.offsetWidth / 2 +
        activeTabRef.current.offsetWidth / 2;

      navRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeCategoryId]);

  return (
    <div
      style={{
        position: 'sticky',
        top: '48px',
        zIndex: 80,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        background: 'rgba(251, 248, 242, 0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-card-border)',
        padding: '8px 10px 8px',
      }}
    >
      <nav
        className="no-scrollbar"
        ref={navRef}
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '2px',
        }}
      >
        {categories.map(cat => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => onSelectCategory(cat.id)}
              className={`category-circle-chip ${isActive ? 'active' : ''}`}
            >
              {/* Circular Food Thumbnail */}
              <div className="category-circle-thumb">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'rgba(139, 29, 44, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      borderRadius: '50%',
                    }}
                  >
                    {cat.icon || '🍽️'}
                  </div>
                )}
              </div>

              {/* Category Name */}
              <span className="category-circle-name">
                {cat.name}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
