#include "ClassCar.h"
#include "Config.h"

Car::Car(short pinVel, short pinFwd, short pinBwd, short pinServo, short pinBat)
    : _pinVel(pinVel), _pinFwd(pinFwd), _pinBwd(pinBwd), _pinServo(pinServo), _pinBat(pinBat) {}

void Car::begin() {
    // TODO: pinMode OUTPUT para _pinFwd y _pinBwd, y INPUT para _pinBat.
    //       (el pin de velocidad y el servo NO se configuran con pinMode: ver abajo)

    // TODO: configura el PWM del motor. Pista (core Arduino-ESP32 3.x, el que usa tu platformio):
    //       ledcAttach(_pinVel, PWM_FREQ, PWM_CANAL_BITS);
    //       Se usa PWM (no digitalWrite) para poder variar la velocidad.

    // TODO: _servo.attach(_pinServo); y déjalo centrado con setDireccion(0).
    //       Pista: ESP32Servo suele necesitar ESP32PWM::allocateTimer(0) antes de attach.
}

void Car::setVelocidad(int vel) {
    // TODO: limita vel a -100..100 con constrain().
    // TODO: según el signo, pon _pinFwd/_pinBwd (adelante: 1/0, atrás: 0/1, parado: 0/0)
    //       con digitalWrite.
    // TODO: calcula el PWM con map() sobre el VALOR ABSOLUTO (abs(vel)) -> 0..1023.
    //       Ojo, trampa del código antiguo: map(vel,-100,0,0,1023) daba el PWM invertido
    //       en marcha atrás (-100 daba 0 y 0 daba 1023). Usar abs() lo evita.
    // TODO: aplícalo con ledcWrite(_pinVel, pwm) y guarda el valor en _velActual.
}

void Car::setDireccion(int dir) {
    // TODO: limita dir a -100..100.
    // TODO: conviértelo a ángulo 0..180 con UN solo map(dir, -100, 100, 0, 180)
    //       (centro = 90). El código antiguo lo hacía en dos tramos y devolvía el valor
    //       sin mover nada.
    // TODO (opcional): limita el ángulo (p.ej. 45..135) para no forzar la mecánica.
    // TODO: _servo.write(angulo) y guarda en _dirActual.
}

void Car::parar() {
    // TODO: llama a setVelocidad(0) y setDireccion(0).
    //       Se usa en el fail-safe cuando se pierde la conexión.
}

float Car::leerBateria() {
    // TODO: analogReadMilliVolts(_pinBat) devuelve mV ya calibrados en ESP32.
    //       Conviértelo a voltios (/1000.0) y multiplica por BAT_FACTOR (divisor de tensión).
    return 0.0f;
}
