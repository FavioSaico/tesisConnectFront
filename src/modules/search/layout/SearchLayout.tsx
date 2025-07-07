// import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import logo from "/logo_ico.png";
import { OptionsUser } from "@/modules/profile/components/OptionsUser";
import { Searcher } from "@/modules/profile/components/Searcher";

interface Props {
  children?: React.ReactNode;
}

export const SearchLayout: React.FC<Props> = ({children}) => {

  return (
    <div className="w-full min-h-screen p-5">
      <header className="w-full flex justify-between items-center gap-1">
        <div className="logo_container max-w-14">
          <img src={logo} alt="logo_tesisconnect" className="w-full" />
        </div>
        <Searcher/>
        <OptionsUser/>
      </header>
      <Outlet />
      {children}
    </div>
  )
}