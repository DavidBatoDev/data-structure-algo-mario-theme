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
          stroke: '#597d35', // Grass color border
          strokeWidth: '15', // Thicker width for the border
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
          stroke: '#5f3e2c', // Solid brown color
          strokeWidth: '11', // Inner line slightly thinner than border
          strokeLinecap: 'square', // Square edges for blocky look
          shapeRendering: 'crispEdges', // Ensure pixel-perfect rendering
        }}
      />
    </svg>
  );
};

export default PatternedEdge;
