// src/pages/PaginaImprimirTicket.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import TicketCompra from '../components/TicketCompra';
import { useCaja } from '../context/CajaContext';

// 1. ¡AQUÍ ESTÁ EL ARREGLO QUE FALTABA!
//    Importamos el CSS que le da formato al ticket.
import '../components/TicketCompra.css'; 

function PaginaImprimirTicket() {
  const { id } = useParams();
  const { userProfile, loadingAuth } = useCaja(); 
  
  const [loadingData, setLoadingData] = useState(true);
  const [compraData, setCompraData] = useState(null);

  useEffect(() => {
    // No hacemos nada si el "Cerebro" (Auth) sigue cargando
    if (loadingAuth) return; 

    const fetchCompra = async () => {
      if (!id) return;
      
      setLoadingData(true);
      try {
        const docRef = doc(db, "compras", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCompraData({
            ...docSnap.data(),
            fecha: docSnap.data().fecha.toDate()
          });
        } else {
          console.error("¡No se encontró la compra!");
        }
      } catch (error) {
        console.error("Error al cargar la compra:", error);
      }
      setLoadingData(false);
    };

    fetchCompra();
  }, [id, loadingAuth]);

  // 2. ¡HEMOS REACTIVADO LA IMPRESIÓN!
  useEffect(() => {
    if (compraData && !loadingData) {
      setTimeout(() => {
        window.print();
      }, 500); // 500ms de espera
    }
  }, [compraData, loadingData]);
  

  if (loadingAuth || loadingData) {
    return (
      <p style={{ fontFamily: "Arial", fontSize: "18px", textAlign: "center", marginTop: "50px" }}>
        Cargando ticket...
      </p>
    );
  }

  if (!compraData) {
    return <p>Error: No se encontraron datos para esta compra.</p>;
  }

  // 3. Mostramos el ticket (que ahora SÍ será visible)
  return (
    <TicketCompra compraData={compraData} usuario={userProfile} />
  );
}

export default PaginaImprimirTicket;