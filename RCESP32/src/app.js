// Punto de entrada: sólo orquesta los módulos de ./js/
import { CONFIG } from './js/config.js';
import { clamp } from './js/utils.js';
import { connect, send } from './js/socket.js';
import { loadCamera } from './js/camera.js';
import { updateHud } from './js/hud.js';
import { initKeyboard, readKeyboard, keys } from './js/keyboard.js';
import { initMouse, mouse } from './js/mouse.js';
import { initGamepad, readGamepad, gamepad } from './js/gamepad.js';

let last = { v: null, d: null };   // último comando enviado (para no repetir)
let lastSent = 0;

function loop(now) {
    readKeyboard();
    readGamepad();

    // Prioridad: mando > ratón > teclado. Si nadie actúa, queda parado (0,0).
    const src = [gamepad, mouse, keys].find((s) => s.active) || { v: 0, d: 0 };
    const v = Math.round(clamp(src.v, -1, 1) * 100);
    const d = Math.round(clamp(src.d, -1, 1) * 100);

    updateHud(v, d);

    // Envía a SEND_HZ, y siempre que cambie; también como "latido" para que el coche
    // pueda detenerse solo si deja de recibir órdenes (fail-safe en el firmware).
    if (now - lastSent >= 1000 / CONFIG.SEND_HZ) {
        if (v !== last.v || d !== last.d || now - lastSent > 250) {
            send(v, d);
            last = { v, d };
        }
        lastSent = now;
    }
    requestAnimationFrame(loop);
}

// === INICIO ===
initKeyboard();
initMouse();
initGamepad();
connect();
loadCamera();
requestAnimationFrame(loop);
