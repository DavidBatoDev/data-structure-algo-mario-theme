import React, { useRef, useState } from "react";
import MinecraftBtn from "../components/MinecraftBtn";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import AnimatedClouds from "../components/AnimatedCloud";
import { useNavigate } from "react-router-dom";
import MarioRiding from "../components/MarioRiding";

function Homepage() {
  const navigate = useNavigate();
  // Ref for the <audio> element
  const audioRef = useRef(null);

  // State to track whether audio is playing
  const [isPlaying, setIsPlaying] = useState(false);

  // Toggle audio playback
  const handleSoundToggle = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      // Start playing
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Playback failed:", err);
      });
    } else {
      // Pause
      audioRef.current.pause();
    }

    // Flip the isPlaying state
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-blue-400 flex flex-col justify-center items-center bg-contain bg-[url('/images/5-bg.png')]">
      <audio ref={audioRef} src="/audio/mario.mp3" />
      <AnimatedClouds />
      <MarioRiding y={400} />
      {/* Title */}
      <div className="z-10 text-center text-white mt-16">
        <h1 className="text-stroke text-5xl text-gray-300 font-pressStart text-shadow-md">DSA CASE STUDY</h1>
      </div>

      {/* Buttons */}
      <div className="z-10 flex gap-8 mt-12">
        <MinecraftBtn onClick={() => navigate('/case1')} className="px-8 py-3 text-2xl font-bold text-white bg-yellow-600 rounded-lg shadow-lg transform transition-transform hover:scale-110 hover:bg-orange-600">
          Play
        </MinecraftBtn>
      </div>

      <div>
        <button
          onClick={handleSoundToggle}
          className="fixed bottom-4 right-4 p-2 bg-yellow-500 text-white rounded-full shadow-lg"
        >
          {isPlaying ?  <FaVolumeUp size={24} /> : <FaVolumeMute size={24} />}
        </button>
      </div>

      <div className="flex flex-col justify-center items-center text-white mt-6">
        <div>Group 13</div>
        <div className="z-30 flex flex-col text-center mt-4">
          <span>Atienza, Angel G.</span>
          <span>Chavez, Trisha Mae A.</span>
          <span>Marquez, Leslie Nicole L.</span>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
