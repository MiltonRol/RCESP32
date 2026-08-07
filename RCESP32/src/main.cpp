#include <Arduino.h>
#include "Config.h"
#include <WebSocketsServer.h>
#include <ESP32Servo.h>

const char* nombreWifi= SSID;
const char* contraWifi= PASSWIFI;

WebSocketsServer websocket= WebSocketsServer(SOCKET_PORT);

void setup() {
  Serial.begin(9600);
  SERVO_RL.attach(SERVO_ATTACH);
  

  // put your setup code here, to run once:
}

void loop() {
  // put your main code here, to run repeatedly:

}