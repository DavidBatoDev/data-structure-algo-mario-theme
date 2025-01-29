import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar } from 'react-icons/fa';
import CustomButton from '../components/CustomButton';
import { GiMushroom } from 'react-icons/gi'; // Mario Mushroom Icon
import { FaMoneyBill } from 'react-icons/fa'; // Money icon for depart action
import AnimatedClouds from '../components/AnimatedCloud';

const Stack = () => {
  const [garage, setGarage] = useState([]);
  const [plateNumber, setPlateNumber] = useState('');
  const [arrivals, setArrivals] = useState(0);
  const [departures, setDepartures] = useState(0);
  const [message, setMessage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [departingCar, setDepartingCar] = useState(null);
  const [isDeparting, setIsDeparting] = useState(false);

  useEffect(() => {
    document.title = "Mario Stack Parking Garage";
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

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const departLastCar = () => {
    if (isDeparting) return;
    if (garage.length === 0) {
      showMessage('Garage is empty!');
      return;
    }

    setIsDeparting(true);
    const lastCar = garage[garage.length - 1];
    setDepartingCar(lastCar);

    setTimeout(() => {
      setGarage(garage.slice(0, -1));
      setDepartures(departures + 1);
      setDepartingCar(null);
      setIsDeparting(false);
      showNotification(`Car ${lastCar} departed!`);
    }, 1000);
  };

  const handleArrival = () => {
    if (!plateNumber.trim()) {
      showMessage('Plate number cannot be empty!');
      return;
    }
    if (plateNumber.length > 11) {
      showMessage('Plate number must be 11 characters or less!');
      return;
    }
    if (garage.includes(plateNumber)) {
      showMessage('Plate number must be unique!');
      return;
    }
    if (garage.length >= 10) {
      showMessage('Garage is full!');
      return;
    }
    setGarage([...garage, plateNumber]);
    setPlateNumber('');
    setArrivals(arrivals + 1);
    showNotification(`Car ${plateNumber} arrived!`);
  };

  const handleDeparture = () => {
    if (!plateNumber.trim()) {
      showMessage('Plate number cannot be empty!');
      return;
    }
    if (!garage.includes(plateNumber)) {
      showMessage('Car not found in the garage!');
      return;
    }
    if (garage[garage.length - 1] !== plateNumber) {
      showMessage('Car must be at the top of the stack to depart!');
      return;
    }
    departLastCar();
    setPlateNumber('');
  };

  return (
    <div className="min-h-screen bg-[url('/images/2-bg.jpg')] bg-contain py-3 px-4 text-white relative">
      <div className='flex justify-center items-center gap-2'>
        <div className='p-2 rounded-lg border-4 border-yellow-400 mb-3'>
          <h1 className="text-4xl text-center font-pressStart text-yellow-500">MARIO STACK PARKING GARAGE</h1>
        </div>
      </div>

      <AnimatedClouds />

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="fixed top-4 right-4 text-white bg-blue-500 border-2 border-yellow-500 py-2 px-8 rounded z-50"
        >
          {notification}
        </motion.div>
      )}

      <div className="flex gap-5">
        {/* Form Section */}
        <div className="z-10 w-full md:w-[40%] h-[470px] bg-red-600 flex flex-col justify-center items-center p-6 rounded-lg border-4 border-yellow-500 shadow-lg">
          <h2 className="text-2xl font-bold mb-1 text-center text-white">Car Arrival/Departure</h2>
          <div className="mt-2 flex gap-10 text-white">
            <p className="text-lg text-center">Total Arrivals: {arrivals}</p>
            <p className="text-lg text-center">Total Departures: {departures}</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-4 w-full max-w-xs mx-auto">
            <label className="text-lg text-center text-white">Car Plate Number:</label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="Enter Plate Number"
              className="p-3 rounded border-2 border-yellow-600 bg-white text-center font-mono text-gray-800 w-full"
            />
            <div className="flex gap-4 w-full justify-center items-center">
              <CustomButton
                variant="departLastCar"
                className={'w-[140px] text-xs'}
                icon={() => <FaMoneyBill className="text-2xl text-red-400" />}
                onClick={handleArrival}
              >
                Arrival
              </CustomButton>
              <CustomButton
                className={'w-[140px] text-xs'}

                variant="departLastCar"
                icon={() => <FaMoneyBill className="text-2xl text-red-400" />}
                onClick={handleDeparture}
              >
                Departure
              </CustomButton>
              <CustomButton
                variant="departLastCar"
                icon={() => <FaMoneyBill className="text-2xl text-red-400" />}
                onClick={departLastCar}
                className={'w-[140px] text-xs'}


              >
                Depart Top Car
              </CustomButton>
            </div>
          </form>
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-10 border-2 border-yellow-400 text-yellow-400 p-2 text-[9px] rounded"
            >
              {message}
            </motion.div>
          )}
        </div>

        {/* Garage Section */}
        <div className="z-10 w-full md:w-[60%] border-yellow-500 rounded-lg border-4 flex justify-center items-center">
          <div className="p-3 bg-white opacity-90 gap-1 rounded-lg shadow-lg border border-gray-200 w-full h-[470px] flex flex-col-reverse items-center overflow-hidden">
            {garage.map((car, index) => (
              <motion.div
                key={index}
                initial={{ y: -50, opacity: 0 }}
                animate={
                  departingCar === car
                    ? { x: 300, opacity: 0 }
                    : { y: 0, opacity: 1 }
                }
                transition={{ type: 'tween', stiffness: 100, duration: 0.5 }}
                className="bg-yellow-600 border border-black text-gray-800 p-[10px] text-sm rounded-lg w-[100%] flex items-center justify-between shadow-md"
              >
                <span>Plate Number: {car}</span>
                <img src="/images/mario-cart.png" className='w-5 h-5 bg-cover' alt="" />
              </motion.div>
            ))}
            {garage.length === 0 && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex justify-center flex-col items-center space-y-4">
                  {/* <GiMushroom className="text-6xl text-red-600" /> */}
                  <img src="/images/mario-cart.png" className='w-36 h-36' alt="" />
                  <p className="text-2xl font-bold text-yellow-500">Garage is Empty</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stack;
