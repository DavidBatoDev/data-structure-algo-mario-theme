import React from 'react';

const PatternedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
}) => {
  return (
    <svg
      style={{
        position: 'absolute',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      {/* Outer border line */}
      <line
        x1={sourceX}
        y1={sourceY}
        x2={targetX}
        y2={targetY}
        style={{
          stroke: '#000000', // Black border
          strokeWidth: '12', // Thicker width for the border
          strokeLinecap: 'square',
          shapeRendering: 'crispEdges',
        }}
      />

      {/* Inner solid pixelated line */}
      <line
        x1={sourceX}
        y1={sourceY}
        x2={targetX}
        y2={targetY}
        style={{
          ...style,
          stroke: '#8B4513', // Solid brown color
          strokeWidth: '8', // Inner line slightly thinner than border
          strokeLinecap: 'square', // Square edges for blocky look
          shapeRendering: 'crispEdges', // Ensure pixel-perfect rendering
        }}
      />
    </svg>
  );
};

export default PatternedEdge;
