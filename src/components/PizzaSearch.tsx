import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const initialCityId = location.state?.cityId;

  // --- STANY ---
  const [pizzas, setPizzas] = useState<PizzaSearchResultDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sortowanie: Stan domyślny to "1" (zgodnie z Enumem w backendzie: Default = 1)
  const [sortOption, setSortOption] = useState<LookUpItemDto | null>(null); 
  const [sortOptions, setSortOptions] = useState<LookUpItemDto[]>([]); 

  // Stan filtrów
  const [filters, setFilters] = useState<PizzaFiltersDto>();
  const [currentFilters, setCurrentFilters] = useState<PizzaSearchCriteriaDto | null>(null);

  // Paginacja
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // --- POBIERANIE DANYCH ---
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

  const fetchPizzas = async (searchCriteria: PizzaSearchCriteriaDto) => {
    try {
      searchCriteria.cityId = initialCityId;
      // ensure pageNumber/pageSize are numbers
      if (!searchCriteria.pageNumber) searchCriteria.pageNumber = pageNumber;
      if (!searchCriteria.pageSize) searchCriteria.pageSize = pageSize;

      setIsLoading(true);
      const data: unknown = await getPizza().postApiPizzaSearch(searchCriteria as any);

      // Handle both legacy array response and future paged response
      if (Array.isArray(data)) {
        setPizzas(data as PizzaSearchResultDto[]);
        setTotalCount((data as PizzaSearchResultDto[]).length);
      } else if (data && (data as PagedResult<PizzaSearchResultDto>).items) {
        const paged = data as PagedResult<PizzaSearchResultDto>;
        setPizzas(paged.items);
        setTotalCount(paged.totalCount ?? paged.items.length);
        setPageNumber(paged.pageNumber ?? pageNumber);
        setPageSize(paged.pageSize ?? pageSize);
      } else {
        // unknown shape: try to coerce
        console.warn("Unexpected search response shape", data);
        setPizzas([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Błąd pobierania pizz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- OBSŁUGA ZMIAN ---
  
  // 1. Zmiana Sortowania (Dropdown)
  const handleSortChange = async(e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const findSortOption = sortOptions.find(opt => opt.id === value);
    setSortOption(findSortOption || null); 

    if (currentFilters) {
        const updatedFilters = { 
            ...currentFilters, 
            sortBy: findSortOption,
        };

        setCurrentFilters(updatedFilters);
        await fetchPizzas({ ...updatedFilters, pageNumber, pageSize });
    }
  };

  // 2. Zmiana Filtrów (Sidebar)
  // FIX: Musimy pamiętać o aktualnym sortowaniu!
  const handleFilterChange = async (newFilters: Omit<PizzaSearchCriteriaDto, "cityId">) => {
    const helper: PizzaSearchCriteriaDto = {
      ...newFilters,
      cityId: initialCityId,
      sortBy: sortOption,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };

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
              
              {/* Dynamiczny Select z API */}
              <select
                value={sortOption?.id}
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

          {/* PAGINACJA - header */}
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
                value={pageSize}
                onChange={async (e) => {
                  const newSize = Number(e.target.value);
                  setPageSize(newSize);
                  setPageNumber(1);
                  const criteria = currentFilters ?? ({ cityId: initialCityId } as PizzaSearchCriteriaDto);
                  await fetchPizzas({ ...criteria, pageNumber: 1, pageSize: newSize });
                }}
                className="bg-[#1E1E1E] border border-gray-700 text-white text-sm rounded-lg p-2.5 outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              {/* Page controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    const prev = Math.max(1, pageNumber - 1);
                    if (prev === pageNumber) return;
                    setPageNumber(prev);
                    const criteria = currentFilters ?? ({ cityId: initialCityId } as PizzaSearchCriteriaDto);
                    await fetchPizzas({ ...criteria, pageNumber: prev, pageSize });
                  }}
                  className="px-3 py-1 bg-[#1E1E1E] border border-gray-700 rounded text-white text-sm disabled:opacity-50"
                  disabled={pageNumber <= 1}
                >
                  Prev
                </button>

                {/* Page numbers (windowed) */}
                <div className="flex items-center gap-1">
                  {(() => {
                    if (totalCount === null) return null;
                    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
                    let start = Math.max(1, pageNumber - 2);
                    let end = Math.min(totalPages, start + 4);
                    if (end - start < 4) start = Math.max(1, end - 4);
                    const pages = [] as number[];
                    for (let i = start; i <= end; i++) pages.push(i);
                    return pages.map(p => (
                      <button
                        key={p}
                        onClick={async () => {
                          if (p === pageNumber) return;
                          setPageNumber(p);
                          const criteria = currentFilters ?? ({ cityId: initialCityId } as PizzaSearchCriteriaDto);
                          await fetchPizzas({ ...criteria, pageNumber: p, pageSize });
                        }}
                        className={`px-3 py-1 rounded ${p === pageNumber ? 'bg-[#FF6B6B] text-white' : 'bg-[#1E1E1E] text-gray-300'} text-sm border border-gray-700`}
                      >
                        {p}
                      </button>
                    ));
                  })()}
                </div>

                <button
                  onClick={async () => {
                    if (totalCount === null) return;
                    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
                    const next = Math.min(totalPages, pageNumber + 1);
                    if (next === pageNumber) return;
                    setPageNumber(next);
                    const criteria = currentFilters ?? ({ cityId: initialCityId } as PizzaSearchCriteriaDto);
                    await fetchPizzas({ ...criteria, pageNumber: next, pageSize });
                  }}
                  className="px-3 py-1 bg-[#1E1E1E] border border-gray-700 rounded text-white text-sm disabled:opacity-50"
                  disabled={totalCount === null || pageNumber >= Math.max(1, Math.ceil((totalCount ?? 0) / pageSize))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* SPINNER */}
          {isLoading && (
            <Loader
              inline
              message="Ładowanie ofert..."
              size={48}
              className="py-20"
            />
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

                      {/* BADGE - Clean Code & Truthy Checks */}
                      <div className="flex gap-2 mt-auto flex-wrap">
                        <span className="text-xs bg-[#2A2A2A] px-2 py-1 rounded text-gray-400">
                          {pizza.style?.name}
                        </span>

                        {pizza.diameterCm && (
                          <span className="text-xs bg-[#2A2A2A] px-2 py-1 rounded text-gray-400">
                            {pizza.diameterCm} cm
                          </span>
                        )}

                        {pizza.pricePerSqCm && (
                          <span className="text-xs bg-green-900/50 text-green-400 border border-green-800 px-2 py-1 rounded">
                            {pizza.pricePerSqCm} zł/cm²
                          </span>
                        )}

                        {pizza.kcalPerGram && (
                          <span className="text-xs bg-blue-900/50 text-blue-400 border border-blue-800 px-2 py-1 rounded">
                            {pizza.kcalPerGram} kcal/g
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