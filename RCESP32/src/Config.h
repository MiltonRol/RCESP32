#ifndef CONFIG_H
#define CONFIG_H

// Antes: sin guardas y con variables no-const (SSID, Servo SERVO_RL) definidas en el .h.
// Al incluirlo desde main.cpp Y ClassCar.cpp daba "multiple definition" al enlazar.
// Ahora todo es constexpr (enlace interno) y el objeto Servo vive dentro de Car.

// --------------------
// WIFI
// --------------------
constexpr const char* SSID     = "";   // TODO: pon aquí tu red WiFi
constexpr const char* PASSWIFI = "";   // TODO: y su contraseña

// --------------------
// PUERTOS
// --------------------
constexpr int SOCKET_PORT = 1999;      // WebSocket de control (app.js: CONFIG.SOCKET_PORT)
constexpr int WEB_PORT    = 2000;      // Servidor HTTP que sirve index.html/app.js/style.css

// --------------------
// IN/OUTS DEL PROYECTO
// --------------------
constexpr int PIN_MOTOR_FWD = 1;       // Puente en H: sentido adelante
constexpr int PIN_MOTOR_BWD = 2;       // Puente en H: sentido atrás
constexpr int PIN_VELOCIDAD = 3;       // PWM de velocidad
constexpr int SERVO_ATTACH  = 4;       // Servo de dirección
constexpr int BATERIA       = 5;       // Entrada analógica (divisor de tensión)

// --------------------
// AJUSTES DE CONTROL
// --------------------
constexpr int PWM_CANAL_BITS    = 10;     // 10 bits => 0..1023 (coincide con el map de ClassCar)
constexpr int PWM_FREQ          = 1000;   // Hz
constexpr unsigned long TIMEOUT_MS   = 500;   // sin órdenes durante este tiempo => parar (fail-safe)
constexpr unsigned long TELEMETRIA_MS = 1000; // cada cuánto se envía la batería a la web
constexpr float BAT_FACTOR      = 1.0f;   // TODO: factor del divisor de tensión (calíbralo con un polímetro)

#endif
