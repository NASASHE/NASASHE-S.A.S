import './App.css';
import Header from './components/Header'; 
import Footer from './components/Footer';

// 1. IMPORTAMOS las herramientas de React Router
import { Routes, Route } from 'react-router-dom';

// 2. IMPORTAMOS las páginas que usaremos como rutas
import Dashboard from './pages/Dashboard';
import PaginaArticulos from './pages/PaginaArticulos';
// (Aquí importaríamos PaginaProveedores, PaginaVentas, etc. a medida que las creemos)

function App() {
  return (
    <div className="app-container">
      
      {/* El Header y Footer están FUERA de las rutas,
          así que siempre estarán visibles. */}
      <Header />
      
      <main className="main-content">
        {/* 3. Definimos el área de "páginas"
            Routes le dice a React: "Aquí es donde van las páginas"
        */}
        <Routes>
          {/* 4. Definimos cada ruta (Route)
              path="/" es la página de inicio (nuestro Dashboard)
              path="/articulos" es la nueva página que creamos
          */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/articulos" element={<PaginaArticulos />} />
          
          {/* Próximamente añadiremos más rutas aquí:
          <Route path="/proveedores" element={<PaginaProveedores />} />
          <Route path="/ventas" element={<PaginaVentas />} />
          */}
        </Routes>
      </main>

      <Footer />
      
    </div>
  );
}

export default App;