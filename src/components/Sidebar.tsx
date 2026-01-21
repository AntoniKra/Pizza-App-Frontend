import React, { useState, useEffect } from "react";

const pizzeriaOptions = ["Da Grasso", "Pizza Hut", "Dominos", "Local Pizzeria"];
const doughOptions = [
  "Pszenne",
  "Pełnoziarniste",
  "Bezglutenowe",
  "Na zakwasie",
];
const crustOptions = [
  "Cienkie",
  "Tradycyjne",
  "Grube",
  "Z wypełnionymi brzegami",
];

const styleOptions = [
  "Neapolitańska",
  "Amerykańska",
  "Chicago Style",
  "Sycylijska",
  "Rzymska",
  "Calzone",
];
const sauceOptions = [
  "Pomidorowy",
  "Śmietanowy (Biały)",
  "BBQ",
  "Pesto",
  "Ostry pomidorowy",
  "Krem truflowy",
];

export interface FilterValues {
  pizzerias: string[];
  doughs: string[];
  crusts: string[];
  shapes: string[];
  styles: string[];
  sauces: string[];
  minPrice: number;
  maxPrice: number;
  minDiameter: number;
}

interface SidebarProps {
  onFilterChange: (filters: FilterValues) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange }) => {
  const [minPrice, setMinPrice] = useState<number>(15);
  const [maxPrice, setMaxPrice] = useState<number>(120);
  const [diameter, setDiameter] = useState<number>(30);

  const [selectedPizzerias, setSelectedPizzerias] = useState<string[]>([]);
  const [selectedDoughs, setSelectedDoughs] = useState<string[]>([]);
  const [selectedCrusts, setSelectedCrusts] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);

  useEffect(() => {
    onFilterChange({
      pizzerias: selectedPizzerias,
      doughs: selectedDoughs,
      crusts: selectedCrusts,
      shapes: selectedShapes,
      styles: selectedStyles,
      sauces: selectedSauces,
      minPrice,
      maxPrice,
      minDiameter: diameter,
    });
  }, [
    minPrice,
    maxPrice,
    diameter,
    selectedPizzerias,
    selectedDoughs,
    selectedCrusts,
    selectedShapes,
    selectedStyles,
    selectedSauces,
  ]);

  const handleReset = () => {
    setMinPrice(15);
    setMaxPrice(120);
    setDiameter(30);
    setSelectedPizzerias([]);
    setSelectedDoughs([]);
    setSelectedCrusts([]);
    setSelectedShapes([]);
    setSelectedStyles([]);
    setSelectedSauces([]);
  };

  const toggleFilter = (
    item: string,
    currentList: string[],
    setFunction: (list: string[]) => void,
  ) => {
    const isSelected = currentList.includes(item);
    const newSelection = isSelected
      ? currentList.filter((i) => i !== item)
      : [...currentList, item];
    setFunction(newSelection);
  };

  const CheckboxGroup = ({
    title,
    options,
    selected,
    setSelected,
  }: {
    title: string;
    options: string[];
    selected: string[];
    setSelected: (l: string[]) => void;
  }) => (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-300 mb-3">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center">
              <input
                type="checkbox"
                className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-transparent checked:bg-[#FF6B6B] checked:border-[#FF6B6B] transition-colors"
                checked={selected.includes(option)}
                onChange={() => toggleFilter(option, selected, setSelected)}
              />
              <svg
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                viewBox="0 0 14 10"
                fill="none"
              >
                <path
                  d="M1 5L4.5 8.5L13 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <aside className="w-72 p-6 hidden md:block border-r border-red-400 ">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-white">Filtry</h3>
        <button
          onClick={handleReset}
          className="text-xs text-[#FF6B6B] hover:text-red-400 font-medium transition"
        >
          Reset all
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2 text-gray-300">
          <span className="font-semibold">Cena (Max)</span>
          <span className="text-xs text-gray-500">PLN</span>
        </div>
        <input
          type="range"
          min="15"
          max="150"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FF6B6B] hover:accent-red-400"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
          <span>0 zł</span>
          <span>{maxPrice} zł</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Kształt</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              if (selectedShapes.includes("Okrągła")) {
                setSelectedShapes([]);
                setDiameter(20);
              } else {
                setSelectedShapes(["Okrągła"]);
              }
            }}
            className={`relative group flex flex-col items-center justify-center py-4 rounded-xl border transition-all duration-300 ${
              selectedShapes.includes("Okrągła")
                ? "border-[#FF6B6B] bg-[#FF6B6B]/10 shadow-[0_0_15px_rgba(255,107,107,0.15)]"
                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-8 h-8 mb-2 transition-colors ${
                selectedShapes.includes("Okrągła")
                  ? "text-[#FF6B6B] drop-shadow-[0_0_8px_rgba(255,107,107,0.6)]"
                  : "text-gray-500 group-hover:text-gray-300"
              }`}
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <span
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedShapes.includes("Okrągła")
                  ? "text-white"
                  : "text-gray-500 group-hover:text-gray-300"
              }`}
            >
              Okrągła
            </span>

            {selectedShapes.includes("Okrągła") && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B6B] rounded-full shadow-[0_0_5px_#FF6B6B]"></div>
            )}
          </button>

          <button
            onClick={() => {
              if (selectedShapes.includes("Prostokątna")) {
                setSelectedShapes([]);
              } else {
                setSelectedShapes(["Prostokątna"]);
                setDiameter(20);
              }
            }}
            className={`relative group flex flex-col items-center justify-center py-4 rounded-xl border transition-all duration-300 ${
              selectedShapes.includes("Prostokątna")
                ? "border-[#FF6B6B] bg-[#FF6B6B]/10 shadow-[0_0_15px_rgba(255,107,107,0.15)]"
                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-8 h-8 mb-2 transition-colors ${
                selectedShapes.includes("Prostokątna")
                  ? "text-[#FF6B6B] drop-shadow-[0_0_8px_rgba(255,107,107,0.6)]"
                  : "text-gray-500 group-hover:text-gray-300"
              }`}
            >
              <rect
                x="4"
                y="5"
                width="16"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <span
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedShapes.includes("Prostokątna")
                  ? "text-white"
                  : "text-gray-500 group-hover:text-gray-300"
              }`}
            >
              Prostokątna
            </span>

            {selectedShapes.includes("Prostokątna") && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B6B] rounded-full shadow-[0_0_5px_#FF6B6B]"></div>
            )}
          </button>
        </div>
      </div>

      {selectedShapes.includes("Okrągła") && (
        <div className="mb-8 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between text-sm mb-2 text-gray-300">
            <span className="font-semibold">Średnica (Min)</span>
            <span className="text-xs text-gray-500">cm</span>
          </div>
          <input
            type="range"
            min="20"
            max="60"
            step="2"
            value={diameter}
            onChange={(e) => setDiameter(Number(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-200"
          />
          <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
            <span>{diameter} cm</span>
            <span>60 cm</span>
          </div>
        </div>
      )}

      <CheckboxGroup
        title="Restauracja"
        options={pizzeriaOptions}
        selected={selectedPizzerias}
        setSelected={setSelectedPizzerias}
      />

      <CheckboxGroup
        title="Grubość ciasta"
        options={crustOptions}
        selected={selectedCrusts}
        setSelected={setSelectedCrusts}
      />

      <CheckboxGroup
        title="Rodzaj ciasta"
        options={doughOptions}
        selected={selectedDoughs}
        setSelected={setSelectedDoughs}
      />

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Styl pizzy</h4>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((style) => {
            const isActive = selectedStyles.includes(style);
            return (
              <button
                key={style}
                onClick={() =>
                  toggleFilter(style, selectedStyles, setSelectedStyles)
                }
                className={`px-3 py-1.5 rounded-full text-xs border transition-all duration-200 ${
                  isActive
                    ? "bg-[#FF6B6B]/20 border-[#FF6B6B] text-[#FF6B6B]"
                    : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          Sos / Dodatki
        </h4>
        <div className="flex flex-wrap gap-2">
          {sauceOptions.map((sauce) => {
            const isActive = selectedSauces.includes(sauce);
            return (
              <button
                key={sauce}
                onClick={() =>
                  toggleFilter(sauce, selectedSauces, setSelectedSauces)
                }
                className={`px-3 py-1.5 rounded-full text-xs border transition-all duration-200 ${
                  isActive
                    ? "bg-[#FF6B6B] border-[#FF6B6B] text-white shadow-[0_0_10px_rgba(255,107,107,0.3)]"
                    : "bg-[#1E1E1E] border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {sauce}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
