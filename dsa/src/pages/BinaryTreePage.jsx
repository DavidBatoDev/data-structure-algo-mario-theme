import React, { useState, useEffect } from "react";
import { Tree } from "react-d3-tree";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "react-modal";

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }

  insertLeft(value) {
    if (!this.left) {
      this.left = new Node(value);
    } else {
      console.log(`Left child already exists for node ${this.value}`);
    }
  }

  insertRight(value) {
    if (!this.right) {
      this.right = new Node(value);
    } else {
      console.log(`Right child already exists for node ${this.value}`);
    }
  }
}

class BinaryTree {
  constructor(value) {
    this.root = new Node(value);
  }

  display() {
    const levels = [];
    const traverse = (node, level = 0) => {
      if (!node) return;
      if (!levels[level]) levels[level] = [];
      levels[level].push(node.value);
      traverse(node.left, level + 1);
      traverse(node.right, level + 1);
    };
    traverse(this.root);
    return levels;
  }

  toD3Tree(node = this.root, currentNodeCount, maxNodes, highlightNode) {
    if (!node || currentNodeCount.current >= maxNodes) return null;

    const d3Node = {
      name: node.value.toString(),
      attributes: highlightNode === node.value ? { highlight: true } : {},
    };

    currentNodeCount.current++;
    if (node.left && currentNodeCount.current < maxNodes) {
      d3Node.children = [
        this.toD3Tree(node.left, currentNodeCount, maxNodes, highlightNode),
      ];
    }
    if (node.right && currentNodeCount.current < maxNodes) {
      d3Node.children = d3Node.children || [];
      d3Node.children.push(
        this.toD3Tree(node.right, currentNodeCount, maxNodes, highlightNode)
      );
    }

    return d3Node;
  }

  traverseLTR(node = this.root) {
    if (!node) return [];
    return [...this.traverseLTR(node.left), ...this.traverseLTR(node.right), node.value];
  }

  traverseLRT(node = this.root) {
    if (!node) return [];
    return [...this.traverseLRT(node.left), node.value, ...this.traverseLRT(node.right)];
  }

  traverseTLR(node = this.root) {
    if (!node) return [];
    return [node.value, ...this.traverseTLR(node.left), ...this.traverseTLR(node.right)];
  }
}

const BinaryTreePage = () => {
  const [levels, setLevels] = useState(0);
  const [tree, setTree] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isTraverseModalOpen, setIsTraverseModalOpen] = useState(false);
  const [traversals, setTraversals] = useState({ LTR: [], LRT: [], TLR: [] });
  const [renderedNodes, setRenderedNodes] = useState(0);
  const [highlightNode, setHighlightNode] = useState(null);

  useEffect(() => {
    if (tree && renderedNodes < Math.pow(2, levels) - 1) {
      const timer = setTimeout(() => {
        const nextNode = renderedNodes + 1;
        setHighlightNode(nextNode);
        setRenderedNodes(nextNode);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [tree, renderedNodes, levels]);

  useEffect(() => {
    document.title = "Binary Tree Traversal";
  }, []);

  const createTree = (levels) => {
    const bt = new BinaryTree(1);
    let value = 2;
    const generateTree = (node, level) => {
      if (level >= levels) return;
      node.insertLeft(value++);
      node.insertRight(value++);
      generateTree(node.left, level + 1);
      generateTree(node.right, level + 1);
    };
    generateTree(bt.root, 1);
    setTree(bt);
    setRenderedNodes(0);
    setHighlightNode(1);
  };

  const resetTree = () => {
    setTree(null);
    setRenderedNodes(0);
    setHighlightNode(null);
    setIsModalOpen(true);
  };

  const handleTraverse = () => {
    if (tree) {
      setTraversals({
        LTR: tree.traverseLTR(),
        LRT: tree.traverseLRT(),
        TLR: tree.traverseTLR(),
      });
      setIsTraverseModalOpen(true);
    }
  };

  const customPath = ({ source, target }) => {
    const deltaX = target.x - source.x;
    const deltaY = target.y - source.y;
    const controlPointX = source.x + deltaX / 2;
    return `M${source.x},${source.y} C${controlPointX},${source.y} ${controlPointX},${target.y} ${target.x},${target.y}`;
  };

  const currentNodeCount = { current: 0 };
  const d3TreeData = tree
    ? tree.toD3Tree(tree.root, currentNodeCount, renderedNodes + 1, highlightNode)
    : null;

  return (
    <div className="min-h-screen bg-green-600 from-white to-gray-100">
      <h1 className="text-4xl font-bold text-center py-6">Binary Tree</h1>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-8 rounded-lg shadow-lg w-1/3 mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Enter Levels</h2>
        <p className="text-gray-600 mb-6">Specify the number of levels (1-5) to create the binary tree.</p>
        <input
          type="number"
          value={levels}
          onChange={(e) => setLevels(Math.min(5, Math.max(1, parseInt(e.target.value) || 0)))}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={() => {
            setIsModalOpen(false);
            createTree(levels);
          }}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Generate Tree
        </button>
      </Modal>

      {/* Traverse Button */}
      <button
        onClick={handleTraverse}
        className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg hover:bg-green-600"
      >
        Traverse Tree
      </button>

      {/* Reset Button */}
      <button
        onClick={resetTree}
        className="fixed top-4 left-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg hover:bg-red-600"
      >
        Reset Tree
      </button>

      {/* Tree Visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ width: "100vw", height: "80vh" }}
        // className="bg-white grid bg-[radial-gradient(circle,lightgray_1px,transparent_1px)] bg-[length:20px_20px] border border-gray-300 relative"
        className="bg-white grid border border-gray-300 relative"
      >
        {d3TreeData && (
          <Tree
            data={d3TreeData}
            pathFunc={customPath}
            orientation="vertical"
            translate={{ x: window.innerWidth / 2, y: 100 }}
            nodeSize={{ x: 150, y: 150 }}
            styles={{
              nodes: {
                node: {
                  circle: {
                    fill: (nodeData) =>
                      nodeData.attributes?.highlight ? "orange" : "blue",
                  },
                  name: { fill: "white" },
                },
              },
            }}
            onNodeClick={(node) => alert(`Clicked node: ${node.data.name}`)}
          />
        )}
      </motion.div>

      {/* Traversals Modal */}
      <AnimatePresence>
        {isTraverseModalOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-lg w-[370px]"
          >
            <h2 className="text-xl font-bold mb-4">Tree Traversals</h2>
            <p className="mb-2"><strong>LTR:</strong> {traversals.LTR.join(", ")}</p>
            <p className="mb-2"><strong>LRT:</strong> {traversals.LRT.join(", ")}</p>
            <p className="mb-4"><strong>TLR:</strong> {traversals.TLR.join(", ")}</p>
            <button
              onClick={() => setIsTraverseModalOpen(false)}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BinaryTreePage;
