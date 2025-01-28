import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar } from 'react-icons/fa';
import CustomButton from '../components/CustomButton';

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
    document.title = "Stack";
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
    if (isDeparting) return; // Prevent spamming
    if (garage.length === 0) {
      showMessage('Garage is empty!');
      return;
    }

    setIsDeparting(true); // Set departure state
    const lastCar = garage[garage.length - 1];
    setDepartingCar(lastCar);

    setTimeout(() => {
      setGarage(garage.slice(0, -1));
      setDepartures(departures + 1);
      setDepartingCar(null);
      setIsDeparting(false); // Reset departure state
      showNotification(`Car ${lastCar} departed!`);
    }, 1000); // Match this timeout to the animation duration
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
    departLastCar(); // Use the same logic as departLastCar
    setPlateNumber('');
  };

  return (
    <div className="min-h-screen bg-[#D9D9D9] p-6 text-gray-800 relative
    ">
      <div className='flex justify-center items-center gap-2'>
        <div className='p-2 rounded-lg border-4 border-black mb-3'>
          <h1 className="text-4xl text-center font-mono text-black">STACK PUP CEA PARKING GARAGE</h1>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="fixed top-4 right-4 text-black border-2 border-black py-2 px-8 rounded z-50"
        >
          {notification}
        </motion.div>
      )}

      <div className="flex gap-5">
        {/* Form Section */}
        <div className='w-[40%] h-[500px] bg-[#D9D9D9] flex flex-col justify-center items-center p-6 rounded-lg border-4 border-black shadow'>
            <h2 className="text-2xl font-bold mb-1 text-center">Car Arrival/Departure</h2>
            <div className="mt-2 flex gap-10">
              <p className="text-lg text-center">Total Arrivals: {arrivals}</p>
              <p className="text-lg text-center">Total Departures: {departures}</p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col space-y-2"
            >
              <label className="text-lg text-center">Car Plate Number:</label>
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="Enter Plate Number"
                className="p-2 rounded border border-black bg-[#FFF] text-center"
              />
              <div className='flex justify-center items-center gap-2'>
                <CustomButton
                  variant="clear"
                  icon={() => <FaCar className="text-xl" />}
                  onClick={handleArrival}
                >
                  Arrival
                </CustomButton>
                <CustomButton
                  variant="clear"
                  icon={() => <FaCar className="text-xl" />}
                  onClick={handleDeparture}
                >
                  Departure
                </CustomButton>
                <CustomButton
                  variant="clear"
                  icon={() => <FaCar className="text-xl" />}
                  onClick={departLastCar}
                >
                  Depart
                </CustomButton>

              </div>
            </form>
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-20 border-2 border-red-400 text-red-700 p-3 rounded"
              >
                {message}
              </motion.div>
            )}

        </div>

        {/* Garage Section */}
        <div className="w-[60%] border-black rounded-lg border-4 flex justify-center items-center">
          <div className="p-3 gap-1 rounded-lg shadow-lg border border-gray-200 w-full h-[500px] flex flex-col-reverse items-center overflow-hidden">
            {garage.map((car, index) => (
              <motion.div
                key={index}
                initial={{ y: -50, opacity: 0 }}
                animate={
                  departingCar === car
                    ? { x: 300, opacity: 0 } // Animate departure
                    : { y: 0, opacity: 1 }
                }
                transition={{ type: 'tween', stiffness: 100, duration: 0.5 }}
                className="border border-black text-gray-800 p-[10px] text-sm rounded-lg w-[100%] flex items-center justify-between shadow-md"
              >
                <span>Plate Number: {car}</span>
                <FaCar className="text-xl text-black" />
              </motion.div>
            ))}
            {garage.length === 0 && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex justify-center flex-col items-center space-y-4">
                  <FaCar className="text-6xl text-black" />
                  <p className="text-2xl font-bold text-black">Garage is Empty</p>
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
