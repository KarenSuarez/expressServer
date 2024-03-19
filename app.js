const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const fs = require("fs");
require("dotenv").config();

const IP_ADDRESS_PERSISTENCE = process.env.IP_ADDRESS_PERSISTENCE;
const PORT_PERSISTENCE = process.env.PORT_PERSISTENCE;

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

let cars = [];

const validateAutomobileData = (req, res, next) => {
  const { name, license_plate, color } = req.body;

  if (!name || !license_plate || !color) {
    return res
      .status(400)
      .send("Required fields are missing (name, license_plate, color)");
  }

  const licensePlateRegex = /^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/;
  if (!licensePlateRegex.test(license_plate)) {
    return res.status(400).send("The plate must have the AAA-123 format");
  }
  next();
};

app.post("/cars", validateAutomobileData, async (req, res) => {
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

app.post("/cars", (req, res) => {
  res.status(405).send("Method Not Allowed");
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

const PORT = process.env.PORT;
const IP_ADDRESS = process.env.IP_ADDRESS;

app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Servidor escuchando en http://${IP_ADDRESS}:${PORT}`);
});
