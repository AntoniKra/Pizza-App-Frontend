import Header from "./Header"; // <-- Usunięto "components/"
import PizzaCard from "./PizzaCard"; // <-- Usunięto "components/"
import Sidebar, { type FilterValues } from "./Sidebar"; // <-- Usunięto "components/"
import { useNavigate, useLocation } from "react-router-dom";
import { pizzas, type Pizza } from "../data/mockPizzas";
import { useState, useEffect } from "react";

function PizzaSearch() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState(pizzas);
  const [sortOption, setSortOption] = useState("default");

  // 1. Odbieramy miasto, ale trzymamy je jako "adres dostawy"
  const [userAddress, setUserAddress] = useState(
    location.state?.city || "Warszawa, PL",
  );

  // 2. SearchTerm zostawiamy pusty (chyba że chcesz szukać konkretnej pizzy)
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilters, setCurrentFilters] = useState<FilterValues>({
    pizzerias: [],
    doughs: [],
    crusts: [],
    shapes: [],
    styles: [],
    sauces: [],
    minPrice: 0,
    maxPrice: 200,
    minDiameter: 0,
  });

  const calculatePricePerCm2 = (pizza: Pizza) => {
    let area = 0;

    if (pizza.shape === "Okrągła" && pizza.diameter) {
      const radius = pizza.diameter / 2;
      area = Math.PI * radius * radius;
    } else if (pizza.shape === "Prostokątna" && pizza.width && pizza.length) {
      area = pizza.width * pizza.length;
    }

    if (area === 0) return 0;
    return pizza.price / area;
  };

  const sortPizzas = (items: typeof pizzas, option: string) => {
    const sortedItems = [...items];

    if (option === "price_asc") {
      return sortedItems.sort((a, b) => a.price - b.price);
    }
    if (option === "price_desc") {
      return sortedItems.sort((a, b) => b.price - a.price);
    }

    if (option === "profitability") {
      return sortedItems.sort((a, b) => {
        const pricePerCm2A = calculatePricePerCm2(a);
        const pricePerCm2B = calculatePricePerCm2(b);

        return pricePerCm2A - pricePerCm2B;
      });
    }

    return sortedItems;
  };

  useEffect(() => {
    let result = pizzas;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (pizza) =>
          pizza.name.toLowerCase().includes(lowerTerm) ||
          pizza.pizzeria.toLowerCase().includes(lowerTerm),
      );
    }

    result = result.filter(
      (pizza) =>
        pizza.price >= currentFilters.minPrice &&
        pizza.price <= currentFilters.maxPrice,
    );

    result = result.filter((pizza) => {
      if (pizza.shape === "Prostokątna") return true;
      return (pizza.diameter || 0) >= currentFilters.minDiameter;
    });

    if (currentFilters.pizzerias.length > 0) {
      result = result.filter((pizza) =>
        currentFilters.pizzerias.includes(pizza.pizzeria),
      );
    }
    if (currentFilters.doughs.length > 0) {
      result = result.filter((pizza) =>
        currentFilters.doughs.includes(pizza.dough),
      );
    }
    if (currentFilters.crusts.length > 0) {
      result = result.filter((pizza) =>
        currentFilters.crusts.includes(pizza.crust),
      );
    }
    if (currentFilters.shapes.length > 0) {
      result = result.filter((pizza) =>
        currentFilters.shapes.includes(pizza.shape),
      );
    }
    if (currentFilters.styles.length > 0) {
      result = result.filter((pizza) =>
        currentFilters.styles.includes(pizza.style),
      );
    }
    if (currentFilters.sauces.length > 0) {
      result = result.filter((pizza) =>
        currentFilters.sauces.includes(pizza.sauce),
      );
    }

    const finalResult = sortPizzas(result, sortOption);
    setData(finalResult);
  }, [searchTerm, currentFilters, sortOption]);

  const handleFilterChange = (filters: FilterValues) => {
    setCurrentFilters(filters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOption = e.target.value;
    setSortOption(newOption);
    setData(sortPizzas(data, newOption));
  };
  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-20">
      <Header
        onSearch={(term) => setSearchTerm(term)}
        address={userAddress} // <--- Przekazujemy adres z Landing Page'a
      />
      <main className="max-w-[1400px] mx-auto p-8 flex gap-8">
        <Sidebar onFilterChange={handleFilterChange} />
        <div className="flex-1">
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
                <option value="profitability">
                  🔥 Najbardziej opłacalne (zł/cm²)
                </option>
                <option value="price_asc">Cena: od najniższej</option>
                <option value="price_desc">Cena: od najwyższej</option>
              </select>
            </div>
          </div>
          {data.length === 0 ? (
            <div className="text-center py-20 bg-[#1E1E1E] rounded-xl border border-gray-800">
              <p className="text-4xl mb-4">🍕🧐</p>
              <h3 className="text-xl font-bold text-white mb-2">
                Brak wyników
              </h3>
              <p className="text-gray-400">
                Żadna pizza nie spełnia wybranych kryteriów. Spróbuj zmienić
                filtry.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.map((pizza) => (
                <PizzaCard
                  key={pizza.id}
                  data={pizza}
                  // Dodajemy akcję kliknięcia:
                  onClick={() => navigate(`/pizza/${pizza.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PizzaSearch;
