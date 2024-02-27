const express = require('express');
const cors = require('cors'); // Importar el middleware cors
const app = express();


// Configuración de middleware
app.use(express.json()); // Para analizar solicitudes JSON
app.use(cors()); // Usar el middleware cors para permitir solicitudes desde cualquier origen

// Datos en memoria para almacenar los carros registrados
let cars = [];

// Endpoint para registrar el ingreso de un carro
app.post('/cars', (req, res) => {
    const { name, license_plate, color } = req.body;
    const timestamp = new Date().toLocaleString();

    // Aquí puedes guardar los datos del carro en la variable `cars`
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
  // Aquí puedes implementar la lógica para retirar un carro de la lista `cars`
  cars = cars.filter(car => car.license_plate !== license_plate);
  res.send('Car removed successfully');
});

// Configuración de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toLocaleString()}`);
  next();
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
