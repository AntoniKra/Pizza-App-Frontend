import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Edit3, Trash2, Flame } from "lucide-react";
import type { Pizza } from "../data/mockPizzas"; // Używamy typu, który już masz

// --- MOCK DATA ---
const MOCK_MENU: Pizza[] = [
  {
    id: 101,
    name: "Margherita",
    price: 32.0,
    description: "Sos pomidorowy, mozzarella fior di latte, bazylia, oliwa.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=500",

    kcal: 800,
    weight: 450,
  },
  {
    id: 102,
    name: "Pepperoni Classic",
    price: 39.0,
    description: "Podwójna porcja pepperoni, mozzarella, sos pomidorowy.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=500",

    kcal: 1200,
    weight: 500,
  },
];

const RestaurantMenuView = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID Restauracji z URL
  const location = useLocation();
  const restaurantName = location.state?.restaurantName || "Restauracja";

  const [menu, setMenu] = useState<Pizza[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Symulacja pobierania menu dla tej konkretnej restauracji
    // GET /api/Menu/GetByPizzeria/{id}
    console.log(`Pobieram menu dla pizzerii ID: ${id}`);

    setTimeout(() => {
      setMenu(MOCK_MENU);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleDelete = (pizzaId: number) => {
    if (confirm("Czy na pewno usunąć tę pizzę z menu?")) {
      console.log(`Usuwam pizzę ID: ${pizzaId}`);
      setMenu((prev) => prev.filter((p) => p.id !== pizzaId));
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/account")}
              className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-full"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">
                Zarządzanie Menu
              </p>
              <h1 className="text-3xl font-bold text-white">
                {restaurantName}
              </h1>
            </div>
          </div>

          <button
            onClick={() =>
              navigate("/add-pizza", {
                state: { pizzeriaId: id, pizzeriaName: restaurantName },
              })
            }
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-900/20 transition transform hover:scale-105"
          >
            <Plus size={20} /> Dodaj Pozycję
          </button>
        </div>

        {/* LISTA PIZZ */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">
            Ładowanie menu...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((pizza) => (
              <div
                key={pizza.id}
                className="group bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden hover:border-red-500/30 transition duration-300 flex flex-col"
              >
                {/* Obrazek */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">
                      {pizza.name}
                    </h3>
                    <span className="text-yellow-400 font-mono font-bold bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                      {pizza.price} zł
                    </span>
                  </div>
                </div>

                {/* Opis */}
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                    {pizza.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1 bg-[#252525] px-2 py-1 rounded">
                      <Flame size={12} className="text-orange-500" />{" "}
                      {pizza.kcal} kcal
                    </span>
                  </div>

                  {/* Przyciski Akcji */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#333]">
                    <button
                      onClick={() =>
                        navigate(`/edit-pizza/${pizza.id}`, {
                          state: { pizzaData: pizza },
                        })
                      }
                      className="flex items-center justify-center gap-2 bg-[#252525] hover:bg-[#333] text-white py-2 rounded-lg text-sm font-bold transition border border-[#333] hover:border-gray-500"
                    >
                      <Edit3 size={16} /> Edytuj
                    </button>
                    <button
                      onClick={() => handleDelete(pizza.id)}
                      className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg text-sm font-bold transition border border-red-500/20 hover:border-red-500"
                    >
                      <Trash2 size={16} /> Usuń
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenuView;
