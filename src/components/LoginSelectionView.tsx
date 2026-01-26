import { useNavigate } from "react-router-dom";
import { ArrowRight, ChefHat, Pizza } from "lucide-react";

const LoginSelectionView = () => {
  const navigate = useNavigate();

  const handleSelection = (role: "user" | "partner") => {
    // Przekierowujemy do istniejącego LoginView z odpowiednim stanem
    navigate("/login", { state: { role: role } });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      {/* NAGŁÓWEK */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center justify-center gap-3 mb-6 opacity-80">
          <span className="text-2xl">🍕</span>
          <span className="text-xl font-bold tracking-wide">Pizza Radar</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Wybierz swoją ścieżkę
        </h1>
        <p className="text-gray-400 text-lg">
          Wybierz rolę, aby rozpocząć przygodę z najlepszą porównywarką pizzy.
        </p>
      </div>

      {/* KARTY WYBORU */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        {/* KARTA KLIENTA (USER) */}
        <div
          onClick={() => handleSelection("user")}
          className="group relative flex-1 h-[400px] md:h-[500px] rounded-3xl overflow-hidden cursor-pointer border border-gray-800 hover:border-[#FF6B6B] transition-all duration-500 shadow-2xl"
        >
          {/* Tło Obrazkowe */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop")',
            }}
          ></div>
          {/* Gradient przyciemniający */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>

          {/* Treść */}
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
            <div className="mb-4 w-14 h-14 bg-[#FF6B6B] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Pizza size={28} />
            </div>
            <h2 className="text-3xl font-bold mb-3 group-hover:text-[#FF6B6B] transition-colors">
              Jestem Głodny
            </h2>
            <p className="text-gray-300 mb-8 max-w-sm">
              Znajdź najlepszą pizzę w okolicy. Porównuj ceny, rozmiary i
              składniki natychmiastowo.
            </p>

            <button className="w-full bg-white/10 hover:bg-[#FF6B6B] backdrop-blur-sm border border-white/20 hover:border-[#FF6B6B] text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group-hover:translate-x-2">
              Szukaj Pizzy <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* OR DIVIDER (tylko na desktopie) */}
        <div className="hidden md:flex flex-col items-center justify-center relative z-10">
          <div className="h-full w-[1px] bg-gray-800 absolute"></div>
          <div className="bg-[#121212] border border-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-xs text-gray-500 font-bold z-20">
            LUB
          </div>
        </div>

        {/* KARTA PARTNERA */}
        <div
          onClick={() => handleSelection("partner")}
          className="group relative flex-1 h-[400px] md:h-[500px] rounded-3xl overflow-hidden cursor-pointer border border-gray-800 hover:border-[#FF6B6B] transition-all duration-500 shadow-2xl"
        >
          {/* Tło Obrazkowe */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?q=80&w=2062&auto=format&fit=crop")',
            }}
          ></div>
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>

          {/* Treść */}
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
            <div className="mb-4 w-14 h-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <ChefHat size={28} />
            </div>
            <h2 className="text-3xl font-bold mb-3 group-hover:text-[#FF6B6B] transition-colors">
              Jestem Partnerem
            </h2>
            <p className="text-gray-300 mb-8 max-w-sm">
              Zarządzaj swoim menu, obliczaj zyski i docieraj do głodnych
              klientów w Twojej okolicy.
            </p>

            <button className="w-full bg-transparent border border-gray-500 hover:border-white text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group-hover:-translate-y-1 hover:bg-white/5">
              Panel Partnera <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 text-gray-600 text-sm">
        &copy; 2026 Pizza Radar. All rights reserved.
      </div>
    </div>
  );
};

export default LoginSelectionView;
