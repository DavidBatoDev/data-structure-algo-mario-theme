import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCar } from "react-icons/fa";
import CustomButton from "../components/CustomButton";

const Queue = () => {
  const [garage, setGarage] = useState([]);
  const [plateNumber, setPlateNumber] = useState("");
  const [arrivals, setArrivals] = useState(0);
  const [departures, setDepartures] = useState(0);
  const [message, setMessage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [highlightedCar, setHighlightedCar] = useState(null);

  useEffect(() => {
    document.title = "Queue";
  }, []);

  useEffect(() => {
    const foundCar = garage.find(car => plateNumber === car);
    setHighlightedCar(foundCar || null);
  }, [plateNumber, garage]);
  


  console.log(garage);
  console.log(highlightedCar);

  // Helper to show a quick error/warning message
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  // Helper to show a quick arrival/departure message
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  // Enqueue / Arrival
  const handleArrival = () => {
    if (!plateNumber.trim()) {
      showMessage("Plate number cannot be empty!");
      return;
    }
    if (garage.includes(plateNumber)) {
      showMessage("Plate number must be unique!");
      return;
    }
    if (garage.length >= 10) {
      showMessage("Garage is full!");
      return;
    }
    setGarage((prev) => [...prev, plateNumber]);
    setPlateNumber("");
    setArrivals((prev) => prev + 1);
    showNotification(`Car ${plateNumber} arrived!`);
  };

  // Dequeue / Departure
  const handleDepartureLastCar = () => {
    if (garage.length === 0) {
      showMessage("Garage is empty!");
      return;
    }
    const departingCar = garage[0];
    // Immediately remove the first car
    setGarage((prev) => prev.slice(1));
    setDepartures((prev) => prev + 1);
    showNotification(`Car ${departingCar} departed!`);
  };
  
  const departCar = (plateNumber) => {
    if (garage.length === 0) {
      showMessage("Garage is empty!");
      return;
    }
    if (!plateNumber.trim()) {
      showMessage("Plate number cannot be empty!");
      return;
    }

    if (!garage.includes(plateNumber)) {
      showMessage("Car is not in the garage!");
      return;
    }

    if (garage.indexOf(plateNumber) !== 0) {
      showMessage("Car is not in front!");
      return;
    }
    const departingCar = garage[garage.indexOf(plateNumber)];
    // Immediately remove the first car
    setGarage((prev) => prev.filter((car) => car !== plateNumber));
    setDepartures((prev) => prev + 1);
    showNotification(`Car ${departingCar} departed!`);
  };

  return (
    <div className="min-h-screen bg-[#D9D9D9] p-10 text-gray-800 relative">
      <h1 className="text-4xl font-mono mb-6 text-center">PUP-CEA Parking Garage</h1>

      {/* Notification (Animated Slide-In) */}
      {notification && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="fixed top-4 right-4 bg-green-500 text-white py-2 px-8 rounded shadow-lg z-50"
        >
          {notification}
        </motion.div>
      )}

      {/* Form Section */}
      <div className="flex justify-center mb-8 relative">
        <div className="text-black p-6 rounded-lg shadow-lg border-4 border-black w-[1300px] max-w-7xl min-h-64">
          <h2 className="text-2xl font-bold mb-4 text-center">Car Arrival/Departure</h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 justify-center"
          >
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="Enter Plate Number"
              className="p-2 rounded border border-black text-black border-dark bg-transparent w-full md:w-auto"
            />
            <CustomButton
              variant="arrival"
              size="md"
              onClick={handleArrival}
              className="flex items-center justify-center gap-2"
            >
              <FaCar className="text-xl" />
              <span>Arrival</span>
            </CustomButton>
            <CustomButton
              variant="departure"
              size="md"
              className="flex items-center justify-center gap-2"
              onClick={() => departCar(plateNumber)}

            >
              <FaCar className="text-xl" />
              <span>Departure</span>
            </CustomButton>


            <CustomButton
              variant="departLastCar"
              onClick={handleDepartureLastCar}
              className="flex items-center justify-center gap-2"
            >
              <FaCar className="text-xl" />
              <span>Depart Front</span>
            </CustomButton>
          </form>
          <div className="mt-6 w-full flex justify-around">
            <div className="flex gap-10">
              <p className="text-lg">Total Arrivals: {arrivals}</p>
              <p className="text-lg">Total Departures: {departures}</p>
            </div>
          </div>
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 absolute left-1/2 -translate-x-1/2 bottom 10 bg-red-100 text-red-700 p-3 rounded border border-red-400 text-center"
            >
              {message}
            </motion.div>
          )}
        </div>
      </div>

      {/* Garage Section */}
      <div className="h-48 p-4 rounded-lg shadow-lg border-4 border-black w-full max-w-7xl mx-auto flex justify-center items-center overflow-x-auto space-x-4">
        <div className="overflow-hidden flex gap justify-start items-center w-full mx-auto">
          <AnimatePresence>
            {garage.map((car, index) => {
              // Is this car the front or rear of the queue?
              const isFront = index === 0;
              const isRear = index === garage.length - 1;

              // If there's only one car, it's both front and rear
              // You could add special styling if isFront && isRear
              // For simplicity, we'll show both labels if there's only 1 car.
              let carImage = "";
              if (isFront && isRear) {
                // Both front and rear
                carImage = '/images/car-front.png'
                // borderClass = "border-4 border-primary"; 
              } else if (highlightedCar === car) {
                carImage = '/images/car-me.png'
              } else if (isFront) {
                carImage = '/images/car-front.png'
              } else if (isRear) {
                carImage = '/images/car-rear.png';
              } else {
                carImage = '/images/car.png';
              }

              return (
                <motion.div
                  key={car}
                  layout
                  initial={{ x: 1000, opacity: 1 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 1 }}
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                    duration: 1,
                    
                  }}
                  className={`relative text-gray-800 rounded-lg flex items-center justify-between flex-col min-w-[100px]`}
                >
                  {/* Car icon and plate number */}
                  <img src={carImage} style={{objectFit: "cover"}} className="w-[120px] h-36 mb-[-40px]" />
                  <span className="text-sm font-bold">PN: {car}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* If garage is empty */}
          {garage.length === 0 && (
            <div className="w-full flex items-center justify-center">
              <div className="flex gap-5 items-center space-y-4">
                <img src="/images/car.png"  className='w-32' alt="" />
                <p className="text-2xl font-bold text-black">Garage is Empty</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Queue;
