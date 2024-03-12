const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
require('dotenv').config();

const IP_ADDRESS = process.env.IP_ADDRESS;
const PORT = process.env.PORT;

app.use(express.json()); 
app.use(cors());

let cars = [];

app.post('/cars', (req, res) => {
    const { name, license_plate, color } = req.body;
    const timestamp = new Date().toLocaleString();

    cars.push({ name, license_plate, color, timestamp });
    res.send('Car registered successfully');
});

app.post('/cars', (req, res) => {
    res.status(405).send('Method Not Allowed');
  });

app.get('/cars', (req, res) => {
  res.json(cars);
});

app.patch('/cars', (req, res) => {
  const { license_plate } = req.body;

  cars = cars.filter(car => car.license_plate !== license_plate);
  res.send('Car removed successfully');
});

app.use((req, res, next) => {
  const currentDate = new Date().toLocaleString();
  if (res.statusCode >= 400) {
    console.error(`${currentDate} - Error: ${res.statusCode} ${res.statusMessage} - ${req.method} ${req.url}`);
    if (res.locals.errorMessage) {
      console.error(`Payload: ${res.locals.errorMessage}`);
    }
  } else {
    console.log(`${currentDate} - ${req.method} ${req.url}`);
    if (req.body) {
      console.log(`Payload: ${JSON.stringify(req.body)}`);
    }
  }
  next();
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Servidor escuchando en http://${IP_ADDRESS}:${PORT}`);
});

