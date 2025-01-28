import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import MinecraftBtn from '../components/MinecraftBtn';

import X from '/images/X.png'
import O from '/images/O.png'

// Import the SVGs
import RedApple from '/svg/red-apple.svg';
import GoldenApple from '/svg/golden-apple.svg';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]); // Track the winning line indices

  const clickSound = new Audio('/audio/button-click.mp3');

  useEffect(() => {
    document.title = 'Tic-Tac-Toe';
  }, []);

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line }; // Return both the winner and the winning line
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O'; 
    setBoard(newBoard);
    setIsXNext(!isXNext);
    clickSound.currentTime = 0; // Reset playback in case clicked repeatedly
    clickSound.play().catch((err) => {
      console.log('Audio play failed:', err);
    });

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult.winner);
      setWinningLine(gameResult.line); // Store the winning line indices
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]); // Reset the winning line
  };

  const renderSquare = (index) => {
    const isWinningSquare = winningLine.includes(index); // Check if the square is part of the winning line

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex justify-center items-center 
          h-20 w-20 cursor-pointer shadow-inner rounded border-2 border-black hover:bg-yello-300
          ${isWinningSquare ? 'bg-blue-400' : 'bg-transparent'} 
          ${board[index] ? 'pointer-events-none' : ''}
        `}
        onClick={() => handleClick(index)}
      >
        {board[index] === 'X' && (
          <motion.img
            src={X}
            alt="X"
            className="h-12 w-12"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
        {board[index] === 'O' && (
          <motion.img
            src={O}
            alt="O"
            className="h-12 w-12"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#D9D9D9] p-4"
    >
      {winner && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <MinecraftBtn onClick={resetGame} className="w-20 h-10 rounded-xl shadow-md">
          <span className="">Restart</span>
        </MinecraftBtn>
        {/* Restart Button */}
        <MinecraftBtn
          onClick={resetGame}
          className="px-6 py-2 text-black rounded-xl shadow-md transition"
        >
          Another Round?
        </MinecraftBtn>
        {/* <MinecraftBtn onClick={() => window.location.reload()} className="w-10 h-10 rounded shadow-md">
          <span className="font-minecraftRegular">✕</span>
        </MinecraftBtn> */}
      </div>

      {/* Game Board */}
      <div className="border-4 border-black rounded-xl p-6">
        <h2 className="text-2xl text-black text-center mb-4">Tic Tac Toe</h2>
        <div className="grid grid-cols-3 gap-2">
          {board.map((_, index) => renderSquare(index))}
        </div>
      </div>

      {/* Next Move */}
      <div className="flex items-center mt-6">
        <div className='text-2xl font-mono text-black'>
          Next Movie : {isXNext ? 'X' : 'O'}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
