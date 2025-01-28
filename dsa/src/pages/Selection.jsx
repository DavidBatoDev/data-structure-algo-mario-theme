import React from 'react'
import { useNavigate } from 'react-router-dom'

const Selection = () => {
    const navigate = useNavigate()


  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center 
        bg-[url('/images/selection-bg.png')] bg-cover md:bg-[length:150%] lg:bg-[length:150%] bg-center 
        animate-panBackground"
    >
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='flex gap-5'>
                <div onClick={() => navigate('/case1')} className='cursor-pointer w-[300px] rounded border-2 border-black text-white font-minecraftRegular bg-[#119B84] h-[450px] flex flex-col justify-between items-center p-10'>
                    <div className='text-2xl'>Tic Tac Toe</div>
                    <div className='text-center'>
                        A classic game of strategy for two players
                    </div>
                </div>

                <div onClick={() => navigate('/case2')} className='cursor-pointer w-[300px] rounded border-2 border-black text-white font-minecraftRegular bg-[#C28340] h-[450px] flex flex-col justify-between items-center p-10'>
                    <div className='text-2xl'>Stack</div>
                    <div className='text-center'>
                        A classic game of strategy for two players
                    </div>
                </div>

                <div onClick={() => navigate('/case4')} className='cursor-pointer w-[300px] rounded border-2 border-black text-white font-minecraftRegular bg-[#723232] h-[450px] flex flex-col justify-between items-center p-10'>
                    <div className='text-2xl'>Binary Tree</div>
                    <div className='text-center'>
                        A classic game of strategy for two players
                    </div>
                </div>
            </div>

            
        </div>
    </div>
  )
}

export default Selection
