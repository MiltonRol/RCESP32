import { $, dz } from './utils.js';

// Fuente de entrada: mando PS4 / Xbox.
export const gamepad = { v: 0, d: 0, active: false };

const MODO_DEFECTO = '⌨️ Teclado / 🖱️ Ratón';

export function initGamepad() {
    addEventListener('gamepadconnected', () => ($('inputMode').textContent = '🎮 Mando conectado'));
    addEventListener('gamepaddisconnected', () => ($('inputMode').textContent = MODO_DEFECTO));
}

// El navegador normaliza ambos mandos al "standard mapping":
//   axes[0] = stick izq. X | buttons[7] = RT/R2 | buttons[6] = LT/L2 | buttons[0] = A/✕
export function readGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = [...pads].find((p) => p && p.connected);
    if (!gp) { gamepad.active = false; gamepad.v = gamepad.d = 0; return; }

    const rt = gp.buttons[7]?.value ?? 0;
    const lt = gp.buttons[6]?.value ?? 0;
    const brake = gp.buttons[0]?.pressed;
    gamepad.d = dz(gp.axes[0] ?? 0);
    gamepad.v = brake ? 0 : rt - lt;
    // El mando "toma el control" sólo si se toca algo (evita ruido de sticks sueltos)
    gamepad.active = brake || Math.abs(gamepad.v) > 0.05 || gamepad.d !== 0;
    $('inputMode').textContent = `🎮 ${gp.id.split('(')[0].trim().slice(0, 28)}`;
}
