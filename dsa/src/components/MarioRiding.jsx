import React from 'react';
import { motion } from 'framer-motion';

const Mushroom = ({ delay = 0, duration = 25, y = 0 }) => (
  <motion.div
    initial={{ x: -500 }}
    animate={{ 
      x: "100vw",
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "linear"
    }}
    style={{ y }}
    className="absolute left-0"
  >
    <img 
      src="/images/mario-cart-pixel-2.png" 
      alt="cloud" 
      className="w-20 h-16"
    />
  </motion.div>
);

const MarioRiding = ({y, duration}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Multiple clouds with different speeds and positions */}
      <Mushroom y={y} duration={duration} delay={0} />
      {/* more clouds */}

    </div>
  );
};

export default MarioRiding;