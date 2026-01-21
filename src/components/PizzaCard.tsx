import React from "react";
import { type Pizza } from "../data/mockPizzas";

interface PizzaCardProps {
  data: Pizza;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ data }) => {
  return (
    <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-gray-600 transition duration-300 flex flex-col h-full">
      <div className="h-48 overflow-hidden relative group">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
          {data.pizzeria}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{data.name}</h3>
          <span className="text-[#FF6B6B] font-bold text-xl">
            {data.price.toFixed(2)} zł
          </span>
        </div>

        <p className="text-gray-400 text-sm mb-4 flex-1 leading-relaxed">
          {data.description}
        </p>

        <div className="mb-6 pt-4 border-t border-gray-800 flex items-center justify-between gap-6 text-gray-300">
          <div className="flex items-center gap-2" title="Średnica">
            <span className="text-xl">📏</span>
            <span className="font-medium text-sm">{data.diameter} cm</span>
          </div>

          <div className="flex items-center gap-2" title="Styl pizzy">
            <span className="text-xl">🍕</span>
            <span className="font-medium text-sm">{data.style}</span>
          </div>
        </div>

        <button className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white py-3 rounded-lg font-semibold transition shadow-lg shadow-red-900/20 mt-auto">
          Zamów teraz
        </button>
      </div>
    </div>
  );
};

export default PizzaCard;
