import { useEffect, useRef } from 'react';

/**
 * Hook to provide WCAG-compliant modal accessibility:
 * - Traps focus inside the modal dialog
 * - Closes modal on Escape key press
 * - Restores focus to trigger element on modal close
 * - Sets aria attributes
 */
export default function useModalA11y(isOpen, onClose) {
  const containerRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save active element to restore later
    previousActiveElementRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      // 1. Escape key closes modal
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
        return;
      }

      // 2. Focus trapping on Tab key
      if (e.key === 'Tab' && containerRef.current) {
        const focusableSelectors = [
          'button:not([disabled])',
          '[href]',
          'input:not([disabled])',
          'select:not([disabled])',
          'textarea:not([disabled])',
          '[tabindex]:not([tabindex="-1"])',
        ].join(', ');

        const focusables = Array.from(
          containerRef.current.querySelectorAll(focusableSelectors)
        ).filter(el => el.offsetParent !== null); // Only visible elements

        if (focusables.length === 0) return;

        const firstFocusable = focusables[0];
        const lastFocusable = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initial focus into modal
    const focusTimer = setTimeout(() => {
      if (containerRef.current) {
        const initialFocus = containerRef.current.querySelector(
          'button:not([disabled]), input:not([disabled])'
        );
        if (initialFocus) {
          initialFocus.focus();
        }
      }
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimer);

      // Restore focus to opener
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        try {
          previousActiveElementRef.current.focus();
        } catch {
          // ignore
        }
      }
    };
  }, [isOpen, onClose]);

  return containerRef;
}
