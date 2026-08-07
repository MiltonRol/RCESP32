// frontend/src/app.js

// === CONFIGURACIÓN ===
const CONFIG = {
    // IP de la ESP32 (en producción usa window.location.origin)
    ESP32_IP: window.location.origin,
    // Puerto del stream de cámara
    CAMERA_PORT: 81,
    // Intervalo de lectura de sensores (ms)
    SENSOR_INTERVAL: 2000
};

// === ESTADO GLOBAL ===
const state = {
    connected: false,
    cameraLoaded: false,
    pressedKeys: new Set()
};

// === MAPEO DE TECLAS ===
const KEY_MAP = {
    'w': 'forward',
    'arrowup': 'forward',
    'a': 'left',
    'arrowleft': 'left',
    's': 'backward',
    'arrowdown': 'backward',
    'd': 'right',
    'arrowright': 'right',
    ' ': 'stop'
};

// === ELEMENTOS DEL DOM ===
const elements = {
    status: document.getElementById('status'),
    statusText: document.querySelector('.status-text'),
    cameraFrame: document.getElementById('cameraFrame'),
    videoPlaceholder: document.getElementById('videoPlaceholder'),
    tempValue: document.getElementById('tempValue'),
    humValue: document.getElementById('humValue'),
    batValue: document.getElementById('batValue'),
    deviceInfo: document.getElementById('deviceInfo')
};

// === FUNCIONES DE API ===

/**
 * Enviar comando de movimiento a la ESP32
 */
async function sendCommand(direction) {
    try {
        const response = await fetch(`${CONFIG.ESP32_IP}/api/move`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ direction })
        });

        if (!response.ok) throw new Error('Error en la respuesta');

        const data = await response.json();
        console.log(`Comando enviado: ${direction}`, data);
        
        updateStatus('connected', `→ ${direction.toUpperCase()}`);
        
    } catch (error) {
        console.error('Error al enviar comando:', error);
        updateStatus('disconnected', 'Error de conexión');
    }
}

/**
 * Enviar comando de acción (claxon, luces, etc.)
 */
async function sendAction(action) {
    try {
        const response = await fetch(`${CONFIG.ESP32_IP}/api/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        });

        if (!response.ok) throw new Error('Error en la respuesta');

        console.log(`Acción enviada: ${action}`);
        
    } catch (error) {
        console.error('Error al enviar acción:', error);
    }
}

/**
 * Leer sensores de la ESP32
 */
async function readSensors() {
    try {
        const response = await fetch(`${CONFIG.ESP32_IP}/api/sensors`);
        
        if (!response.ok) throw new Error('Error al leer sensores');

        const data = await response.json();
        
        // Actualizar valores en el DOM
        if (data.temperature !== undefined) {
            elements.tempValue.textContent = data.temperature.toFixed(1);
        }
        if (data.humidity !== undefined) {
            elements.humValue.textContent = data.humidity.toFixed(0);
        }
        if (data.battery !== undefined) {
            elements.batValue.textContent = data.battery.toFixed(2);
        }

        updateStatus('connected', 'Conectado');
        
    } catch (error) {
        console.error('Error al leer sensores:', error);
        updateStatus('disconnected', 'Desconectado');
    }
}

/**
 * Obtener información del dispositivo
 */
async function getDeviceInfo() {
    try {
        const response = await fetch(`${CONFIG.ESP32_IP}/api/info`);
        const data = await response.json();
        
        if (data.device_id) {
            elements.deviceInfo.textContent = data.device_id;
        }
        
    } catch (error) {
        console.error('Error al obtener info:', error);
    }
}

// === FUNCIONES DE UI ===

/**
 * Actualizar indicador de estado
 */
function updateStatus(status, message) {
    elements.status.className = `status ${status}`;
    elements.statusText.textContent = message;
    state.connected = status === 'connected';
}

/**
 * Cargar stream de cámara
 */
function loadCamera() {
    const cameraUrl = `${window.location.protocol}//${window.location.hostname}:${CONFIG.CAMERA_PORT}/stream`;
    
    elements.cameraFrame.src = cameraUrl;
    
    elements.cameraFrame.onload = () => {
        elements.cameraFrame.style.display = 'block';
        elements.videoPlaceholder.style.display = 'none';
        state.cameraLoaded = true;
        console.log('Cámara cargada correctamente');
    };

    elements.cameraFrame.onerror = () => {
        elements.videoPlaceholder.textContent = '⚠️ Cámara no disponible';
        console.error('Error al cargar cámara');
    };
}

// === EVENTOS DE BOTONES ===

/**
 * Configurar eventos de la cruceta
 */
function setupDpadButtons() {
    document.querySelectorAll('.dpad button').forEach(btn => {
        const direction = btn.dataset.dir;

        // Click normal
        btn.addEventListener('click', () => {
            sendCommand(direction);
        });

        // Touch para móvil
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            btn.classList.add('active');
            sendCommand(direction);
        });

        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            btn.classList.remove('active');
        });
    });
}

/**
 * Configurar botones de acción
 */
function setupActionButtons() {
    document.getElementById('btnHorn').addEventListener('click', () => {
        sendAction('horn');
    });

    document.getElementById('btnLights').addEventListener('click', () => {
        sendAction('lights');
    });
}

// === EVENTOS DE TECLADO ===

/**
 * Manejar tecla presionada
 */
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const direction = KEY_MAP[key];

    if (!direction) return;

    // Evitar repeticiones automáticas
    if (e.repeat) return;

    e.preventDefault(); // Evita scroll con flechas

    // Marcar botón como activo
    const btn = document.querySelector(`[data-dir="${direction}"]`);
    if (btn) btn.classList.add('active');

    state.pressedKeys.add(key);
    sendCommand(direction);
});

/**
 * Manejar tecla liberada
 */
document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    const direction = KEY_MAP[key];

    if (!direction) return;

    const btn = document.querySelector(`[data-dir="${direction}"]`);
    if (btn) btn.classList.remove('active');

    state.pressedKeys.delete(key);
});

// === INICIALIZACIÓN ===

/**
 * Inicializar aplicación
 */
function init() {
    console.log('Inicializando aplicación...');

    // Configurar eventos
    setupDpadButtons();
    setupActionButtons();

    // Cargar cámara
    loadCamera();

    // Obtener info del dispositivo
    getDeviceInfo();

    // Leer sensores periódicamente
    readSensors();
    setInterval(readSensors, CONFIG.SENSOR_INTERVAL);

    // Verificar conexión inicial
    setTimeout(() => {
        if (!state.connected) {
            updateStatus('disconnected', 'Verificando conexión...');
        }
    }, 3000);
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}