// src/components/AnimatedNode.jsx
import React, { useState } from 'react';
import { Handle } from 'reactflow';
import { motion } from 'framer-motion';

const AnimatedNode = React.memo((props) => {
  const { id, data, style } = props;
  const [hasAnimated, setHasAnimated] = useState(false);

  return (
    <motion.div
      initial={hasAnimated ? false : { scale: 0, opacity: 0 }} // Animate only if not animated before
      animate={{ scale: 1, opacity: 1 }} // Ensure final state
      transition={hasAnimated ? { duration: 0 } : { duration: 0.5 }} // No animation if already animated
      onAnimationComplete={() => {
        if (!hasAnimated) {
          setHasAnimated(true);
        }
      }}
      style={{
        width: '100%', // Ensure it takes full space of the container
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          ...style,
          backgroundImage: 'url(/images/painting.png)', // Ensure correct path
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          color: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'MinecraftRegular, sans-serif',
          width: 100,
          height: 100,
          borderRadius: 10,
        }}
      >
        {/* Target Handle */}
        <Handle
          type="target"
          position="top"
          style={{ background: '#555' }}
          id="a"
        />
        
        {/* Node Content */}
        <div>{data.label}</div>
        
        {/* Source Handle */}
        <Handle
          type="source"
          position="bottom"
          style={{ background: '#555' }}
          id="b"
        />
      </div>
    </motion.div>
  );
});

export default AnimatedNode;
