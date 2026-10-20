import { CONFIG } from './config.js';
import { $ } from './utils.js';

/** Carga el stream MJPEG como fondo; reintenta si cae. */
export function loadCamera() {
    const img = $('camera');
    img.onload = () => ($('noSignal').style.display = 'none');
    img.onerror = () => {
        $('noSignal').style.display = 'flex';
        setTimeout(loadCamera, 3000);
    };
    img.src = `${CONFIG.CAMERA_URL}?t=${Date.now()}`; // t evita la caché
}
