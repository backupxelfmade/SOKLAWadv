import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query'; // ← ADD
import App from './App.tsx';
import './index.css';
import { queryClient } from './lib/queryClient';             // ← ADD
import { AppDataProvider } from './context/AppDataContext';  // ← ADD
import { initializeAccessibility } from './utils/accessibility';
import { initializePerformanceOptimizations } from './utils/performanceOptimization';
import { setupGlobalErrorHandling } from './utils/errorHandling';
import { seedDatabase } from './utils/seedDatabase';

// Initialize global utilities
setupGlobalErrorHandling();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeAccessibility();
  initializePerformanceOptimizations();
});

// Seed database on first load
seedDatabase().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}> {/* ← ADD */}
        <AppDataProvider>                         {/* ← ADD */}
          <App />
        </AppDataProvider>                        {/* ← ADD */}
      </QueryClientProvider>                      {/* ← ADD */}
    </BrowserRouter>
  </StrictMode>
);
