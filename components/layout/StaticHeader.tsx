import React from "react";
import Image from "next/image";
import logo from "../../lib/images/logo.svg";

export default function StaticHeader() {
  return (
    <nav className="flex-shrink-0 h-12 sm:h-16 py-4 sm:py-0 px-2 md:px-16 shadow-none flex justify-between items-center rounded-none border-solid border-b-[3px] border-border-gray">
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center">
          <Image src={logo} alt="Credit Key Logo" className="w-3/5 sm:w-3/4" />
        </div>
      </div>
    </nav>
  );
}
