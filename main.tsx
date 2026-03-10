import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AppDataProvider } from './context/AppDataContext';  // ← keep
import { initializeAccessibility } from './utils/accessibility';
import { initializePerformanceOptimizations } from './utils/performanceOptimization';
import { setupGlobalErrorHandling } from './utils/errorHandling';
import { seedDatabase } from './utils/seedDatabase';

setupGlobalErrorHandling();

document.addEventListener('DOMContentLoaded', () => {
  initializeAccessibility();
  initializePerformanceOptimizations();
});

seedDatabase().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppDataProvider>   {/* ← AppDataProvider alone is enough */}
        <App />
      </AppDataProvider>
    </BrowserRouter>
  </StrictMode>
);
