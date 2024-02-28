const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');

const IP_ADDRESS = 'localhost'

app.use(express.json()); 
app.use(cors());

let cars = [];

// Endpoint para registrar el ingreso de un carro
app.post('/cars', (req, res) => {
    const { name, license_plate, color } = req.body;
    const timestamp = new Date().toLocaleString();

    cars.push({ name, license_plate, color, timestamp });
    res.send('Car registered successfully');
});


app.post('/cars', (req, res) => {
    res.status(405).send('Method Not Allowed');
  });

// Endpoint para listar los vehículos registrados
app.get('/cars', (req, res) => {
  res.json(cars);
});

// Endpoint para retirar un carro
app.patch('/cars', (req, res) => {
  const { license_plate } = req.body;

  cars = cars.filter(car => car.license_plate !== license_plate);
  res.send('Car removed successfully');
});


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toLocaleString()}`);
  next();
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


const PORT = process.env.PORT || 3000;
app.listen(3000, IP_ADDRESS, () => {
  console.log(`Servidor escuchando en http://${IP_ADDRESS}:3000`);
});


const logStream = fs.createWriteStream('server.log', { flags: 'a' });
app.use((req, res, next) => {
  const logMessage = `${req.method} ${req.url} - ${new Date().toLocaleString()}\n`;
  logStream.write(logMessage);
  next();
});