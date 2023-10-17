const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors =  require('cors');

// Conectar a la base de datos MongoDB

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://thyaravintimilla:SAgBv3aiqa9tLINi@cluster0.qlmd0uh.mongodb.net/?retryWrites=true&w=majority");


// Crear esquemas de Mongoose para las tablas de clientes y contratos
const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true }
});
const ContratoSchema = new mongoose.Schema({
  monto: { type: Number, required: true },
  fecha: { type: Date, required: true },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' }
});

const Cliente = mongoose.model('Cliente', ClienteSchema);
const Contrato = mongoose.model('Contrato', ContratoSchema);

// Iniciar el servidor Express
const app = express();
app.use(bodyParser.json());

app.use(cors({origin:['http://localhost:3000','https://minicore-cdna-api.onrender.com']}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Crear una ruta para realizar la búsqueda de clientes y contratos entre fechas
app.post('/buscar', async (req, res) => {
  // Obtener las fechas de búsqueda desde el cuerpo de la solicitud
  const { fechaInicial, fechaFinal } = req.body;

  try {
    // Realizar una consulta a la base de datos utilizando Mongoose
    const clientes = await Cliente.aggregate([
      {
        $lookup: {
          from: "contratos",
          localField: "_id",
          foreignField: "cliente",
          as: "contratos"
        }
      },
      { $unwind: "$contratos" }, 
      {
        $match: {
          "contratos.fecha": {
            $gte: new Date(fechaInicial),
            $lt: new Date(fechaFinal)
          }
        }
      },
      {
        $group: {
          _id: "$_id",
          nombre: { $first: "$nombre" },
          contratos: { $push: "$contratos" },
          total: { $sum: "$contratos.monto" }
        }
      }
    ]);
    res.send({ clientes });
  } catch (err) {
    res.status(500).send(err);
  }
});



app.listen(8800, () => {
  console.log('Servidor iniciado en el puerto 8800');
});

app.post('/clientes', async (req, res) => {
  try {
    // Create a new Cliente document with the data from the request body
    const cliente = new Cliente(req.body);
    // Save the document to the MongoDB collection
    await cliente.save();
    // Send a success response to the client
    res.send({ message: 'Cliente creado exitosamente' });
  } catch (err) {
    // Send an error response to the client
    res.status(500).send(err);
  }
});

app.get('/clientes', async (req, res) => {
  try {
   const clientes = await Cliente.find();

    return res.status(200).json(clientes);
  } catch (err) {
    res.status(500).send(err);
  }
})

app.post('/contratos', async (req, res) => {
  try {
    // Create a new Cliente document with the data from the request body
    const contrato = new Contrato(req.body);

    
    // Save the document to the MongoDB collection
    await contrato.save();
    // Send a success response to the client
    res.send({ message: 'Contrato creado exitosamente' });
  } catch (err) {
    // Send an error response to the client
    res.status(500).send(err);
  }
});


app.get('/contratos', async (req, res) => {
  try {
    const contratos = await Contrato.find();
    return res.status(200).json(contratos);
  } catch (err) {
    res.status(500).send(err);
  }
})


