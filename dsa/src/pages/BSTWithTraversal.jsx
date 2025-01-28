import React, { useState, useEffect, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import CustomButton from "../components/CustomButton";

/** 1) DAGRE LAYOUT HELPER */
const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Basic node size for the layout algorithm
  const nodeWidth = 80;
  const nodeHeight = 80;

  // "TB" = top-to-bottom; "LR" = left-to-right; etc.
  dagreGraph.setGraph({
    rankdir: direction,
    ranksep: 100, // vertical gap
    nodesep: 50,  // horizontal gap
  });

  // Add nodes to Dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to Dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Run the Dagre layout
  dagre.layout(dagreGraph);

  // Update each node's position from Dagre
  const layoutedNodes = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    let { x, y } = dagreNode;

    // 2) OPTIONAL NUDGE BASED ON "SIDE"
    // If this node is a left or right child, shift it slightly.
    if (node.data.side === "left") {
      x -= 15; // push left children slightly left
    } else if (node.data.side === "right") {
      x += 15; // push right children slightly right
    }
    // End optional nudge

    return {
      ...node,
      position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
    };
  });

  return { nodes: layoutedNodes, edges };
};


// let nodeIdCounter = 1;

/** BST Node Structure */
class BSTNode {
  constructor(val,id) {
    this.id = id;
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

/** Binary Search Tree with insert method */
class BST {
  constructor() {
    this.root = null;
  }

  insert(val, id = "1") {
    if (!this.root) {
      this.root = new BSTNode(val, id);
      return;
    }
    this._insertNode(this.root, val, id);
  }

  _insertNode(node, val, id) {
    if (val < node.val) {
      // Go left
      const leftId = `${id}L`; // Generate left child ID
      if (!node.left) node.left = new BSTNode(val, leftId);
      else this._insertNode(node.left, val, leftId);
    } else {
      // Go right
      const rightId = `${id}R`; // Generate right child ID
      if (!node.right) node.right = new BSTNode(val, rightId);
      else this._insertNode(node.right, val, rightId);
    }
  }
}

/** Main BST component with form on the left and ReactFlow on the right */
const BinarySearchTree = () => {
  // For user input
  const [userInput, setUserInput] = useState("");
  const [values, setValues] = useState([]); 

  // The BST instance
  const [tree, setTree] = useState(new BST());

  // ReactFlow node/edge states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // ReactFlow instance
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Traversal state
  const [traversalResult, setTraversalResult] = useState("");
  const traversalIntervalRef = useRef(null);

  // Modal for traversal type
  const [isTraversalModalOpen, setIsTraversalModalOpen] = useState(false);

  useEffect(() => {
    document.title = "BST with Traversal";
  }, []);

  // Clear any traversal highlight
  const clearTraversal = () => {
    if (traversalIntervalRef.current) {
      clearInterval(traversalIntervalRef.current);
      traversalIntervalRef.current = null;
    }
    setTraversalResult("");
  };

  /** Build or rebuild the BST from values array */
  const rebuildBST = (arr) => {
    const newTree = new BST();
    arr.forEach((val) => newTree.insert(val));
    return newTree;
  };

  /** Insert a single value from user input */
  const handleInsert = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const num = parseInt(userInput, 10);
    if (Number.isNaN(num)) {
      alert("Please enter a valid integer!");
      return;
    }
    if (values.length >= 30) {
      alert("Maximum of 30 integers reached!");
      return;
    }

    setValues((prev) => [...prev, num]);
    setUserInput("");
  };

  /** Clear all integers */
  const handleClear = () => {
    clearTraversal();
    setValues([]);
    nodeIdCounter = 1; 
    setTree(new BST());
    setNodes([]);
    setEdges([]);
  };

  /**
   * Build a node/edge list from the BST, ignoring (x,y).
   * We do BFS *only* to create unique IDs and track "left" or "right" side.
   */
  const buildFlowFromBST = (root) => {
    const newNodes = [];
    const newEdges = [];
  
    if (!root) return { newNodes, newEdges };
  
    const queue = [{ node: root, id: "1", side: "root" }];
  
    while (queue.length > 0) {
      const { node, id, side } = queue.shift();
  
      newNodes.push({
        id: node.id,
        data: { label: node.val, side },
        position: { x: 0, y: 0 }, 
        // type: "dirt",
        style: {
          background: "transparent",
          color: "black",
          border: "2px solid black",
          height: 60,
          width: 60,
          borderRadius: 10000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }
      });
  
      if (node.left) {
        const leftId = `${id}L`;
        newEdges.push({
          id: `e${id}-${leftId}`,
          source: id,
          target: leftId,
          type: "smoothstep",
          style: { stroke: "black", strokeWidth: 4 },
        });
        queue.push({ node: node.left, id: leftId, side: "left" });
      }
  
      if (node.right) {
        const rightId = `${id}R`;
        newEdges.push({
          id: `e${id}-${rightId}`,
          source: id,
          target: rightId,
          type: "smoothstep",
          style: { stroke: "black", strokeWidth: 4 },
        });
        queue.push({ node: node.right, id: rightId, side: "right" });
      }
    }
  
    return { newNodes, newEdges };
  };
  
  // Rebuild tree when values changes
  useEffect(() => {
    const newTree = rebuildBST(values);
    setTree(newTree);

    // (1) Build node/edge lists without x/y
    const { newNodes, newEdges } = buildFlowFromBST(newTree.root);

    // (2) Let Dagre compute positions
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
      "TB" 
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    // eslint-disable-next-line
  }, [values]);

  // Auto-fit after nodes/edges update
  useEffect(() => {
    if (reactFlowInstance && nodes.length) {
      reactFlowInstance.fitView({
        padding: 0.2,
        includeHiddenNodes: true,
        duration: 800,
      });
    }
  }, [nodes, reactFlowInstance]);

  // Traversal helpers
  const preorder = (node, list = []) => {
    if (!node) return list;
    list.push({ id: node.id, val: node.val });
    preorder(node.left, list);
    preorder(node.right, list);
    return list;
  };
  const inorder = (node, list = []) => {
    if (!node) return list;
    inorder(node.left, list);
    list.push({ id: node.id, val: node.val });
    inorder(node.right, list);
    return list;
  };
  const postorder = (node, list = []) => {
    if (!node) return list;
    postorder(node.left, list);
    postorder(node.right, list);
    list.push({ id: node.id, val: node.val });
    return list;
  };

  // Reset node colors
  const resetNodeColors = () => {
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        style: {
          ...node.style,
          background: "transparent",
        },
      }))
    );
  };

  // Handle traversal selection
  const handleTraversalSelect = (type) => {
    clearTraversal();
    if (!tree.root) {
      alert("Please insert at least one value to build a BST!");
      return;
    }
  
    resetNodeColors();
  
    let order = [];
    if (type === "Preorder") {
      order = preorder(tree.root);
    } else if (type === "Inorder") {
      order = inorder(tree.root);
    } else {
      order = postorder(tree.root);
    }
  
    let current = 0;
    traversalIntervalRef.current = setInterval(() => {
      if (current >= order.length) {
        clearTraversal();
        setTraversalResult(order.map((n) => n.val).join(" -> "));
        return;
      }
    
      const currentNode = order[current]; // Get current { id, val }
      setNodes((prev) => {
        console.log("Updating nodes", prev);
        console.log("Current node", currentNode.id);
        return prev.map((n) => ({
          ...n,
          style: {
            ...n.style,
            background: n.id == currentNode.id ? "#ff5722" : "transparent",
          },
        }));
      });      
    
      setTraversalResult(order.slice(0, current + 1).map((n) => n.val).join(" -> "));
      current++;
    }, 1000);
    
  
    setIsTraversalModalOpen(false);
  };
  

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-white"
    >
      <div 
      style={{
        // backgroundImage: 'url(/images/bst-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className="w-full h-screen flex gap-8 py-[70px] px-[70px]">
        {/* LEFT: input form */}

        <div className="w-[730px] gap-7 flex flex-col">
          <div className="border-4 h-[500px] border-black rounded-xl">
            <form 
            onSubmit={handleInsert} className="relative flex flex-row justify-between gap-2 p-5">
              <div className="top-0 left-0 absolute w-full h-full bg-minecraft-white rounded-xl opacity-80"/>
              <div className="z-10 flex flex-col flex-1 justify-between gap-5">
                <input
                  type="number"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter integer"
                  className="p-2 bg-minecraft-white shadow-craftingInset border border-black rounded focus:outline-none w-full"
                />
                <div className="text-sm h-[130px] overflow-auto">
                  <p className="">Values in BST:</p>
                  <p className="">{values.join(", ") || "No values inserted yet."}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 z-10">
                <CustomButton
                  variant="clear"
                  type="submit"
                >
                  Insert
                </CustomButton>
                <CustomButton
                  variant="clear"
                  onClick={handleClear}
                >
                  Clear All
                </CustomButton>
              </div>

            </form>
            <div 
            className="relative flex flex-col gap-2 p-3">
            <div className="top-0 left-0 absolute w-full h-full bg-minecraft-white rounded-xl opacity-80"/>
              <CustomButton
                variant="clear"
                onClick={() => setIsTraversalModalOpen(true)}
                className="z-10 text-dark px-4 py-2 rounded hover:bg-red-600"
              >
                Choose Traversal
              </CustomButton>
              <div className="z-10 flex flex-col gap-2">
                <span className="text-sm text-gray-800">
                  {traversalResult || ""}
                </span>
              </div>
            </div>
          </div>

 

          {/* Traversal result display */}
        </div>

        {/* RIGHT: ReactFlow visualization */}
        <div className="w-3/4 h-full relative">

        {/* Modal for Traversal Selection */}
        {isTraversalModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

            <div className="bg-minecraft-whiteSecondary border-4 border-black p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-2xl text-white font-bold mb-4">Choose Traversal Type</h2>
                <div className="flex flex-col space-y-4">
                  <CustomButton
                    variant="clear"
                    onClick={() => handleTraversalSelect("Preorder")}
                    className="bg-primary text-dark px-4 py-2 rounded shadow-md hover:bg-primary-light transition"
                  >
                    Preorder (TLR)
                  </CustomButton>
                  <CustomButton
                    variant="clear"
                    onClick={() => handleTraversalSelect("Inorder")}
                    className="bg-primary text-dark px-4 py-2 rounded shadow-md hover:bg-primary-light transition"
                  >
                    Inorder (LTR)
                  </CustomButton>
                  <CustomButton
                    variant="clear"
                    onClick={() => handleTraversalSelect("Postorder")}
                    className="text-dark px-4 py-2 rounded shadow-md hover:bg-primary-light transition"
                  >
                    Postorder (LRT)
                  </CustomButton>
                </div>
              <div className="w-full flex justify-center mt-4">
                <CustomButton
                  variant="clear"
                  onClick={() => setIsTraversalModalOpen(false)}
                  className="text-dark px-4 py-2 rounded shadow-md hover:bg-red-400 transition"
                >
                  Close
                </CustomButton>

              </div>
            </div>
          </div>
        )}

          <ReactFlow
          style={{
            imageRendering: "pixelated",
            imageRendering: "crisp-edges",
            fill: 'rgba(217, 217, 217, 0.80)',
            strokeWidth: '7px',
            stroke: '#000',
            // boxShadow: '-12px -12px 4px 0px #565656 inset, 12px 12px 4px 0px #FDFDFD inset'
          }}
          minZoom={0.09}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onInit={setReactFlowInstance}
            fitView
            ref={reactFlowWrapper}
            className="w-full rounded-xl h-full bg-slate-200 opacity-90 border-4 border-black"
          >
            <Background color="#black" gap={10} variant="lines" lineWidth={0.1} />
            {values.length === 0 && (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <p className="text-5xl">No values inserted yet...</p>
            </div>
            )}
            {/* <Controls /> */}
          </ReactFlow>
        </div>
      </div>

    </div>
  );
};

export default BinarySearchTree;
