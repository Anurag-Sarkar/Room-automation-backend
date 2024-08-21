var express = require('express');
var router = express.Router();
var mqtt = require("../config/MQTT.js")
const client = require("../config/MQTT.js")
const tempModel = require("../Models/temprature.js");
const devices = {
  "9b07e99d-10f6-483e-b87e-35b3af7f078c":"Light bulb",
  "a25c3b74-9c8f-4f4b-aef4-1a4a2c8c7309":"Tubelight",
  "b9f4f8c6-ea6e-4a29-b4f9-1b5c8c8c7f0d":"Fan",
  "d3d4c4bd-f251-4b05-98c4-4b321a4736d9":"Bulb",
}
const light = "9b07e99d-10f6-483e-b87e-35b3af7f078c"
const bulb = "d3d4c4bd-f251-4b05-98c4-4b321a4736d9"
const fan = "b9f4f8c6-ea6e-4a29-b4f9-1b5c8c8c7f0d"
const tubelight = "a25c3b74-9c8f-4f4b-aef4-1a4a2c8c7309"

router.get('/', async (req, res) => {
  const temp = await tempModel.find()
  res.status(200).json({devices,temperature:temp[0]})
})

router.get('/status', async (req, res) => {
  try{
    mqtt.publish("status")
    const ackMessage = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout waiting for acknowledgment'));
      }, 5000); // 5 seconds timeout
      client.on('message', (topic, data) => {
        if (topic === `devices/status`) {
          clearTimeout(timeout); // Clear the timeout if acknowledgment is received
          resolve(data.toString());
        }
      });
    });
    return res.status(200).json({ message: 'Success', data: JSON.parse(ackMessage) });
  } catch (error) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
})

client.on('message', async (topic, temp) => {
  if (topic === `53db21b6-cfd4-46ed-81c0-7b4425b3a416`) {
    const model = await tempModel.find()
    console.log(model)
    if(model.length == 0){
      const data = await tempModel.create({
        temperature:[temp.toString()]
      })
    }else{
      const data = await tempModel.findById(model[0]._id)
      data.temperature.unshift(temp.toString())
      data.save()
    }
  }
});

router.post('/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    client.publish(req.params.id, req.body.state.toString());
    const ackMessage = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout waiting for acknowledgment'));
      }, 5000); // 5 seconds timeout

      client.on('message', (topic, data) => {
        console.log(topic)
        if (topic == `${req.params.id}/ack`) {
          clearTimeout(timeout); // Clear the timeout if acknowledgment is received
          resolve(data.toString());
        }
      });

    });
    return res.status(200).json({ message: 'Success', data: ackMessage });
  } catch (error) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
});


module.exports = router;
