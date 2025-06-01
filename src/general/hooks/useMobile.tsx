import { useState, useEffect } from 'react';

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(isMobile);

    const handleResize = () => {
      const isMobileScreen = window.matchMedia("(max-width: 767px)").matches;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if(isMobileScreen || isMobile) {
        setIsMobile(true)
      } else{
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };

  }, []);

  return isMobile;
}

export default useMobile;