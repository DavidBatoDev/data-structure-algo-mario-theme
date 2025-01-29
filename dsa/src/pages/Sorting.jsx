import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { div } from 'framer-motion/client';
import CustomButton from '../components/CustomButton';
import AnimatedClouds from '../components/AnimatedCloud';

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [currentAlgorithm, setCurrentAlgorithm] = useState('');
  const [comparing, setComparing] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [arrayLength, setArrayLength] = useState(8);
  const [animationSpeed, setAnimationSpeed] = useState(300);
  const [currentMin, setCurrentMin] = useState(null);
  const [mergingGroups, setMergingGroups] = useState([]);

  const generateArray = (length = arrayLength) => {
    const newArray = Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
  };

    useEffect(() => {
      const audio = new Audio('/audio/mario.mp3');
      audio.volume = 0.7
      audio.loop = true; 
      audio.play();
  
      return () => {
        audio.pause();
      };
    }, []);

  const handleArrayLengthChange = (e) => {
    const newLength = parseInt(e.target.value);
    setArrayLength(newLength);
    generateArray(newLength);
  };

  const handleAnimationSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setAnimationSpeed(newSpeed);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Bubble Sort');
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparing([j, j + 1]);
        await delay(animationSpeed);

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }
    }
    setComparing([]);
    setSorting(false);
  };

  const selectionSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Selection Sort');
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      setCurrentMin(minIndex);

      for (let j = i + 1; j < n; j++) {
        setComparing([minIndex, j]);
        await delay(animationSpeed);

        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        const tempArr = [...arr];
        tempArr[i] = arr[minIndex];
        tempArr[minIndex] = arr[i];
        setArray(tempArr);
        await delay(animationSpeed);

        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        setArray([...arr]);
      }

      setCurrentMin(null);
    }

    setComparing([]);
    setSorting(false);
  };

  const insertionSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Insertion Sort');
    const arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      let insertPosition = j + 1;

      while (j >= 0 && arr[j] > key) {
        setComparing([j, j + 1]);
        await delay(animationSpeed);

        arr[j + 1] = arr[j];
        insertPosition = j;
        j--;
        
        const tempArr = [...arr];
        tempArr[insertPosition] = key;
        setArray(tempArr);
      }

      arr[insertPosition] = key;
      setArray([...arr]);
      await delay(animationSpeed);
    }
    
    setComparing([]);
    setSorting(false);
  };

  const mergeSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Merge Sort');
    const arr = [...array];

    const merge = async (start, mid, end) => {
      const leftArray = arr.slice(start, mid + 1);
      const rightArray = arr.slice(mid + 1, end + 1);
      
      setMergingGroups([
        { start, end: mid },
        { start: mid + 1, end }
      ]);
      await delay(animationSpeed);

      let i = 0, j = 0, k = start;
      
      while (i < leftArray.length && j < rightArray.length) {
        setComparing([start + i, mid + 1 + j]);
        await delay(animationSpeed);

        if (leftArray[i] <= rightArray[j]) {
          arr[k] = leftArray[i];
          i++;
        } else {
          arr[k] = rightArray[j];
          j++;
        }
        setArray([...arr]);
        k++;
      }

      while (i < leftArray.length) {
        arr[k] = leftArray[i];
        setArray([...arr]);
        i++;
        k++;
        await delay(animationSpeed);
      }

      while (j < rightArray.length) {
        arr[k] = rightArray[j];
        setArray([...arr]);
        j++;
        k++;
        await delay(animationSpeed);
      }
    };

    const mergeSortRecursive = async (start, end) => {
      if (start >= end) return;

      const mid = Math.floor((start + end) / 2);
      await mergeSortRecursive(start, mid);
      await mergeSortRecursive(mid + 1, end);
      await merge(start, mid, end);
    };

    await mergeSortRecursive(0, arr.length - 1);
    setMergingGroups([]);
    setComparing([]);
    setSorting(false);
  };

  const quickSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Quick Sort');
    const arr = [...array];

    const partition = async (arr, low, high) => {
      let pivot = arr[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        setComparing([i + 1, j]);
        await delay(animationSpeed);

        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      return i + 1;
    };

    const quickSortRecursive = async (arr, low, high) => {
      if (low < high) {
        let pivotIndex = await partition(arr, low, high);
        await quickSortRecursive(arr, low, pivotIndex - 1);
        await quickSortRecursive(arr, pivotIndex + 1, high);
      }
      return arr;
    };

    await quickSortRecursive(arr, 0, arr.length - 1);
    setComparing([]);
    setSorting(false);
  };

  const heapSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Heap Sort');
    const arr = [...array];

    const heapify = async (arr, n, i) => {
      let largest = i;
      let left = 2 * i + 1;
      let right = 2 * i + 2;

      if (left < n) {
        setComparing([largest, left]);
        await delay(animationSpeed);
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      if (right < n) {
        setComparing([largest, right]);
        await delay(animationSpeed);
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        setArray([...arr]);
        await heapify(arr, n, largest);
      }
    };

    const heapSortAlgorithm = async () => {
      let n = arr.length;

      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
      }

      for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        setArray([...arr]);
        await heapify(arr, i, 0);
      }
    };

    await heapSortAlgorithm();
    setComparing([]);
    setSorting(false);
  };

  const shellSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Shell Sort');
    const arr = [...array];
    const n = arr.length;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        let temp = arr[i];
        let j;

        for (j = i; j >= gap; j -= gap) {
          setComparing([j - gap, j]);
          await delay(animationSpeed);

          if (arr[j - gap] > temp) {
            arr[j] = arr[j - gap];
            setArray([...arr]);
          } else {
            break;
          }
        }
        arr[j] = temp;
      }
    }
    setComparing([]);
    setSorting(false);
  };

  useEffect(() => {
    generateArray();
  }, []);

  const sortingAlgorithms = [
    { name: 'Bubble Sort', algorithm: bubbleSort },
    { name: 'Selection Sort', algorithm: selectionSort },
    { name: 'Insertion Sort', algorithm: insertionSort },
    { name: 'Merge Sort', algorithm: mergeSort },
    { name: 'Quick Sort', algorithm: quickSort },
    { name: 'Heap Sort', algorithm: heapSort },
    { name: 'Shell Sort', algorithm: shellSort }
  ];

  return (
    <div className='flex justify-center bg-[url("/images/5-bg.png")] bg-contain'>

      <AnimatedClouds />
      <div className=" h-screen mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Sorting</h1>
        
        <div className="z-30 flex flex-wrap items-center space-x-4 mb-4">
          <div className="z-30 flex items-center space-x-2">
            <label htmlFor="arrayLength" className="mr-2">Array Length:</label>
            <input 
              type="number" 
              id="arrayLength"
              min="5" 
              max="18" 
              value={arrayLength} 
              onChange={handleArrayLengthChange}
              disabled={sorting}
              className="w-20 p-1 border rounded"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="animationSpeed" className="mr-2">Animation Speed (ms):</label>
            <input 
              type="number" 
              id="animationSpeed"
              min="50" 
              max="2000" 
              value={animationSpeed} 
              onChange={handleAnimationSpeedChange}
              disabled={sorting}
              className="w-20 p-1 border rounded"
            />
          </div>
          
          <button 
            onClick={() => generateArray(arrayLength)} 
            disabled={sorting}
            className="z-30 bg-yellow-600 text-white border-2 border-black hover:bg-slate-400 p-2 rounded"
          >
            Generate New Array
          </button>
        </div>

        <div className="flex justify-center space-x-2 mb-4 flex-wrap">
          {sortingAlgorithms.map(({ name, algorithm }) => (
            <CustomButton
              key={name}
              onClick={algorithm}
              disabled={sorting}
              className="bg-yellow-500 p-3 text-white hover:bg-slate-300 m-1 rounded"
            >
              {name}
            </CustomButton>
          ))}
        </div>

        <div className="relative h-52 mx-auto" style={{ width: `${array.length * 64}px` }}>
          <AnimatePresence mode="popLayout">
            {array.map((value, index) => {
              const isInMergingGroup = mergingGroups.some(
                group => index >= group.start && index <= group.end
              );
              
              return (
                <motion.div
                  key={`${index}-${value}`}
                  layout
                  initial={{ 
                    scale: 0.8,
                    opacity: 0,
                  }}
                  animate={{ 
                    scale: comparing.includes(index) ? 1.1 : 1,
                    opacity: 1,
                    y: comparing.includes(index) ? -20 : 0,
                    // height: `${value * 2}px`,
                    height: '48px',
                    backgroundColor: 
                      comparing.includes(index) ? '#EF4444' : 
                      isInMergingGroup ? '#8B5CF6' :
                      (currentMin === index ? '#10B981' : 'green'),
                    border: comparing.includes(index) ? '2px solid black' : '2px solid black',
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      mass: 0.8,
                    }
                  }}
                  exit={{ 
                    scale: 0.8,
                    opacity: 0
                  }}
                  style={{
                    position: 'absolute',
                    left: `${index * 64}px`,
                    bottom: 0,
                    width: '48px',
                  }}
                  className="pixel-corners rounded-lg flex items-center justify-center text-white font-bold"
                >
                  {value}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {currentAlgorithm && (
          <div className="mt-4 text-center">
            <p className="text-lg text-white">Current Algorithm: {currentAlgorithm}</p>
          </div>
        )}
      </div>


    </div>
  );
};

export default SortingVisualizer;