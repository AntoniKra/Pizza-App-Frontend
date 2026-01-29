import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import { getPizza } from "../api/endpoints/pizza/pizza";
import type { PizzaDetailsDto } from "../api/model";
import { Loader2 } from "lucide-react";

const PizzaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Zabezpieczenie adresu z nawigacji
  const userAddress = location.state?.address || "Lokalizacja nieznana";
  
  // 2. STAN DLA DANYCH Z API
  const [pizza, setPizza] = useState<PizzaDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getPizza().getApiPizzaId(id); 
        setPizza(response.data);
      } catch (err) {
        console.error(err);
        setError("Błąd pobierania");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
       <div className="min-h-screen bg-[#121212] flex items-center justify-center">
         <Loader2 className="animate-spin text-[#FF6B6B]" size={48} />
       </div>
    );
  }

  if (!pizza || error) {
      return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-4">Nie znaleziono pizzy 😔</h2>
          <button
            onClick={() => navigate("/search")}
            className="text-[#FF6B6B] hover:underline"
          >
            Wróć do wyszukiwarki
          </button>
        </div>
      );
  }

  const calculateMetrics = () => {
    let area = 0;
    
    // Konwersja bezpieczna: Number(wartosc)
    const diameter = Number(pizza.diameterCm || 0);
    const width = Number(pizza.widthCm || 0);
    const length = Number(pizza.lengthCm || 0);
    const price = Number(pizza.price || 0);
    const weight = Number(pizza.weightGrams || 0);

    // Logika kształtu
    if (diameter > 0) {
      const radius = diameter / 2;
      area = Math.PI * radius * radius;
    } else if (width > 0 && length > 0) {
      area = width * length;
    }

    // Obliczenia (zabezpieczenie przed dzieleniem przez 0)
    const pricePerCm2 = area > 0 ? (price / area).toFixed(4) : "---";
    
    const pricePer100g =
      weight > 0
        ? ((price / weight) * 100).toFixed(2)
        : "---";

    return { pricePerCm2, pricePer100g };
  };

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <Header
        address={userAddress}
        onSearch={() => navigate("/search")}
      />
      <nav className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          ← Wróć do listy
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
        {/* LEWA KOLUMNA - ZDJĘCIE */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-gray-800 shadow-2xl group">
            <div className="absolute top-6 left-6 bg-[#FF6B6B] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider shadow-lg z-10">
              POLECANA
            </div>
            <img
              // FIX: imageUrl
              src={pizza.imageUrl || "https://placehold.co/600x600?text=Pizza"}
              alt={pizza.name}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60"></div>
          </div>
        </div>

        {/* PRAWA KOLUMNA - DANE */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <div>
              <div className="mb-2 text-[#FF6B6B] font-medium tracking-wide text-sm uppercase flex items-center gap-2">
                {/* FIX: Placeholder dla miasta */}
                📍 {location.state?.cityName || "Twoje Miasto"}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {pizza.name}
              </h1>
            </div>
            
            <div
              onClick={() => navigate("/restaurant")}
              className="bg-[#1E1E1E] px-3 py-1 rounded-lg border border-gray-700 text-[#FF6B6B] font-medium tracking-wide text-m cursor-pointer hover:bg-[#FF6B6B] hover:text-white transition-colors"
            >
              {/* FIX: Placeholder dla pizzerii */}
              <span>Pizzeria Info</span>
            </div>
          </div>

          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {pizza.description}
          </p>

          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl font-bold text-white">
              {Number(pizza.price || 0).toFixed(2)} zł
            </span>
          </div>

          {/* SPECYFIKACJA - FIX: OBIEKTY .name */}
          <div className="bg-[#1E1E1E]/50 rounded-xl p-5 border border-gray-800 mb-8 grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">
                Styl
              </span>
              <span className="text-white font-medium">{pizza.style.name}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">
                Ciasto (Dough)
              </span>
              <span className="text-white font-medium">{pizza.dough.name}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">
                Brzeg
              </span>
              <span className="text-white font-medium">{pizza.thickness.name}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">
                Sos bazowy
              </span>
              <span className="text-white font-medium">{pizza.baseSauce.name}</span>
            </div>
          </div>

          {/* METRYKI */}
          <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-gray-800 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF6B6B] blur-[50px] opacity-10"></div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
              📊 Analiza Opłacalności
            </h3>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-gray-500 text-sm mb-1">Cena za 100g</p>
                <p className="text-3xl font-bold text-[#FF6B6B]">
                  {metrics.pricePer100g} zł
                </p>
              </div>
              <div className="border-l border-gray-700 pl-8">
                <p className="text-gray-500 text-sm mb-1">Cena za cm²</p>
                <p className="text-3xl font-bold text-white">
                  {metrics.pricePerCm2} zł
                </p>
              </div>
            </div>
          </div>

          {/* SZCZEGÓŁY FIZYCZNE - FIX: Nazwy pól */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-[#1E1E1E] rounded-xl p-4 text-center border border-gray-800">
              <div className="text-blue-400 text-2xl mb-1">📏</div>
              <div className="font-bold text-lg">
                {pizza.diameterCm
                  ? `${pizza.diameterCm} cm`
                  : `${pizza.widthCm}x${pizza.lengthCm} cm`}
              </div>
              <div className="text-xs text-gray-500 uppercase mt-1">
                Rozmiar
              </div>
            </div>

            <div className="bg-[#1E1E1E] rounded-xl p-4 text-center border border-gray-800">
              <div className="text-green-400 text-2xl mb-1">⚖️</div>
              <div className="font-bold text-lg">{pizza.weightGrams} g</div>
              <div className="text-xs text-gray-500 uppercase mt-1">Waga</div>
            </div>

            <div className="bg-[#1E1E1E] rounded-xl p-4 text-center border border-gray-800">
              <div className="text-orange-400 text-2xl mb-1">🔥</div>
              <div className="font-bold text-lg">{pizza.kcal}</div>
              <div className="text-xs text-gray-500 uppercase mt-1">Kcal</div>
            </div>
          </div>

          {/* SKŁADNIKI */}
           <div className="mb-10">
             <h4 className="text-sm font-semibold text-gray-300 mb-3">Składniki</h4>
             <ul className="flex flex-wrap gap-2">
               {pizza.ingredients?.map((ing: any) => (
                 <li key={ing.id} className={`px-3 py-1 rounded-full text-sm border ${ing.isAllergen ? 'border-red-500 text-red-400' : 'border-gray-700 text-gray-300'}`}>
                   {ing.name}
                 </li>
               ))}
             </ul>
           </div>

          {/* DANE PIZZERII (Mock) */}
          <div
            onClick={() => navigate("/restaurant")}
            className="bg-[#1E1E1E] p-4 rounded-xl flex items-center gap-4 border border-gray-800 mb-10 cursor-pointer hover:border-[#FF6B6B]/50 transition-colors"
          >
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-gray-600 opacity-50"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                📍
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">
                Sprzedawane przez
              </p>
              {/* FIX: Placeholder */}
              <h4 className="font-bold text-lg text-white">Twój Lokal</h4>
              <p className="text-sm text-green-400">● Otwarte do 23:00</p>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={() => {
                const googleSearch = `https://www.google.com/search?q=pizzeria+Pizza+${location.state?.cityName}+zamówienie`;
                window.open(googleSearch, "_blank");
              }}
              className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] hover:from-[#ff5252] hover:to-[#ff7b3b] text-white font-bold py-4 rounded-full text-xl shadow-[0_10px_30px_rgba(255,107,107,0.3)] transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Zamów na stronie pizzerii ➔
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              Zostaniesz przekierowany do strony partnera w
              celu realizacji zamówienia.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PizzaDetails;