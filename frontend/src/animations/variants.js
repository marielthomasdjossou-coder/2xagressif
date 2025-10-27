export const slowFadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] }
  }
};

export const slowScaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] }
  }
};

export const slowStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2, when: 'beforeChildren' }
  }
};
