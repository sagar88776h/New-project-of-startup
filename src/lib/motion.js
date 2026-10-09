/**
 * Central Motion Design System for Devi QR Dining Experience
 * Consistent timing curves, accessible reduced-motion safeguards, and reusable Framer Motion variants.
 */

export const TRANSITION_EASE = [0.22, 1, 0.36, 1];

export const defaultTransition = {
  duration: 0.5,
  ease: TRANSITION_EASE,
};

export const springTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 28,
};

export const smoothSpring = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
};

// Reusable motion variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      duration: custom.duration || 0.45,
      delay: custom.delay || 0,
      ease: TRANSITION_EASE,
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration || 0.55,
      delay: custom.delay || 0,
      ease: TRANSITION_EASE,
    },
  }),
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration || 0.5,
      delay: custom.delay || 0,
      ease: TRANSITION_EASE,
    },
  }),
  exit: {
    opacity: 0,
    y: -15,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (custom = {}) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: custom.duration || 0.45,
      delay: custom.delay || 0,
      ease: TRANSITION_EASE,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: (custom = {}) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: custom.duration || 0.5,
      delay: custom.delay || 0,
      ease: TRANSITION_EASE,
    },
  }),
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: (custom = {}) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: custom.duration || 0.5,
      delay: custom.delay || 0,
      ease: TRANSITION_EASE,
    },
  }),
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export const staggerContainer = (staggerAmount = 0.08, delayChildren = 0.05) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerAmount,
      delayChildren: delayChildren,
    },
  },
});

export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

export const bottomSheetVariants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 28,
      stiffness: 320,
    },
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: { duration: 0.25, ease: [0.32, 0, 0.67, 0] },
  },
};

export const cardHoverVariants = {
  rest: { y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  hover: {
    y: -4,
    scale: 1.015,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
};

export const buttonTap = {
  scale: 0.96,
  transition: { duration: 0.1 },
};

export const standardViewport = {
  once: true,
  amount: 0.18,
};
