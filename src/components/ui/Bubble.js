import React from 'react'
import { motion } from "framer-motion";


function Bubble() {
    

  // Variantes pour les animations des bulles
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


  return (
    <div>
          
             {/* Bulles animées en arrière-plan */}
                  {[...Array(10)].map((_, index) => (
                    <motion.div
                      key={index}
                      variants={bubbleVariants}
                      animate="animate"
                      style={{
                        position: "absolute",
                        top: `${Math.random() * 100}%`, // Position verticale aléatoire
                        left: `${Math.random() * 100}%`, // Position horizontale aléatoire
                        width: `${Math.random() * 100 + 50}px`, // Taille aléatoire entre 50px et 150px
                        height: `${Math.random() * 100 + 50}px`,
                        backgroundColor: index % 2 === 0 ? "#fff" : "#E59AA6", // Couleurs alternées
                        borderRadius: "50%", // Forme circulaire
                        filter: "blur(30px)", // Effet de flou
                        zIndex: 1, // Derrière le contenu principal
                      }}
                    />
             ))}
    
    </div>
  )
}

export default Bubble