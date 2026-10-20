import { CONFIG } from './config.js';

// Atajo para getElementById
export const $ = (id) => document.getElementById(id);

// Limita x al rango [a, b]
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

// Aplica zona muerta: valores muy pequeños se tratan como 0
export const dz = (x) => (Math.abs(x) < CONFIG.DEADZONE ? 0 : x);
