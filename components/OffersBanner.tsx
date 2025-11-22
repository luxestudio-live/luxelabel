import React from "react";

export const OffersBanner: React.FC = () => (
  <div className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white py-2 overflow-hidden">
    <marquee behavior="scroll" direction="left" scrollamount="10" className="text-lg font-bold whitespace-nowrap">
      Get 20% off on min order of ₹1000. Use Code: <span className="bg-white text-pink-600 px-2 py-1 rounded font-extrabold mx-2">NEW20</span>
      &nbsp;&nbsp;|&nbsp;&nbsp; Free shipping on orders above ₹2000!
      &nbsp;&nbsp;|&nbsp;&nbsp; Buy 2 get 1 free on select items!
    </marquee>
  </div>
);
