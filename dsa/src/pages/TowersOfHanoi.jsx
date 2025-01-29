import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiMushroom } from "react-icons/gi"; // Mario Mushroom Icon
import CustomButton from "../components/CustomButton";

const TowerOfHanoi = () => {
  const [disks, setDisks] = useState(3);
  const [towers, setTowers] = useState([
    Array.from({ length: 3 }, (_, i) => 3 - i),
    [],
    [],
  ]);
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(true);
  const [exceededMoves, setExceededMoves] = useState(false);
  const [draggedDisk, setDraggedDisk] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [hoveredTower, setHoveredTower] = useState(null);

  const minMoves = Math.pow(2, disks) - 1;

  useEffect(() => {
    document.title = 'Towers of Mario Hanoi';
  }, []);

  useEffect(() => {
    const isComplete = towers[2].length === disks;
    setIsSolved(isComplete);
    setExceededMoves(moves > minMoves);
  }, [towers, moves, disks]);

  useEffect(() => {
    const audio = new Audio('/audio/mario.mp3');
    audio.volume = 0.7
    audio.loop = true; 
    audio.play();

    return () => {
      audio.pause();
    };
  }, []);


  useEffect(() => {
    let interval = null;

    if (isTimerRunning && !isSolved) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timer, isSolved]);

  const resetGame = () => {
    setTowers([Array.from({ length: disks }, (_, i) => disks - i), [], []]);
    setMoves(0);
    setIsSolved(false);
    setExceededMoves(false);
    setTimer(0);
    setIsTimerRunning(false);
    setErrorMessage(""); 
    setHoveredTower(null); 
  };

  const handleDragStart = (disk) => {
    setDraggedDisk(disk);
    if (!isTimerRunning && !isSolved) {
      setIsTimerRunning(true);
    }
  };

  const handleDrop = (to) => {
    if (draggedDisk === null || isSolved) return;

    const from = towers.findIndex((tower) => tower.includes(draggedDisk));

    if (
      from !== -1 &&
      (towers[to].length === 0 || towers[to][towers[to].length - 1] > draggedDisk)
    ) {
      const newTowers = towers.map((tower, index) => {
        if (index === from) {
          return tower.slice(0, -1);
        }
        if (index === to) {
          return [...tower, draggedDisk];
        }
        return tower;
      });
      setTowers(newTowers);
      setMoves(moves + 1);
      setErrorMessage(""); 
    } else {
      setErrorMessage("Invalid move! Disk is larger");
    }
    setDraggedDisk(null);
    setHoveredTower(null); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[url('/images/2-bg.jpg')] bg-contain text-white relative">


      <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 bg-blue-500 z-1"></div>
      <div className="text-center mb-4 z-10 mt-20">
        <h1 className="text-4xl font-pressStart text-yellow-500">Towers of Mario Hanoi</h1>
        <div className="flex gap-4 items-center justify-center">
          <p className="text-lg text-white">Number of disks:</p>
          <input
            type="number"
            value={disks}
            min={3}
            max={5}
            onChange={(e) => {
              const num = parseInt(e.target.value);
              setDisks(num);
              setTowers([Array.from({ length: num }, (_, i) => num - i), [], []]);
              setMoves(0);
              setIsSolved(false);
              setExceededMoves(false);
              setTimer(0);
              setIsTimerRunning(false);
              setErrorMessage("");
            }}
            className="text-center border-none border-black rounded-md p-2 bg-transparent text-black"
          />
        </div>
      </div>

      <div className="relative z-10 flex justify-center items-start gap-9 w-full max-w-4xl">
        <div className="bg-yellow-600 border-4 border-black h-10 w-full absolute bottom-[-36px]"></div>
        {towers.map((tower, i) => (
          <div
            key={i}
            className="w-60 flex justify-center"
            onDragOver={(e) => {
              e.preventDefault();
              setHoveredTower(i); 
            }}
            onDrop={() => handleDrop(i)}
            onDragLeave={() => setHoveredTower(null)} 
          >
            <div
              className={`flex flex-col items-center justify-end relative h-64 w-[30px] bg-yellow-600 border-4 border-black border-b-0 rounded-t-lg ${hoveredTower === i ? "bg-slate-400" : ""}`}
            >
              {tower.map((disk, index) => (
                <motion.div
                  key={disk}
                  className={` absolute bg-[#D9D9D9] border-4 text-black font-bold text-center border-black rounded-md cursor-grab ${
                    draggedDisk === disk ? "opacity-50" : "opacity-100"
                  }`}
                  draggable={index === tower.length - 1}
                  onDragStart={() => handleDragStart(disk)}
                  style={{
                    width: `${40 + disk * 20}px`,
                    height: "24px",
                    bottom: `${index * 26}px`,
                    left: `calc(50% - ${(40 + disk * 20) / 2}px)`,
                  }}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="z-10 flex mt-10 gap-5">
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-red-500 text-white rounded-md shadow-lg hover:bg-red-600 transition-all duration-300"
        >
          Reset
        </button>
        <div className="flex gap-5 absolute top-10 right-10">
          <p className={`text-lg font-bold ${exceededMoves ? "text-red-500" : "text-white"}`}>
            Moves: {moves}
          </p>
          <p className="text-lg font-bold text-white">Time: {timer}s</p>
        </div>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            className="z-20 absolute top-16 right-5 text-lg text-red-600 font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSolved && (
          <motion.p
            className={`z-20 absolute top-10 right-5 mt-6 text-lg ${exceededMoves ? "text-yellow-600" : "text-green-600"} font-bold`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            {exceededMoves
              ? "At least you did it, but with more moves than necessary!"
              : "Congratulations! You solved it!"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TowerOfHanoi;
