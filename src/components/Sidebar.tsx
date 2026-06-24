import React from "react";
import type {
  LookUpItemDto,
  PizzaFiltersDto,
  PizzaSearchCriteriaDto,
} from "../api/generated/models";

// Dodajemy nowy prop: activeFilters
interface SidebarProps {
  onFilterChange: (filters: Omit<PizzaSearchCriteriaDto, "cityId">) => void;
  filters: PizzaFiltersDto;
  activeFilters: PizzaSearchCriteriaDto;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange, filters, activeFilters }) => {
  // Jeśli filtry jeszcze nie przyszły z API, nie renderuj nic albo pokaż loader
  if (!filters) {
    return <div className="text-gray-500 text-sm p-4">Ładowanie filtrów...</div>;
  }
  // Wyciągamy aktualne stany prosto z aktywnych filtrów (z URL)
  const maxPrice = activeFilters.maxPrice 
  ? Number(activeFilters.maxPrice) 
  : (filters?.maxPriceLimit || 150);
  const diameter = activeFilters.minDiameter ? Number(activeFilters.minDiameter) : null;
  
  const selectedPizzeriasIds = activeFilters.brandIds || [];
  const selectedDoughs = activeFilters.doughs || [];
  const selectedCrusts = activeFilters.thicknesses || [];
  const selectedStyles = activeFilters.styles || [];
  const selectedSauces = activeFilters.sauces || [];
  const selectedShape = activeFilters.shapes?.[0] || null;

  // --- LOGIKA ZMIAN (Wysyłamy cały nowy stan w górę do rodzica) ---

  const handleReset = () => {
    // Wysyłamy puste filtry, co spowoduje wyczyszczenie URL
    onFilterChange({
      brandIds: null,
      doughs: null,
      thicknesses: null,
      styles: null,
      sauces: null,
      shapes: null,
      minPrice: null,
      maxPrice: null,
      minDiameter: null,
    });
  };

  const toggleFilter = (
    item: LookUpItemDto,
    currentList: LookUpItemDto[],
    keyToUpdate: keyof PizzaSearchCriteriaDto
  ) => {
    const isSelected = currentList.some((i) => i.id === item.id);
    const newSelection = isSelected
      ? currentList.filter((i) => i.id !== item.id)
      : [...currentList, item];
    
    onFilterChange({ [keyToUpdate]: newSelection.length ? newSelection : null });
  };

  const toggleBrandFilter = (brandId: string) => {
    const isSelected = selectedPizzeriasIds.includes(brandId);
    const newSelection = isSelected
      ? selectedPizzeriasIds.filter((id) => id !== brandId)
      : [...selectedPizzeriasIds, brandId];
      
    onFilterChange({ brandIds: newSelection.length ? newSelection : null });
  };

  // --- KOMPONENTY WIDOKU ---

  const generateShapes = (shape: LookUpItemDto) => {
    const isSelected = selectedShape?.id === shape.id;
    const isRound = shape.name?.toLowerCase().includes("okrągła") || shape.name?.toLowerCase().includes("round");

    return (
      <button
        key={shape.id}
        onClick={() => {
          if (shape.id === "1" || shape.id === "Round") {
            onFilterChange({ shapes: [shape], minDiameter: 30 });
          } else {
            onFilterChange({ shapes: [shape], minDiameter: null });
          }
        }}
        className={`relative group flex flex-col items-center justify-center py-4 rounded-xl border transition-all duration-300 ${
          isSelected
            ? "border-[#FF6B6B] bg-[#FF6B6B]/10 shadow-[0_0_15px_rgba(255,107,107,0.15)]"
            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
        }`}
      >
        {isRound ? (
          <svg viewBox="0 0 24 24" className={`w-8 h-8 mb-2 transition-colors ${isSelected ? "text-[#FF6B6B] drop-shadow-[0_0_8px_rgba(255,107,107,0.6)]" : "text-gray-500 group-hover:text-gray-300"}`}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className={`w-8 h-8 mb-2 transition-colors ${isSelected ? "text-[#FF6B6B] drop-shadow-[0_0_8px_rgba(255,107,107,0.6)]" : "text-gray-500 group-hover:text-gray-300"}`}>
            <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        )}
        <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isSelected ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}>
          {shape.name}
        </span>
        {isSelected && <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B6B] rounded-full shadow-[0_0_5px_#FF6B6B]"></div>}
      </button>
    );
  };

  const CheckboxGroup = ({
    title,
    options,
    selectedItems,
    filterKey,
    isBrand = false
  }: {
    title: string;
    options: LookUpItemDto[];
    selectedItems: LookUpItemDto[] | string[];
    filterKey: keyof PizzaSearchCriteriaDto;
    isBrand?: boolean;
  }) => (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-300 mb-3">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => {
          // Specjalna obsługa dla brandIds (tablica stringów, a nie obiektów)
          const isChecked = isBrand 
            ? (selectedItems as string[]).includes(option.id!) 
            : (selectedItems as LookUpItemDto[]).some((i) => i.id === option.id);

          return (
            <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border-2 border-gray-600 rounded bg-transparent checked:bg-[#FF6B6B] checked:border-[#FF6B6B] transition-colors"
                  checked={isChecked}
                  onChange={() => {
                    if (isBrand) toggleBrandFilter(option.id!);
                    else toggleFilter(option, selectedItems as LookUpItemDto[], filterKey);
                  }}
                />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 10" fill="none">
                  <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{option.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-72 p-6 hidden md:block border-r border-red-400 ">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-white">Filtry</h3>
        <button onClick={handleReset} className="text-xs text-[#FF6B6B] hover:text-red-400 font-medium transition">
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
          max={filters.maxPriceLimit || 150}
          value={maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
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

      {diameter !== null && (
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
            onChange={(e) => onFilterChange({ minDiameter: Number(e.target.value) })}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-200"
          />
          <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
            <span>{diameter} cm</span>
            <span>60 cm</span>
          </div>
        </div>
      )}

      <CheckboxGroup title="Restauracja" options={filters.restaurants ?? []} selectedItems={selectedPizzeriasIds} filterKey="brandIds" isBrand={true} />
      <CheckboxGroup title="Grubość ciasta" options={filters.thicknesses ?? []} selectedItems={selectedCrusts} filterKey="thicknesses" />
      <CheckboxGroup title="Rodzaj ciasta" options={filters.doughs ?? []} selectedItems={selectedDoughs} filterKey="doughs" />

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Styl pizzy</h4>
        <div className="flex flex-wrap gap-2">
          {filters.styles?.map((style) => {
            const isActive = selectedStyles.some(s => s.id === style.id);
            return (
              <button
                key={style.id}
                onClick={() => toggleFilter(style, selectedStyles, "styles")}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all duration-200 ${isActive ? "bg-[#FF6B6B]/20 border-[#FF6B6B] text-[#FF6B6B]" : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"}`}
              >
                {style.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Sosy na spodzie</h4>
        <div className="flex flex-wrap gap-2">
          {filters.sauces?.map((sauce) => {
            const isActive = selectedSauces.some(s => s.id === sauce.id);
            return (
              <button
                key={sauce.id}
                onClick={() => toggleFilter(sauce, selectedSauces, "sauces")}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all duration-200 ${isActive ? "bg-[#FF6B6B] border-[#FF6B6B] text-white shadow-[0_0_10px_rgba(255,107,107,0.3)]" : "bg-[#1E1E1E] border-gray-700 text-gray-400 hover:border-gray-500"}`}
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