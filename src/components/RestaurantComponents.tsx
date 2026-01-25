import { MapPin, Bike, ShoppingBasket, Clock, Star } from "lucide-react";
import type { Pizza } from "../data/mockPizzas";
import MapComponent from "./MapComponent";

// --- 1. NAGŁÓWEK RESTAURACJI (HERO) ---
export const RestaurantHero = () => {
  // Link do mapy Google z Twoimi współrzędnymi
  const mapLink = "https://www.google.com/maps?q=52.20064825424179,20.931893529706343";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      
      {/* LEWA STRONA (2/3): Info o restauracji + Zdjęcie */}
      <div className="lg:col-span-2 bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A] relative overflow-hidden shadow-2xl flex flex-col md:flex-row gap-6">
        
        {/* Zdjęcie Pizza Hut */}
        <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 relative border border-[#333]">
           <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400" 
            alt="Pizza Hut Piec" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Treść Info */}
        <div className="flex-1 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Pizza Hut</h1>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider rounded-full border border-green-500/30">
                    ● Otwarte teraz
                    </span>
                </div>

                <p className="text-gray-400 flex items-center gap-2 mb-4 text-sm">
                    <MapPin size={16} className="text-[#FF6B6B]" />
                    Al. Jerozolimskie 54, Warszawa
                    {/* ZMIANA TUTAJ: Link zamiast spana */}
                    <a 
                      href={mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#FF6B6B] font-bold cursor-pointer hover:underline ml-2"
                    >
                      Zobacz na mapie
                    </a>
                </p>

                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Najpopularniejsza sieć pizzerii na świecie. Oryginalne ciasto PAN, świeże składniki i legendarny smak.
                </p>
            </div>

            {/* Statystyki */}
            <div className="flex flex-wrap gap-3">
                <div className="bg-[#252525] px-4 py-2 rounded-lg flex items-center gap-3 border border-[#333] flex-1 min-w-[140px]">
                    <Bike className="text-[#FF6B6B]" size={20} />
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Dostawa</p>
                        <p className="text-white font-bold text-sm">6.99 zł</p>
                    </div>
                </div>

                <div className="bg-[#252525] px-4 py-2 rounded-lg flex items-center gap-3 border border-[#333] flex-1 min-w-[140px]">
                    <ShoppingBasket className="text-[#FF6B6B]" size={20} />
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Min. zamówienie</p>
                        <p className="text-white font-bold text-sm">35.00 zł</p>
                    </div>
                </div>

                <div className="bg-[#252525] px-4 py-2 rounded-lg flex items-center gap-3 border border-[#333] flex-grow-[2] min-w-[200px]">
                    <Clock className="text-[#FF6B6B]" size={20} />
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Szacowany czas dostawy</p>
                        <p className="text-white font-bold text-sm">30-40 min</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* PRAWA STRONA (1/3): Godziny Otwarcia */}
      <div className="hidden lg:flex flex-col justify-center bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A] shadow-xl h-full">
         <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="text-[#FF6B6B]" size={20} /> Godziny otwarcia
         </h3>
         <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex justify-between border-b border-[#2A2A2A] pb-1"><span>Poniedziałek</span><span>11:00 - 22:00</span></li>
            <li className="flex justify-between border-b border-[#2A2A2A] pb-1"><span>Wtorek</span><span>11:00 - 22:00</span></li>
            <li className="flex justify-between border-b border-[#2A2A2A] pb-1"><span>Środa</span><span>11:00 - 22:00</span></li>
            <li className="flex justify-between border-b border-[#2A2A2A] pb-1"><span>Czwartek</span><span>11:00 - 22:00</span></li>
            <li className="flex justify-between text-white font-bold bg-white/5 px-2 -mx-2 py-1 rounded">
                <span>Piątek</span><span>11:00 - 23:00</span>
            </li>
            <li className="flex justify-between border-b border-[#2A2A2A] pb-1"><span>Sobota</span><span>12:00 - 23:00</span></li>
            <li className="flex justify-between"><span>Niedziela</span><span>12:00 - 23:00</span></li>
         </ul>
      </div>
    </div>
  );
};


// --- 2. KARTA MENU (PIZZA) ---
export const MenuCard = ({ data }: { data: Pizza }) => {
  const isSpicy = data.style === "Spicy" || data.name.includes("Diavola") || data.name.includes("Texas") || data.sauce === "Ostry pomidorowy";
  const isVegetarian = data.style === "Vegetarian" || data.name.includes("Vegetariańska");

  return (
    <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#2A2A2A] hover:border-[#333] transition-all duration-300 flex group min-h-[144px] relative shadow-lg">
      <div className="w-36 h-auto flex-shrink-0 overflow-hidden relative">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
      </div>
      
      <div className="flex-1 p-5 flex justify-between items-center">
        <div className="flex flex-col justify-center h-full pr-4">
          <h3 className="text-xl font-bold text-white mb-2">{data.name}</h3>
          
          <p className="text-gray-500 text-xs mb-3 max-w-sm leading-relaxed">
            {data.description}
          </p>
          
          <div className="flex gap-2 flex-wrap">
             {isSpicy && (
                <span className="bg-red-900/20 text-red-400 border border-red-900/30 text-[10px] font-bold px-2 py-1 rounded uppercase">
                    🌶️ Pikantna
                </span>
             )}
             {isVegetarian && (
                <span className="bg-green-900/20 text-green-400 border border-green-900/30 text-[10px] font-bold px-2 py-1 rounded uppercase">
                    🌿 Wege
                </span>
             )}
             {!isSpicy && !isVegetarian && (
                 <span className="bg-[#2A2A2A] text-gray-400 border border-[#333] text-[10px] font-bold px-2 py-1 rounded uppercase">
                    {data.dough || "Klasyczna"}
                 </span>
             )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 min-w-[100px]">
          <div className="text-right">
            <span className="text-white font-extrabold text-2xl block tracking-tight">
              {data.price.toFixed(2)} <span className="text-sm text-gray-500 font-normal">zł</span>
            </span>
            <span className="text-[10px] bg-[#FF6B6B] text-white px-2 py-0.5 rounded font-bold inline-block mt-1 shadow-lg shadow-red-500/20">
               {((data.price / data.weight) * 100).toFixed(2)} zł / 100g
            </span>
          </div>
          <button className="w-8 h-8 rounded-lg bg-[#2A2A2A] hover:bg-[#FF6B6B] text-white flex items-center justify-center transition-colors border border-[#333] hover:border-[#FF6B6B]">
            +
          </button>
        </div>
      </div>
    </div>
  );
};


// --- 3. PRAWY SIDEBAR ---
export const RightSidebar = () => {
  // Ten sam link co w nagłówku
  const mapLink = "https://www.google.com/maps?q=52.20064825424179,20.931893529706343";

  return (
    <div className="space-y-6 sticky top-6">
        
      {/* 1. SEKCJA OPINII */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A] shadow-xl">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Star className="text-[#FF6B6B] fill-[#FF6B6B]" size={18} /> Opinie
            </h3>
            <a href="#" className="text-xs text-[#FF6B6B] font-bold hover:underline">Zobacz 1,204</a>
        </div>

        <div className="flex items-end gap-4 mb-6">
            <span className="text-5xl font-extrabold text-white">4.5</span>
            <div className="mb-1">
                <div className="flex text-[#FF6B6B] mb-1">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" className="opacity-50" />
                </div>
                <p className="text-xs text-gray-500 font-medium">Na podstawie Google</p>
            </div>
        </div>

        {/* --- KOMENTARZ WIKTORA W. --- */}
        <div className="bg-[#252525] p-4 rounded-xl border border-[#333] relative">
            <div className="absolute -top-2 left-6 w-4 h-4 bg-[#252525] border-l border-t border-[#333] transform rotate-45"></div>
            
            <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-10 h-10 bg-[#FF6B6B] text-white font-bold text-xs flex items-center justify-center rounded-full shadow-lg shadow-red-500/20 ring-2 ring-[#1A1A1A]">
                    WW
                </div>
                <div>
                    <p className="font-bold text-white text-sm">Wiktor W.</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">2 dni temu</p>
                </div>
            </div>
            <p className="text-gray-300 text-sm italic leading-relaxed pl-13">
                "Antonio jak ci sie podoba?"
            </p>
        </div>
      </div>

      {/* 2. SEKCJA MAPY - INTERAKTYWNA */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden h-56 relative shadow-xl z-0">
          <MapComponent 
            coords={[52.20064825424179, 20.931893529706343]} 
            popupText="Pizza Hut - Al. Jerozolimskie 54" 
          />
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[400]">
              <a 
                href={mapLink} 
                target="_blank"
                rel="noreferrer"
                className="bg-[#1A1A1A] text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold text-xs shadow-xl border border-[#333] hover:bg-[#FF6B6B] hover:border-[#FF6B6B] transition-all"
              >
                  <MapPin size={14} /> Nawiguj
              </a>
          </div>
      </div>

    </div>
  );
};