import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { ArrowLeft, CheckCircle } from "lucide-react";
import type { Pizza } from "../data/mockPizzas";

interface NewPizzaPreviewViewProps {
    onConfirm: (pizza: Pizza) => void;
}

const NewPizzaPreviewView = ({ onConfirm }: NewPizzaPreviewViewProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const pizza = location.state?.pizzaData as Pizza;
  const ingredientsList = (location.state?.ingredientsList as string[]) || [];

  if (!pizza) {
      navigate("/add-pizza");
      return null;
  }

  const handleAddToMenu = () => {
      onConfirm(pizza);
      navigate("/restaurant");
  };

  // Obliczenia
  let area = 0;
  if (pizza.shape === "Okrągła" && pizza.diameter) {
      area = Math.PI * (pizza.diameter / 2) ** 2;
  } else if (pizza.shape === "Prostokątna" && pizza.width && pizza.length) {
      area = pizza.width * pizza.length;
  }
  
  const pricePerCm2 = area > 0 ? (pizza.price / area).toFixed(2) : "0.00";
  const pricePer100g = pizza.weight > 0 ? ((pizza.price / pizza.weight) * 100).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <Header onSearch={() => {}} />
      
      {/* Banner informacyjny */}
      <div className="bg-green-500/10 border-b border-green-500/20 py-3 text-center text-green-400 font-bold text-sm flex items-center justify-center gap-2 sticky top-0 z-50 backdrop-blur-sm">
          <CheckCircle size={16} />
          To jest podgląd. Jeśli wszystko wygląda dobrze, dodaj pizzę do menu.
      </div>

      <nav className="p-6 max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
          <ArrowLeft size={20} /> Edytuj dane
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
        
        {/* LEWA KOLUMNA - ZDJĘCIE I SKŁADNIKI */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-gray-800 shadow-2xl group">
            <div className="absolute top-6 left-6 bg-[#FF6B6B] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider shadow-lg z-10">
              NOWA POZYCJA
            </div>
            <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60"></div>
          </div>

          {/* LISTA SKŁADNIKÓW (POD ZDJĘCIEM) */}
          <div className="bg-[#1E1E1E]/50 rounded-xl p-5 border border-gray-800">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Składniki</h3>
              {ingredientsList.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                      {ingredientsList.map((ing, idx) => (
                          <span key={idx} className="bg-[#252525] text-gray-300 text-xs px-3 py-1.5 rounded-full border border-[#333]">
                              {ing}
                          </span>
                      ))}
                  </div>
              ) : (
                  <p className="text-gray-500 text-sm italic">Brak wyszczególnionych składników</p>
              )}
          </div>
        </div>

        {/* PRAWA KOLUMNA - DANE SZCZEGÓŁOWE */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <div>
              <div className="mb-2 text-[#FF6B6B] font-medium tracking-wide text-sm uppercase flex items-center gap-2">
                <span>📍 {pizza.city}</span>
                <span className="text-gray-600">•</span>
                <span>{pizza.pizzeria}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{pizza.name}</h1>
            </div>
          </div>

          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {pizza.description}
          </p>

          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl font-bold text-white">{pizza.price.toFixed(2)} zł</span>
          </div>

          {/* SPECYFIKACJA (Tabela 2x2) */}
          <div className="bg-[#1E1E1E]/50 rounded-xl p-5 border border-gray-800 mb-8 grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Styl</span>
              <span className="text-white font-medium">{pizza.style}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Ciasto (Dough)</span>
              <span className="text-white font-medium">{pizza.dough}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Brzeg (Crust)</span>
              <span className="text-white font-medium">{pizza.crust}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Sos bazowy</span>
              <span className="text-white font-medium">{pizza.sauce}</span>
            </div>
          </div>

          {/* METRYKI OPŁACALNOŚCI */}
          <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-gray-800 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF6B6B] blur-[50px] opacity-10"></div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
               📊 Analiza Opłacalności
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-gray-500 text-sm mb-1">Cena za 100g</p>
                <p className="text-3xl font-bold text-[#FF6B6B]">{pricePer100g} zł</p>
              </div>
              <div className="border-l border-gray-700 pl-8">
                <p className="text-gray-500 text-sm mb-1">Cena za cm²</p>
                <p className="text-3xl font-bold text-white">{pricePerCm2} zł</p>
              </div>
            </div>
          </div>

          {/* FIZYCZNE METRYKI (Ikony) */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-[#1E1E1E] rounded-xl p-4 text-center border border-gray-800">
              <div className="text-blue-400 text-2xl mb-1">📏</div>
              <div className="font-bold text-lg">
                  {pizza.shape === "Okrągła" ? `${pizza.diameter} cm` : `${pizza.width}x${pizza.length}`}
              </div>
              <div className="text-xs text-gray-500 uppercase mt-1">Rozmiar</div>
            </div>
            <div className="bg-[#1E1E1E] rounded-xl p-4 text-center border border-gray-800">
              <div className="text-green-400 text-2xl mb-1">⚖️</div>
              <div className="font-bold text-lg">{pizza.weight} g</div>
              <div className="text-xs text-gray-500 uppercase mt-1">Waga</div>
            </div>
            <div className="bg-[#1E1E1E] rounded-xl p-4 text-center border border-gray-800">
              <div className="text-orange-400 text-2xl mb-1">🔥</div>
              <div className="font-bold text-lg">{pizza.kcal}</div>
              <div className="text-xs text-gray-500 uppercase mt-1">Kcal</div>
            </div>
          </div>

          {/* SPRZEDAWCA */}
          <div className="bg-[#1E1E1E] p-4 rounded-xl flex items-center gap-4 border border-gray-800 mb-10">
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-gray-600 opacity-50"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">📍</div>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">Sprzedawane przez</p>
              <h4 className="font-bold text-lg text-white">{pizza.pizzeria}</h4>
              <p className="text-sm text-green-400">● Otwarte do 23:00</p>
            </div>
          </div>

          {/* BUTTON */}
          <div className="mt-auto">
            <button
              onClick={handleAddToMenu}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-full text-xl shadow-[0_10px_30px_rgba(22,163,74,0.3)] transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Dodaj pizzę do menu ➔
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewPizzaPreviewView;