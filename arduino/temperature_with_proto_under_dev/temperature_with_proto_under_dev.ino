#include <pb_arduino.h>

#include <pb.h>
#include <pb_common.h>
#include <pb_decode.h>
#include <pb_encode.h>

#include "proto/device.pb.h"
#include "proto/device.pb.c"

#define PROTOCOL_VERSION 1

pb_istream_s pb_in;
pb_ostream_s pb_out;
    
void setup() {
    Serial.begin(9600);
    
  pb_in = as_pb_istream(Serial);
  pb_out = as_pb_ostream(Serial);
    
    // put your setup code here, to run once:
    //HandshakeRequest mymessage = {1};
    //pb_encode(&pb_out, HandshakeRequest_fields, &mymessage);
    //pb_decode(&pb_in);
}

void loop() {
  // put your main code here, to run repeatedly:

}

void sendMessage(void * response){
  
     
   
  uint8_t buffer[HandshakeRequest_size]; 
  pb_ostream_t ostream = pb_ostream_from_buffer(buffer, sizeof(buffer));  
  pb_encode(&ostream, HandshakeResponse_fields, &response);
  size_t num_written = ostream.bytes_written;
  Serial.write(0x03);
  Serial.write(Messages::Messages_HANDSHAKE);
  Serial.write(num_written);
  for(int i=0; i < num_written; i++){
    Serial.write(buffer[i]); // extra work required for the real protocol
   }
  Serial.write(0x02);
}

void serialEvent() {
  while (Serial.available()) {
    if(Serial.read()==0x03) {
      handleMessage();
    }
    
  }
  Serial.println("new Message");
  HandshakeResponse response = {1 <= PROTOCOL_VERSION};
  sendMessage(&response);
  Serial.println("message end");
}

bool handleMessage() {
  Messages message = (Messages) Serial.read();
  byte len = Serial.read();
  switch(message) {
    case Messages_HANDSHAKE:
    {
      HandshakeRequest request;
      if(!pb_decode(&pb_in, HandshakeRequest_fields, &request)) 
        return false;
      HandshakeResponse response = {request.protocolVersion <= PROTOCOL_VERSION};
      pb_encode(&pb_out, HandshakeResponse_fields, &response); 
    } break;
    case Messages_SENSOR_TYPES:
    {
      SensorTypesRequest request;
      if(!pb_decode(&pb_in, SensorTypesRequest_fields, &request))
        return false;
        SensorTypesResponse response = {};
    } break;
    default: return false;
  }
  return true;
}

