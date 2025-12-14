// 1. Importamos React (buena práctica) y nuestro CSS
import React from 'react';
import './BotonMaterial.css';

// 2. Creamos el componente.
//    Observa que recibe un argumento: { nombre }
//    ¡Esto es una 'prop'! Es el texto que le pasaremos.
function BotonMaterial({ nombre }) {

  // 3. La función de clic
  function manejarClick() {
    // Por ahora, todos harán lo mismo:
    // Mostrarán en qué botón se hizo clic.
    alert('Hiciste clic en ' + nombre);
  }

  // 4. Devolvemos el HTML (JSX)
  //    - Usamos la className que definimos en el CSS
  //    - Mostramos la 'prop' {nombre} dentro del botón
  //    - Asignamos la función manejarClick al evento onClick
  return (
    <button className="boton-material" onClick={manejarClick}>
      {nombre}
    </button>
  );
}

// 5. Exportamos el componente para poder usarlo en App.jsx
export default BotonMaterial;