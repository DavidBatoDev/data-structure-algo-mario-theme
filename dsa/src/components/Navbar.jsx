import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';
import { path } from 'framer-motion/client';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { path: '/case1', name: 'Tic-Tac-Toe' },
    { path: '/case2', name: 'Stack' },
    {path: '/case3', name: 'Queue'},
    { path: '/case4', name: 'Binary Tree' },
    {path: '/case5', name: 'BST with Traversal'},
    {path: '/case6', name: 'Towers of Hanoi'},
    {path: '/case7', name: 'Sorting'}
  ];

  return (
    <div className="relative">
      {/* Menu Button */}
      {!isOpen && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={toggleDrawer}
            className="p-2 bg-primary text-dark rounded-full shadow-md hover:bg-primary-light transition"
          >
            <FiMenu size={24} />
          </button>
        </div>
      )}

      {/* Drawer */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        // transition={{ duration: 0.5, ease: 'easeInOut' }}
        // transition={{ duration: 0.5, ease: 'linear' }}
        // transition={{ duration: 0.5, ease: 'easeOut' }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        // transition={{ type: 'tween', duration: 0.2, }}
        // transition={{ type: 'spring', stiffness: 70 }}
        // transition={{ type: 'keyframes', duration: 0.7, ease: 'easeInOut' }}
        className="bg-[#D9D9D9] border-black border-r-4 shadow-craftingInset text-black fixed top-0 left-0 h-full w-64 z-50"
      >
        <h2 className="text-2xl font-bold text-gray-800 p-6">Navigation</h2>
        <ul className="display flex flex-col">
          {navLinks.map((link) => (
            <li key={link.path} className='hover:bg-slate-300 p-3'>
              <Link
                to={link.path}
                className="block text-lg hover:text-black transition"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black z-30"
          onClick={toggleDrawer}
        ></motion.div>
      )}
    </div>
  );
};

export default Navbar;
