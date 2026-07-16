import React, { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Presentation from './components/Presentation';
import AppMain from './components/AppMain';

function App() {
  useEffect(() => {
    const updateThemeColor = () => {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const themeColor = isDarkMode ? '#1e1e1e' : '#fafafa';
      
      const metas = document.querySelectorAll('meta[name="theme-color"]');
      metas.forEach(meta => {
        meta.setAttribute('content', themeColor);
      });
    };

    updateThemeColor();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Support de la compatibilité pour les navigateurs plus anciens sous Windows
    try {
      mediaQuery.addEventListener('change', updateThemeColor);
    } catch (e) {
      mediaQuery.addListener(updateThemeColor); // Fallback ancienne syntaxe
    }

    return () => {
      try {
        mediaQuery.removeEventListener('change', updateThemeColor);
      } catch (e) {
        mediaQuery.removeListener(updateThemeColor);
      }
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Presentation />} />
        <Route path="/app" element={<AppMain />} />
      </Routes>
    </Router>
  );
}

export default App;