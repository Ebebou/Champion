import React, { useState, useEffect } from "react";
import SplashScreen from "./SplashScreen";
import "./AppMain.css";

// =========================================================================
//  TES CONFIGURATIONS (C'est toi qui décides de tout ici !)
// =========================================================================
const HEURE_MATIN = "08:00"; // Première heure cible (ex: Réveil)
const HEURE_MIDI = "13:00"; // Deuxième heure cible (ex: Boost de mi-journée)
const HEURE_SOIR = "20:00"; // Troisième heure cible (ex: Bilan/Coucher)
const CHAQUE_HEURE = true; // Activer (true) ou Désactiver (false) le rappel chaque heure pile

function AppMain() {
  const [showSplash, setShowSplash] = useState(true);

  // --- 1. TOUS LES HOOKS DOIVENT ÊTRE DÉCLARÉS EN PREMIER ---

  // Effet de temporisation pour le Splash Screen (1.5s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Gestion stricte et automatique du thème système
  useEffect(() => {
    const root = document.documentElement;
    const themeColorMeta = document.getElementById("pwa-theme-color");
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applySystemTheme = (e) => {
      const isDark = e ? e.matches : mediaQuery.matches;

      if (isDark) {
        root.className = "dark";
        if (themeColorMeta) themeColorMeta.setAttribute("content", "#1E1E1E");
      } else {
        root.className = "light";
        if (themeColorMeta) themeColorMeta.setAttribute("content", "#FAFAFA");
      }
    };

    applySystemTheme();

    try {
      mediaQuery.addEventListener("change", applySystemTheme);
    } catch (err) {
      mediaQuery.addListener(applySystemTheme);
    }

    return () => {
      try {
        mediaQuery.removeEventListener("change", applySystemTheme);
      } catch (err) {
        mediaQuery.removeListener(applySystemTheme);
      }
    };
  }, []);

  // Sauvegarder tes variables et demander la permission après le Splash Screen
  useEffect(() => {
    if (!showSplash) {
      localStorage.setItem("champion_heure_matin", HEURE_MATIN);
      localStorage.setItem("champion_heure_midi", HEURE_MIDI);
      localStorage.setItem("champion_heure_soir", HEURE_SOIR);
      localStorage.setItem("champion_chaque_heure", CHAQUE_HEURE.toString());

      requestNotificationPermission();
    }
  }, [showSplash]);

  // --- 2. FONCTIONS DE NOTIFICATIONS ---

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("Ce navigateur ne prend pas en charge les notifications de bureau.");
      return;
    }

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        sendWelcomeNotification();
      }
    } else if (Notification.permission === "granted") {
      console.log("Notifications déjà activées et synchronisées avec tes réglages !");
    }
  };

  const sendWelcomeNotification = () => {
    if (Notification.permission === "granted") {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("CHAMPION", {
          body: "Prêt à relever tous les défis Champion ?",
          icon: "/icons/logo 500x500.png",
          badge: "/favicon.svg",
          vibrate: [200, 100, 200],
        });
      });
    }
  };

  // --- 3. RETOURS CONDITIONNELS DE RENDU (TOUT EN BAS) ---

  // Si showSplash est actif, on renvoie uniquement le SplashScreen
  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  // Sinon, on affiche le contenu principal
  return (
    <>
      {/* ==========================================
          APPLICATION PRINCIPALE (HOME)
         ========================================== */}
      <main className="app-content visible">
        <section className="hero-section">
          <p className="sub-title">RAPPELLE-TOI QUE</p>
          <p className="sub-title">TU ES UN</p>
          <h1 className="main-title">CHAMPION</h1>
        </section>
      </main>
    </>
  );
}

export default AppMain;