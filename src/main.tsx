import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// A successful boot means any pending chunk-reload retry worked; allow future retries.
sessionStorage.removeItem('hb4_chunk_reload');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
