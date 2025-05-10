// import { useEffect, useState } from "react";
import { OptionsUser } from "../components/OptionsUser";
import { Searcher } from "../components/Searcher";
import logo from "/logo_ico.png";

interface Props {
  children?: React.ReactNode;
}

export const ProfileLayout: React.FC<Props> = ({children}) => {

  // const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   const checkIsMobile = () => {
  //     const userAgent = window.navigator.userAgent.toLowerCase();
  //     setIsMobile(/mobile|android|iphone|ipad|blackberry|iemobile/.test(userAgent));
  //   };

  //   function isMobilePx() {
  //     const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
  //     setIsMobile(isSmallScreen)
  //   }

  //   isMobilePx()

  //   checkIsMobile();
  // }, []);
  
  // console.log(isMobile)

  return (
    <div className="w-full min-h-screen p-5">
      <header className="w-full flex justify-between items-center gap-1">
        <div className="logo_container max-w-14">
          <img src={logo} alt="logo_tesisconnect" className="w-full" />
        </div>
        <Searcher/>
        <OptionsUser/>
      </header>

      {children}
    </div>
  )
}