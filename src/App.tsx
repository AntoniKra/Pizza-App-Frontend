import Header from "./components/Header";
import PizzaCard from "./components/PizzaCard";
import { pizzas } from "./data/mockPizzas";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-20">
      <Header />
      <main className="max-w-[1400px] mx-auto p-8 flex gap-8">
        <Sidebar />
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-8">Znalezione oferty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pizzas.map((pizza) => (
              <PizzaCard key={pizza.id} data={pizza} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
