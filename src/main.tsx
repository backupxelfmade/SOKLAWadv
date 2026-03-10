import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import { queryClient } from './lib/queryClient';
import { AppDataProvider } from './context/AppDataContext';
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
      <QueryClientProvider client={queryClient}>
        <AppDataProvider>
          <App />
        </AppDataProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
