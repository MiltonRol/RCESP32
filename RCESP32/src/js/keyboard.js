// Fuente de entrada: teclado. Valores v,d de -1 a 1.
export const keys = { v: 0, d: 0, active: false };

const KEYS = {
    w: 'f', arrowup: 'f', s: 'b', arrowdown: 'b',
    a: 'l', arrowleft: 'l', d: 'r', arrowright: 'r', ' ': 'brake'
};
const pressed = new Set();

export function initKeyboard() {
    addEventListener('keydown', (e) => {
        const k = KEYS[e.key.toLowerCase()];
        if (!k) return;
        e.preventDefault();
        pressed.add(k);
    });
    addEventListener('keyup', (e) => {
        const k = KEYS[e.key.toLowerCase()];
        if (k) pressed.delete(k);
    });
    addEventListener('blur', () => pressed.clear()); // al perder foco, suelta todo (seguridad)
}

/** Se llama en cada frame para traducir las teclas pulsadas a v,d. */
export function readKeyboard() {
    const brake = pressed.has('brake');
    keys.v = brake ? 0 : (pressed.has('f') ? 1 : 0) - (pressed.has('b') ? 1 : 0);
    keys.d = (pressed.has('r') ? 1 : 0) - (pressed.has('l') ? 1 : 0);
    keys.active = pressed.size > 0;
}
