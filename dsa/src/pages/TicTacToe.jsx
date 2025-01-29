import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import MinecraftBtn from '../components/MinecraftBtn';

import MarioX from '/images/mario-x.png'; // Mario's hat for 'X'
import LuigiO from '/images/luigi-o.png'; // Luigi's hat for 'O'
import AnimatedClouds from '../components/AnimatedCloud';
import MarioRunning from '../components/MarioRunning';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  const clickSound = new Audio('/audio/button-click.mp3');

  useEffect(() => {
    document.title = 'Tic-Tac-Toe';
  }, []);

  useEffect(() => {
    const audio = new Audio('/audio/mario.mp3');
    audio.volume = 0.7
    audio.loop = true; 
    audio.play();

    return () => {
      audio.pause();
    };
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
        return { winner: board[a], line };
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
    clickSound.currentTime = 0;
    clickSound.play().catch((err) => {
      console.log('Audio play failed:', err);
    });

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult.winner);
      setWinningLine(gameResult.line);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  const renderSquare = (index) => {
    const isWinningSquare = winningLine.includes(index);

    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`
          flex justify-center items-center 
          h-20 w-20 cursor-pointer shadow-md rounded-lg border-2 border-yellow-600
          ${isWinningSquare ? 'bg-red-500' : 'bg-green-300'} 
          ${board[index] ? 'pointer-events-none' : ''} 
          transition-all duration-300
        `}
        onClick={() => handleClick(index)}
      >
        {board[index] === 'X' && (
          <motion.img
            src={MarioX}
            alt="Mario X"
            className="h-12 w-12"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
        {board[index] === 'O' && (
          <motion.img
            src={LuigiO}
            alt="Luigi O"
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
      className="min-h-screen flex flex-col items-center justify-center bg-blue-400 p-4"
      style={{ backgroundImage: 'url(/images/1-bg.png)', backgroundSize: 'contain' }}
    >
      {winner && <Confetti />}

      <AnimatedClouds />
      <MarioRunning y={440} duration={10} />
      <MarioRunning y={440} duration={40} />


      {/* Header */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <MinecraftBtn onClick={resetGame} className="w-24 h-12 bg-yellow-400 rounded-xl shadow-lg">
          <span className="text-white font-semibold">Restart</span>
        </MinecraftBtn>
        <MinecraftBtn
          onClick={resetGame}
          className="px-8 py-3 bg-yellow-400 text-white rounded-xl shadow-lg"
        >
          Another Round?
        </MinecraftBtn>
      </div>

      {/* Game Board */}
      <div className="pixel-corners border-4 border-yellow-600 rounded-xl p-6 bg-white">
        <h2 className="text-3xl text-black text-center font-bold mb-4">Tic-Tac-Toe</h2>
        <div className="grid grid-cols-3 gap-4">
          {board.map((_, index) => renderSquare(index))}
        </div>

      </div>

      {/* Next Move */}
      <div className="bg-yellow-600 rounded border-black border-2 p-3 flex items-center mt-6">
        <div className='text-2xl text-black'>
          Next Move: {isXNext ? 'Mario (X)' : 'Luigi (O)'}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
