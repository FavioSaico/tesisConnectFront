// import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { OptionsUser } from "../components/OptionsUser";
import { Searcher } from "../components/Searcher";
import logo from "/logo_ico.png";

interface Props {
  children?: React.ReactNode;
}

export const ProfileLayout: React.FC<Props> = () => {

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
    </div>
  )
}