'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="cookie-banner"
        >
          <p className="cookie-banner-text">
            Usamos cookies para melhorar sua experiencia na RuzziStore. Ao continuar, voce concorda com nossa politica.
          </p>
          <button onClick={accept} className="cookie-banner-btn">
            Aceitar e fechar
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
