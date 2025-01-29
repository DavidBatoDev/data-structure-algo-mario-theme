import React from 'react';
import { motion } from 'framer-motion';

const Cloud = ({ delay = 0, duration = 25, y = 0 }) => (
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
      src="/images/cloud.png" 
      alt="cloud" 
      className="w-32 h-20 opacity-80"
    />
  </motion.div>
);

const AnimatedClouds = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Multiple clouds with different speeds and positions */}
      <Cloud y={40} duration={30} delay={0} />
      <Cloud y={160} duration={25} delay={5} />
      <Cloud y={40} duration={35} delay={10} />
      <Cloud y={120} duration={28} delay={15} />
      <Cloud y={200} duration={32} delay={20} />
      {/* more clouds */}
      <Cloud y={80} duration={30} delay={0} />
      <Cloud y={180} duration={25} delay={5} />
        <Cloud y={60} duration={35} delay={10} />
        <Cloud y={140} duration={28} delay={15} />
        <Cloud y={220} duration={32} delay={20} />

    </div>
  );
};

export default AnimatedClouds;