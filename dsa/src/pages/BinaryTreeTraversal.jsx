// src/pages/BinaryTreeTraversal.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import AnimatedNode from "../components/AnimatedNode";
// import PatternedEdge from "../components/PatternedEdge";
import SolidBrownEdges from "../components/SolidBrownEdges";
import CustomButtom from "../components/CustomButton";
import MinecraftBtn from "../components/MinecraftBtn";
import MarioRunning from "../components/MarioRunning";

// Define nodeTypes outside the component to prevent React Flow warning
// const nodeTypes = {
//   animatedNode: AnimatedNode,
// };

// const edgeTypes = {
//   brown: SolidBrownEdges,
// };

const BinaryTreeTraversal = () => {
  const [levels, setLevels] = useState(1); // Initialize to 1 for better UX
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [showSkipTraversal, setShowSkipTraversal] = useState(false);

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // State for traversal modal
  const [isTraversalModalOpen, setIsTraversalModalOpen] = useState(false);
  const [traversalType, setTraversalType] = useState("");
  const [traversalResult, setTraversalResult] = useState("");

  const traversalIntervalRef = useRef(null);

  // Refit the view whenever nodes change using ReactFlow's fitView
  // useEffect(() => {
  //   if (reactFlowInstance && nodes.length) {
  //     reactFlowInstance.fitView({
  //       padding: 0.3,
  //       includeHiddenNodes: false,
  //       duration: 800,
  //       easing: (t) => t,
  //     });
  //   }
  // }, [nodes, reactFlowInstance]);

  useEffect(() => {
    const audio = new Audio('/audio/mario.mp3');
    audio.volume = 0.7
    audio.loop = true; 
    audio.play();

    return () => {
      audio.pause();
    };
  }, []);

  const unhiglightNodes = () => {
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        style: {
          ...node.style,
          background: "white", // Reset background
          color: "black", // Reset text color
        },
      }))
    );
  };

  const clearTraversal = () => {
    if (traversalIntervalRef.current) {
      clearInterval(traversalIntervalRef.current);
      traversalIntervalRef.current = null;
    }
    setTraversalResult("");
  };

  // Define the fitView function
  const handleFitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({
        padding: 0.2,
        includeHiddenNodes: false,
        duration: 800,
        easing: (t) => t,
      });
    }
  };

  const createTree = (desiredLevels) => {
    clearTraversal();
    setTraversalType("");

    if (desiredLevels < 1 || desiredLevels > 5) {
      alert("Levels must be between 1 and 5!");
      return;
    }

    // Clear existing nodes and edges
    setNodes([]);
    setEdges([]);

    const baseHorizontalSpacing = 500 + 100 * (desiredLevels - 1); // Dynamic spacing
    const verticalSpacing = 200;

    const generateTreeData = (
      level,
      value = 1,
      x = 0,
      y = 0,
      parentId = null
    ) => {
      if (level > desiredLevels) return { nodes: [], edges: [] };

      const horizontalSpacing = baseHorizontalSpacing / Math.pow(2, level);
      const nodeId = value.toString();

      const node = {
        id: nodeId,
        data: { label: `Node ${value}` },
        position: { x, y },
        style: {
          width: 100,
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
        },
        rightOrLeft: parentId ? (value % 2 === 0 ? "left" : "right") : "root",
      };

      const edges = [];
      if (parentId) {
        edges.push({
          id: `e${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          // type: "smoothstep",
          // type: "straight",
          style: { strokeWidth: 4, stroke: "white" },
          strokeLinecap: "butt",
        });
      }

      const leftChild = generateTreeData(
        level + 1,
        value * 2,
        x - horizontalSpacing,
        y + verticalSpacing,
        nodeId
      );
      const rightChild = generateTreeData(
        level + 1,
        value * 2 + 1,
        x + horizontalSpacing,
        y + verticalSpacing,
        nodeId
      );

      return {
        nodes: [node, ...leftChild.nodes, ...rightChild.nodes],
        edges: [...edges, ...leftChild.edges, ...rightChild.edges],
      };
    };

    const treeData = generateTreeData(1, 1, 0, 0);
    let time;
    if (desiredLevels === 1) {
      time = 400;
    } else if (desiredLevels === 2) {
      time = 650;
    } else if (desiredLevels === 3) {
      time = 950;
    } else if (desiredLevels === 4) {
      time = 1250;
    } else {
      time = 1550;
    }

    animateTreeConstruction(treeData.nodes, treeData.edges, desiredLevels);
    setTimeout(() => {
      handleFitView();
    }, time);
  };

  const animateTreeConstruction = (nodesData, edgesData, levels = 1) => {
    let currentLevel = 1;
    const maxLevel = levels;

    const time = 300; // Time interval between levels
    const interval = setInterval(() => {
      if (currentLevel > maxLevel) {
        clearInterval(interval);
        return;
      }

      const newNodes = nodesData.filter(
        (node) =>
          Math.floor(Math.log2(parseInt(node.id, 10)) + 1) === currentLevel
      );
      const newEdges = edgesData.filter(
        (edge) =>
          Math.floor(Math.log2(parseInt(edge.source, 10)) + 1) ===
            currentLevel - 1 &&
          Math.floor(Math.log2(parseInt(edge.target, 10)) + 1) === currentLevel
      );

      setNodes((prev) => {
        // Avoid adding duplicate nodes
        const existingNodeIds = new Set(prev.map((node) => node.id));
        const filteredNewNodes = newNodes.filter(
          (node) => !existingNodeIds.has(node.id)
        );
        return [...prev, ...filteredNewNodes];
      });

      setEdges((prev) => {
        // Avoid adding duplicate edges
        const existingEdgeIds = new Set(prev.map((edge) => edge.id));
        const filteredNewEdges = newEdges.filter(
          (edge) => !existingEdgeIds.has(edge.id)
        );
        return [...prev, ...filteredNewEdges];
      });

      currentLevel++;
    }, time);
  };

  const handleGenerate = () => {
    createTree(levels);
    setIsModalOpen(false);
    setTraversalResult("");
  };

  const buildTree = () => {
    if (nodes.length === 0) return null;

    const nodeMap = {};
    nodes.forEach((node) => {
      nodeMap[node.id] = {
        value: parseInt(node.id, 10),
        left: null,
        right: null,
      };
    });

    edges.forEach((edge) => {
      const source = edge.source;
      const target = edge.target;
      if (parseInt(target, 10) === parseInt(source, 10) * 2) {
        nodeMap[source].left = nodeMap[target];
      } else if (parseInt(target, 10) === parseInt(source, 10) * 2 + 1) {
        nodeMap[source].right = nodeMap[target];
      }
    });

    return nodeMap["1"] || null; // Assuming "1" is the root
  };

  // Traversal functions
  const preorderTraversal = (node, result = []) => {
    if (!node) return result;
    result.push(node.value);
    preorderTraversal(node.left, result);
    preorderTraversal(node.right, result);
    return result;
  };

  const inorderTraversal = (node, result = []) => {
    if (!node) return result;
    inorderTraversal(node.left, result);
    result.push(node.value);
    inorderTraversal(node.right, result);
    return result;
  };

  const postorderTraversal = (node, result = []) => {
    if (!node) return result;
    postorderTraversal(node.left, result);
    postorderTraversal(node.right, result);
    result.push(node.value);
    return result;
  };

  const handleTraversalSelect = (type) => {
    clearTraversal();
    if (nodes.length === 0) {
      alert("Please generate a tree first!");
      return;
    }
    setShowSkipTraversal(true);
    setTraversalType(type);

    // Reset all node styles to default without unnecessary updates
    setNodes((prev) =>
      prev.map((node) => {
        const defaultStyle = { background: "white", color: "black" };
        const currentStyle = node.style || {};
        const needsUpdate =
          currentStyle.background !== defaultStyle.background ||
          currentStyle.color !== defaultStyle.color;

        if (needsUpdate) {
          return {
            ...node,
            style: {
              ...currentStyle,
              ...defaultStyle,
            },
          };
        }
        return node;
      })
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
        clearTraversal();
        setTraversalResult(traversalOrder.join(" -> "));
        setShowSkipTraversal(false);
        unhiglightNodes();
        return;
      }
      if (!traversalOrder[currentIndex]) {
        clearTraversal();
        return;
      }

      const prevNodeId = traversalOrder[currentIndex - 1]?.toString(); // Previous node
      const currentNodeId = traversalOrder[currentIndex].toString(); // Current node

      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === prevNodeId) {
            // Reset the previous node to its default color
            return {
              ...node,
              style: {
                ...node.style,
                background: "#FFDE00", // Default color
                color: "white",
              },
            };
          } else if (node.id === currentNodeId) {
            // Highlight the current node
            return {
              ...node,
              style: {
                ...node.style,
                background: "#FFDE00", // Highlight color
                color: "white",
              },
            };
          }
          return node; // Leave other nodes unchanged
        })
      );

      setTraversalResult(
        traversalOrder.slice(0, currentIndex + 1).join(" -> ")
      );
      currentIndex++;
    }, 1000);

    setIsTraversalModalOpen(false);
  };

  const handleChooseTraversal = () => {
    if (nodes.length === 0) {
      alert("Please generate a tree first!");
      return;
    }
    setIsTraversalModalOpen(true);
  };

  const handleLevelChange = (newLevel) => {
    clearTraversal();
    setLevels(newLevel);
  };

  // skip traversal
  const skipTraversal = () => {
    console.log("Traversal Type", traversalType);

    if (traversalIntervalRef.current) {
      clearInterval(traversalIntervalRef.current);
      traversalIntervalRef.current = null;
    }
    unhiglightNodes(); // Reset all node styles

    // Compute the full traversal result immediately
    if (traversalType) {
      const treeRoot = buildTree();
      let fullTraversal = [];
      if (traversalType === "Preorder") {
        fullTraversal = preorderTraversal(treeRoot);
      } else if (traversalType === "Inorder") {
        fullTraversal = inorderTraversal(treeRoot);
      } else if (traversalType === "Postorder") {
        fullTraversal = postorderTraversal(treeRoot);
      }

      // Set the full traversal result directly
      setTraversalResult(fullTraversal.join(" -> "));
      setShowSkipTraversal(false);
    }
  };

  return (
    <div
      className="bg-[#D9D9D9] min-h-screen flex flex-col items-center justify-center"
    >
      <div
        style={{
          // backgroundImage: 'url(/images/binary-bg.png)', // Replace with your image path
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat", // Prevents the image from repeating
          backgroundPosition: "center", // Centers the image
        }}
        className="w-full h-screen relative  "
      >
              <MarioRunning className='z-[999999]' y={0} duration={40} />
        {/* Modal for Levels */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-[#D9D9D9] border p-6 rounded-lg w-96 text-center z-10">
              <h2 className="text-2xl font-bold mb-4">Enter Levels (1-5)</h2>
              <input
                type="number"
                value={levels}
                onChange={(e) =>
                  handleLevelChange(Math.min(5, Math.max(1, +e.target.value)))
                }
                className="p-2 border border-dark bg-transparent rounded text-center w-24 mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
                min="1"
                max="5"
              />
              <div className="flex justify-center space-x-4">
                <CustomButtom
                  variant="departLastCar"
                  onClick={handleGenerate}
                  className="text-dark px-4 py-2 rounded shadow-md transition"
                >
                  Generate Tree
                </CustomButtom>
                <CustomButtom
                  variant="departLastCar"
                  onClick={() => setIsModalOpen(false)}
                  className="text-dark px-4 py-2 rounded shadow-md hover:bg-red-400 transition"
                >
                  Close
                </CustomButtom>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Traversal Selection */}
        {isTraversalModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-minecraft-whiteSecondary border-4 border-black p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-2xl text-black font-bold mb-4">
                  Choose Traversal
                </h2>
                <div className="flex flex-col space-y-4">
                  <CustomButtom
                    variant="departLastCar"
                    onClick={() => handleTraversalSelect("Preorder")}
                    className="bg-primary text-dark px-4 py-2 rounded shadow-md hover:bg-primary-light transition"
                  >
                    Preorder (TLR)
                  </CustomButtom>
                  <CustomButtom
                    variant="departLastCar"
                    onClick={() => handleTraversalSelect("Inorder")}
                    className="bg-primary text-dark px-4 py-2 rounded shadow-md hover:bg-primary-light transition"
                  >
                    Inorder (LTR)
                  </CustomButtom>
                  <CustomButtom
                    variant="departLastCar"
                    onClick={() => handleTraversalSelect("Postorder")}
                    className="text-dark px-4 py-2 rounded shadow-md hover:bg-primary-light transition"
                  >
                    Postorder (LRT)
                  </CustomButtom>
                </div>
              <div className="w-full flex justify-center mt-4">
                <CustomButtom
                  variant="clear"
                  onClick={() => setIsTraversalModalOpen(false)}
                  className="text-dark px-4 py-2 rounded shadow-md hover:bg-red-400 transition"
                >
                  Close
                </CustomButtom>
              </div>
            </div>
          </div>
        )}

        {/* Tree */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          // nodeTypes={nodeTypes}
          // edgeTypes={edgeTypes}
          fitView
          onInit={setReactFlowInstance} // Capture the ReactFlow instance
          ref={reactFlowWrapper}
          style={{
            imageRendering: "pixelated",
            imageRendering: "crisp-edges",
            opacity: "1",
            strokeWidth: "7px",
            boxShadow:
              "-12px -12px 4px 0px #565656 inset, 12px 12px 4px 0px #FDFDFD inset",
          }}
          className="bg-[#D9D9D9] border-4 border-black rounded-lg shadow-lg"
          // panOnDrag={false} // Disables panning by dragging the canvas
          // zoomOnScroll={false} // Disables zooming with the scroll wheel or touchpad
          // zoomOnPinch={false} // Disables zooming with pinch gestures on touch devices
          // panOnScroll={false} // Disables panning with the scroll wheel or touchpad
          minZoom={0.3}
        >
          <Background
            color="black"
            className="bg-[url(/images/3-bg.png)] bg-contain"
            gap={1000000}
            variant="dots"
            // variant="lines"
            style={{ shapeRendering: "crispEdges" }}
          />
          <div className="absolute z-10 top-10 right-4">
            <MinecraftBtn
              onClick={() => handleChooseTraversal()}
              variant="departLastCar"
              className="bg-yellow-600 hover:bg-yellow-300 text-white px-4 py-2 rounded shadow-md cursor-pointer transition z-30"
            >
              Choose Traversal
            </MinecraftBtn>
          </div>
          {/* Reopen Modal Button */}
          {!isModalOpen && (
            <>
              <div className="absolute z-10 top-24 right-10">
                <MinecraftBtn
                  variant="gray"
                  onClick={() => setIsModalOpen(true)}
                  className="text-white bg-yellow-600 px-4 py-2 rounded shadow-md hover:bg-yellow-300 transition"
                >
                  Edit Levels
                </MinecraftBtn>
              </div>
              <div
                className={`absolute z-10 top-40 right-10 ml-10 ${
                  showSkipTraversal ? "flex" : "hidden"
                } `}
              >
                <MinecraftBtn
                  variant="arrival"
                  onClick={() => skipTraversal()}
                  className="bg-yellow-600 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-300 transition"
                >
                  Skip Traversal
                </MinecraftBtn>
              </div>
            </>
          )}
          <Controls showInteractive={false} />
        </ReactFlow>
        {traversalResult && (
          <div className="w-max max-w-[1180px] absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#D9D9D9] bg-opacity-80 py-2 flex justify-center items-center gap-2 p-3 border rounded">
            <span className="text-xl text-black"></span>
            <span className="text-center text-xl text-black">
              {traversalType + ": " + traversalResult || ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BinaryTreeTraversal;
