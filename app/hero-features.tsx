"use client";

export function HeroFeatures() {
  return (
    <section className="w-full bg-gradient-to-r from-secondary/40 to-background py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="flex items-center gap-3">
          <span className="inline-block bg-white/80 rounded-full p-2 shadow">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9V7a2 2 0 0 1 2-2h2m0 0h10a2 2 0 0 1 2 2v2m-14 0v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9m-14 0h14"/></svg>
          </span>
          <span className="font-semibold text-base md:text-lg text-black">Free shipping on orders over Rs. 5,000</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-block bg-white/80 rounded-full p-2 shadow">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 0v4m0 0h4m-4 0H8"/></svg>
          </span>
          <span className="font-semibold text-base md:text-lg text-black">Authentic luxury guarantee</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-block bg-white/80 rounded-full p-2 shadow">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 8v4l3 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"/></svg>
          </span>
          <span className="font-semibold text-base md:text-lg text-black">30-day return policy</span>
        </div>
      </div>
    </section>
  );
}
