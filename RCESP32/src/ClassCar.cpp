#include "ClassCar.h"
#include "Config.h"

Car::Car(short OUT_VELOCIDAD, bool FWD, bool BWD, short SERVO_OUT, short BATERIA_IN){
    _motorVel = OUT_VELOCIDAD;
    _servo_dir = SERVO_OUT;
    _bateria = BATERIA_IN;
    _fwd = FWD;
    _bwd = BWD;
}

void Car::begin(){
    pinMode(_motorVel,OUTPUT);
    pinMode(_servo_dir, OUTPUT);
    pinMode(_bateria,INPUT);
    pinMode(_fwd, OUTPUT);
    pinMode(_bwd, OUTPUT);
}

int Car::escal_velocidad(int vel){

        if (vel > 0){
            digitalWrite(_fwd,true);
            digitalWrite(_bwd,false);
            _motorVel = map(vel,0,100,0,1023);
        }else if(vel == 0){
            digitalWrite(_fwd,false);
            digitalWrite(_bwd,false);
            _motorVel = 0;
        }else{
            digitalWrite(_fwd,false);
            digitalWrite(_bwd,true);
            _motorVel = map(vel,-100,0,0,1023);
        }

        return _motorVel;
    }

int Car::set_direccion(int direccion){
    int out;
    if (direccion >= 0){
    out = map(direccion,0,100,90,180);
    }else{
    out = map(direccion,-100,0,0,90);
    }
    return out;

}
