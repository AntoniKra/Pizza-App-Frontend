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

  // 1. Odbieramy dane z LandingPage
  const initialCityId = location.state?.cityId;
  const initialCityName = location.state?.cityName || "Wybierz miasto";

  // 2. STANY
  const [pizzas, setPizzas] = useState<PizzaSearchResultDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState("default"); 

  // Stan filtrów (Kryteria API)
  const [filters, setFilters] = useState<PizzaFiltersDto>();
  const [currentFilters, setCurrentFilters] = useState<PizzaSearchCriteriaDto>();

  // 3. POBIERANIE DANYCH Z API
  // Pobierz filtry (opcje) przy starcie
  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchPizzas = async (searchCriteria: PizzaSearchCriteriaDto) => {
    try {
      searchCriteria.cityId = initialCityId;
      console.log("Wysyłanie filtrów:", searchCriteria);
      
      setIsLoading(true);
      const data = (await getPizza().postApiPizzaSearch(searchCriteria)).data;
      setPizzas(data);
    } catch (error) {
      console.error("Błąd pobierania pizz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
        const data = (await getLookUp().getApiLookUpFilters()).data;
        setFilters(data);
        console.log("Pobrane opcje filtrów:", data);
    } catch (error) {
        console.error("Nie udało się pobrać filtrów", error);
    }
  };

  // 4. OBSŁUGA ZMIAN (Sortowanie, Filtry)
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOption(value);

    // Mapowanie: Front -> Enum 
    let apiSortBy = 0;
    if (value === "price_asc") apiSortBy = 1;
    if (value === "price_desc") apiSortBy = 2;

    if (currentFilters) {
        const updatedFilters = { ...currentFilters, SortBy: apiSortBy }; // Używamy dużej litery SortBy, jeśli tak jest w DTO, lub małej sortBy - zależnie od definicji. W C# DTO jest zazwyczaj PascalCase, ale JS to camelCase. Zostawiam tak jak jest w TS.
        (updatedFilters as any).sortBy = apiSortBy; 
        
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
                <option value="profitability">🔥 Najbardziej opłacalne</option>
                <option value="price_asc">Cena: od najniższej</option>
                <option value="price_desc">Cena: od najwyższej</option>
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
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={pizza.imageUrl ?? undefined}
                        alt={pizza.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>
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

                      <div className="flex gap-2 mt-auto">
                        <span className="text-xs bg-[#2A2A2A] px-2 py-1 rounded text-gray-400">
                          {pizza.style?.name}
                        </span>
                        {pizza.diameterCm && (
                          <span className="text-xs bg-[#2A2A2A] px-2 py-1 rounded text-gray-400">
                            {pizza.diameterCm} cm
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