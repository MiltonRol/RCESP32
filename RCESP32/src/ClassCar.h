#ifndef ClassCar

#include <WMath.cpp>
#include <Arduino.h>
class Car{
private:
    short

    _motorVel,
    _servo_dir,
    _bateria;
    
    bool
    _fwd,
    _bwd;
    
    public:
    Car(short _motor,bool _fwd, bool _bwd, short _servo_dir, short _bateria);

    void begin();
    int escal_velocidad(int velocidad);
    int set_direccion(int direccion);
};
#endif