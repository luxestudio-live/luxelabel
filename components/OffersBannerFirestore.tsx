"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

export const OffersBannerFirestore: React.FC = () => {
  const [banners, setBanners] = useState<any[]>([]);
  useEffect(() => {
    async function fetchBanners() {
      try {
        const snap = await getDocs(collection(db, "banners"));
        setBanners(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch {
        setBanners([]);
      }
    }
    fetchBanners();
  }, []);

  if (!banners.length) return null;

  return (
    <div className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white py-2 overflow-hidden">
      <div
        className="text-lg font-bold whitespace-nowrap animate-banner-scroll"
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: 'banner-scroll 30s linear infinite'
        }}
      >
        {banners.map((b, idx) => (
          <span key={b.id}>
            {b.text}
            {b.couponCode && (
              <span className="bg-white text-pink-600 px-2 py-1 rounded font-extrabold mx-2">{b.couponCode}</span>
            )}
            {idx < banners.length - 1 && <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>}
          </span>
        ))}
      </div>
    </div>
  );
};
