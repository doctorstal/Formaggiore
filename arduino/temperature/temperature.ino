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

String inputString = "";

byte readSerial() {
  if (!Serial.available()) delay(100); // Just wait a little if no bytes are available - for new bytes to come
  char c = (char) Serial.read();
  inputString += c + '0';
  inputString += "::";
  return c;
}

void setup() {
    Serial.begin(9600);
    Serial.println("Basic Formaggiore device implementation.");
    Serial.println("I have this sensor:");
    Serial.println(firstSensorType.token);
    Serial.println(firstSensorType.defaultName);
    Serial.println(firstSensorType.minValue);
    Serial.println(firstSensorType.maxValue);
}

void loop() {
  // put your main code here, to run repeatedly:
  //sendHandshakeResponse();
  Serial.println("Hello!");
  delay(500);

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
    
    default: return false;
  }
  while(readSerial() != Markup_MESSAGE_END && Serial.available()) 
      ;
    inputString += "end.\n";
  
  return true;
}


