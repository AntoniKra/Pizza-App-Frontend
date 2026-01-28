import React, { useState, useEffect } from "react";
import type {
  GetApiPizzaSearchParams,
  LookUpItemDto,
  PizzaDetailsDto,
  PizzaFiltersDto,
  PizzaSearchResultDto,
  PizzaShapeEnum,
} from "../api/model";
import type { PizzaSearchCriteria } from "../types/apiTypes";

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
  onFilterChange: (filters: GetApiPizzaSearchParams) => void;
  filters: PizzaFiltersDto;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange, filters }) => {
  const [minPrice, setMinPrice] = useState<number>(15);
  const [maxPrice, setMaxPrice] = useState<number>(120);
  const [diameter, setDiameter] = useState<number | null>(30);

  const [selectedPizzerias, setSelectedPizzerias] = useState<LookUpItemDto[]>(
    [],
  );
  const [selectedDoughs, setSelectedDoughs] = useState<LookUpItemDto[]>([]);
  const [selectedCrusts, setSelectedCrusts] = useState<LookUpItemDto[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<LookUpItemDto[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<LookUpItemDto[]>([]);

  const [selectedShape, setSelectedShape] = useState<LookUpItemDto | null>();

  useEffect(() => {
    onFilterChange({
      BrandIds: [],
      Doughs: [],
      Shapes: [],
      Styles: [1],
      Sauces: [],
      MinPrice: minPrice,
      MaxPrice: maxPrice,
    });
  }, [
    minPrice,
    maxPrice,
    diameter,
    selectedPizzerias,
    selectedDoughs,
    selectedCrusts,
    selectedShape,
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
    setSelectedShape(null);
    setSelectedStyles([]);
    setSelectedSauces([]);
  };

  const toggleFilter = (
    item: LookUpItemDto,
    currentList: LookUpItemDto[],
    setFunction: (list: LookUpItemDto[]) => void,
  ) => {
    const isSelected = currentList.includes(item);
    const newSelection = isSelected
      ? currentList.filter((i) => i !== item)
      : [...currentList, item];
    setFunction(newSelection);
  };

  const generateShapes = (shape: LookUpItemDto) => {
    // 1. Sprawdzamy czy to ten wybrany
    const isSelected = selectedShape?.id === shape.id;

    // 2. Sprawdzamy czy to koło (po nazwie z API)
    // Używamy toLowerCase(), żeby zadziałało na "Okrągła", "okrągła", "Round" itp.
    const isRound =
      shape.name.toLowerCase().includes("okrągła") ||
      shape.name.toLowerCase().includes("round");

    return (
      <button
        onClick={() => {
          if (shape.id === "Round") setDiameter(20);
          else setDiameter(null);
          setSelectedShape(shape);
        }}
        className={`relative group flex flex-col items-center justify-center py-4 rounded-xl border transition-all duration-300 ${
          isSelected
            ? "border-[#FF6B6B] bg-[#FF6B6B]/10 shadow-[0_0_15px_rgba(255,107,107,0.15)]" // Jak wybrany -> NEON
            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20" // Jak nie -> SZARY
        }`}
      >
        {isRound ? (
          // Opcja A: IKONA KOŁA
          <svg
            viewBox="0 0 24 24"
            // Tutaj też zmieniamy kolor ikony zależnie od isSelected
            className={`w-8 h-8 mb-2 transition-colors ${
              isSelected
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
        ) : (
          // Opcja B: IKONA PROSTOKĄTA (dla reszty)
          <svg
            viewBox="0 0 24 24"
            className={`w-8 h-8 mb-2 transition-colors ${
              isSelected
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
        )}
        <span
          className={`text-xs font-bold uppercase tracking-wider transition-colors ${
            isSelected
              ? "text-white"
              : "text-gray-500 group-hover:text-gray-300"
          }`}
        >
          {shape.name}
        </span>
        {/* Kropka w rogu - renderuje się TYLKO jeśli isSelected jest true */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B6B] rounded-full shadow-[0_0_5px_#FF6B6B]"></div>
        )}
      </button>
    );
  };

  const CheckboxGroup = ({
    title,
    options,
    selected,
    setSelected,
  }: {
    title: string;
    options: LookUpItemDto[];
    selected: LookUpItemDto[];
    setSelected: (l: LookUpItemDto[]) => void;
  }) => (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-300 mb-3">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.id}
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
              {option.name}
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
          max={filters.maxPriceLimit}
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
          {filters.shapes?.map((x) => generateShapes(x))}
        </div>
      </div>

      {diameter && (
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
        options={filters.restaurants ?? []}
        selected={selectedPizzerias}
        setSelected={setSelectedPizzerias}
      />

      <CheckboxGroup
        title="Grubość ciasta"
        options={filters.thicknesses ?? []}
        selected={selectedCrusts}
        setSelected={setSelectedCrusts}
      />

      <CheckboxGroup
        title="Rodzaj ciasta"
        options={filters.doughs ?? []}
        selected={selectedDoughs}
        setSelected={setSelectedDoughs}
      />

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Styl pizzy</h4>
        <div className="flex flex-wrap gap-2">
          {filters.styles?.map((style) => {
            const isActive = selectedStyles.includes(style);
            return (
              <button
                key={style.id}
                onClick={() =>
                  toggleFilter(style, selectedStyles, setSelectedStyles)
                }
                className={`px-3 py-1.5 rounded-full text-xs border transition-all duration-200 ${
                  isActive
                    ? "bg-[#FF6B6B]/20 border-[#FF6B6B] text-[#FF6B6B]"
                    : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                }`}
              >
                {style.name}
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
          {filters.sauces?.map((sauce) => {
            const isActive = selectedSauces.includes(sauce);
            return (
              <button
                key={sauce.id}
                onClick={() =>
                  toggleFilter(sauce, selectedSauces, setSelectedSauces)
                }
                className={`px-3 py-1.5 rounded-full text-xs border transition-all duration-200 ${
                  isActive
                    ? "bg-[#FF6B6B] border-[#FF6B6B] text-white shadow-[0_0_10px_rgba(255,107,107,0.3)]"
                    : "bg-[#1E1E1E] border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {sauce.name}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
