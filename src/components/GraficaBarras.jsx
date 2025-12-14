// src/components/GraficaBarras.jsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// 1. Registramos los "módulos" de Chart.js que vamos a usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function GraficaBarras({ chartData, titulo, useLogScale = false }) {
  
  // 2. Opciones de la gráfica
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite que se ajuste al contenedor
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: titulo, // Título que le pasaremos
        font: {
          size: 18
        }
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
        },
      },
      y: {
        type: useLogScale ? 'logarithmic' : 'linear',
        beginAtZero: !useLogScale,
        min: useLogScale ? 0.1 : undefined,
        title: {
          display: true,
          text: useLogScale ? 'Escala logarítmica (kg/und)' : 'Cantidad (kg/und)',
        },
        ticks: useLogScale
          ? {
              callback: (value) => Number(value).toLocaleString('es-CO'),
            }
          : {
              precision: 0,
            },
      },
    },
  };

  return <Bar options={options} data={chartData} />;
}

export default GraficaBarras;
