import React from "react";
import type { Pizza } from "../data/mockPizzas";

interface PizzaCardProps {
  data: Pizza;
}

const PizzaCard = ({ data }: PizzaCardProps) => {
  return (
    <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg border border-gray-800  ">
      <div className="relative h-48">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-[#FF6B6B] text-white text-xs font-bold px-3 py-1 rounded shadow-md">
          {data.pricePer100g} zł / 100g
        </div>
      </div>
      <div className="p-7">
        <h3 className="text-xl font-bold">{data.name}</h3>
        <p className="text-sm text-gray-400">{data.pizzeria}</p>
        <div className="flex gap-2 mb-4">
          <div className="bg-[#121212] rounded p-4 flex-1 text-center">
            SIZE: {data.diameter}
          </div>
          <div className="bg-[#121212] rounded p-4 flex-1 text-center">
            WEIGHT: {data.weight}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-white ">
            Cena: {data.price} PLN
          </p>
          <button className="bg-white text-black font-bold py-2 px-4 rounded">
            View Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;
