import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

const Carousel = ({ setOpenCarousel }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const swiperSlideRef = useRef(null);

  const items = [
    { title: 'Tic Tac Toe', Link: '/case1' },
    { title: 'Stack', Link: '/case2' },
    { title: 'Queue', Link: '/case3' },
    { title: 'Binary Tree', Link: '/case4' },
    { title: 'BST with Traversal', Link: '/case5' },
    { title: 'Towers of Hanoi', Link: '/case6' },
    { title: 'Sorting', Link: '/case7' },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (swiperSlideRef.current && !swiperSlideRef.current.contains(event.target)) {
        setOpenCarousel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setOpenCarousel]);
    

  return (
    <div className="relative w-full max-w-3xl mx-auto my-auto z-20">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: true,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container"
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
          cardPickingSound();
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className="w-64 h-96 nes-pointer flex items-center justify-center bg-[#262137]  text-white font-bold text-lg rounded-lg shadow-md hover:scale-105 transition-transform duration-300 relative"
          ref={swiperSlideRef}>
            {index === activeIndex ? (
                <Link to={item.Link} className="w-full h-full flex items-center justify-center relative">
                    <Link onClick={() => navigate('/case1')} className='cursor-pointer w-[300px] rounded border-2 border-black text-white font-minecraftRegular bg-[#119B84] h-[450px] flex flex-col justify-between items-center p-10'>
                        <div className='text-2xl'>Tic Tac Toe</div>
                        <div className='text-center'>
                            A classic game of strategy for two players
                        </div>
                    </Link>

                </Link>
            ) : (
              <img src={imagesMap[index]} alt={item.title} className="w-full h-full image-rendering"/>
            )}
            
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-button-prev text-gray-300 hover:text-white active:scale-110 transition-transform duration-200"></div>
      <div className="swiper-button-next text-gray-300 hover:text-white active:scale-110 transition-transform duration-200"></div>
      <div className="swiper-pagination "></div>
    </div>
  );
};

export default Carousel;