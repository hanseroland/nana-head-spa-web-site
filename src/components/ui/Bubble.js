'use client'; // Indique que c'est un Client Component

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
// Pas besoin de Box ou useTheme si ces valeurs ne dépendent pas du thème ou de MUI directement pour la structure

function Bubble() {
  const [bubbleStyles, setBubbleStyles] = useState([]);
  const numberOfBubbles = 10; // Nombre de bulles à générer

  // Variantes pour les animations des bulles (elles peuvent rester ici, car elles ne sont pas aléatoires)
  const bubbleVariants = {
    animate: {
      y: [0, -50, 0], // Mouvement vertical
      opacity: [0.6, 0.8, 0.6], // Variation d'opacité
      transition: {
        duration: 6, // Durée de l'animation
        repeat: Infinity, // Répétition infinie
        ease: "easeInOut",
      },
    },
  };

  useEffect(() => {
    // Cette fonction s'exécute seulement côté client, après le premier rendu.
    const generatedBubbles = Array.from({ length: numberOfBubbles }).map((_, index) => ({
      position: "absolute",
      top: `${Math.random() * 100}%`, // Généré aléatoirement CÔTÉ CLIENT
      left: `${Math.random() * 100}%`, // Généré aléatoirement CÔTÉ CLIENT
      width: `${Math.random() * 100 + 50}px`, // Généré aléatoirement CÔTÉ CLIENT
      height: `${Math.random() * 100 + 50}px`, // Généré aléatoirement CÔTÉ CLIENT
      backgroundColor: index % 2 === 0 ? "#fff" : "#E59AA6",
      borderRadius: "50%",
      filter: "blur(30px)",
      zIndex: 1,
    }));
    setBubbleStyles(generatedBubbles);
  }, []); // Le tableau de dépendances vide [] garantit que cela ne s'exécute qu'une fois au montage.

  // Si les styles des bulles n'ont pas encore été générés (lors du rendu SSR ou avant l'useEffect)
  if (bubbleStyles.length === 0) {
    return null; // Ne rien rendre côté serveur ou tant que les styles ne sont pas prêts côté client
  }

  return (
    <div>
      {bubbleStyles.map((style, index) => (
        <motion.div
          key={index}
          variants={bubbleVariants}
          animate="animate"
          style={style} // Applique les styles générés dynamiquement et de manière stable côté client
        />
      ))}
    </div>
  );
}

export default Bubble;