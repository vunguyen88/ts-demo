import { useState, useEffect } from 'react';

type WindowSize = 'desktop' | 'laptop' | 'tablet' | 'mobile';

export default function useCurrentDisplaySize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>('mobile');

  const breakpoints = {
    values: {
      xs: 0,
      sm: 540,
      md: 720,
      lg: 960,
      xl: 1140,
      xxl: 1320,
    },
  };

  useEffect(() => {
    function displayWindowSize() {
      // console.log('current window width ', window.innerWidth)
      if (window.innerWidth > breakpoints.values.xxl) {
        setWindowSize('desktop');
      } else if (window.innerWidth <= breakpoints.values.xxl && window.innerWidth >= breakpoints.values.lg) {
        setWindowSize('laptop');
      } else if (window.innerWidth < breakpoints.values.lg && window.innerWidth >= breakpoints.values.md) {
        setWindowSize('tablet');
      } else {
        setWindowSize('mobile');
      }
    }

    /**
     The event listener that's calling the displayWindowSize function when 
      resizing the window.
    */
    window.addEventListener('resize', displayWindowSize);

    // Call the displayWindowSize function to set the state with the initial value.
    displayWindowSize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', displayWindowSize);
  }, []);

  return windowSize;
}
