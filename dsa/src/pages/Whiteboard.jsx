import {useEffect} from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Whiteboard = ({ children }) => {

  return (
    
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center">
      <TransformWrapper
        initialScale={1}
        minScale={0.2}
        maxScale={3}
        initialPositionX={-1300}
        initialPositionY={-1300}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Whiteboard Canvas */}
            <TransformComponent>
              <div 
              id="whiteboard"
              className="w-[5000px] h-[5000px] bg-white grid bg-[radial-gradient(circle,lightgray_1px,transparent_1px)] bg-[length:20px_20px] border border-gray-300 relative">
                {/* Binary Tree */}
                <div className="w-100% absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {children}
                </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default Whiteboard;
