const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT;
const IP_ADDRESS = process.env.IP_ADDRESS;
const IP_ADDRESS_PERSISTENCE = process.env.IP_ADDRESS_PERSISTENCE;
const PORT_PERSISTENCE = process.env.PORT_PERSISTENCE;
const SERVER_NAME = process.env.SERVER_NAME;
const MONITOR_IP = process.env.MONITOR_IP;
const MONITOR_PORT = process.env.MONITOR_PORT;
const PORT_HOST= process.env.PORT_HOST;
const HOST_IP= process.env.HOST_IP;
const BALANCER_IP= process.env.BALANCER_IP;
const BALANCER_PORT= process.env.BALANCER_PORT;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const currentDate = new Date().toISOString();
  if (res.statusCode >= 400) {
    console.error(
      `${currentDate} - Error: ${res.statusCode} ${res.statusMessage} - ${req.method} ${req.url}`
    );
    if (res.locals.errorMessage) {
      console.error(`Payload: ${JSON.stringify(res.locals.errorMessage)}`);
    }
  } else {
    console.log(`${currentDate} - ${req.method} ${req.url}`);
    if (req.body) {
      console.log(`Payload: ${JSON.stringify(req.body)}`);
    }
  }
  next();
});

app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy");
});

let registered = false;

const registerServer = async () => {
  try {
    const response = await axios.post(`http://${MONITOR_IP}:${MONITOR_PORT}/register`, {
      name: SERVER_NAME,
      ip: HOST_IP,
      port: PORT_HOST,
    });
    console.log("Server registered successfully in monitor:", response.data);

    if (BALANCER_IP && BALANCER_PORT) {
      const balancerResponse = await axios.post(`http://${BALANCER_IP}:${BALANCER_PORT}/registerServer`, {
        ip: HOST_IP,
        port: PORT_HOST,
      });
      console.log("Server registered successfully in balancer:", balancerResponse.data);
    } else {
      console.log("Balancer IP and port not defined, skipping registration in the balancer.");
    }

    registered = true;
  } catch (error) {
    console.error("Error registering server:", error.response?.data || error.message);
    registered = false;
  }
};

registerServer();

app.post("/cars", async (req, res) => {
  try {
    const { name, license_plate, color } = req.body;
    const response = await axios.post(
      `http://${IP_ADDRESS_PERSISTENCE}:${PORT_PERSISTENCE}/cars`,
      { name, license_plate, color }
    );
    res.send(response.data);
  } catch (error) {
    console.error("Error registering car:", error);
    res.status(500).send("Error registering car");
  }
});

app.get("/cars", async (req, res) => {
  try {
    const response = await axios.get(
      `http://${IP_ADDRESS_PERSISTENCE}:${PORT_PERSISTENCE}/cars`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error getting cars:", error);
    res.status(500).send("Error getting cars");
  }
});

app.delete("/cars/:license_plate", async (req, res) => {
  try {
    const { license_plate } = req.params;
    const response = await axios.delete(
      `http://${IP_ADDRESS_PERSISTENCE}:${PORT_PERSISTENCE}/cars/${license_plate}`
    );
    res.send(response.data);
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).send("Error deleting car");
  }
});

app.patch("/cars", (req, res) => {
  const { license_plate } = req.body;

  cars = cars.filter((car) => car.license_plate !== license_plate);
  res.send("Car removed successfully");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Servidor escuchando en http://${IP_ADDRESS}:${PORT}`);
});
