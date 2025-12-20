import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
base: process.env.VITE_BASE ?? "./",
  plugins: [react()],
  resolve: {
    conditions: ['tauri'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id) return;
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'charts';
            if (id.includes('jspdf')) return 'pdf';
            if (id.includes('react-router')) return 'router';
            if (id.includes('react')) return 'react';
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
});
