import Header from "./components/Header";
import PizzaCard from "./components/PizzaCard";
import { pizzas } from "./data/mockPizzas";
import { useState } from "react";
import Sidebar, { type FilterValues } from "./components/Sidebar";

function App() {
  const [data, setData] = useState(pizzas);
  const [sortOption, setSortOption] = useState("default");

  const sortPizzas = (items: typeof pizzas, option: string) => {
    const sortedItems = [...items];

    if (option === "price_asc") {
      return sortedItems.sort((a, b) => a.price - b.price);
    }
    if (option === "price_desc") {
      return sortedItems.sort((a, b) => b.price - a.price);
    }
    return sortedItems;
  };

  const handleFilterChange = (filters: FilterValues) => {
    let filteredPizzas = pizzas;

    filteredPizzas = filteredPizzas.filter(
      (pizza) =>
        pizza.price >= filters.minPrice && pizza.price <= filters.maxPrice,
    );

    filteredPizzas = filteredPizzas.filter(
      (pizza) => pizza.diameter >= filters.minDiameter,
    );

    if (filters.pizzerias.length > 0) {
      filteredPizzas = filteredPizzas.filter((pizza) =>
        filters.pizzerias.includes(pizza.pizzeria),
      );
    }

    if (filters.doughs.length > 0) {
      filteredPizzas = filteredPizzas.filter((pizza) =>
        filters.doughs.includes(pizza.dough),
      );
    }

    if (filters.crusts.length > 0) {
      filteredPizzas = filteredPizzas.filter((pizza) =>
        filters.crusts.includes(pizza.crust),
      );
    }

    if (filters.shapes.length > 0) {
      filteredPizzas = filteredPizzas.filter((pizza) =>
        filters.shapes.includes(pizza.shape),
      );
    }

    if (filters.styles.length > 0) {
      filteredPizzas = filteredPizzas.filter((pizza) =>
        filters.styles.includes(pizza.style),
      );
    }

    if (filters.sauces.length > 0) {
      filteredPizzas = filteredPizzas.filter((pizza) =>
        filters.sauces.includes(pizza.sauce),
      );
    }

    const finalResult = sortPizzas(filteredPizzas, sortOption);
    setData(finalResult);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOption = e.target.value;
    setSortOption(newOption);
    setData(sortPizzas(data, newOption));
  };
  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-20">
      <Header />
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
                <PizzaCard key={pizza.id} data={pizza} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
