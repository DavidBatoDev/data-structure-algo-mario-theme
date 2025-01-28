export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      
      colors: {
        'minecraft-white': '#FFFFFF',
        'minecraft-whiteSecondary': '#BBBBBB',
        'minecraft-gray': '#6E6E6E',
        'minecraft-graySecondary': '#8B8B8B',
        'minecraft-green': '#7ebc59',
        'minecraft-brown': '#5f3e2c',
        'minecraft-grass': '#597d35',
        'minecraft-abyss': '#252525'
      },
      fontFamily: {
        pressStart: ['"Press Start 2P"', 'cursive'],
        minecraftRegular: ['MinecraftRegular', 'sans-serif'],
        minecraftItalic: ['MinecraftItalic', 'sans-serif'],
        minecraftBold: ['MinecraftBold', 'sans-serif'],
        minecraftBoldItalic: ['MinecraftBoldItalic', 'sans-serif'],
      },
      //  keyframes + animation for the background panning
      keyframes: {
        panBackground: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        scroll: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "-100% 0%" },
        },
        seamlessScroll: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% -100%" }, // Scroll left
        },
      },
      animation: {
        // 20s linear infinite = it’ll smoothly pan forever
        // alternate = it’ll pan from left to right, then right to left
        scroll: "scroll 6s linear infinite",
        seamlessScroll: "seamlessScroll 4s linear infinite",
        panBackground: 'panBackground 20s linear infinite alternate',
      },
      // insets shadow
      boxShadow: {
        craftingInset: '-4px -4px 0px #363636',
        craftingBoard: '-4px -4px 0px #141414',
        topLeft: '-4px -4px 8px rgba(0, 0, 0, 0.2)',
        whiteinset: '-7px -5px 4px 0px #565656 inset, 7px 5px 4px 0px #FDFDFD inset',
      },
      
    },
  },
  plugins: [],
};
