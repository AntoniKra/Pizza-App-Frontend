import { useParams, useNavigate, useLocation } from "react-router-dom";
import { pizzas } from "../data/mockPizzas";
import Header from "./Header";

const PizzaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const userAddress = location.state?.address || "Lokalizacja nieznana";

  const pizza = pizzas.find((p) => p.id === Number(id));

  if (!pizza) {
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
    if (pizza.shape === "Okrągła" && pizza.diameter) {
      const radius = pizza.diameter / 2;
      area = Math.PI * radius * radius;
    } else if (pizza.shape === "Prostokątna" && pizza.width && pizza.length) {
      area = pizza.width * pizza.length;
    }

    const pricePerCm2 = area > 0 ? (pizza.price / area).toFixed(4) : "---";
    const pricePer100g =
      pizza.weight > 0
        ? ((pizza.price / pizza.weight) * 100).toFixed(2)
        : "---";

    return { pricePerCm2, pricePer100g };
  };

  const metrics = calculateMetrics();

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <Header
        address={userAddress}
        onSearch={() => navigate("/search")} // Kliknięcie w lupę wraca do searcha
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
              src={pizza.image}
              alt={pizza.name}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
            />
            {/* Overlay gradient na dole zdjęcia */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60"></div>
          </div>
        </div>

        {/* PRAWA KOLUMNA - DANE */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <div>
              <div className="mb-2 text-[#FF6B6B] font-medium tracking-wide text-sm uppercase flex items-center gap-2">
                📍 {pizza.city}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {pizza.name}
              </h1>
            </div>
            {/* Mock odległości - wymagane w PDF (str. 5) */}
            <div
              onClick={() => navigate("/restaurant")}
              className="bg-[#1E1E1E] px-3 py-1 rounded-lg border border-gray-700 text-[#FF6B6B] font-medium tracking-wide text-m cursor-pointer hover:bg-[#FF6B6B] hover:text-white transition-colors"
            >
              <span>{pizza.pizzeria}</span>
            </div>
          </div>

          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {pizza.description}
          </p>

          {/* CENA */}
          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl font-bold text-white">
              {pizza.price.toFixed(2)} zł
            </span>
          </div>

          {/* --- NOWOŚĆ: SPECYFIKACJA TECHNICZNA (Wymagane w PDF str. 2) --- */}
          <div className="bg-[#1E1E1E]/50 rounded-xl p-5 border border-gray-800 mb-8 grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">
                Styl
              </span>
              <span className="text-white font-medium">{pizza.style}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">
                Ciasto (Dough)
              </span>
              <span className="text-white font-medium">{pizza.dough}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">
                Brzeg (Crust)
              </span>
              <span className="text-white font-medium">{pizza.crust}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">
                Sos bazowy
              </span>
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

          {/* SZCZEGÓŁY FIZYCZNE (Kafelki) */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-[#1E1E1E] rounded-xl p-4 text-center border border-gray-800">
              <div className="text-blue-400 text-2xl mb-1">📏</div>
              <div className="font-bold text-lg">
                {pizza.diameter
                  ? `${pizza.diameter} cm`
                  : `${pizza.width}x${pizza.length} cm`}
              </div>
              <div className="text-xs text-gray-500 uppercase mt-1">
                Rozmiar
              </div>
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

          {/* DANE PIZZERII (Mock mapy) */}
          <div
            onClick={() => navigate("/restaurant")} // Dodajemy nawigację
            className="bg-[#1E1E1E] p-4 rounded-xl flex items-center gap-4 border border-gray-800 mb-10 cursor-pointer hover:border-[#FF6B6B]/50 transition-colors" // Dodajemy kursor i hover
          >
            <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden relative">
              {/* Atrapa mapy */}
              <div className="absolute inset-0 bg-gray-600 opacity-50"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                📍
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">
                Sprzedawane przez
              </p>
              <h4 className="font-bold text-lg text-white">{pizza.pizzeria}</h4>
              <p className="text-sm text-green-400">● Otwarte do 23:00</p>
            </div>
          </div>

          {/* --- PRZYCISK PRZEKIEROWANIA (Model Agregatora) --- */}
          <div className="mt-auto pt-6">
            <button
              onClick={() => {
                // Symulacja przekierowania do partnera zewnętrznego
                // W prawdziwej aplikacji brałbyś tutaj np. pizza.externalUrl
                const googleSearch = `https://www.google.com/search?q=pizzeria+${pizza.pizzeria}+${pizza.city}+zamówienie`;
                window.open(googleSearch, "_blank");
              }}
              className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] hover:from-[#ff5252] hover:to-[#ff7b3b] text-white font-bold py-4 rounded-full text-xl shadow-[0_10px_30px_rgba(255,107,107,0.3)] transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Zamów na stronie pizzerii ➔
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              Zostaniesz przekierowany do strony partnera ({pizza.pizzeria}) w
              celu realizacji zamówienia.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PizzaDetails;
