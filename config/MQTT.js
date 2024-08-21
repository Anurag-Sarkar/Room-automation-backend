const mqtt = require("mqtt") 

const mqttOptions = {
    host: '8a6c82add09241c481ed0beb7e30bf47.s1.eu.hivemq.cloud',
    port: 8883, // Usually 8883 for secure connections
    protocol: 'mqtts',
    username: 'anurag',
    password: 'Arduino2560'
};
const topics = [
    '53db21b6-cfd4-46ed-81c0-7b4425b3a416',
    "9b07e99d-10f6-483e-b87e-35b3af7f078c/ack",
    "d3d4c4bd-f251-4b05-98c4-4b321a4736d9/ack",
    "a25c3b74-9c8f-4f4b-aef4-1a4a2c8c7309/ack",
    "b9f4f8c6-ea6e-4a29-b4f9-1b5c8c8c7f0d/ack",
    "devices/status"
];

const client = mqtt.connect(mqttOptions);
console.log("connecting to MQTT server")
client.on('connect', () => {
    console.log('Connected to HiveMQ MQTT Broker');
    client.subscribe(topics, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Subscribed to topics:', topics);
        }
    });
});


module.exports = client