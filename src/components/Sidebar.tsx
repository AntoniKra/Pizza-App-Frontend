import React from "react";
import { useState } from "react";

const Sidebar: React.FC = () => {
  const pizzerias = ["Da Grasso", "Pizza Hut", "Dominos"];
  return (
    <aside className="w-64 p-4 hidden md:block">
      <h3 className="text-xl font-bold mb-6">Filtrowanie</h3>
      <div className="mb-6">
        <h4 className="font-bold mb-3 text-gray-400">Restauracja</h4>
        <div className="space-y-2">
          {pizzerias.map((pizzeria) => (
            <label
              key={pizzeria}
              className="flex items-center gap-2 cursor-pointer hover:text-[#FF6B6B]"
            >
              <input
                type="checkbox"
                className="rounded border-gray-600 bg-[#1E1E1E]"
              />
              <span>{pizzeria}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h4 className="font-bold mb-3 text-gray-400">Cena (PLN)</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Od"
            className="w-full bg-[#1E1E1E] border border-gray-600 rounded p-2 text-white"
          />
          <input
            type="number"
            placeholder="Do"
            className="w-full bg-[#1E1E1E] border border-gray-600 rounded p-2 text-white"
          />
        </div>
      </div>
      <button className="w-full mt-6 bg-[#2A2A2A] text-white p-2 rounded hover:bg-[#333] transition">
        Wyczyść filtry
      </button>
    </aside>
  );
};

export default Sidebar;
