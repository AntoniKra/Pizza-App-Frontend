import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Hooki do nawigacji
import { pizzas } from "../data/mockPizzas";

const PizzaDetails = () => {
  const { id } = useParams(); // Pobieramy ID z adresu URL (np. /pizza/1)
  const navigate = useNavigate(); // Hook do przycisku "Wróć"

  // Szukamy pizzy w bazie danych
  const pizza = pizzas.find((p) => p.id === Number(id));

  // Zabezpieczenie: jeśli ktoś wpisze zły link
  if (!pizza) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Nie znaleziono pizzy 😔</h2>
          <button onClick={() => navigate("/")} className="text-[#FF6B6B]">
            Wróć do strony głównej
          </button>
        </div>
      </div>
    );
  }

  // --- LOGIKA RADARU (Kopiuj-wklej z poprzedniego kroku) ---
  const getArea = () => {
    if (pizza.shape === "Okrągła" && pizza.diameter) {
      return Math.PI * (pizza.diameter / 2) ** 2;
    } else if (pizza.shape === "Prostokątna" && pizza.width && pizza.length) {
      return pizza.width * pizza.length;
    }
    return 0;
  };

  const area = getArea();
  const pricePerCm2 = area > 0 ? (pizza.price / area).toFixed(3) : "0.000";
  const pricePer100g =
    pizza.weight > 0 ? ((pizza.price / pizza.weight) * 100).toFixed(2) : "0.00";

  const numericPricePerCm2 = parseFloat(pricePerCm2);
  let score = Math.max(
    0,
    Math.min(100, Math.round(100 - (numericPricePerCm2 - 0.03) * 2000)),
  );
  if (area === 0) score = 0;

  const scoreColor =
    score > 80 ? "#22c55e" : score > 50 ? "#eab308" : "#ef4444";
  const scoreText =
    score > 80 ? "GREAT VALUE" : score > 50 ? "GOOD VALUE" : "PRICEY";

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-20">
      {/* HEADER Z PRZYCISKIEM POWROTU */}
      <div className="max-w-[1400px] mx-auto p-8">
        <button
          onClick={() => navigate("/search")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Back to Search
        </button>

        <div className="bg-[#121212] rounded-2xl overflow-hidden flex flex-col md:flex-row relative border border-gray-800 shadow-2xl">
          {/* KOLUMNA LEWA: ZDJĘCIE */}
          <div className="w-full md:w-[45%] h-96 md:h-auto relative bg-gray-900">
            <img
              src={pizza.image}
              alt={pizza.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-sm">
              <span className="text-yellow-400">★</span>
              <span className="font-bold">4.8</span>
              <span className="text-gray-300 text-xs">(124 reviews)</span>
            </div>
          </div>

          {/* KOLUMNA PRAWA: DANE */}
          <div className="w-full md:w-[55%] p-8 md:p-12">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                  {pizza.pizzeria} • {pizza.style}
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {pizza.name}
                </h1>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-8 border-b border-gray-800 pb-8">
              {pizza.description} Authentic Italian style with premium
              ingredients.
            </p>

            {/* CENA */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">
                  {pizza.price.toFixed(2)} zł
                </span>
                <span className="text-gray-500 text-sm">incl. VAT</span>
              </div>
            </div>

            {/* RADAR SCORE (Ten sam co wcześniej) */}
            <div className="bg-[#1A1A1A] border border-gray-700 rounded-xl p-6 mb-10 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6 text-[#FF6B6B] font-bold text-xs uppercase tracking-widest">
                <span className="text-lg">◎</span> RADAR SCORE ANALYSIS
              </div>

              <div className="flex flex-col sm:flex-row gap-10 items-center">
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <div className="text-gray-400 text-xs mb-1">
                      Price per 100g
                    </div>
                    <div className="text-3xl font-bold text-[#FF6B6B]">
                      {pricePer100g} zł
                    </div>
                  </div>
                  <div className="h-px bg-gray-700 w-full"></div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">
                      Price per cm²
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {pricePerCm2} zł
                    </div>
                  </div>
                </div>

                <div className="relative w-40 h-40 flex-shrink-0">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#333"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={scoreColor}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - score / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {score}
                    </span>
                    <span
                      className="text-xs font-bold mt-1 px-2 py-0.5 rounded bg-white/10"
                      style={{ color: scoreColor }}
                    >
                      {scoreText}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <a
              href={`https://google.com/search?q=Zamów+pizza+${pizza.name}+${pizza.pizzeria}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white text-center py-4 rounded-xl font-bold text-lg transition"
            >
              Order Now ➔
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaDetails;
