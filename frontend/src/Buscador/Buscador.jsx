import React, { useState } from 'react';

import axios from 'axios';
import './buscador.css';

function Buscador() {
  // Establecer estado para las fechas de búsqueda
  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');

  // Establecer estado para los resultados de la búsqueda
  const [clientes, setClientes] = useState([]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Realizar una solicitud POST al servidor con las fechas de búsqueda
      const response = await axios.post('https://minicore-cdna-api.onrender.com/buscar', { fechaInicial, fechaFinal });
      setClientes(response.data.clientes);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Mini-Core  Caleb Naranjo</h1>
      <h4>Establece fechas de Inicio y Fin para mostrar la información de los Clientes y sus respectivos Contratos</h4>
      <form onSubmit={handleSubmit}>
        <label>
          Fecha Inicial:
          <input
            type="date"
            value={fechaInicial}
            onChange={e => setFechaInicial(e.target.value)}
          />
        </label>
        <label>
          Fecha Final:
          <input
            type="date"
            value={fechaFinal}
            onChange={e => setFechaFinal(e.target.value)}
          />
        </label>
        <button type="submit">Buscar</button>
      </form>
      {clientes.map(cliente => (
        <div key={cliente._id}>
          <h2>Nombre del cliente: {cliente.nombre}</h2>
          <h3>Monto total de contratos: ${cliente.total}</h3>
          <h5>
            Fecha y monto de los contratos:
          </h5>
          <ul>
            {cliente.contratos.map(contrato => (
              <li key={contrato._id}>
                {new Date(contrato.fecha).toISOString().split('T', 1)}: ${contrato.monto}
              </li>
            ))}
          </ul>
        </div>
        
      ))}
      <a href="https://github.com/calebdamian/minicore-express-react">Repositorio Github del Mini-Core</a>
    </div> 
  );
}

export default Buscador;