  // if I change my mind
  const handleTraversalSelect = (type) => {
    clearTraversal();
      if (nodes.length === 0) {
        alert("Please generate a tree first!");
        return;
      }
    
      // Reset all node styles to default
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          style: {
            ...node.style,
            background: "#b71c1c",
            color: "white",
          },
        }))
      );
    
      // Determine the traversal order
      const treeRoot = buildTree();
      let traversalOrder = [];
      if (type === "Preorder") {
        traversalOrder = preorderTraversal(treeRoot);
      } else if (type === "Inorder") {
        traversalOrder = inorderTraversal(treeRoot);
      } else if (type === "Postorder") {
        traversalOrder = postorderTraversal(treeRoot);
      }
    
      // Highlight nodes one by one based on traversal order
      let currentIndex = 0;
      traversalIntervalRef.current = setInterval(() => {
        if (currentIndex >= traversalOrder.length) {
          clearTraversal()
          return;
        }
        // change the previous node back to default color
        const prevNodeId = traversalOrder[currentIndex - 1]?.toString();
        const currentNodeId = traversalOrder[currentIndex].toString();
    
        setNodes((prev) =>
          prev.map((node) =>
            node.id === currentNodeId
              ? {
                  ...node,
                  style: {
                    ...node.style,
                    background: "#ff5722", // Highlight color
                  },
                }
              : node
          )
        );
        setTraversalResult(traversalOrder.slice(0, currentIndex + 1).join(" -> "));
        currentIndex++;
      }, 1000);
      setIsTraversalModalOpen(false);
    };