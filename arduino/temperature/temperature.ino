#include "proto/device.pb.h"
#include "proto/device.pb.c"
#include <OneWire.h>
#include <DallasTemperature.h>

int TEMPERATURE = 3;
int BUZZER = 12;

int a = 4;
int b = 5;  //For displaying segment "b"
int c = 6;  //For displaying segment "c"
int d = 7;  //For displaying segment "d"
int e = 8;  //For displaying segment "e"
int f = 9;  //For displaying segment "f"
int g = 10;  //For displaying segment "g"
int h = 11;  //For displaying dot

OneWire oneWire(TEMPERATURE);
// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

// arrays to hold device address
DeviceAddress insideThermometer;


#define PROTOCOL_VERSION 1

struct SensorType {
  const String token;
  const String defaultName;
  const int minValue;
  const int maxValue;
};

struct SensorType firstSensorType = {"c820201f-99d3-4e70-b4b1-c5b10ff15acf", "Induction Heater", 0, 100};

String inputString = "";

int startValue;
int endValue;
int dTime;
float powerMultiplier = 0;



void turnOff()
{
  digitalWrite(a,LOW);
  digitalWrite(b,LOW);
  digitalWrite(c,LOW);
  digitalWrite(d,LOW);
  digitalWrite(e,LOW);
  digitalWrite(f,LOW);
  digitalWrite(g,LOW);
  digitalWrite(h,LOW);
}

void displayDigit(float input)
{
  int digit = input;
  turnOff();
 //Conditions for displaying segment a
 if(digit!=1 && digit != 4)
 digitalWrite(a,HIGH);
 
 //Conditions for displaying segment b
 if(digit != 5 && digit != 6)
 digitalWrite(b,HIGH);
 
 //Conditions for displaying segment c
 if(digit !=2)
 digitalWrite(c,HIGH);
 
 //Conditions for displaying segment d
 if(digit != 1 && digit !=4 && digit !=7)
 digitalWrite(d,HIGH);
 
 //Conditions for displaying segment e 
 if(digit == 2 || digit ==6 || digit == 8 || digit==0)
 digitalWrite(e,HIGH);
 
 //Conditions for displaying segment f
 if(digit != 1 && digit !=2 && digit!=3 && digit !=7)
 digitalWrite(f,HIGH);
 if (digit!=0 && digit!=1 && digit !=7)
 digitalWrite(g,HIGH);

 if (input - digit > .4)
 digitalWrite(h, HIGH);
 
}

void setup() {
    pinMode(BUZZER, OUTPUT);

    pinMode(a, OUTPUT);  //A
    pinMode(b, OUTPUT);  //B
    pinMode(c, OUTPUT);  //C
    pinMode(d, OUTPUT);  //D
    pinMode(e, OUTPUT);  //E
    pinMode(f, OUTPUT);  //F
    pinMode(g, OUTPUT);  //G
    pinMode(h, OUTPUT);  //G
      
    Serial.begin(9600);
    Serial.println("Basic Formaggiore device implementation.");
    Serial.println("I have this sensor:");
    Serial.println(firstSensorType.token);
    Serial.println(firstSensorType.defaultName);
    Serial.println(firstSensorType.minValue);
    Serial.println(firstSensorType.maxValue);
  
    sensors.begin();
    Serial.print("Found ");
    Serial.print(sensors.getDeviceCount(), DEC);
    Serial.println(" devices.");
  
    if (!sensors.getAddress(insideThermometer, 0)) Serial.println("Unable to find address for Device 0"); 

}

void loop() {
    float temp = getTemperature();

    if (dTime > 1) {
      
          
      float diff = endValue - temp;
      float pm = 3 * 3.9 * diff / dTime / 2; // 3kg of milk, 3.9kJ/kg*grad thermocapacity of milk, 2kW - nominal heater power
      float pmDiff = powerMultiplier - pm;
      
      Serial.print("We now need change temperature to ");
      Serial.print(endValue);
      Serial.print(" degree in ");
      Serial.print(dTime);
      Serial.println(" seconds.");
      Serial.print("Please, set power to ");
      Serial.print(pm*10);
      Serial.println(".");
      
      if (abs(pmDiff) > 0.05) {
        digitalWrite(BUZZER,  HIGH);
        powerMultiplier = pm;
      } else {
        digitalWrite(BUZZER, LOW);
      }
      displayDigit(pm * 10);
      Serial.println(pm);
      if (dTime <= 1) turnOff();
      dTime--;
    }

    Serial.println(temp);
    delay(1000);

}

float getTemperature()
{
  sensors.requestTemperatures();
  return sensors.getTempC(insideThermometer);
}


void sendMessage(Messages type, const char *message){
  Serial.write(Markup_MESSAGE_START);
  Serial.write(type);
  Serial.write(message, strlen(message));
  Serial.write(Markup_MESSAGE_END);
}
void sendHandshakeResponse() {
  char body[] = {PROTOCOL_VERSION};
      sendMessage(Messages_HANDSHAKE, body);
}
void sendSensorTypesResponse() {
// (len(typeToken)+typeToken+len(defaultName)+defaultName+minValue+maxValue)*
    String b = ((char) firstSensorType.token.length()) + firstSensorType.token 
          +((char) firstSensorType.defaultName.length()) + firstSensorType.defaultName
          + firstSensorType.minValue + firstSensorType.maxValue;
        
    sendMessage(Messages_SENSOR_TYPES, b.c_str());
}

void sendSensorsResponse() {
  // (len(typeToken)+typeToken+id)*
  String b = ((char) firstSensorType.token.length()) + firstSensorType.token + 1;
  sendMessage(Messages_SENSORS, b.c_str());
}

void sendDirectiveAcceptedResponse() {
  char body[] = {true};
  sendMessage(Messages_DIRECTIVE, body);
}

byte readSerial() {
  if (!Serial.available()) delay(100); // Just wait a little if no bytes are available - for new bytes to come
  char c = (char) Serial.read() - '0';
  inputString += (char) (c + '0');
  inputString += "::";
  return c;
}

void serialEvent() {
  while (Serial.available()) {
    if(readSerial() == Markup_MESSAGE_START)
      handleMessage();
  }
  Serial.print("Handled it! ");
  Serial.println(inputString);
  inputString = "";
}

bool handleMessage() {
  inputString+="\nMessage: ";
  int message = readSerial();
  switch(message) {
    case Messages_HANDSHAKE:
      sendHandshakeResponse();
     break;
    case Messages_SENSOR_TYPES:
     sendSensorTypesResponse();
     break;
    case Messages_SENSORS:
     sendSensorsResponse();
     break;
    case Messages_DIRECTIVE:
    {
      int sensorId = readSerial();
      startValue = readSerial();
      endValue = readSerial();
      dTime = readSerial() * 60;
      // TODO we should check if directive is correct here
      sendDirectiveAcceptedResponse();
    }
      break;
    
    default: return false;
  }
  while(readSerial() != Markup_MESSAGE_END && Serial.available()) 
      ;
    inputString += "end.\n";
  
  return true;
}


