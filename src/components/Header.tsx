import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#1A1A1A] border-b border-gray-800 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
          <span className="text-xl">🍕</span>
        </div>
        <span className="text-xl font-bold text-white tracking-wide">
          Pizza Radar
        </span>
      </div>

      <div className="flex-1 max-w-2xl mx-8 bg-[#252525] rounded-lg flex items-center p-1.5 border border-gray-700 focus-within:border-gray-500 transition-colors">
        <div className="pl-3 text-gray-400">🔍</div>
        <input
          type="text"
          placeholder="Search for pizza, pizzeria..."
          className="bg-transparent text-gray-200 w-full outline-none px-3 placeholder-gray-500"
        />

        <div className="flex items-center border-l border-gray-600 pl-3 gap-3">
          <div className="flex items-center gap-1 text-gray-300 text-sm cursor-pointer hover:text-white transition">
            <span>📍</span>
            <span className="font-medium">Warsaw, PL</span>
            <span className="text-[10px] ml-1">▼</span>
          </div>
          <button className="bg-[#FF6B6B] hover:bg-red-500 text-white px-6 py-2 rounded font-semibold transition shadow-md shadow-red-500/20">
            Search
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
