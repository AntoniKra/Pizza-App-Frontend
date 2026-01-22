import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Tło ozdobne (gradient) */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-[#1a0505] to-[#2b0a0a] z-0"></div>

      <div className="z-10 text-center px-4">
        <div className="w-20 h-20 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,107,107,0.4)] mx-auto mb-6">
          <span className="text-4xl">🍕</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Pizza <span className="text-[#FF6B6B]">Radar</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Znajdź najlepszą pizzę w Twojej okolicy. Porównuj ceny, wielkości i
          opłacalność.
          <br />
          <span className="text-xs text-gray-600 mt-2 block">
            (To jest miejsce na przyszły Landing Page)
          </span>
        </p>

        <button
          onClick={() => navigate("/search")}
          className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-10 py-4 rounded-full font-bold text-xl transition transform hover:scale-105 shadow-xl shadow-red-900/30"
        >
          Przejdź do wyszukiwarki ➔
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
