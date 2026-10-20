#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>          // servidor HTTP incluido en el core de ESP32 (sirve la web)
#include <WebSocketsServer.h>   // lib links2004/WebSockets (control + telemetría)
#include "Config.h"
#include "ClassCar.h"

WebSocketsServer websocket(SOCKET_PORT);
WebServer web(WEB_PORT);
Car coche(PIN_VELOCIDAD, PIN_MOTOR_FWD, PIN_MOTOR_BWD, SERVO_ATTACH, BATERIA);

unsigned long ultimaOrden = 0;      // millis() de la última orden "drive" recibida
unsigned long ultimaTelemetria = 0; // millis() del último envío de batería

// ---------------------------------------------------------------
// Procesa un mensaje del navegador. Formato (ver app.js, función send()):
//   {"t":"drive","v":-100..100,"d":-100..100}
// ---------------------------------------------------------------
void procesarMensaje(const char* json) {
    // TODO: extrae v y d del texto. Opciones:
    //   a) lib ArduinoJson (añádela a lib_deps de platformio.ini): deserializeJson(doc, json)
    //   b) sin librerías: sscanf(json, "{\"t\":\"drive\",\"v\":%d,\"d\":%d}", &v, &d)
    //      (más simple, pero frágil: depende del orden exacto de las claves)
    // TODO: llama a coche.setVelocidad(v) y coche.setDireccion(d).
    // TODO: actualiza ultimaOrden = millis() (alimenta el fail-safe del loop).
}

// Callback de eventos del WebSocket
void eventoWebSocket(uint8_t cliente, WStype_t tipo, uint8_t* payload, size_t longitud) {
    switch (tipo) {
        case WStype_CONNECTED:
            // TODO: Serial.printf para avisar de que se conectó el cliente.
            break;
        case WStype_DISCONNECTED:
            // TODO: coche.parar(); (si se cae el cliente, el coche NO puede seguir acelerando)
            break;
        case WStype_TEXT:
            // TODO: procesarMensaje((const char*)payload);
            break;
        default:
            break;
    }
}

void conectarWifi() {
    // TODO: WiFi.mode(WIFI_STA); WiFi.begin(SSID, PASSWIFI);
    //       espera con while (WiFi.status() != WL_CONNECTED) { delay(300); }
    //       e imprime WiFi.localIP() por Serial (esa IP es la que abres en el navegador).
    // IDEA alternativa: modo AP (WiFi.softAP) para usarlo en el campo sin router;
    //       la IP sería 192.168.4.1 (la que ya hay como valor por defecto en app.js).
}

void configurarWeb() {
    // TODO: sirve index.html, app.js y style.css en el puerto WEB_PORT.
    //   Paso 1: crea la carpeta "data/" junto a platformio.ini y mueve ahí los 3 ficheros
    //           (PlatformIO sólo sube a LittleFS lo que haya en data/).
    //   Paso 2: añade  board_build.filesystem = littlefs  en platformio.ini.
    //   Paso 3: #include <LittleFS.h>, LittleFS.begin(), y
    //           web.serveStatic("/", LittleFS, "/", "no-cache"); web.begin();
    //   Paso 4: sube los ficheros con "Upload Filesystem Image" de PlatformIO.
    //   Nota: si abres la web desde el puerto 2000, app.js usa location.hostname para
    //         encontrar el WebSocket en el 1999, así que no hay que tocar nada más.
}

void setup() {
    Serial.begin(115200);       // antes 9600: sube la velocidad y cambia monitor_speed en platformio.ini
    coche.begin();

    // TODO: conectarWifi();
    // TODO: configurarWeb();
    // TODO: websocket.begin(); websocket.onEvent(eventoWebSocket);
}

void loop() {
    // TODO: websocket.loop(); y web.handleClient(); (sin esto no atienden a nadie)

    // TODO FAIL-SAFE: si millis() - ultimaOrden > TIMEOUT_MS => coche.parar().
    //       app.js reenvía la orden cada 250 ms, así que 500 ms sin nada = enlace perdido.

    // TODO TELEMETRÍA: cada TELEMETRIA_MS envía la batería a todos los clientes:
    //       websocket.broadcastTXT("{\"bat\":7.40}") con el valor de coche.leerBateria().
    //       Pista: String(valor, 2) para 2 decimales. Evita delay() para no bloquear el loop.
}
