import { $ } from './utils.js';

/** Actualiza acelerador y dirección del HUD (v y d en -100..100). */
export function updateHud(v, d) {
    $('thrValue').textContent = v;
    $('thrFwd').style.height = Math.max(v, 0) + '%';
    $('thrBwd').style.height = Math.max(-v, 0) + '%';
    $('steerValue').textContent = d;
    // La aguja se mueve ±50 % del ancho de la barra
    $('steerNeedle').style.left = (50 + d / 2) + '%';
}
