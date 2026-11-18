// Curvas y variantes compartidas para que toda la app se mueva igual.
export const EASE = [0.16, 1, 0.3, 1]
export const EASE_SOFT = [0.22, 0.61, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
}

export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE },
  },
}

/** Contenedor que escalona la entrada de sus hijos. */
export const container = (delayChildren = 0, staggerChildren = 0.08) => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
})
