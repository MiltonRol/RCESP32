#ifndef CLASSCAR_H
#define CLASSCAR_H
// Antes: "#ifndef ClassCar" sin #define (la guarda no hacía nada) y se incluía
// <WMath.cpp> (un .cpp, error). Con Arduino.h basta para map(), pinMode...

#include <Arduino.h>
#include <ESP32Servo.h>

class Car {
private:
    // Pines (se guardan para usarlos en cada método)
    short _pinVel, _pinFwd, _pinBwd, _pinServo, _pinBat;

    // Antes se guardaba el resultado del PWM en el mismo campo que el pin (_motorVel):
    // se pisaba el número de pin. Ahora son campos separados.
    int _velActual = 0;     // último valor PWM aplicado (0..1023)
    int _dirActual = 90;    // último ángulo aplicado al servo (0..180)

    Servo _servo;           // el servo es del coche, no una variable global

public:
    Car(short pinVel, short pinFwd, short pinBwd, short pinServo, short pinBat);

    void begin();                       // configura pines, PWM y servo
    void setVelocidad(int vel);         // vel: -100..100 -> mueve el motor
    void setDireccion(int dir);         // dir: -100..100 -> mueve el servo
    void parar();                       // motor a 0 y servo al centro
    float leerBateria();                // devuelve voltios
};

#endif
