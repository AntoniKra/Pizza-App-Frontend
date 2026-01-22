import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  const handleSearch = () => {
    // 1. Jeśli pole jest puste, nic nie rób (opcjonalne zabezpieczenie)
    if (!address.trim()) return;

    // 2. Przekieruj do /search i wyślij "paczkę" z adresem w stanie
    navigate("/search", { state: { city: address } });
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white relative overflow-hidden">
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
        </p>

        <div className="bg-[#1E1E1E] p-2 rounded-full flex flex-col md:flex-row items-center gap-2 border border-gray-700 shadow-2xl max-w-2xl mx-auto focus-within:border-[#FF6B6B] transition-colors">
          <input
            type="text"
            placeholder="Wpisz miasto (np. Warszawa)..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-transparent text-white w-full h-12 px-4 outline-none text-lg placeholder-gray-500 text-center md:text-left"
          />

          <button
            onClick={handleSearch}
            className="w-full md:w-auto bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-8 py-3 rounded-full font-bold text-lg transition shadow-lg whitespace-nowrap"
          >
            Szukaj ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
