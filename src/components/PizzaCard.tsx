import React from "react";
import { type Pizza } from "../data/mockPizzas";

interface PizzaCardProps {
  data: Pizza;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ data }) => {
  const getPricePerCm2 = () => {
    let area = 0;
    if (data.shape === "Okrągła" && data.diameter) {
      area = Math.PI * (data.diameter / 2) ** 2;
    } else if (data.shape === "Prostokątna" && data.width && data.length) {
      area = data.width * data.length;
    }
    if (area === 0) return 0;
    return (data.price / area).toFixed(2);
  };

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
          <div className="text-right">
            <span className="text-[#FF6B6B] font-bold text-xl block">
              {data.price.toFixed(2)} zł
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {getPricePerCm2()} zł/cm²
            </span>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 flex-1 leading-relaxed">
          {data.description}
        </p>

        <div className="mb-6 pt-4 border-t border-gray-800 flex items-center justify-between gap-2 text-gray-300">
          <div className="flex items-center gap-2" title="Rozmiar">
            <span className="text-lg">📏</span>
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {data.shape === "Okrągła"
                  ? `${data.diameter} cm`
                  : `${data.width}x${data.length} cm`}
              </span>
              <span className="text-[10px] text-gray-500">
                {data.weight}g • {data.kcal} kcal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2" title="Styl pizzy">
            <span className="text-lg">🍕</span>
            <span className="font-medium text-sm text-right">{data.style}</span>
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
