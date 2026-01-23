import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onSearch: (term: string) => void;
  address?: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, address }) => {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#1A1A1A] border-b border-gray-800 sticky top-0 z-50">
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer hover:opacity-80 flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
          <span className="text-xl">🍕</span>
        </div>
        <span className="text-xl font-bold text-white tracking-wide">
          Pizza Radar
        </span>
      </div>

      <div className="flex-1 max-w-3xl mx-8 bg-[#1E1E1E] rounded-full flex items-center p-1 border border-gray-700 focus-within:border-[#FF6B6B] focus-within:shadow-[0_0_15px_rgba(255,107,107,0.15)] transition-all duration-300">
        <div className="pl-3 text-gray-400">🔍</div>
        <input
          type="text"
          placeholder="Search for pizza, pizzeria..."
          className="bg-transparent text-gray-200 w-full outline-none px-3 placeholder-gray-500"
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="w-[1px] h-6 bg-gray-700 mx-2"></div>

        <div className="flex items-center gap-2 ">
          <div
            title={address || "Brak lokalizacji"}
            className="flex items-center gap-1 text-gray-300 text-sm cursor-pointer hover:text-white transition"
          >
            <span>📍</span>
            <span className="font-medium text-sm max-w-[150px] truncate">
              {address || "Wybierz lokalizację"}
            </span>
            <span className="text-[10px] ml-1">▼</span>
          </div>
          <button className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] hover:from-[#ff5252] hover:to-[#ff7b3b] text-white px-6 py-2 rounded-full font-semibold transition shadow-lg shadow-red-900/40 text-sm whitespace-nowrap">
            Szukaj
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 text-gray-400 text-sm font-medium">
        <a href="#" className="hover:text-white transition">
          Deals
        </a>
        <a href="#" className="hover:text-white transition">
          Rankings
        </a>

        <button className="hover:text-white transition relative">
          🔔
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-red-500 rounded-full border-2 border-[#1A1A1A] cursor-pointer"></div>
      </div>
    </header>
  );
};

export default Header;
