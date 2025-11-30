import React from "react";

export const OffersBanner: React.FC = () => (
  <div className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white py-2 overflow-hidden">
    <div className="relative w-full h-8 overflow-hidden">
      <div className="absolute left-0 top-0 flex items-center whitespace-nowrap min-w-max animate-marquee" style={{ willChange: 'transform', animation: 'marquee-slide 16s linear infinite' }}>
        <div className="flex items-center">
          <span className="inline-block mr-8">
            Buy 2 Get 1 Free! <span className="bg-white text-pink-600 px-2 py-1 rounded font-extrabold mx-2">B2G1</span>
          </span>
          <span className="inline-block mr-8">
            Get 20% off on min order of ₹1000. Use Code: <span className="bg-white text-pink-600 px-2 py-1 rounded font-extrabold mx-2">TEST20</span>
          </span>
          <span className="inline-block mr-8">
            Free shipping on orders above ₹2000!
          </span>
        </div>
        <div className="flex items-center">
          <span className="inline-block mr-8">
            Buy 2 Get 1 Free! <span className="bg-white text-pink-600 px-2 py-1 rounded font-extrabold mx-2">B2G1</span>
          </span>
          <span className="inline-block mr-8">
            Get 20% off on min order of ₹1000. Use Code: <span className="bg-white text-pink-600 px-2 py-1 rounded font-extrabold mx-2">TEST20</span>
          </span>
          <span className="inline-block mr-8">
            Free shipping on orders above ₹2000!
          </span>
        </div>
      </div>
    </div>
  </div>
);
