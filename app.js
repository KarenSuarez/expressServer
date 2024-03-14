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


const validateAutomobileData = (req, res, next) => {
  const { name, license_plate, color } = req.body;

  if (!name || !license_plate || !color) {
      return res.status(400).send('Required fields are missing (name, license_plate, color)');
  }

  const licensePlateRegex = /^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/;
  if (!licensePlateRegex.test(license_plate)) {
      return res.status(400).send('The plate must have the AAA-123 format');
  }
  next();
};


const existingCar = cars.find(car => car.license_plate === license_plate);
if (existingCar) {
    return res.status(400).send('Error: License plate already exists');
  }

app.post('/cars', validateAutomobileData, (req, res) => {
  const { name, license_plate, color } = req.body;
  const timestamp = new Date().toLocaleString();

  const existingCar = cars.find(car => car.license_plate === license_plate);
  if (existingCar) {
      return res.status(400).send('Error: License plate already exists');
  }

  cars.push({ name, license_plate, color, timestamp });
  res.send('Car registered successfully');
});

app.post('/cars', (req, res) => {
    res.status(405).send('Method Not Allowed');
});


app.get('/cars', (req, res) => {
  res.json(cars);

  setTimeout(() => {
    res.json(cars);
  }, 2000); 
  
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