import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "./Loader";
import Sidebar from "./Sidebar";
import { getPizza } from "../api/generated/pizza/pizza";
import {
  type PizzaFiltersDto,
  type PizzaSearchCriteriaDto,
  type PizzaSearchResultDto,
  type LookUpItemDto,
} from "../api/generated/models";
import { getLookUp } from "../api/generated/look-up/look-up";

function PizzaSearch() {
  const navigate = useNavigate();
  // 1. Zastępujemy useLocation przez useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();

  // Pobieranie miasta z URL z fallbackiem do localStorage
  const cityIdFromUrl = searchParams.get("cityId");
  const savedCity = localStorage.getItem("pizza_city");
  let defaultCityId = "";
  try {
    defaultCityId = savedCity ? JSON.parse(savedCity).id : "";
  } catch (e) {
    console.warn("Nie udało się parsować pizza_city z localStorage", e);
  }
  const currentCityId = cityIdFromUrl || defaultCityId;
  
  // Debug: pokaż gdzie bierzemy miasta z
  if (!currentCityId) {
    console.warn("⚠️ Brak cityId! URL:", cityIdFromUrl, "localStorage:", savedCity, "defaultCityId:", defaultCityId);
  }

  // --- STANY ---
  const [pizzas, setPizzas] = useState<PizzaSearchResultDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [sortOptions, setSortOptions] = useState<LookUpItemDto[]>([]); 
  const [filters, setFilters] = useState<PizzaFiltersDto>();

  const [totalCount, setTotalCount] = useState<number | null>(null);

  // --- POBIERANIE DANYCH SŁOWNIKOWYCH (Tylko raz po montażu) ---
  useEffect(() => {
    const init = async () => {
      try {
        const filtersData = await getLookUp().getApiLookUpFilters();
        setFilters(filtersData);

        const sortData = await getLookUp().getApiLookUpEnumAll({ type: "SortOptionEnum" });
        setSortOptions(sortData);
      } catch (err) {
        console.error("Błąd inicjalizacji:", err);
      }
    };
    init();
  }, []);

  type PagedResult<T> = {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };

  
  const getFiltersFromUrl = useCallback((): PizzaSearchCriteriaDto => {
    const parseLookUp = (key: string) => {
      const val = searchParams.get(key);
      return val ? val.split(",").map(id => ({ id, name: "" } as LookUpItemDto)) : null;
    };

    return {
      cityId: currentCityId,
      pageNumber: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("limit")) || 10,
      sortBy: searchParams.get("sort") ? ({ id: searchParams.get("sort"), name: "" } as LookUpItemDto) : null,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null,
      brandIds: searchParams.get("brands") ? searchParams.get("brands")!.split(",") : null,
      styles: parseLookUp("styles"),
      doughs: parseLookUp("doughs"),
      thicknesses: parseLookUp("thicknesses"),
      shapes: parseLookUp("shapes"),
      sauces: parseLookUp("sauces"),
    };
  }, [searchParams, currentCityId]);


  const updateUrlParams = (criteria: PizzaSearchCriteriaDto) => {
    const params = new URLSearchParams();
    if (criteria.cityId) params.set("cityId", criteria.cityId);
    if (criteria.pageNumber && criteria.pageNumber !== 1) params.set("page", String(criteria.pageNumber));
    if (criteria.pageSize && criteria.pageSize !== 10) params.set("limit", String(criteria.pageSize));
    if (criteria.sortBy?.id && criteria.sortBy.id !== "1") params.set("sort", criteria.sortBy.id);
    if (criteria.minPrice) params.set("minPrice", String(criteria.minPrice));
    if (criteria.maxPrice) params.set("maxPrice", String(criteria.maxPrice));
    if (criteria.brandIds?.length) params.set("brands", criteria.brandIds.join(","));

    const stringifyLookUp = (arr?: LookUpItemDto[] | null) => arr?.map(a => a.id).join(",");

    const styles = stringifyLookUp(criteria.styles);
    if (styles) params.set("styles", styles);

    const doughs = stringifyLookUp(criteria.doughs);
    if (doughs) params.set("doughs", doughs);

    const thicknesses = stringifyLookUp(criteria.thicknesses);
    if (thicknesses) params.set("thicknesses", thicknesses);

    const shapes = stringifyLookUp(criteria.shapes);
    if (shapes) params.set("shapes", shapes);

    const sauces = stringifyLookUp(criteria.sauces);
    if (sauces) params.set("sauces", sauces);

    setSearchParams(params);
  };

  // --- GŁÓWNY SILNIK (Reaguje na każdą zmianę w URL) ---
  useEffect(() => {
    console.log("useEffect: searchParams się zmieniły, odpalam fetchPizzas");
    
    const fetchPizzas = async () => {
      const criteria = getFiltersFromUrl();
      console.log("Finalne kryteria wysłane do API:", criteria);

      try {
        setIsLoading(true);
        console.log("Wywołuję postApiPizzaSearch...");
        const data: any = await getPizza().postApiPizzaSearch(criteria as any);
        console.log("Odpowiedź z API:", data);

        if (Array.isArray(data)) {
          setPizzas(data as PizzaSearchResultDto[]);
          setTotalCount((data as PizzaSearchResultDto[]).length);
        } else if (data && (data as PagedResult<PizzaSearchResultDto>).items) {
          const paged = data as PagedResult<PizzaSearchResultDto>;
          setPizzas(paged.items);
          setTotalCount(paged.totalCount ?? paged.items.length);
        } else {
          setPizzas([]);
          setTotalCount(0);
        }
      } catch (error) {
        console.error("BŁĄD W API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPizzas();
  }, [searchParams]);

  // --- OBSŁUGA ZMIAN (Zamiast modyfikować stan, modyfikujemy URL) ---
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newCriteria = { 
        ...getFiltersFromUrl(), 
        sortBy: sortOptions.find(opt => opt.id === value) || null, 
        pageNumber: 1 // Przy zmianie sortowania wracamy na 1 stronę
    };
    updateUrlParams(newCriteria);
  };

  const handleFilterChange = (newFilters: Omit<PizzaSearchCriteriaDto, "cityId">) => {
    const newCriteria = { ...getFiltersFromUrl(), ...newFilters, pageNumber: 1 };
    updateUrlParams(newCriteria);
  };

  // Wyciągamy wartości bieżące prosto z URL na potrzeby renderowania UI
  const currentCriteria = getFiltersFromUrl();
  const currentPage = Number(currentCriteria.pageNumber);
  const currentLimit = Number(currentCriteria.pageSize);

  // --- WIDOK ---
  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-20">
      <main className="max-w-[1400px] mx-auto p-8 flex gap-8">
        
        {/* Pokazuj Sidebar tylko jeśli jest miasto */}
        {filters && currentCityId && (
          <Sidebar 
            filters={filters} 
            activeFilters={currentCriteria} 
            onFilterChange={handleFilterChange} 
          />
        )}

        <div className="flex-1">
          {currentCityId && (
            <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-4">
            <h2 className="text-3xl font-bold">Znalezione oferty</h2>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Sortuj:</span>
              <select
                value={currentCriteria.sortBy?.id || "1"}
                onChange={handleSortChange}
                className="bg-[#1E1E1E] border border-gray-700 text-white text-sm rounded-lg p-2.5 outline-none focus:border-[#FF6B6B]"
              >
                {sortOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>
                        {opt.name}
                    </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="text-sm text-gray-400">
              {totalCount !== null ? (
                <span>Wyświetlono {pizzas.length} z {totalCount} wyników</span>
              ) : (
                <span>Wyświetlono {pizzas.length} wyników</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400">Na stronie:</label>
              <select
                value={currentLimit}
                onChange={(e) => {
                  const newCriteria = { ...currentCriteria, pageSize: Number(e.target.value), pageNumber: 1 };
                  updateUrlParams(newCriteria);
                }}
                className="bg-[#1E1E1E] border border-gray-700 text-white text-sm rounded-lg p-2.5 outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const prev = Math.max(1, currentPage - 1);
                    updateUrlParams({ ...currentCriteria, pageNumber: prev });
                  }}
                  className="px-3 py-1 bg-[#1E1E1E] border border-gray-700 rounded text-white text-sm disabled:opacity-50"
                  disabled={currentPage <= 1}
                >
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {(() => {
                    if (totalCount === null) return null;
                    const totalPages = Math.max(1, Math.ceil(totalCount / currentLimit));
                    let start = Math.max(1, currentPage - 2);
                    let end = Math.min(totalPages, start + 4);
                    if (end - start < 4) start = Math.max(1, end - 4);
                    const pages = [] as number[];
                    for (let i = start; i <= end; i++) pages.push(i);
                    return pages.map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          updateUrlParams({ ...currentCriteria, pageNumber: p });
                        }}
                        className={`px-3 py-1 rounded ${p === currentPage ? 'bg-[#FF6B6B] text-white' : 'bg-[#1E1E1E] text-gray-300'} text-sm border border-gray-700`}
                      >
                        {p}
                      </button>
                    ));
                  })()}
                </div>

                <button
                  onClick={() => {
                    if (totalCount === null) return;
                    const totalPages = Math.max(1, Math.ceil(totalCount / currentLimit));
                    const next = Math.min(totalPages, currentPage + 1);
                    updateUrlParams({ ...currentCriteria, pageNumber: next });
                  }}
                  className="px-3 py-1 bg-[#1E1E1E] border border-gray-700 rounded text-white text-sm disabled:opacity-50"
                  disabled={totalCount === null || currentPage >= Math.max(1, Math.ceil((totalCount ?? 0) / currentLimit))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* SPINNER, BRAK MIASTA, BRAK WYNIKÓW I LISTA PIZZ */}
          {!currentCityId && !isLoading && (
            <div className="text-center py-20 bg-[#1E1E1E] rounded-xl border border-gray-800 text-gray-500">
              <h3 className="text-xl font-bold mb-2">Brak wybranego miasta 📍</h3>
              <p>Przejdź do strony głównej i wybierz miasto, aby zobaczyć dostępne pizze.</p>
            </div>
          )}

          {currentCityId && isLoading && (
            <Loader inline message="Ładowanie ofert..." size={48} className="py-20" />
          )}

          {currentCityId && !isLoading && pizzas.length === 0 && (
            <div className="text-center py-20 bg-[#1E1E1E] rounded-xl border border-gray-800 text-gray-500">
              <h3 className="text-xl font-bold mb-2">Brak wyników 😔</h3>
              <p>Spróbuj zmienić filtry lub wpisać inną nazwę.</p>
            </div>
          )}

          {currentCityId && !isLoading && pizzas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pizzas.map((pizza) => (
                <div key={pizza.id} onClick={() => navigate(`/pizza/${pizza.id}`)}>
                  {/* TWOJA AKTUALNA KARTA PIZZY - nic tu nie modyfikowałem :) */}
                  <div className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-gray-800 hover:border-[#FF6B6B] transition cursor-pointer group h-full flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                      <img src={pizza.imageUrl ?? undefined} alt={pizza.name ?? "Pizza"} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-white">{pizza.name}</h3>
                          <p className="text-xs text-[#FF6B6B] font-bold uppercase tracking-wider">{pizza.brandName}</p>
                        </div>
                        <span className="text-xl font-bold text-white">{pizza.price} zł</span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{pizza.description}</p>
                      <div className="flex gap-2 mt-auto flex-wrap">
                        <span className="text-xs bg-[#2A2A2A] px-2 py-1 rounded text-gray-400">{pizza.style?.name}</span>
                        {pizza.diameterCm && <span className="text-xs bg-[#2A2A2A] px-2 py-1 rounded text-gray-400">{pizza.diameterCm} cm</span>}
                        {pizza.pricePerSqCm && <span className="text-xs bg-green-900/50 text-green-400 border border-green-800 px-2 py-1 rounded">{pizza.pricePerSqCm} zł/cm²</span>}
                        {pizza.kcalPerGram && <span className="text-xs bg-blue-900/50 text-blue-400 border border-blue-800 px-2 py-1 rounded">{pizza.kcalPerGram} kcal/g</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default PizzaSearch;