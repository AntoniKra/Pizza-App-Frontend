import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Sidebar from "./Sidebar";
import { getPizza } from "../api/endpoints/pizza/pizza";
import {
  type PizzaFiltersDto,
  type PizzaSearchCriteriaDto,
  type PizzaSearchResultDto,
} from "../api/model";
import { getLookUp } from "../api/endpoints/look-up/look-up";

function PizzaSearch() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialCityId = location.state?.cityId;

  // --- STANY ---
  const [pizzas, setPizzas] = useState<PizzaSearchResultDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState("default");

  // Stan filtrów
  const [filters, setFilters] = useState<PizzaFiltersDto>();
  const [currentFilters, setCurrentFilters] = useState<PizzaSearchCriteriaDto>();

  // --- POBIERANIE DANYCH ---
  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchPizzas = async (searchCriteria: PizzaSearchCriteriaDto) => {
    try {
      searchCriteria.cityId = initialCityId;
      setIsLoading(true);
      const data = (await getPizza().postApiPizzaSearch(searchCriteria));
      setPizzas(data);
    } catch (error) {
      console.error("Błąd pobierania pizz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const data = (await getLookUp().getApiLookUpFilters());
      setFilters(data);
    } catch (error) {
      console.error("Nie udało się pobrać filtrów", error);
    }
  };

  // --- OBSŁUGA ZMIAN ---
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOption(value);

    let apiSortBy = 1;
    if (value === "price_asc") apiSortBy = 2;
    if (value === "price_desc") apiSortBy = 3;
    if (value === "name_asc") apiSortBy = 4;
    if (value === "name_desc") apiSortBy = 5;
    if (value === "profitability") apiSortBy = 6;
    if (value === "kcal_desc") apiSortBy = 7;
    if (value === "kcal_asc") apiSortBy = 8;

    if (currentFilters) {
      const updatedFilters = { ...currentFilters, SortBy: apiSortBy } as any;
      updatedFilters.sortBy = apiSortBy;

      setCurrentFilters(updatedFilters);
      fetchPizzas(updatedFilters);
    }
  };

  const handleFilterChange = async (newFilters: PizzaSearchCriteriaDto) => {
    const helper = {
      ...newFilters,
      cityId: initialCityId,
    } as PizzaSearchCriteriaDto;

    setCurrentFilters(helper);
    await fetchPizzas(helper);
  };

  // --- WIDOK ---
  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-20">
      <main className="max-w-[1400px] mx-auto p-8 flex gap-8">
        {filters && (
          <Sidebar filters={filters} onFilterChange={handleFilterChange} />
        )}

        <div className="flex-1">
          {/* PASEK KONTROLNY */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-4">
            <h2 className="text-3xl font-bold">Znalezione oferty</h2>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Sortuj:</span>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="bg-[#1E1E1E] border border-gray-700 text-white text-sm rounded-lg p-2.5 outline-none focus:border-[#FF6B6B]"
              >
                <option value="default">Domyślnie</option>
                <option value="price_asc">Cena: od najniższej</option>
                <option value="price_desc">Cena: od najwyższej</option>
                <option value="profitability">💰 Opłacalność (zł/cm²)</option>
                <option value="kcal_desc">💪 Masa (Max kcal/g)</option>
                <option value="kcal_asc">🥗 Redukcja (Min kcal/g)</option>
              </select>
            </div>
          </div>

          {/* SPINNER */}
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#FF6B6B]" size={48} />
            </div>
          )}

          {/* BRAK WYNIKÓW */}
          {!isLoading && pizzas.length === 0 && (
            <div className="text-center py-20 bg-[#1E1E1E] rounded-xl border border-gray-800 text-gray-500">
              <h3 className="text-xl font-bold mb-2">Brak wyników 😔</h3>
              <p>Spróbuj zmienić filtry lub wpisać inną nazwę.</p>
            </div>
          )}

          {/* LISTA WYNIKÓW */}
          {!isLoading && pizzas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pizzas.map((pizza) => (
                <div
                  key={pizza.id}
                  onClick={() => navigate(`/pizza/${pizza.id}`)}
                >
                  <div className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-gray-800 hover:border-[#FF6B6B] transition cursor-pointer group h-full flex flex-col">
                    
                    {/* ZDJĘCIE */}
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={pizza.imageUrl ?? undefined}
                        alt={pizza.name ?? "Pizza"}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>

                    {/* TREŚĆ */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-white">
                            {pizza.name}
                          </h3>
                          <p className="text-xs text-[#FF6B6B] font-bold uppercase tracking-wider">
                            {pizza.brandName}
                          </p>
                        </div>
                        <span className="text-xl font-bold text-white">
                          {pizza.price} zł
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                        {pizza.description}
                      </p>

                      {/* BADGE (NAPRAWIONE) */}
                      <div className="flex gap-2 mt-auto flex-wrap">
                        {/* 1. Styl */}
                        <span className="text-xs bg-[#2A2A2A] px-2 py-1 rounded text-gray-400">
                          {pizza.style?.name}
                        </span>

                        {/* 2. Średnica */}
                        {pizza.diameterCm && (
                          <span className="text-xs bg-[#2A2A2A] px-2 py-1 rounded text-gray-400">
                            {pizza.diameterCm} cm
                          </span>
                        )}

                        {/* 3. Opłacalność (Fix: Rzutowanie na Number) */}
                        {pizza.pricePerSqCm && Number(pizza.pricePerSqCm) > 0 && (
                          <span className="text-xs bg-green-900/50 text-green-400 border border-green-800 px-2 py-1 rounded">
                            {pizza.pricePerSqCm} zł/cm²
                          </span>
                        )}

                        {/* 4. Masa/Kcal (Fix: 'as any' + Number, bo Orval tego jeszcze nie widzi) */}
                        {(pizza as any).kcalPerGram && Number((pizza as any).kcalPerGram) > 0 && (
                          <span className="text-xs bg-blue-900/50 text-blue-400 border border-blue-800 px-2 py-1 rounded">
                            {(pizza as any).kcalPerGram} kcal/g
                          </span>
                        )}
                      </div>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PizzaSearch;