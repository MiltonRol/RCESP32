import { CONFIG } from './config.js';
import { $, clamp, dz } from './utils.js';

// Fuente de entrada: ratón/dedo (joystick virtual por arrastre). Valores -1 a 1.
// Es un objeto que se muta (no se reasigna) para que quien lo importe vea los cambios.
export const mouse = { v: 0, d: 0, active: false };

let drag = null; // {x, y} origen del arrastre

function endDrag() {
    drag = null;
    mouse.v = 0; mouse.d = 0; mouse.active = false;
    $('joy').style.display = 'none';
}

export function initMouse() {
    addEventListener('pointerdown', (e) => {
        drag = { x: e.clientX, y: e.clientY };
        const joy = $('joy');
        joy.style.display = 'block';
        joy.style.left = e.clientX + 'px';
        joy.style.top = e.clientY + 'px';
        $('joyKnob').style.transform = 'translate(0,0)';
    });
    addEventListener('pointermove', (e) => {
        if (!drag) return;
        const R = CONFIG.MOUSE_RADIUS;
        const dx = clamp((e.clientX - drag.x) / R, -1, 1);
        const dy = clamp((e.clientY - drag.y) / R, -1, 1);
        mouse.d = dz(dx);
        mouse.v = dz(-dy);      // arrastrar hacia arriba = adelante
        mouse.active = true;
        $('joyKnob').style.transform = `translate(${dx * 60}px, ${dy * 60}px)`;
    });
    addEventListener('pointerup', endDrag);
    addEventListener('pointercancel', endDrag);
}
