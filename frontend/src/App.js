import logo from './logo.svg';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import Buscador from './Buscador/Buscador.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Buscador/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;