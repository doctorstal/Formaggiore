#include "proto/device.pb.h"
#include "proto/device.pb.c"

#define PROTOCOL_VERSION 1

struct SensorType {
  const String token;
  const String defaultName;
  const int minValue;
  const int maxValue;
};

struct SensorType firstSensorType = {"c820201f-99d3-4e70-b4b1-c5b10ff15acf", "Inducttion Heater", 0, 100};

void setup() {
    Serial.begin(9600);
    Serial.println("Basic Formaggiore device implementation.");
    Serial.println("I have this sensor (or should I say control element?):");
    Serial.println(firstSensorType.token);
    Serial.println(firstSensorType.defaultName);
    Serial.println(firstSensorType.minValue);
    Serial.println(firstSensorType.maxValue);
sendSensorTypesResponse();
}

void loop() {
  // put your main code here, to run repeatedly:

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


void serialEvent() {
  while (Serial.available()) {
    if(Serial.read() == Markup_MESSAGE_START)
      handleMessage();
  }
}

bool handleMessage() {
  int message = Serial.read();
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
    default: return false;
  }
  // Should we read till Markup_MESSAGE_END if we do not need to? Probably yes!
  while(message != Markup_MESSAGE_END) 
    message = (Messages) Serial.read();
  
  return true;
}


