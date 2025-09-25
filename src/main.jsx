import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import './compatibility.css'
import App from './App.jsx'

// Override console.warn for CSS compatibility warnings
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Filter out CSS compatibility warnings
    const message = args[0];
    if (typeof message === 'string' && (
      message.includes('text-size-adjust') ||
      message.includes('mask-repeat') ||
      message.includes('field-sizing') ||
      message.includes('text-wrap')
    )) {
      return; // Suppress these warnings
    }
    originalWarn.apply(console, args);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
