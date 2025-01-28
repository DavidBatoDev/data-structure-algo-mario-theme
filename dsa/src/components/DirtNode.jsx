// src/components/DirtNode.jsx
import React from 'react';
import { Handle } from 'reactflow';
import './DirtNode.css'; // Optional: for additional styling

const DirtNode = ({ data }) => {
  return (
    <div className="dirt-node">
      {/* Optional: Handles for connections */}
      <Handle style={{
        background: 'transparent', // Dark gray color
        border: 'none',// Optional: Add border for handles
      }} type="target" position="top" />
      <div className="node-content font-minecraftRegular">
        {data.label}
      </div>
      <Handle 
      style={{
        background: 'transparent', // Dark gray color
        border: 'none',// Optional: Add border for handles
      }}
      type="source" position="bottom" />
    </div>
  );
};

export default DirtNode;
