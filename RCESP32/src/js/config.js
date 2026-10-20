// === CONFIGURACIÓN ===
// Puertos acordes con Config.h del firmware (SOCKET_PORT = 1999, WEB_PORT = 2000).
const host = window.location.hostname || '192.168.4.1'; // IP de la ESP32 (la que sirve esta web)

export const CONFIG = {
    HOST: host,
    SOCKET_PORT: 1999,                         // WebSocket de control
    CAMERA_URL: `http://${host}:81/stream`,    // stream MJPEG (ajusta si cambia)
    SEND_HZ: 20,              // frecuencia de envío de órdenes
    DEADZONE: 0.12,           // zona muerta del stick/ratón (evita deriva)
    MOUSE_RADIUS: 120,        // px de arrastre para llegar al 100 %
    BAT_MIN: 6.4              // voltaje por debajo del cual se marca "batería baja"
};
