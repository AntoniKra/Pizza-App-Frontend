import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPizza } from "../api/endpoints/pizza/pizza";
import type { PizzaDetailsDto } from "../api/model";
import { Loader2, ChefHat, Ruler, Scale, Flame } from "lucide-react";

const PizzaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 2. STAN DLA DANYCH Z API
  const [pizza, setPizza] = useState<PizzaDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Pobieranie szczegółów pizzy
        const response = await getPizza().getApiPizzaId(id);
        
        
        setPizza(response);
      } catch (err) {
        console.error(err);
        setError("Nie udało się pobrać szczegółów pizzy.");
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
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate("/search")}
            className="text-[#FF6B6B] hover:underline"
          >
            Wróć do wyszukiwarki
          </button>
        </div>
      );
  }

  // 3. Obliczenia metryk (Cena za cm2, Cena za 100g)
  const calculateMetrics = () => {
    let area = 0;
    
    const price = Number(pizza.price || 0);
    const weight = Number(pizza.weightGrams || 0);
    const diameter = Number(pizza.diameterCm || 0);
    const width = Number(pizza.widthCm || 0);
    const length = Number(pizza.lengthCm || 0);

    // Obliczanie powierzchni (cm2)
    if (diameter > 0) {
      // Koło: π * r^2
      const radius = diameter / 2;
      area = Math.PI * radius * radius;
    } else if (width > 0 && length > 0) {
      // Prostokąt
      area = width * length;
    }

    // Cena za cm2 (w groszach dla czytelności lub w zł)
    // Tutaj wyświetlamy w PLN, np. 0.0450 zł/cm2
    const pricePerCm2 = area > 0 ? (price / area).toFixed(4) : "---";
    
    // Cena za 100g
    const pricePer100g = weight > 0 ? ((price / weight) * 100).toFixed(2) : "---";

    return { pricePerCm2, pricePer100g, area };
  };

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <nav className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          ← Wróć
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
        {/* LEWA KOLUMNA - ZDJĘCIE */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-gray-800 shadow-2xl group">
            {/* Opcjonalny badge */}
            <div className="absolute top-6 left-6 bg-[#FF6B6B] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider shadow-lg z-10">
              POLECANA
            </div>
            
            <img
              src={pizza.imageUrl || "https://placehold.co/600x600?text=Brak+Zdjęcia"}
              alt={pizza.name}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60"></div>

            {/* Styl pizzy jako badge na zdjęciu */}
            {pizza.style && (
                <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-sm font-bold">
                    <ChefHat size={16} className="text-yellow-500"/>
                    {pizza.style.name}
                </div>
            )}
          </div>
        </div>

        {/* PRAWA KOLUMNA - DANE */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <div>
             
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                {pizza.name}
              </h1>
            </div>
            
            {/* Przycisk przejścia do profilu pizzerii (opcjonalne, bo DTO details nie ma ID pizzerii wprost, ale ma menuId)
            <div
              onClick={() => navigate("/restaurant")} // Tu można dodać logikę jeśli backend zwróci pizzeriaId
              className="bg-[#1E1E1E] px-3 py-1 rounded-lg border border-gray-700 text-[#FF6B6B] font-medium tracking-wide text-m cursor-pointer hover:bg-[#FF6B6B] hover:text-white transition-colors"
            >
              <span>Pizzeria Info</span>
            </div> */}
          </div>

          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {pizza.description || "Brak opisu dla tej pizzy."}
          </p>

          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl font-bold text-white">
              {Number(pizza.price).toFixed(2)} zł
            </span>
          </div>

          {/* SPECYFIKACJA - Dane z LookUpItemDto */}
          <div className="bg-[#1E1E1E]/50 rounded-xl p-5 border border-gray-800 mb-8 grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Styl</span>
              <span className="text-white font-medium">{pizza.style?.name || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Ciasto</span>
              <span className="text-white font-medium">{pizza.dough?.name || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Grubość</span>
              <span className="text-white font-medium">{pizza.thickness?.name || "-"}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">Sos bazowy</span>
              <span className="text-white font-medium">{pizza.baseSauce?.name || "-"}</span>
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

          {/* SZCZEGÓŁY FIZYCZNE */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-[#1E1E1E] rounded-xl p-4 text-center border border-gray-800">
              <div className="text-blue-400 text-2xl mb-1 flex justify-center"><Ruler /></div>
              <div className="font-bold text-lg">
                {pizza.diameterCm 
                    ? `${pizza.diameterCm} cm` 
                    : (pizza.widthCm && pizza.lengthCm ? `${pizza.widthCm}x${pizza.lengthCm} cm` : "-")
                }
              </div>
              <div className="text-xs text-gray-500 uppercase mt-1">Rozmiar</div>
            </div>

            <div className="bg-[#1E1E1E] rounded-xl p-4 text-center border border-gray-800">
              <div className="text-green-400 text-2xl mb-1 flex justify-center"><Scale /></div>
              <div className="font-bold text-lg">{pizza.weightGrams || "?"} g</div>
              <div className="text-xs text-gray-500 uppercase mt-1">Waga</div>
            </div>

            <div className="bg-[#1E1E1E] rounded-xl p-4 text-center border border-gray-800">
              <div className="text-orange-400 text-2xl mb-1 flex justify-center"><Flame /></div>
              <div className="font-bold text-lg">{pizza.kcal || "?"}</div>
              <div className="text-xs text-gray-500 uppercase mt-1">Kcal</div>
            </div>
          </div>

          {/* SKŁADNIKI */}
          {pizza.ingredients && pizza.ingredients.length > 0 && (
            <div className="mb-10">
              <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Składniki</h4>
              <ul className="flex flex-wrap gap-2">
                {pizza.ingredients.map((ing) => (
                  <li 
                    key={ing.id || ing.name} 
                    className="px-3 py-1 rounded-full text-sm border border-gray-700 bg-[#252525] text-gray-300"
                  >
                    {ing.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

        
        </div>
      </main>
    </div>
  );
};

export default PizzaDetails;