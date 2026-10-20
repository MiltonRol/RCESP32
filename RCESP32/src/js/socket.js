import { CONFIG } from './config.js';
import { $ } from './utils.js';

let ws = null;

function setConn(cls, text) {
    $('conn').className = `chip ${cls}`;
    $('connText').textContent = text;
}

/** Abre el WebSocket y reconecta solo si se cae. */
export function connect() {
    ws = new WebSocket(`ws://${CONFIG.HOST}:${CONFIG.SOCKET_PORT}`);
    ws.onopen = () => setConn('ok', 'Conectado');
    ws.onclose = () => {
        setConn('bad', 'Desconectado');
        setTimeout(connect, 2000);        // reintento automático
    };
    ws.onerror = () => ws.close();
    ws.onmessage = (e) => {
        // Telemetría esperada del coche: {"bat": 7.4}
        try {
            const m = JSON.parse(e.data);
            if (m.bat !== undefined) {
                $('batValue').textContent = Number(m.bat).toFixed(2);
                $('battery').classList.toggle('low', m.bat < CONFIG.BAT_MIN);
            }
        } catch { /* mensaje no JSON: se ignora */ }
    };
}

/**
 * Envía el comando. Protocolo: {"t":"drive","v":-100..100,"d":-100..100}
 * v = velocidad (+ adelante / - atrás), d = dirección (- izq / + der),
 * los mismos rangos que usa Car::setVelocidad y Car::setDireccion.
 */
export function send(v, d) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ t: 'drive', v, d }));
    }
}
