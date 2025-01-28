class BinaryTree {
    constructor(value) {
      this.root = new Node(value);
    }
  
    // Convert binary tree to React Flow nodes and edges
    toGraph() {
      const nodes = [];
      const edges = [];
      let idCounter = 1; // Unique ID counter for nodes
  
      const traverse = (node, x, y, parentId = null) => {
        if (!node) return;
  
        const id = `${idCounter++}`; // Unique, incrementing ID for each node
        nodes.push({
          id,
          data: { label: `${node.value}` },
          position: { x, y },
          type: "customNode", // Use a custom node type
        });
  
        if (parentId) {
          edges.push({
            id: `e-${parentId}-${id}`, // Unique edge ID
            source: parentId,
            target: id,
            type: "smoothstep", // Bezier curve for squiggly lines
          });
        }
  
        traverse(node.left, x - 100, y + 100, id); // Adjust left child position
        traverse(node.right, x + 100, y + 100, id); // Adjust right child position
      };
  
      traverse(this.root, 0, 0); // Start from the root node
      return { nodes, edges };
    }
  }
  